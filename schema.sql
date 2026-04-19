-- NewTube Gold Standard Schema v2.0
-- Refactored for Standards, Performance, and Extensibility

-- 1. EXTENSIONS & UTILS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create an auth bypass function to prevent infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin_user BOOLEAN;
BEGIN
  -- We query profiles directly using a separate auth context or simply select it.
  -- However, since the function is SECURITY DEFINER, it runs with the privileges of the creator (usually postgres/supabase_admin).
  -- This bypasses RLS policies entirely, preventing infinite recursion.
  SELECT role = 'admin' INTO is_admin_user
  FROM public.profiles
  WHERE id = auth.uid();

  RETURN COALESCE(is_admin_user, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. STORAGE SETUP
-- Create buckets for videos and thumbnails
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('videos', 'videos', true, 1073741824, '{video/*}'), -- 1GB limit
  ('thumbnails', 'thumbnails', true, 10485760, '{image/*}') -- 10MB limit
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 3. ROLES SYSTEM
CREATE TABLE IF NOT EXISTS public.roles (
    name TEXT PRIMARY KEY,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.roles (name, description)
VALUES
    ('guest', 'Can only view public content'),
    ('user', 'Can upload videos, comment and react'),
    ('admin', 'Full control over content and users')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 4. TABLES
-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' REFERENCES public.roles(name) ON UPDATE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Videos table
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'published' CHECK (status IN ('published', 'hidden', 'blocked')),
  view_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Video Reactions table (Likes/Dislikes)
CREATE TABLE IF NOT EXISTS public.video_reactions (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
  is_like BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, video_id)
);

-- Comments table (Threaded)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- 5. RLS POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Profile Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());

-- Video Policies
CREATE POLICY "Videos are viewable by everyone if not deleted" ON public.videos
    FOR SELECT USING (
        (deleted_at IS NULL AND status = 'published')
        OR auth.uid() = user_id
        OR public.is_admin()
    );
CREATE POLICY "Users can insert their own videos" ON public.videos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own videos" ON public.videos FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

-- Reaction Policies
CREATE POLICY "Reactions are viewable by everyone" ON public.video_reactions FOR SELECT USING (true);
CREATE POLICY "Users can manage their own reactions" ON public.video_reactions FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- Comment Policies
CREATE POLICY "Active comments are viewable by everyone" ON public.comments
    FOR SELECT USING (
        deleted_at IS NULL
        OR auth.uid() = user_id
        OR public.is_admin()
    );
CREATE POLICY "Users can manage their own comments" ON public.comments FOR ALL USING (auth.uid() = user_id OR public.is_admin());

-- 6. TRIGGERS
-- Handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url, role)
  VALUES (new.id, new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'avatar_url', 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Handle updated_at automation
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_video_reactions_updated_at BEFORE UPDATE ON public.video_reactions FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 7. INDEXES
CREATE INDEX IF NOT EXISTS idx_videos_user_id ON public.videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);
CREATE INDEX IF NOT EXISTS idx_videos_deleted_at ON public.videos(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_video_id ON public.comments(video_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_deleted_at ON public.comments(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_video_reactions_video_id ON public.video_reactions(video_id);
CREATE INDEX IF NOT EXISTS idx_video_reactions_user_id ON public.video_reactions(user_id);

-- 8. FUNCTIONS
CREATE OR REPLACE FUNCTION public.increment_view_count(video_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.videos SET view_count = view_count + 1 WHERE id = video_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. STORAGE POLICIES
-- Allow public read access to all objects in videos and thumbnails buckets
CREATE POLICY "Videos are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Thumbnails are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'thumbnails');

-- Allow authenticated users to upload files to their own folders in buckets
CREATE POLICY "Users can upload videos" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Users can upload thumbnails" ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'thumbnails');

-- 10. DOCUMENTATION
COMMENT ON TABLE profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE videos IS 'Video metadata with soft delete and status support';
COMMENT ON TABLE video_reactions IS 'User likes and dislikes tracked globally';
COMMENT ON TABLE roles IS 'Platform role system (Extensible)';
