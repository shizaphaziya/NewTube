<script setup>
definePageMeta({
  middleware: ['admin']
})

const supabase = useSupabaseClient()
const { error: showError } = useToast()
const { t } = useI18n()


const { data: videos, refresh } = await useAsyncData('admin-videos', async () => {
  const { data } = await supabase
    .from('videos')
    .select('*, profiles:profiles!videos_user_id_fkey(display_name)')
    .order('created_at', { ascending: false })
  return data
})

const updateStatus = async (videoId, status) => {
  const { error } = await supabase
    .from('videos')
    .update({ status })
    .eq('id', videoId)
  
  if (!error) {
    refresh()
  } else {
    showError(error.message)
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'published': return 'text-green-400 bg-green-400/10'
    case 'hidden': return 'text-yellow-400 bg-yellow-400/10'
    case 'blocked': return 'text-red-400 bg-red-400/10'
    default: return 'text-white/40 bg-white/5'
  }
}

useSeoMeta({
  title: () => `${t('admin.title')} - ${t('seo.title')}`
})
</script>

<template>
  <div class="layout-container pb-20">
    <div class="flex items-center gap-6 mb-16">
      <div class="w-16 h-16 rounded-[24px] bg-white/[0.03] border border-white/5 flex items-center justify-center text-white/40">
        <div class="i-ph-shield-check-bold text-3xl"></div>
      </div>
      <div>
        <h1 class="text-4xl font-black font-heading tracking-tighter text-white uppercase">{{ t('admin.moderation') }}</h1>
      </div>
    </div>

    <div class="glass-card overflow-hidden border-white/5 shadow-md rounded-[32px]">
      <div class="overflow-x-auto w-full">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
              <th class="px-8 py-6">{{ t('admin.signal') }}</th>
              <th class="px-8 py-6">{{ t('admin.node') }}</th>
              <th class="px-8 py-6">{{ t('admin.status') }}</th>
              <th class="px-8 py-6 text-right">{{ t('admin.actions') }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/5">
            <tr v-for="video in videos" :key="video.id" class="hover:bg-white/[0.02] transition-all duration-300 group">
              <td class="px-8 py-6">
                <div class="flex items-center gap-5">
                  <div class="relative transition-transform duration-500">
                    <img :src="video.thumbnail_url" class="w-24 aspect-video rounded-xl bg-white/5 object-cover border border-white/5" />
                    <div class="absolute inset-0 bg-void/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <div class="i-ph-eye-bold text-white text-xl"></div>
                    </div>
                  </div>
                  <div class="min-w-0">
                    <div class="text-sm font-black text-white uppercase tracking-tight truncate max-w-[240px]">{{ video.title }}</div>
                    <div class="text-[9px] text-white/10 font-bold uppercase tracking-widest mt-1">ID: {{ video.id.split('-')[0] }}...</div>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="text-[10px] font-black text-white/40 uppercase tracking-widest">{{ video.profiles?.display_name }}</div>
              </td>
              <td class="px-8 py-6">
                <div class="flex">
                  <span 
                    class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border"
                    :class="[
                      video.status === 'published' ? 'text-white bg-white/5 border-white/10' : 
                      video.status === 'blocked' ? 'text-red-400 bg-red-400/5 border-red-400/10' :
                      'text-white/30 bg-white/5 border-white/5'
                    ]"
                  >
                    {{ t(`admin.${video.status}`) }}
                  </span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                  <button 
                    v-if="video.status !== 'published'"
                    @click="updateStatus(video.id, 'published')"
                    class="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white hover:text-void transition-all"
                    :title="t('admin.publish')"
                  >
                    <div class="i-ph-check-bold"></div>
                  </button>
                  <button 
                    v-if="video.status !== 'hidden'"
                    @click="updateStatus(video.id, 'hidden')"
                    class="p-3 rounded-xl bg-white/5 text-white/40 hover:bg-white hover:text-void transition-all"
                    :title="t('admin.hide')"
                  >
                    <div class="i-ph-eye-closed-bold"></div>
                  </button>
                  <button 
                    v-if="video.status !== 'blocked'"
                    @click="updateStatus(video.id, 'blocked')"
                    class="p-3 rounded-xl bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    :title="t('admin.block')"
                  >
                    <div class="i-ph-prohibit-bold"></div>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="!videos?.length" class="py-32 text-center text-white/5 font-black uppercase tracking-[0.5em] text-sm">
        {{ t('admin.no_signals') }}
      </div>
    </div>
  </div>
</template>
