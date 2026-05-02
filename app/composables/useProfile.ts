import type { Database } from "~/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>();
  const user = useSupabaseUser();
  const nuxtApp = useNuxtApp();
  const profile = useState<Profile | null>("user-profile-v6", () => null);
  const loading = useState("user-profile-loading-v6", () => false);

  const fetchProfile = async (uid?: string) => {
    const userId = uid || user.value?.id;
    if (!userId) {
      profile.value = null;
      return;
    }

    if ((nuxtApp as any)._profileFetchPromise) {
      await (nuxtApp as any)._profileFetchPromise;
      return;
    }

    loading.value = true(nuxtApp as any)._profileFetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          profile.value = null;
        } else {
          if (data) {
            // Efficient avatar cache busting using updated_at timestamp
            if (data.avatar_url && data.avatar_url.includes("supabase.co")) {
              const timestamp = data.updated_at
                ? new Date(data.updated_at).getTime()
                : Date.now();
              const separator = data.avatar_url.includes("?") ? "&" : "?";
              data.avatar_url = `${data.avatar_url}${separator}v=${timestamp}`;
            }
          }
          profile.value = data as Profile;
        }
      } catch (e) {
        console.error("[Profile] Unexpected error:", e);
      } finally {
        loading.value = false(nuxtApp as any)._profileFetchPromise = null;
      }
    })();

    await (nuxtApp as any)._profileFetchPromise;
  };

  // Auth state listener
  if (import.meta.client) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        if (!profile.value || profile.value.id !== session.user.id) {
          fetchProfile(session.user.id);
        }
      } else {
        profile.value = null;
      }
    });
  }

  // User ID watcher
  watch(
    () => user.value?.id,
    (newId) => {
      if (newId && (!profile.value || profile.value.id !== newId)) {
        fetchProfile(newId);
      }
    },
    { immediate: true },
  );

  const updateProfile = async (
    updates: Database["public"]["Tables"]["profiles"]["Update"],
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const userId = session?.user?.id || user.value?.id;

      if (!userId) throw new Error("Authentication required");

      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (!error && data) {
        // Re-fetch to ensure all computed fields (like avatar_url with timestamp) are fresh
        await fetchProfile(userId);
      }
      return { data, error };
    } catch (e: any) {
      console.error("[Profile] Update failed:", e);
      return { error: e };
    }
  };

  const isAdmin = computed(() => profile.value?.role === "admin");
  const isUser = computed(() =>
    ["user", "admin"].includes(profile.value?.role || ""),
  );

  return {
    profile,
    loading: computed(() => loading.value),
    fetchProfile,
    refreshProfile: fetchProfile,
    updateProfile,
    isAdmin,
    isUser,
  };
};
