<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const { t } = useI18n()

const query = computed(() => route.query.q as string || '')
const videos = ref<any[]>([])
const loading = ref(true)

const searchVideos = async () => {
  if (!query.value) return
  
  loading.value = true
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)')
    .or(`title.ilike.%${query.value}%,description.ilike.%${query.value}%`)
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (!error && data) {
    videos.value = data
  }
  loading.value = false
}

watch(() => route.query.q, () => {
  searchVideos()
}, { immediate: true })

useSeoMeta({
  title: () => `${query.value} - ${t('search.title')}`,
  description: t('search.description')
})
</script>

<template>
  <div class="min-h-screen bg-void pb-24 relative selection:(bg-primary-500/30 text-white)">
    <!-- Cinematic Atmosphere -->
    <div class="fixed top-0 inset-x-0 h-[600px] bg-gradient-to-b from-primary-900/10 to-transparent pointer-events-none"></div>

    <div class="max-w-[1400px] mx-auto px-4 md:px-10 pt-12 relative z-10">
      <!-- Search Info Header -->
      <div v-motion-slide-visible-bottom class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="h-1 w-10 bg-primary-500 rounded-full"></div>
            <span class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]">{{ t('search.query_processing') }}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-900 text-white uppercase tracking-tighter italic leading-none">
            {{ t('search.results_for') }} <span class="text-primary-500 underline decoration-white/10 decoration-2 underline-offset-8">{{ query }}</span>
          </h1>
          <p class="text-white/30 text-[11px] font-black uppercase tracking-[0.2em]">{{ videos.length }} {{ t('search.videos_found') }}</p>
        </div>

        <div class="flex items-center gap-4">
           <div class="glass-card border-white/10 rounded-xl px-6 py-3 flex items-center gap-4">
             <div class="i-ph-funnel-duotone text-white/40"></div>
             <span class="text-[10px] font-black text-white/40 uppercase tracking-widest">{{ t('search.filter_relevance') }}</span>
           </div>
        </div>
      </div>

      <!-- Content -->
      <div v-if="loading" class="space-y-12">
        <div v-for="n in 5" :key="n" class="flex flex-col md:flex-row gap-8 animate-pulse">
          <div class="w-full md:w-[360px] aspect-video bg-void-900 rounded-3xl"></div>
          <div class="flex-1 space-y-4 py-2">
            <div class="h-8 bg-void-900 rounded-xl w-3/4"></div>
            <div class="h-4 bg-void-950 rounded-lg w-1/2"></div>
            <div class="h-20 bg-void-950/50 rounded-2xl w-full"></div>
          </div>
        </div>
      </div>

      <div v-else-if="videos.length === 0" v-motion-fade-in class="flex flex-col items-center justify-center py-32 text-center glass-card border-white/5 rounded-[3rem] shadow-2xl">
          <div class="w-24 h-24 rounded-3xl bg-void-900 border border-white/10 flex items-center justify-center mb-8 shadow-2xl">
            <div class="i-ph-magnifying-glass-slash-duotone text-5xl text-white/10"></div>
          </div>
          <h2 class="text-3xl font-900 text-white uppercase tracking-tighter italic mb-4">{{ t('search.no_matches') }}</h2>
          <p class="text-white/30 text-[11px] font-black uppercase tracking-widest leading-loose max-w-md">
            {{ t('search.no_matches_subtitle', { query: query }) }}
          </p>
      </div>

      <div v-else class="space-y-10">
        <div 
          v-for="(video, idx) in videos" 
          :key="video.id"
          v-motion
          :initial="{ opacity: 0, x: -20 }"
          :enter="{ opacity: 1, x: 0, transition: { delay: idx * 100, duration: 800 } }"
          class="group"
        >
          <NuxtLink :to="`/watch/${video.id}`" class="flex flex-col md:flex-row gap-8 no-underline">
            <!-- Thumbnail -->
            <div class="relative w-full md:w-[400px] shrink-0 aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 group-hover:(border-primary-500/50 scale-[1.02] shadow-primary-500/10)">
              <img :src="video.thumbnail_url" class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div class="absolute inset-0 bg-void/20 group-hover:bg-transparent transition-all"></div>
              
              <!-- Badge -->
              <div v-if="video.is_short" class="absolute top-4 right-4 px-3 py-1 rounded-lg bg-primary-600 text-white text-[9px] font-black uppercase tracking-widest shadow-xl">
                {{ t('search.short') }}
              </div>
              
              <!-- Duration Placeholder -->
              <div class="absolute bottom-4 right-4 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md text-[10px] font-bold text-white">
                12:34
              </div>
            </div>

            <!-- Info -->
            <div class="flex-1 py-2 space-y-4">
              <h2 class="text-2xl font-900 text-white uppercase tracking-tighter italic group-hover:text-primary-500 transition-colors line-clamp-2">
                {{ video.title }}
              </h2>
              
              <div class="flex items-center gap-6 text-[10px] font-black text-white/40 uppercase tracking-widest">
                <span>{{ (video.view_count || 0).toLocaleString() }} {{ t('search.impressions') }}</span>
                <span>•</span>
                <span>{{ t('search.synchronized') }} {{ new Date(video.created_at).toLocaleDateString() }}</span>
              </div>

              <div class="flex items-center gap-4 py-2">
                <img :src="video.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video.user_id}`" 
                     class="w-8 h-8 rounded-lg border border-white/10 object-cover" />
                <span class="text-[11px] font-black text-white/60 uppercase tracking-widest group-hover:text-white transition-colors">
                  {{ video.profiles?.display_name }}
                </span>
                <div class="i-ph-seal-check-fill text-primary-500 text-sm"></div>
              </div>

              <p class="text-white/30 text-sm font-medium line-clamp-2 leading-relaxed max-w-2xl">
                {{ video.description || t('search.no_description') }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-void {
  background-color: #050505;
}
</style>
