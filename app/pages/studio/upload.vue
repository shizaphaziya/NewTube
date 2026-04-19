<script setup lang="ts">
import type { Database } from '~/types/database.types'

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const { t } = useI18n()

const title = ref('')
const description = ref('')
const videoFile = ref<File | null>(null)
const thumbFile = ref<File | null>(null)

const videoInput = ref<HTMLInputElement | null>(null)
const thumbInput = ref<HTMLInputElement | null>(null)

const uploading = ref(false)
const uploadProgress = ref(0)
const success = ref(false)

const onVideoSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.size > 1073741824) { // 1GB limit
    alert(t('studio.file_too_large'))
    return
  }
  videoFile.value = file || null
}

const handleUpload = async () => {
  if (!videoFile.value || !user.value) return
  
  // Auto-title logic
  const finalTitle = title.value.trim() || new Date().toLocaleString()
  
  try {
    // Stage 1: Uploading
    uploading.value = true
    uploadProgress.value = 0
    
    // Use explicit getUser for stability during long upload
    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser()
    if (userError || !authUser) throw new Error(t('studio.auth_lost'))
    const userId = authUser.id

    const videoExt = videoFile.value.name.split('.').pop() || 'mp4'
    const videoPath = `${userId}/${Date.now()}.${videoExt}`
    
    const { data: vData, error: vError } = await supabase.storage
      .from('videos')
      .upload(videoPath, videoFile.value, {
        cacheControl: '3600',
        upsert: false,
        contentType: videoFile.value.type || 'video/mp4'
      })
    
    if (vError) throw vError
    uploadProgress.value = 50

    // 2. Upload Thumbnail (Optional)
    let thumbnailUrl = ''
    let thumbnailFile: File | null = thumbFile.value

    if (thumbnailFile) {
      const thumbExt = thumbnailFile.name.split('.').pop() || 'jpg'
      const thumbPath = `${userId}/${Date.now()}.${thumbExt}`
      
      const { data: tData, error: tError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, thumbnailFile, {
          contentType: thumbnailFile.type || 'image/jpeg'
        })
      
      if (!tError) {
        thumbnailUrl = supabase.storage.from('thumbnails').getPublicUrl(thumbPath).data.publicUrl
      }
    }
    uploadProgress.value = 80

    // 3. Create Database Entry
    const videoUrl = supabase.storage.from('videos').getPublicUrl(videoPath).data.publicUrl
    
    const { error: dbError } = await supabase
      .from('videos')
      .insert({
        user_id: userId,
        title: finalTitle,
        description: description.value || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        status: 'published'
      })

    if (dbError) throw dbError
    
    uploadProgress.value = 100
    success.value = true
    setTimeout(() => navigateTo('/'), 2000)
    
  } catch (e: any) {
    const errorMsg = e.message || e.toString() || JSON.stringify(e);
    alert(t('studio.upload_failed') + ` : ` + errorMsg)
    console.error('Upload Process Failed:', e)
  } finally {
    uploading.value = false
  }
}
</script>


