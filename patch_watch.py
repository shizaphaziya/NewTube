import re

with open('app/pages/watch/[id].vue', 'r') as f:
    content = f.read()

# Replace Reactions stub
old_reaction = """// Reactions stub
const likesCount = ref(0)
const hasLiked = ref(false)
const handleReactionChange = (state) => {
  console.log('Reaction state changed to:', state)
}"""

new_reaction = """const likesCount = ref(0)
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

watch(() => video.value, () => {
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

watch(() => video.value, () => {
    fetchSubscriptionStatus()
}, { immediate: true })
"""

content = content.replace(old_reaction, new_reaction)

# Replace Subscribe button
old_sub = """                  <div class="text-xs text-white/60">1.2M subscribers</div> <!-- Hardcoded for now to look realistic -->
                </div>
                <button class="ml-4 btn-premium px-4 py-2 text-sm rounded-full bg-white text-black font-semibold hover:bg-white/90">Subscribe</button>"""
new_sub = """                  <div class="text-xs text-white/60">{{ formatCount(subscribersCount) }} subscribers</div>
                </div>
                <button v-if="user?.id !== video?.user_id" @click="toggleSubscription" class="ml-4 btn-premium px-4 py-2 text-sm rounded-full font-semibold transition-colors" :class="isSubscribed ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white text-black hover:bg-white/90'">{{ isSubscribed ? 'Subscribed' : 'Subscribe' }}</button>"""
content = content.replace(old_sub, new_sub)

# Replace PillReaction
old_pill = """                <PillReaction
                  :initialLikes="likesCount"
                  :initialDislikes="0"
                  :initialState="hasLiked ? 'like' : 'none'"
                  @change="handleReactionChange"
                />"""
new_pill = """                <PillReaction
                  :key="`${reactionState}-${likesCount}-${dislikesCount}`"
                  :initialLikes="likesCount"
                  :initialDislikes="dislikesCount"
                  :initialState="reactionState"
                  @change="handleReactionChange"
                />"""
content = content.replace(old_pill, new_pill)

# Add formatCount if not exists
if "const formatCount = " not in content:
    format_count = """const formatCount = (count) => {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M'
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K'
  return count?.toString() || '0'
}
"""
    content = content.replace("const commentContent = ref('')", format_count + "\nconst commentContent = ref('')")

with open('app/pages/watch/[id].vue', 'w') as f:
    f.write(content)
