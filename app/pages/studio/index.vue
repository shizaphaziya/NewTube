<script setup>
const supabase = useSupabaseClient()
const { confirm: showConfirm } = useConfirm()
const user = useSupabaseUser()
const { t, locale } = useI18n()
const { error: showError } = useToast()

const { profile } = useProfile()

useSeoMeta({
  title: () => `${t('studio.command_center')} - ${t('studio.page_title')}`,
  description: () => t('studio.broadcasting')
})

const { data: videos, refresh, error: asyncError } = await useAsyncData('user-videos', async () => {

  const { data: { user: authUser } } = await supabase.auth.getUser()
  const userId = user.value?.id || authUser?.id
  if (!userId) return []
  
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('[Studio] Fetch error:', error)
    throw error
  }
  return (data || [])
}, { watch: [user], server: false })

if (asyncError.value) {
  console.error('[Studio] useAsyncData error:', asyncError.value)
}


const stats = computed(() => {
  if (!videos.value) return { views: 0, videos: 0, engagement: 0 }
  return {
    views: videos.value.reduce((acc, v) => acc + (v.view_count || 0), 0),
    videos: videos.value.length,
    engagement: videos.value.reduce((acc, v) => acc + (v.likes?.[0]?.count || 0) + (v.comments?.[0]?.count || 0), 0)
  }
})

const editingVideo = ref(null)
const editForm = ref({ title: '', description: '', is_18_plus: false, thumbnailFile: null })
const isSaving = ref(false)
const thumbnailInput = ref(null)

const openEditModal = (video) => {
  editingVideo.value = video
  editForm.value = {
    title: video.title,
    description: video.description || '',
    is_18_plus: video.is_18_plus || false,
    thumbnailFile: null
  }
}

const closeEditModal = () => {
  editingVideo.value = null
}

const handleThumbnailSelect = (e) => {
  editForm.value.thumbnailFile = e.target.files[0]
}

const saveVideo = async () => {
  if (!editingVideo.value) return
  isSaving.value = true

  try {
    let thumbnailUrl = editingVideo.value.thumbnail_url

    if (editForm.value.thumbnailFile) {
      const thumbExt = editForm.value.thumbnailFile.name.split('.').pop()
      const thumbFileName = `${Math.random()}.${thumbExt}`
      const thumbPath = `${user.value.id}/${thumbFileName}`

      await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, editForm.value.thumbnailFile, {
            contentType: editForm.value.thumbnailFile.type
        })

      const { data: { publicUrl: tUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbPath)

      thumbnailUrl = tUrl
    }

    const { error } = await supabase
      .from('videos')
      .update({
        title: editForm.value.title,
        description: editForm.value.description,
        is_18_plus: editForm.value.is_18_plus,
        thumbnail_url: thumbnailUrl
      })
      .eq('id', editingVideo.value.id)

    if (error) throw error

    refresh()
    closeEditModal()
  } catch (error) {
    console.error('Failed to update video', error)
    showError({
      title: t('studio.failed_update'),
      description: error.message
    })
  } finally {
    isSaving.value = false
  }
}

const deleteVideo = async (id) => {
  if (!await showConfirm(t('studio.terminate_confirm'))) return
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (!error) refresh()
}
</script>

