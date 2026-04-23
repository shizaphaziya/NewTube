<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('home.subscriptions')} - NewTube`,
})

const { data: subscribedVideos, pending } = await useAsyncData('subscriptions-videos', async () => {
    if (!user.value) return []

    // 1. Get user's subscriptions
    const { data: subs } = await supabase
        .from('subscriptions')
        .select('creator_id')
        .eq('subscriber_id', user.value.id)

    if (!subs || subs.length === 0) return []

    const creatorIds = subs.map(s => s.creator_id)

    // 2. Get videos from those creators
    const { data: videos } = await supabase
        .from('videos')
        .select('*, profiles:profiles!videos_user_id_fkey(display_name, avatar_url)')
        .in('user_id', creatorIds)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    return videos || []
}, { watch: [user] })

</script>

<template>
  <div class="layout-container py-8">
    <h1 class="text-2xl font-semibold text-white mb-8">{{ t('home.subscriptions') }}</h1>

    <div v-if="!user" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="i-ph-users text-6xl text-white/10 mb-4"></div>
        <h2 class="text-xl font-medium text-white/60 mb-4">Sign in to see updates from your favorite channels</h2>
        <NuxtLink to="/auth/login" class="btn-primary">Sign In</NuxtLink>
    </div>

    <div v-else-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6">
        <VideoSkeleton v-for="n in 10" :key="n" />
    </div>

    <div v-else-if="subscribedVideos?.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
        <div class="i-ph-users text-6xl text-white/10 mb-4"></div>
        <h2 class="text-xl font-medium text-white/60">No videos yet</h2>
        <p class="text-white/40 mt-2">Subscribe to some channels to see their videos here.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-10 sm:gap-x-6">
        <VideoCard
            v-for="(video, idx) in subscribedVideos"
            :key="video.id"
            :video="video"
            :index="idx"
        />
    </div>
  </div>
</template>
