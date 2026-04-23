<script setup>
const route = useRoute()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()
const { profile } = useProfile()

const isCinemaMode = ref(false)

const { data: video } = await useAsyncData(`video-${route.params.id}`, async () => {
  const { data, error } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)')
    .eq('id', route.params.id)
    .single()

  if (!error && data) {
    // Basic anti-abuse: check localStorage
    const viewKey = `viewed_${data.id}`
    if (typeof localStorage !== 'undefined' && !localStorage.getItem(viewKey)) {
      supabase.rpc('increment_view_count', { video_id: data.id }).then(() => {
        localStorage.setItem(viewKey, '1')
      })
    }
  }
  return data
})

const { data: relatedVideos } = await useAsyncData(`related-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)')
    .eq('status', 'published')
    .neq('id', route.params.id)
    .order('created_at', { ascending: false })
    .limit(8)
  return data || []
})

const { data: comments, refresh: refreshComments } = await useAsyncData(`comments-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('comments')
    .select('*, profiles:profiles!comments_user_id_fkey(display_name, avatar_url)')
    .eq('video_id', route.params.id)
    .order('created_at', { ascending: false })
  return data || []
})

const formatCount = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count?.toString() || '0'
}

const commentContent = ref('')
const isPosting = ref(false)
const postComment = async () => {
  if (!commentContent.value.trim() || !user.value) return
  isPosting.value = true

  await supabase.from('comments').insert({
    video_id: route.params.id,
    user_id: user.value.id,
    content: commentContent.value.trim()
  })

  commentContent.value = ''
  isPosting.value = false
  refreshComments()
}

const likesCount = ref(0)
const dislikesCount = ref(0)
const hasLiked = ref(false)
const reactionState = ref('none')

const fetchReactions = async () => {
  if (!video.value?.id) return

  // Get counts
  const { data: likesData } = await supabase
    .from('likes')
    .select('is_dislike')
    .eq('video_id', video.value.id)

  if (likesData) {
    likesCount.value = likesData.filter(l => !l.is_dislike).length
    dislikesCount.value = likesData.filter(l => l.is_dislike).length
  }

  // Get user reaction
  if (user.value) {
    const { data: userLike } = await supabase
      .from('likes')
      .select('is_dislike')
      .eq('video_id', video.value.id)
      .eq('user_id', user.value.id)
      .single()

    if (userLike) {
      reactionState.value = userLike.is_dislike ? 'dislike' : 'like'
      hasLiked.value = !userLike.is_dislike
    } else {
      reactionState.value = 'none'
      hasLiked.value = false
    }
  }
}

const handleReactionChange = async (state, revert) => {
  if (!user.value) {
    // Optionally trigger login modal
    revert()
    return
  }

  try {
    if (state === 'none') {
      await supabase
        .from('likes')
        .delete()
        .eq('video_id', video.value.id)
        .eq('user_id', user.value.id)
    } else {
      await supabase
        .from('likes')
        .upsert({
          video_id: video.value.id,
          user_id: user.value.id,
          is_dislike: state === 'dislike'
        })
    }
    reactionState.value = state
  } catch (err) {
    console.error('Failed to update reaction', err)
    revert()
  }
}

watch([() => video.value, () => user.value], () => {
  fetchReactions()
}, { immediate: true })

// Subscriptions
const isSubscribed = ref(false)
const subscribersCount = ref(0)

const fetchSubscriptionStatus = async () => {
    if (!video.value?.user_id) return

    const { count } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', video.value.user_id)

    subscribersCount.value = count || 0

    if (user.value) {
        const { data } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('creator_id', video.value.user_id)
            .eq('subscriber_id', user.value.id)
            .single()

        isSubscribed.value = !!data
    }
}

const toggleSubscription = async () => {
    if (!user.value) return

    try {
        if (isSubscribed.value) {
            await supabase
                .from('subscriptions')
                .delete()
                .eq('creator_id', video.value.user_id)
                .eq('subscriber_id', user.value.id)
            isSubscribed.value = false
            subscribersCount.value--
        } else {
            await supabase
                .from('subscriptions')
                .insert({
                    creator_id: video.value.user_id,
                    subscriber_id: user.value.id
                })
            isSubscribed.value = true
            subscribersCount.value++
        }
    } catch (err) {
        console.error('Failed to toggle subscription', err)
    }
}

watch([() => video.value, () => user.value], () => {
    fetchSubscriptionStatus()
}, { immediate: true })


useSeoMeta({
  title: () => video.value?.title ? `${video.value.title} - NewTube` : 'Watch - NewTube',
  description: () => video.value?.description || 'Watch this video on NewTube.'
})
</script>

