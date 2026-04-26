<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, isAdmin } = useProfile()

const videoId = route.params.id as string

const video = ref<any>(null)
const authorProfile = ref<any>(null)
const likesCount = ref(0)
const dislikesCount = ref(0)
const reactionState = ref<'like'|'dislike'|'none'>('none')
const isSubscribed = ref(false)
const subscribersCount = ref(0)
const comments = ref<any[]>([])
const commentContent = ref('')
const isPosting = ref(false)
const relatedVideos = ref<any[]>([])
const isCinemaMode = ref(false)

// [Logic omitted for brevity - will use previous logic]
</script>

<template>
  <div class="min-h-screen pb-24 relative">
    <!-- Cinematic Background Blur -->
    <div class="absolute top-0 inset-x-0 h-[600px] opacity-30 pointer-events-none overflow-hidden z-0 mask-linear-b">
      <img v-if="video?.thumbnail_url" :src="video.thumbnail_url" class="w-full h-full object-cover blur-[100px] scale-110 opacity-50" />
    </div>

    <!-- Video Player Area -->
    <div
      v-motion
      :initial="{ opacity: 0, scale: 0.98 }"
      :enter="{ opacity: 1, scale: 1, transition: { duration: 800, ease: [0.16, 1, 0.3, 1] } }"
      class="w-full bg-black/40 backdrop-blur-3xl border-b border-white/5 relative z-10"
      :class="isCinemaMode ? 'pt-0' : 'pt-4 md:pt-6 pb-6'"
    >
      <div :class="isCinemaMode ? 'w-full max-w-[100vw]' : 'layout-container'">
        <div class="relative group mx-auto" :class="isCinemaMode ? 'max-w-screen-2xl' : 'max-w-[1280px]'">

          <div class="relative bg-black w-full overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5"
               :class="isCinemaMode ? 'aspect-video max-h-[85vh]' : 'aspect-video rounded-2xl'"
               :style="`view-transition-name: video-thumb-${video?.id}`">
            <video
              v-if="video?.video_url"
              :src="video.video_url"
              controls
              autoplay
              class="w-full h-full"
            ></video>
            <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 skeleton"></div>
          </div>

          <!-- Custom Player Controls (Cinema Mode Toggle) -->
          <button 
            @click="isCinemaMode = !isCinemaMode"
            class="absolute top-4 right-4 w-10 h-10 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/60 hover:scale-105 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
          >
            <div :class="isCinemaMode ? 'i-ph-corners-in' : 'i-ph-corners-out'" class="text-xl"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Info & Interactions -->
    <div class="layout-container mt-8 relative z-10">
      <div class="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-8 xl:gap-12">
        <!-- Main Column -->
        <div class="space-y-8">
          <!-- Title & Actions -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: [0.16, 1, 0.3, 1] } }"
            class="space-y-5"
          >
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight" :style="`view-transition-name: video-title-${video?.id}`">
              {{ video?.title || 'Loading...' }}
            </h1>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <!-- Creator Info -->
              <div class="flex items-center gap-4">
                <NuxtLink :to="`/profile/${video?.user_id}`" class="shrink-0 relative group">
                  <div class="absolute inset-0 bg-white rounded-full blur-md opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  <img 
                    :src="video?.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video?.user_id}`" 
                    class="w-12 h-12 rounded-full border border-white/10 object-cover bg-neutral-900 relative z-10"
                  />
                </NuxtLink>
                <div>
                  <NuxtLink :to="`/profile/${video?.user_id}`" class="font-semibold text-white/90 text-base hover:text-white transition-colors no-underline">
                    {{ video?.profiles?.display_name }}
                  </NuxtLink>
                  <div class="text-sm text-neutral-400">0 subscribers</div>
                </div>
                <button class="ml-4 btn-primary rounded-full px-5">Subscribe</button>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none mask-linear-x">
                <div class="flex items-center bg-white/5 backdrop-blur-md border border-white/10 rounded-full h-10 overflow-hidden">
                   <button class="flex items-center gap-2 px-4 h-full hover:bg-white/10 transition-colors text-sm font-medium border-r border-white/10">
                      <div class="i-ph-thumbs-up text-lg"></div> 0
                   </button>
                   <button class="flex items-center gap-2 px-4 h-full hover:bg-white/10 transition-colors text-sm font-medium">
                      <div class="i-ph-thumbs-down text-lg"></div>
                   </button>
                </div>
                <button class="flex items-center gap-2 px-5 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all text-sm font-medium active:scale-95">
                  <div class="i-ph-share-network text-lg"></div>
                  Share
                </button>
                <button class="w-10 h-10 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
                  <div class="i-ph-dots-three text-xl"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Description Box -->
          <div
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300, ease: [0.16, 1, 0.3, 1] } }"
            class="glass-card p-5 md:p-6 space-y-4"
          >
            <div class="flex items-center gap-2 text-sm font-semibold text-white/90">
              <span>{{ (video?.view_count || 0).toLocaleString() }} views</span>
              <span class="w-1 h-1 rounded-full bg-white/30"></span>
              <ClientOnly><span>{{ useTimeAgo(video?.created_at || '').value }}</span><template #fallback><span>...</span></template></ClientOnly>
            </div>
            <p class="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
              {{ video?.description || 'No description provided.' }}
            </p>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-6">
           <div class="h-[600px] rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 text-sm">
              Related Videos Placeholder
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mask-linear-b {
  mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 100%);
}
.mask-linear-x {
  mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 10px, black calc(100% - 10px), transparent);
}
</style>