<template>
  <div class="layout-container max-w-4xl py-12 pb-20">
    <div v-motion-pop-in class="relative overflow-hidden rounded-xl
                               bg-white/[0.03] border border-white/[0.07]
                               backdrop-blur-2xl p-6 md:p-12">
      <!-- Ambient glow -->
      <div class="absolute -bottom-40 -left-20 w-60 h-60 bg-white/[0.01] blur-[80px] rounded-full pointer-events-none"></div>
      
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
        <div class="w-16 h-16 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
          <div class="i-ph-upload-simple-bold text-2xl text-white/60"></div>
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-black font-brand tracking-tighter text-white uppercase">{{ t('studio.upload') }}</h1>
          <p class="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mt-1">{{ t('studio.broadcasting') }}</p>
        </div>
      </div>

      <div v-if="success" class="bg-white/5 border border-white/10 p-16 rounded-3xl text-center space-y-6">
        <div class="i-ph-check-circle-fill text-7xl text-white mx-auto animate-pulse"></div>
        <h2 class="text-2xl md:text-3xl font-heading font-black tracking-tight text-white uppercase">{{ t('studio.success') }}</h2>
        <p class="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">{{ t('studio.success_subtitle') }}</p>
      </div>

      <form v-else @submit.prevent="handleUpload" class="space-y-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 md:p-12">
          <!-- File Selection (2 columns) -->
          <div class="lg:col-span-2 space-y-8">
            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">{{ t('studio.select_file') }}</label>
              <div 
                class="relative h-64 rounded-xl border-2 border-dashed border-white/[0.08]
                       bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20
                       transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group"
                @click="videoInput?.click()"
              >
                <div v-if="!videoFile" class="text-center group-hover:scale-105 transition-transform duration-500">
                  <div class="i-ph-video-bold text-5xl text-white/5 mb-4 group-hover:text-white/20 transition-colors"></div>
                  <p class="text-[10px] text-white/20 font-black uppercase tracking-widest">{{ t('studio.select_file') }}</p>
                </div>
                <div v-else class="text-center p-6 w-full">
                  <div class="i-ph-file-video-fill text-5xl text-silver mb-4 mx-auto"></div>
                  <p class="text-xs font-black text-white truncate px-4">{{ videoFile.name.toUpperCase() }}</p>
                  <p class="text-[9px] text-white/20 font-bold mt-2 uppercase tracking-widest">{{ (videoFile.size / (1024*1024)).toFixed(1) }} MB • {{ t('studio.ready') }}</p>
                </div>
                <input ref="videoInput" type="file" hidden accept="video/*" @change="onVideoSelect" />
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">{{ t('studio.cover_artwork') }}</label>
              <div class="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-white/10 transition-colors cursor-pointer" @click="thumbInput?.click()">
                <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
                  <div class="i-ph-image-bold text-2xl"></div>
                </div>
                <div class="flex-1 min-w-0">
                   <p class="text-[10px] font-black text-white/40 uppercase tracking-widest truncate">{{ thumbFile ? thumbFile.name : t('studio.select_thumbnail') }}</p>
                </div>
                <input ref="thumbInput" type="file" hidden accept="image/*" @change="e => thumbFile = (e.target as HTMLInputElement).files?.[0] || null" />
              </div>
            </div>
          </div>

          <!-- Metadata (3 columns) -->
          <div class="lg:col-span-3 space-y-10">
            <div class="space-y-3 group">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-silver transition-colors">{{ t('studio.title') }}</label>
              <input 
                v-model="title" 
                type="text" 
              class="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-2xl font-brand font-black tracking-tight focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/[0.06] text-white" 
                :placeholder="t('studio.entry_name_placeholder') || new Date().toLocaleString()" 
              />
            </div>
            
            <div class="space-y-3 group">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-silver transition-colors">{{ t('studio.description') }}</label>
              <textarea 
                v-model="description" 
                rows="6" 
                class="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl p-6 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.05] transition-all placeholder:text-white/15 leading-relaxed resize-none text-white font-sans" 
                :placeholder="t('studio.description_placeholder')"
              ></textarea>
            </div>
          </div>
        </div>


        <!-- Progress/Action -->
        <div class="pt-12 border-t border-white/5">
          <!-- Uploading State (Supabase) -->
          <div v-if="uploading" class="space-y-6 mb-12" v-motion-fade>
             <div class="flex justify-between items-end">
               <div class="space-y-1">
                 <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 animate-pulse">{{ t('studio.broadcasting') }}</p>
                 <p class="text-[9px] text-white/20 uppercase font-black">{{ t('studio.uploading_note') }}</p>
               </div>
               <span class="text-2xl font-brand font-black tracking-tighter text-white tabular-nums">{{ uploadProgress }}%</span>
             </div>
             <div class="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
               <div class="h-full bg-silver transition-all duration-700 ease-out" :style="{ width: `${uploadProgress}%` }"></div>
             </div>
          </div>
          
          <button 
            type="submit" 
            :disabled="uploading || !videoFile"
            class="btn-primary w-full py-6 text-sm font-black tracking-[0.4em] uppercase group"
          >
            <span v-if="!uploading" class="flex items-center justify-center gap-4 text-xs font-black tracking-[0.3em]">
              {{ t('studio.publish') }}
              <div class="i-ph-rocket-launch-bold group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-300"></div>
            </span>
            <span v-else class="flex items-center justify-center gap-4 text-xs font-black tracking-[0.2em]">
              {{ t('studio.uploading') }}
              <div class="i-ph-circle-notch-bold animate-spin"></div>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>