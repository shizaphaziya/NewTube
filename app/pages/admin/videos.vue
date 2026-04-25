<script setup lang="ts">
import type { Database } from '~/types/database.types'

type VideoWithProfile = Database['public']['Tables']['videos']['Row'] & {
  profiles: {
    display_name: string | null
  } | null
}

const supabase = useSupabaseClient<Database>()
const { t } = useI18n()
const { confirm: showConfirm } = useConfirm()
const { profile } = useProfile()

// Security check: Only admins allowed
const isAdmin = computed(() => profile.value?.role === 'admin')

const { data: videos, refresh } = await useAsyncData('admin-videos', async () => {
  const { data } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name)')
    .order('created_at', { ascending: false })
  return (data as unknown || []) as VideoWithProfile[]
})

const toggle18Plus = async (video: VideoWithProfile) => {
  const { error } = await supabase
    .from('videos')
    .update({ is_18_plus: !video.is_18_plus })
    .eq('id', video.id)

  if (!error) refresh()
}

const toggleBlock = async (video: VideoWithProfile) => {
  const newStatus = video.status === 'blocked' ? 'published' : 'blocked'
  const { error } = await supabase
    .from('videos')
    .update({ status: newStatus as any }) // status is an enum in DB
    .eq('id', video.id)
  
  if (!error) refresh()
}

const deleteVideo = async (id: string) => {
  if (!await showConfirm(t('studio.terminate_confirm'))) return
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (!error) refresh()
}

// Redirect if not admin (handled in template for now, but usually middleware is better)
watchEffect(() => {
  if (profile.value && profile.value.role !== 'admin') {
    // navigateTo('/')
  }
})
</script>

<template>
  <div class="px-4 md:px-10 py-6 md:py-10 relative">
    <!-- Admin Shield -->
    <div v-if="!isAdmin" class="glass-card p-20 text-center max-w-2xl mx-auto space-y-8">
      <div class="i-ph-shield-warning-bold text-6xl text-red-500 mx-auto opacity-50"></div>
      <div class="space-y-2">
        <h1 class="text-3xl font-brand font-black text-white">{{ t('admin.access_denied') }}</h1>
        <p class="text-white/30 text-sm uppercase tracking-widest font-bold">{{ t('admin.clearance_required') }}</p>
      </div>
      <NuxtLink to="/" class="btn-primary inline-flex">{{ t('admin.return_surface') }}</NuxtLink>
    </div>

    <div v-else class="space-y-16">
      <!-- Header -->
      <div class="space-y-2">
        <h1 class="text-5xl font-brand font-black tracking-tighter text-white uppercase italic">
          {{ t('admin.high_command') }}
        </h1>
        <p class="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">
          {{ t('admin.video_moderation_terminal') }}
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="glass-card p-6 border-white/5 space-y-1">
          <div class="text-[8px] font-black text-white/20 uppercase tracking-widest">{{ t('admin.total_assets') }}</div>
          <div class="text-3xl font-brand font-black text-white tabular-nums">{{ videos?.length || 0 }}</div>
        </div>
        <div class="glass-card p-6 border-white/5 space-y-1">
          <div class="text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">{{ t('admin.active') }}</div>
          <div class="text-3xl font-brand font-black text-emerald-400 tabular-nums">
            {{ videos?.filter(v => v.status === 'published').length || 0 }}
          </div>
        </div>
        <div class="glass-card p-6 border-white/5 space-y-1">
          <div class="text-[8px] font-black text-red-500/40 uppercase tracking-widest">{{ t('admin.blocked') }}</div>
          <div class="text-3xl font-brand font-black text-red-500 tabular-nums">
            {{ videos?.filter(v => v.status === 'blocked').length || 0 }}
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="glass-card overflow-hidden border-white/5">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5 bg-white/[0.02]">
                <th class="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">{{ t('admin.video_author') }}</th>
                <th class="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">{{ t('watch.views') }}</th>
                <th class="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">18+</th>
                <th class="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest">{{ t('admin.status') }}</th>
                <th class="px-6 py-4 text-[9px] font-black text-white/30 uppercase tracking-widest text-right">{{ t('admin.actions') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/[0.03]">
              <tr v-for="video in videos" :key="video.id" class="group hover:bg-white/[0.01] transition-colors">
                <td class="px-6 py-6">
                  <div class="flex items-center gap-4">
                    <div class="w-20 aspect-video rounded-lg overflow-hidden bg-void-card border border-white/5">
                      <img v-if="video.thumbnail_url" :src="video.thumbnail_url" class="w-full h-full object-cover" />
                      <video v-else-if="video.video_url" :src="video.video_url + '#t=0.5'" class="w-full h-full object-cover" muted preload="metadata"></video>
                      <div v-else class="w-full h-full flex items-center justify-center opacity-20 bg-white/5"><div class="i-ph-video-camera-bold text-2xl text-white"></div></div>
                    </div>
                    <div class="space-y-1">
                      <div class="text-xs font-bold text-white group-hover:text-white transition-colors">{{ video.title }}</div>
                      <div class="text-[9px] text-white/30 uppercase tracking-wider font-medium">{{ video.profiles?.display_name || t('admin.anonymous') }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-6">
                  <div class="text-[10px] font-black text-white/40 tabular-nums uppercase tracking-widest">{{ (video.view_count || 0).toLocaleString() }} {{ t('admin.imps') }}</div>
                </td>
                <td class="px-6 py-6">
                  <button
                    @click.prevent="toggle18Plus(video)"
                    class="w-12 h-6 rounded-full transition-colors relative shrink-0 block"
                    :class="video.is_18_plus ? 'bg-red-500' : 'bg-white/20'"
                    title="Toggle 18+ Age Restriction"
                  >
                    <div
                      class="absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200"
                      :class="video.is_18_plus ? 'translate-x-6' : 'translate-x-0'"
                    ></div>
                  </button>
                </td>
                <td class="px-6 py-6">
                  <span 
                    class="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all duration-300"
                    :class="video.status === 'blocked' ? 'border-red-500/20 text-red-500 bg-red-500/5' : 'border-emerald-500/20 text-emerald-400 bg-emerald-400/5'"
                  >
                    {{ t('studio.status_' + video.status) }}
                  </span>
                </td>
                <td class="px-6 py-6 text-right">
                  <div class="flex items-center justify-end gap-2 text-void-silver">
                    <button 
                      @click="toggleBlock(video)"
                      class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                      :title="video.status === 'blocked' ? t('admin.publish') : t('admin.block')"
                      :class="video.status === 'blocked' ? 'text-emerald-400 hover:bg-emerald-400/10' : 'text-red-500 hover:bg-red-500/10'"
                    >
                      <div :class="video.status === 'blocked' ? 'i-ph-lock-open-bold' : 'i-ph-lock-bold'"></div>
                    </button>
                    <button 
                      @click="deleteVideo(video.id)"
                      class="w-8 h-8 rounded-lg bg-red-500/5 border border-red-500/10 text-red-500/60 hover:text-red-500 flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div class="i-ph-trash-bold"></div>
                    </button>
                    <NuxtLink 
                      :to="`/watch/${video.id}`"
                      class="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      <div class="i-ph-arrow-square-out-bold"></div>
                    </NuxtLink>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