<template>
  <div class="px-4 md:px-8 lg:px-12 py-12 relative max-w-screen-xl mx-auto min-h-screen">
    <!-- Cinematic Aura -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-primary-500/5 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div class="absolute bottom-[20%] -right-[5%] w-[30%] h-[30%] bg-primary-500/3 blur-[100px] rounded-full"></div>
    </div>

    <!-- Guest Overlay -->
    <Transition 
      enter-active-class="transition duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="!user" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="glass-card border-primary-500/20 p-10 md:p-12 max-w-md w-full space-y-8 text-center shadow-[0_0_50px_-12px_rgba(239,68,68,0.2)] relative z-10">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center animate-glow">
            <div class="i-ph-lock-key-duotone text-3xl text-primary-500"></div>
          </div>
          <div class="space-y-3">
            <h2 class="text-2xl font-black text-white uppercase tracking-tight italic">
              {{ $t('auth.authentication_locked') }}
            </h2>
            <p class="text-white/40 text-sm font-medium leading-relaxed">
              {{ $t('auth.login_required') }}
            </p>
          </div>
          <NuxtLink to="/auth/login" class="btn-primary w-full inline-flex rounded-xl py-4 font-black uppercase tracking-widest text-xs">
            {{ $t('auth.authorize_identity') }}
          </NuxtLink>
        </div>
        <div class="absolute inset-0 bg-void/90 backdrop-blur-md"></div>
      </div>
    </Transition>

    <div class="relative z-10 space-y-12" :class="{ 'opacity-10 blur-xl pointer-events-none select-none': !user }">
      <!-- Header -->
      <div v-motion-fade-in class="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <div class="h-1 w-8 bg-primary-500"></div>
            <span class="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">{{ $t('studio.command_center') }}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">
            {{ $t('studio.command_center') }}
          </h1>
          <p class="text-white/40 text-sm font-medium">
            {{ $t('studio.welcome') }}, <span class="text-white">{{ profile?.display_name || $t('studio.creator') }}</span>
          </p>
        </div>

        <NuxtLink to="/studio/upload" class="btn-primary flex items-center gap-3 rounded-xl px-8 py-4 font-black uppercase tracking-widest text-xs shadow-xl hover:scale-105 active:scale-95 transition-all">
          <div class="i-ph-plus-circle-duotone text-lg"></div>
          {{ $t('studio.upload') }}
        </NuxtLink>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-motion-slide-visible-bottom v-for="(val, key, i) in { views: stats.views, videos: stats.videos, engagement: stats.engagement }" 
             :key="key" :delay="i * 100"
             class="glass-card p-8 group hover:border-primary-500/20 transition-all duration-500">
          <div class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 group-hover:text-primary-500 transition-colors">
            {{ $t(`studio.total_${key}`) }}
          </div>
          <div class="flex items-end justify-between">
            <div class="text-4xl font-black text-white tracking-tighter tabular-nums">
              {{ val.toLocaleString() }}
            </div>
            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-primary-500/10 group-hover:text-primary-500 transition-all">
              <div :class="[
                key === 'views' ? 'i-ph-chart-line-up-duotone' : 
                key === 'videos' ? 'i-ph-video-camera-duotone' : 
                'i-ph-heart-duotone'
              , 'text-2xl']"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Table -->
      <div v-motion-fade-in :delay="300" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-white uppercase tracking-tight italic">
            {{ $t('studio.channel_content') }}
          </h2>
          <button @click="refresh" class="text-white/20 hover:text-white transition-colors">
            <div class="i-ph-arrows-clockwise text-xl"></div>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="!videos?.length"
             class="glass-card p-24 flex flex-col items-center justify-center text-center gap-6 border-dashed border-2 border-white/5">
          <div class="w-24 h-24 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-2">
             <div class="i-ph-video-camera-slash-duotone text-4xl text-white/10"></div>
          </div>
          <div class="space-y-2">
            <p class="text-white/60 text-base font-bold uppercase tracking-tight">
              {{ $t('studio.no_records') }}
            </p>
            <p class="text-white/30 text-xs uppercase tracking-widest italic">{{ $t('studio.no_records_hint') }}</p>
          </div>
          <NuxtLink to="/studio/upload" class="btn-primary mt-4 rounded-xl px-10 py-4 font-black uppercase tracking-widest text-xs">
            {{ $t('studio.upload') }}
          </NuxtLink>
        </div>

        <!-- Records List -->
        <div v-else class="glass-card overflow-hidden border-white/5 shadow-2xl">
          <!-- Table Header -->
          <div class="hidden sm:grid grid-cols-[1fr_120px_140px_100px] gap-6 px-8 py-5 border-b border-white/5 text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
            <div>{{ $t('studio.video_header') }}</div>
            <div class="text-right">{{ $t('studio.security_header') }}</div>
            <div class="text-right">{{ $t('studio.date_header') }}</div>
            <div class="text-right">{{ $t('studio.views_header') }}</div>
          </div>

          <div class="divide-y divide-white/5">
            <div
              v-for="(video, i) in videos"
              :key="video.id"
              class="flex flex-col sm:grid sm:grid-cols-[1fr_120px_140px_100px] gap-6 p-6 sm:px-8 sm:py-6 items-start sm:items-center hover:bg-white/[0.03] transition-all duration-300 group relative"
            >
              <!-- Video Info -->
              <div class="flex gap-6 min-w-0 w-full">
                <div class="w-40 aspect-video rounded-2xl overflow-hidden bg-void-900 border border-white/10 shrink-0 relative shadow-xl group-hover:border-primary-500/30 transition-colors">
                   <img
                    v-if="video.thumbnail_url"
                    :src="video.thumbnail_url"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                   <div v-else class="w-full h-full flex items-center justify-center">
                     <div class="i-ph-film-strip-duotone text-3xl text-white/10"></div>
                   </div>
                   <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="flex-1 min-w-0 space-y-2 py-1">
                  <h3 class="font-bold text-base text-white truncate group-hover:text-primary-500 transition-colors tracking-tight">{{ video.title }}</h3>
                  <p class="text-xs text-white/30 line-clamp-2 leading-relaxed font-medium">{{ video.description || $t('studio.no_description') }}</p>

                  <!-- Mobile only meta -->
                  <div class="flex sm:hidden items-center gap-3 text-[10px] font-black text-white/20 mt-3 uppercase tracking-widest">
                    <span>{{ video.created_at ? new Date(video.created_at).toLocaleDateString(locale) : '—' }}</span>
                    <span>•</span>
                    <span>{{ (video.view_count || 0).toLocaleString() }} {{ $t('common.views') }}</span>
                  </div>
                </div>
              </div>

              <!-- Desktop Meta Columns -->
              <div class="hidden sm:flex items-center justify-end">
                <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-500 text-[10px] font-black uppercase tracking-widest border border-primary-500/20">
                  <div class="w-1.5 h-1.5 rounded-full bg-primary-500 animate-glow"></div>
                  {{ $t('studio.visibility_public') }}
                </span>
              </div>
              <div class="hidden sm:block text-[11px] font-bold text-white/40 text-right uppercase tracking-tighter">
                {{ video.created_at ? new Date(video.created_at).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' }) : '—' }}
              </div>
              <div class="hidden sm:block text-base font-black text-white text-right tabular-nums tracking-tighter">
                {{ (video.view_count || 0).toLocaleString() }}
              </div>

              <!-- Hover Actions -->
              <div class="flex sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 items-center gap-3 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 sm:translate-x-4 group-hover:translate-x-0 bg-void/90 sm:backdrop-blur-xl sm:pl-6 py-2 rounded-2xl mt-4 sm:mt-0 z-20">
                 <button
                  @click="openEditModal(video)"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all shadow-xl"
                  :title="$t('studio.edit_video')"
                >
                  <div class="i-ph-pencil-simple-duotone text-xl"></div>
                </button>
                 <NuxtLink
                  :to="`/watch/${video.id}`"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-primary-500 hover:bg-primary-500/10 border border-transparent hover:border-primary-500/20 transition-all shadow-xl"
                  :title="$t('studio.watch_video')"
                >
                  <div class="i-ph-eye-duotone text-xl"></div>
                </NuxtLink>
                <div class="w-px h-6 bg-white/5 mx-1 hidden sm:block"></div>
                <button
                  @click="deleteVideo(video.id)"
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all shadow-xl"
                  :title="$t('studio.delete_video')"
                >
                  <div class="i-ph-trash-duotone text-xl"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Video Modal -->
    <Transition 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 backdrop-blur-0"
      enter-to-class="opacity-100 scale-100 backdrop-blur-md"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 backdrop-blur-md"
      leave-to-class="opacity-0 scale-95 backdrop-blur-0"
    >
      <div v-if="editingVideo" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-void/80 backdrop-blur-md" @click="closeEditModal"></div>

        <div class="glass-card border-white/10 w-full max-w-xl shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
          <div class="flex items-center justify-between p-8 border-b border-white/5 bg-white/[0.01]">
            <div class="space-y-1">
              <span class="text-[10px] font-black text-primary-500 uppercase tracking-[0.3em]">{{ $t('studio.video_update') }}</span>
              <h2 class="text-xl font-black text-white uppercase tracking-tight italic">{{ $t('studio.edit_metadata') }}</h2>
            </div>
            <button @click="closeEditModal" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all">
              <div class="i-ph-x text-2xl"></div>
            </button>
          </div>

          <div class="p-8 space-y-8 overflow-y-auto custom-scrollbar">
            <!-- Thumbnail -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ $t('studio.thumbnail') }}</label>
              <div class="flex items-end gap-6 p-4 rounded-3xl bg-white/[0.02] border border-white/5 group">
                <div class="w-48 aspect-video rounded-2xl overflow-hidden bg-void-900 border border-white/10 shrink-0 shadow-2xl relative">
                   <img v-if="editingVideo.thumbnail_url && !editForm.thumbnailFile" :src="editingVideo.thumbnail_url" class="w-full h-full object-cover" />
                   <div v-else-if="editForm.thumbnailFile" class="w-full h-full flex items-center justify-center text-[10px] text-primary-500 font-black uppercase tracking-widest bg-primary-500/10 italic">{{ $t('studio.updated') }}</div>
                   <div v-else class="w-full h-full flex items-center justify-center">
                     <div class="i-ph-image-duotone text-3xl text-white/10"></div>
                   </div>
                </div>
                <div class="flex-1 space-y-3">
                  <input type="file" accept="image/*" class="hidden" ref="thumbnailInput" @change="handleThumbnailSelect" />
                  <button @click="$refs.thumbnailInput.click()" class="w-full px-6 py-3 glass-button rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
                    {{ $t('studio.change_image') }}
                  </button>
                  <p class="text-[9px] text-white/20 font-bold uppercase text-center" v-if="editForm.thumbnailFile">{{ editForm.thumbnailFile.name }}</p>
                  <p class="text-[9px] text-white/20 font-bold uppercase text-center italic" v-else>{{ $t('studio.file_limit_hint') }}</p>
                </div>
              </div>
            </div>

            <!-- Title -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ $t('studio.video_title') }}</label>
              <input v-model="editForm.title" type="text" class="glass-input w-full rounded-2xl py-4 px-6 text-sm font-medium" :placeholder="$t('studio.video_title_placeholder')" />
            </div>

            <!-- Description -->
            <div class="space-y-3">
              <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ $t('studio.video_description') }}</label>
              <textarea v-model="editForm.description" class="glass-input w-full min-h-[150px] resize-none rounded-3xl py-5 px-6 text-sm font-medium" :placeholder="$t('studio.video_description_placeholder')"></textarea>
            </div>

            <!-- 18+ Toggle -->
            <div class="flex items-center justify-between p-6 rounded-3xl border border-white/5 bg-white/[0.01] hover:border-primary-500/20 transition-all duration-500">
              <div class="space-y-1">
                <div class="text-sm font-bold text-white uppercase tracking-tight italic">{{ $t('studio.age_restriction') }}</div>
                <div class="text-[11px] text-white/30 font-medium">{{ $t('studio.age_restriction_hint') }}</div>
              </div>
              <button
                @click="editForm.is_18_plus = !editForm.is_18_plus"
                class="w-14 h-7 rounded-full transition-all duration-500 relative p-1"
                :class="editForm.is_18_plus ? 'bg-primary-500' : 'bg-white/10'"
              >
                <div
                  class="w-5 h-5 rounded-full bg-white shadow-xl transition-all duration-500"
                  :class="editForm.is_18_plus ? 'translate-x-7' : 'translate-x-0'"
                ></div>
              </button>
            </div>
          </div>

          <div class="p-8 border-t border-white/5 flex justify-end gap-4 bg-white/[0.01]">
            <button @click="closeEditModal" class="px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white hover:bg-white/5 transition-all">
              {{ $t('studio.cancel') }}
            </button>
            <button @click="saveVideo" :disabled="isSaving || !editForm.title" class="btn-primary rounded-xl px-10 py-4 text-[10px] font-black uppercase tracking-widest shadow-2xl disabled:opacity-50 hover:scale-105 active:scale-95 transition-all">
              <div class="flex items-center gap-2">
                <div v-if="isSaving" class="i-ph-circle-notch animate-spin"></div>
                <span>{{ isSaving ? $t('studio.saving') : $t('studio.apply_changes') }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>


<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 5px rgba(239, 68, 68, 0.1); }
  to { box-shadow: 0 0 20px rgba(239, 68, 68, 0.3); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.glass-button {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-button:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>