<template>
  <div class="min-h-screen pb-20 relative">

    <!-- Main Player Section (Full Width if Cinema) -->
    <div :class="isCinemaMode ? 'w-full px-0' : 'layout-container pt-6 md:pt-8'" class="relative z-10 transition-all duration-300">
      <div 
        class="group/player relative aspect-video bg-black overflow-hidden"
        :class="isCinemaMode ? 'w-full h-screen max-h-[85vh]' : 'rounded-xl border border-white/5 shadow-xl'"
      >
        <!-- Actual Video Player -->
        <video 
          v-if="video?.video_url"
          :src="video.video_url"
          class="w-full h-full object-contain"
          controls
          autoplay
          :poster="video.thumbnail_url || ''"
        ></video>
        
        <!-- Processing State -->
        <div v-else class="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#18181b]">
          <div class="w-10 h-10 rounded-full border-2 border-white/10 border-t-white animate-spin"></div>
          <span class="text-sm font-medium text-white/40">Loading Video...</span>
        </div>

        <!-- Cinema Controls Overlay -->
        <div class="absolute top-4 right-4 flex gap-4 opacity-0 group-hover/player:opacity-100 transition-all duration-300">
          <button 
            @click="isCinemaMode = !isCinemaMode"
            class="w-10 h-10 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 transition-all"
          >
            <div :class="isCinemaMode ? 'i-ph-arrows-in' : 'i-ph-arrows-out'" class="text-xl"></div>
          </button>
        </div>
      </div>
    </div>

    <!-- Info & Interactions -->
    <div class="layout-container mt-6 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
        <!-- Main Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title & Actions -->
          <div class="space-y-4">
            <h1 class="text-xl md:text-2xl font-semibold text-white leading-tight">
              {{ video?.title }}
            </h1>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <!-- Creator Info -->
              <div class="flex items-center gap-4">
                <NuxtLink :to="`/profile/${video?.user_id}`" class="shrink-0">
                  <img 
                    :src="video?.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${video?.user_id}`" 
                    class="w-12 h-12 rounded-full border border-white/10 object-cover bg-[#18181b]"
                  />
                </NuxtLink>
                <div>
                  <div class="font-semibold text-white/90 text-base">{{ video?.profiles?.display_name }}</div>
                  <div class="text-xs text-white/60">{{ formatCount(subscribersCount) }} subscribers</div>
                </div>
                <button v-if="user?.id !== video?.user_id" @click="toggleSubscription" class="ml-4 btn-premium px-4 py-2 text-sm rounded-full font-semibold transition-colors" :class="isSubscribed ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:bg-white/90'">{{ isSubscribed ? 'Subscribed' : 'Subscribe' }}</button>
              </div>

              <!-- Action Bar -->
              <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                <PillReaction
                  :key="`${reactionState}-${likesCount}-${dislikesCount}`"
                  :initialLikes="likesCount"
                  :initialDislikes="dislikesCount"
                  :initialState="reactionState"
                  @change="handleReactionChange"
                />
                <button class="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 transition-colors text-sm font-medium">
                  <div class="i-ph-share-network text-lg"></div>
                  Share
                </button>
                <button class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/15 transition-colors">
                  <div class="i-ph-dots-three text-xl"></div>
                </button>
              </div>
            </div>
          </div>

          <!-- Description Box -->
          <div class="bg-[#18181b] rounded-xl p-4 md:p-6 space-y-4">
            <div class="flex items-center gap-2 text-sm font-medium text-white/90">
              <span>{{ (video?.view_count || 0).toLocaleString() }} views</span>
              <span class="w-1 h-1 rounded-full bg-white/40"></span>
              <ClientOnly><span>{{ useTimeAgo(video?.created_at || '').value }}</span><template #fallback><span>...</span></template></ClientOnly>
            </div>
            <p class="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
              {{ video?.description || 'No description provided.' }}
            </p>
          </div>

          <!-- Comments Feed -->
          <div class="space-y-6 pt-6">
            <div class="flex items-center gap-2 mb-6">
              <h2 class="text-lg font-semibold text-white">Comments</h2>
              <span class="text-sm font-medium text-white/40">{{ comments?.length || 0 }}</span>
            </div>

            <!-- Comment Input -->
            <div class="flex gap-4">
              <img 
                :src="profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id}`" 
                class="w-10 h-10 rounded-full border border-white/10 object-cover shrink-0 bg-[#18181b]"
              />
              <div class="flex-1 space-y-3">
                <textarea 
                  v-model="commentContent"
                  placeholder="Add a comment..."
                  class="w-full bg-transparent border-b border-white/10 pb-2 text-sm text-white focus:(outline-none border-white/40) transition-colors resize-none overflow-hidden placeholder:text-white/40"
                  rows="1"
                  @input="(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }"
                ></textarea>
                <div class="flex justify-end gap-2" v-if="commentContent.length > 0">
                   <button @click="commentContent = ''" class="px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:bg-white/10">
                    Cancel
                  </button>
                  <button @click="postComment" :disabled="isPosting" class="px-4 py-2 rounded-full text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50">
                    {{ isPosting ? 'Posting...' : 'Comment' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Comments List -->
            <div class="space-y-6 pt-4">
              <div v-for="comment in comments" :key="comment.id" class="flex gap-4 group/comment">
                <img 
                  :src="comment.profiles?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.user_id}`" 
                  class="w-10 h-10 rounded-full bg-[#18181b] border border-white/10 object-cover shrink-0"
                />
                <div class="flex-1 space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-medium text-white/90">@{{ comment.profiles?.display_name }}</span>
                    <ClientOnly><span class="text-xs text-white/40">{{ useTimeAgo(comment.created_at).value }}</span><template #fallback><span class="text-xs text-white/40">...</span></template></ClientOnly>
                  </div>
                  <p class="text-white/80 text-sm leading-relaxed max-w-2xl">
                    {{ comment.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Column -->
        <div class="space-y-6">
          <div class="space-y-4">
            <NuxtLink 
              v-for="related in relatedVideos" 
              :key="related.id"
              :to="`/watch/${related.id}`"
              class="flex gap-2.5 group/related no-underline"
            >
              <div class="relative w-40 aspect-video rounded-xl overflow-hidden bg-[#18181b] shrink-0">
                <img :src="related.thumbnail_url || ''" class="w-full h-full object-cover transition-transform duration-300 group-hover/related:scale-105" />
              </div>
              <div class="flex-1 min-w-0 py-0.5 space-y-1">
                <h4 class="text-sm font-medium text-white/90 line-clamp-2 leading-snug group-hover/related:text-white transition-colors">
                  {{ related.title }}
                </h4>
                <div class="text-xs text-white/60 group-hover/related:text-white/80 transition-colors">{{ related.profiles?.display_name }}</div>
                <div class="text-xs text-white/60">{{ related.view_count || 0 }} Views</div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
