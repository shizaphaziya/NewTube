<script setup lang="ts">
import { z } from 'zod'
import { useToast } from '~/composables/useToast'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()

useSeoMeta({
  title: () => `${t('studio.upload')} - NewTube`,
  description: () => t('studio.broadcasting')
})

const title = ref('')
const description = ref('')
const videoFile = ref<File | null>(null)
const thumbFile = ref<File | null>(null)

const uploading = ref(false)
const uploadProgress = ref(0)
const { error: showError, success: showSuccess } = useToast()
const success = ref(false)
const videoInput = ref<HTMLInputElement | null>(null)
const thumbInput = ref<HTMLInputElement | null>(null)

const onVideoSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file && file.size > 1073741824) { // 1GB limit
    showError(t('studio.file_too_large'))
    return
  }
  videoFile.value = file || null
}

const handleUpload = async () => {
  if (!videoFile.value || !user.value) return
  
  const generateThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true
      const url = URL.createObjectURL(file)
      video.src = url

      video.addEventListener('loadedmetadata', () => {
        video.currentTime = Math.min(1.5, video.duration / 2 || 0)
      })

      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 1280
        canvas.height = video.videoHeight || 720
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          canvas.toBlob((blob) => {
            URL.revokeObjectURL(url)
            if (blob) resolve(blob)
            else reject(new Error('Could not create thumbnail blob'))
          }, 'image/jpeg', 0.85)
        } else {
          URL.revokeObjectURL(url)
          reject(new Error('Could not get canvas context'))
        }
      })

      video.addEventListener('error', (e) => {
        URL.revokeObjectURL(url)
        reject(e)
      })
    })
  }


  const schema = z.object({
    title: z.string().trim().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional()
  })

  const finalTitle = title.value.trim() || new Date().toLocaleString()
  const result = schema.safeParse({ title: finalTitle, description: description.value })

  if (!result.success) {
    showError(result.error.errors[0].message)
    return
  }

  
  try {
    // Stage 1: Uploading
    uploading.value = true
    uploadProgress.value = 0
    
    const fileExt = videoFile.value.name.split('.').pop() || 'mp4'
    const videoPath = `${user.value.id}/${Date.now()}.${fileExt}`
    
    const { data: vData, error: vError } = await supabase.storage
      .from('videos')
      .upload(videoPath, videoFile.value, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (vError) throw vError
    uploadProgress.value = 50

    // 2. Upload Thumbnail
    let thumbnailUrl = ''
    let thumbnailBlob: Blob | File | null = thumbFile.value

    if (!thumbnailBlob && videoFile.value) {
      try {
        thumbnailBlob = await generateThumbnail(videoFile.value)
      } catch (e) {
        console.warn('Failed to generate automatic thumbnail:', e)
      }
    }

    if (thumbnailBlob) {
      const thumbExt = thumbnailBlob instanceof File ? (thumbnailBlob.name.split('.').pop() || 'jpg') : 'jpg'
      const thumbPath = `${user.value.id}/${Date.now()}.${thumbExt}`
      
      const { data: tData, error: tError } = await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, thumbnailBlob, {
          contentType: thumbnailBlob.type || 'image/jpeg'
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
        title: title.value,
        description: description.value || null,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        status: 'published'
      })

    if (dbError) throw dbError
    
    uploadProgress.value = 100
    success.value = true
    await nextTick()
    navigateTo('/')
    
  } catch (e: any) {
    showError('Upload failed: ' + e.message)
    console.error(e)
  } finally {
    uploading.value = false
  }
}
</script>


<template>
  <div class="layout-container max-w-4xl py-12 pb-20">
    <div v-motion-pop-in class="relative overflow-hidden rounded-[28px]
                               bg-white/[0.03] border border-white/[0.07]
                               backdrop-blur-2xl p-6 md:p-12">
      <!-- Ambient glow -->
      <div class="absolute -bottom-40 -left-20 w-60 h-60 bg-white/[0.01] blur-[80px] rounded-full pointer-events-none"></div>
      
      <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-12 sm:mb-16">
        <div class="w-16 h-16 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center">
          <div class="i-ph-upload-simple-bold text-2xl text-white/60"></div>
        </div>
        <div>
          <h1 class="text-2xl md:text-3xl font-black font-brand tracking-tighter text-white uppercase">{{ t('studio.upload') }}</h1>
          <p class="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] mt-1">{{ t('studio.broadcasting') }}</p>
        </div>
      </div>

      <div v-if="success" class="bg-white/5 border border-white/10 p-16 rounded-[40px] text-center space-y-6">
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
                class="relative h-64 rounded-2xl border-2 border-dashed border-white/[0.08]
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
                  <p class="text-[9px] text-white/20 font-bold mt-2 uppercase tracking-widest">{{ (videoFile.size / (1024*1024)).toFixed(1) }} MB • READY</p>
                </div>
                <input ref="videoInput" type="file" hidden accept="video/*" @change="onVideoSelect" />
              </div>
            </div>

            <div class="space-y-4">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">{{ t('studio.cover_artwork') }}</label>
              <div class="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-colors cursor-pointer" @click="thumbInput?.click()">
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
                required
                type="text" 
              class="w-full bg-transparent border-b-2 border-white/[0.08] py-4 text-2xl font-brand font-black tracking-tight focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/[0.06] text-white" 
                :placeholder="t('studio.entry_name_placeholder')"
              />
            </div>
            
            <div class="space-y-3 group">
              <label class="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1 group-focus-within:text-silver transition-colors">{{ t('studio.description') }}</label>
              <textarea 
                v-model="description" 
                rows="6" 
                class="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.05] transition-all placeholder:text-white/15 leading-relaxed resize-none text-white font-sans"
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
             <progress :value="uploadProgress" max="100" class="w-full h-[2px] rounded-full overflow-hidden appearance-none [&::-webkit-progress-bar]:bg-white/5 [&::-webkit-progress-value]:bg-silver [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-700"></progress>
          </div>
          
          <button 
            type="submit" 
            :disabled="uploading || !videoFile || !title"
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
