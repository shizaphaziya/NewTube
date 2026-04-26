<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()
const { error: showError, success: showSuccess } = useToast()

const form = ref({
  title: '',
  description: '',
  videoFile: null,
  thumbnailFile: null,
  isShort: false,
  thumbnailBlob: null
})

const isUploading = ref(false)
const progress = ref({
  status: '',
  percent: 0
})
const uploadSuccess = ref(false)

const handleVideoSelect = async (e) => {
  const file = e.target.files[0]
  if (!file) return
  form.value.videoFile = file

  // Extract duration, resolution and generate thumbnail
  const videoUrl = URL.createObjectURL(file)
  const video = document.createElement('video')
  video.src = videoUrl

  await new Promise(resolve => {
    video.onloadedmetadata = () => {
      const isVertical = video.videoHeight > video.videoWidth
      const isShortDuration = video.duration <= 60
      form.value.isShort = isVertical && isShortDuration
      resolve()
    }
  })

  // Generate thumbnail from 5th second (or middle if shorter than 5s)
  const targetTime = Math.min(5, video.duration / 2)
  video.currentTime = targetTime

  await new Promise(resolve => {
    video.onseeked = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(blob => {
        if (blob) {
            form.value.thumbnailBlob = blob
        }
        URL.revokeObjectURL(videoUrl)
        resolve()
      }, 'image/jpeg', 0.8)
    }
  })
}

const handleThumbnailSelect = (e) => {
  form.value.thumbnailFile = e.target.files[0]
}

const uploadVideo = async () => {
  if (!form.value.videoFile || !form.value.title || !user.value) return
  isUploading.value = true
  uploadSuccess.value = false

  try {
    const videoExt = form.value.videoFile.name.split('.').pop()
    const videoFileName = `${Math.random()}.${videoExt}`
    const videoPath = `${user.value.id}/${videoFileName}`

    progress.value = { status: t('studio.uploading_storage'), percent: 20 }

    const { error: uploadError } = await supabase.storage
      .from('videos')
      .upload(videoPath, form.value.videoFile)

    if (uploadError) throw uploadError

    const { data: { publicUrl: videoUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(videoPath)

    let thumbnailUrl = null
    if (form.value.thumbnailFile || form.value.thumbnailBlob) {
      progress.value = { status: t('studio.uploading_thumbnail'), percent: 60 }

      const fileToUpload = form.value.thumbnailFile || form.value.thumbnailBlob
      const thumbExt = form.value.thumbnailFile ? form.value.thumbnailFile.name.split('.').pop() : 'jpg'
      const thumbFileName = `${Math.random()}.${thumbExt}`
      const thumbPath = `${user.value.id}/${thumbFileName}`

      await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, fileToUpload, {
            contentType: form.value.thumbnailFile ? form.value.thumbnailFile.type : 'image/jpeg'
        })

      const { data: { publicUrl: tUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbPath)
      
      thumbnailUrl = tUrl
    }

    progress.value = { status: t('studio.finalizing'), percent: 90 }

    const { error: dbError } = await supabase.from('videos').insert({

      user_id: user.value.id,
      title: form.value.title,
      description: form.value.description,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      is_short: form.value.isShort,
      status: 'published'
    })

    if (dbError) throw dbError

    progress.value = { status: t('studio.done'), percent: 100 }
    uploadSuccess.value = true
    form.value = { title: '', description: '', videoFile: null, thumbnailFile: null, isShort: false, thumbnailBlob: null }
  } catch (error) {
    showError({
      title: t('studio.failed_upload'),
      description: error.message
    })
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="px-4 md:px-8 py-12 relative max-w-4xl mx-auto min-h-screen">
    <!-- Cinematic Aura -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary-500/5 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div class="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-primary-500/3 blur-[100px] rounded-full"></div>
    </div>

    <div class="relative z-10 space-y-10">
      
      <div v-motion-fade-in class="text-center md:text-left">
        <h1 class="text-4xl md:text-5xl font-black text-white mb-2 uppercase tracking-tighter italic">
          {{ t('studio.upload') }}
        </h1>
        <div class="flex items-center justify-center md:justify-start gap-3">
          <div class="h-px w-8 bg-primary-500/40"></div>
          <p class="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">
            {{ t('studio.uploading_content_hint') }}
          </p>
        </div>
      </div>

      <!-- Success State -->
      <Transition 
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div v-if="uploadSuccess" class="glass-card border-primary-500/20 p-12 flex flex-col items-center text-center space-y-6 shadow-[0_0_50px_-12px_rgba(239,68,68,0.15)]">
          <div class="w-20 h-20 rounded-3xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-primary-500 animate-glow">
            <div class="i-ph-check-circle-duotone text-5xl"></div>
          </div>
          <div class="space-y-2">
            <h3 class="text-2xl font-black text-white uppercase tracking-tight">{{ t('studio.success') }}</h3>
            <p class="text-white/40 text-sm font-medium">{{ t('studio.success_subtitle') }}</p>
          </div>
          <div class="pt-4 flex gap-4">
            <button @click="uploadSuccess = false" class="btn-primary rounded-xl px-10 py-4 font-bold uppercase tracking-widest text-xs">
              {{ t('studio.upload_another') }}
            </button>
            <NuxtLink to="/studio" class="glass-button rounded-xl px-10 py-4 font-bold uppercase tracking-widest text-xs">
              {{ t('studio.go_dashboard') }}
            </NuxtLink>
          </div>
        </div>

        <form v-else @submit.prevent="uploadVideo" class="space-y-8">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <!-- Left Column: Media -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Video Dropzone -->
              <div v-motion-slide-visible-left class="space-y-3">
                <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ t('studio.video_file') }}</label>
                <div class="group relative aspect-[9/16] lg:aspect-square rounded-[2rem] overflow-hidden border-2 border-dashed border-white/5 hover:border-primary-500/40 transition-all duration-500 bg-white/[0.02]">
                  <input
                    type="file"
                    accept="video/*"
                    @change="handleVideoSelect"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    required
                  />
                  
                  <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 pointer-events-none transition-transform duration-500 group-hover:scale-105">
                    <div class="w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center text-white/20 group-hover:text-primary-500 group-hover:bg-primary-500/10 group-hover:border-primary-500/20 transition-all duration-500 shadow-2xl">
                      <div class="i-ph-upload-simple-duotone text-4xl"></div>
                    </div>
                    
                    <div v-if="form.videoFile" class="space-y-1">
                      <div class="text-white font-black uppercase tracking-tight text-sm line-clamp-1 px-4">{{ form.videoFile.name }}</div>
                      <div class="text-primary-500 text-[10px] font-bold uppercase tracking-widest">{{ (form.videoFile.size / 1024 / 1024).toFixed(1) }} {{ t('studio.mb_ready') }}</div>
                    </div>
                    <div v-else class="space-y-2">
                      <div class="text-white/60 text-xs font-bold uppercase tracking-widest">{{ t('studio.drop_source') }}</div>
                      <div class="text-white/20 text-[9px] uppercase tracking-tighter">{{ t('studio.video_formats') }}</div>
                    </div>
                  </div>

                  <!-- Hover Glow -->
                  <div class="absolute inset-0 bg-primary-500/0 group-hover:bg-primary-500/[0.02] transition-colors duration-500"></div>
                </div>
              </div>

              <!-- Thumbnail Dropzone -->
              <div v-motion-slide-visible-left :delay="100" class="space-y-3">
                <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ t('studio.cover_artwork') }}</label>
                <div class="group relative rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-300 bg-white/[0.02] p-4 flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleThumbnailSelect"
                    class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div class="w-24 aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center shrink-0 border border-white/10 relative group-hover:border-white/20">
                    <div v-if="!form.thumbnailFile" class="i-ph-image-duotone text-2xl text-white/10"></div>
                    <div v-else class="text-[8px] text-primary-500 font-black uppercase tracking-widest">{{ t('studio.selected') }}</div>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div v-if="form.thumbnailFile" class="text-white text-xs font-bold truncate uppercase tracking-tight">{{ form.thumbnailFile.name }}</div>
                    <div v-else class="text-white/40 text-xs font-bold uppercase tracking-widest">{{ t('studio.select_image') }}</div>
                    <p class="text-[9px] text-white/20 uppercase mt-1">{{ t('studio.recommended_ratio') }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Metadata -->
            <div class="lg:col-span-3 space-y-8">
              <div v-motion-slide-visible-right class="glass-card p-8 space-y-8 shadow-2xl">
                <!-- Metadata Fields -->
                <div class="space-y-6">
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ t('studio.title') }}</label>
                    <input
                      v-model="form.title"
                      type="text"
                      required
                      class="glass-input w-full rounded-2xl py-4 px-6 text-sm font-medium placeholder:text-white/10"
                      :placeholder="t('studio.entry_name_placeholder')"
                    />
                  </div>
                  <div class="space-y-3">
                    <label class="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] ml-2">{{ t('studio.description') }}</label>
                    <textarea
                      v-model="form.description"
                      class="glass-input w-full min-h-[200px] resize-none rounded-[2rem] py-5 px-6 text-sm font-medium placeholder:text-white/10"
                      :placeholder="t('studio.description_placeholder')"
                    ></textarea>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="pt-6 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/5">
                  <div class="flex-1 w-full md:pr-8">
                    <div v-if="isUploading" class="space-y-3">
                      <div class="flex justify-between items-end">
                        <span class="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] animate-pulse">{{ progress.status }}</span>
                        <span class="text-lg font-black text-white tabular-nums">{{ progress.percent }}%</span>
                      </div>
                      <div class="h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px] border border-white/5">
                        <div class="h-full bg-gradient-to-r from-primary-600 to-primary-400 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.5)]" :style="{ width: `${progress.percent}%` }"></div>
                      </div>
                    </div>
                    <div v-else class="flex items-center gap-2 text-white/20">
                      <div class="i-ph-info text-sm"></div>
                      <p class="text-[9px] font-bold uppercase tracking-widest">{{ t('studio.safety_protocols') }}</p>
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    :disabled="isUploading || !form.videoFile || !form.title"
                    class="btn-primary w-full md:w-auto shrink-0 rounded-2xl px-12 py-5 font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                  >
                    <div class="flex items-center justify-center gap-3">
                      <div v-if="isUploading" class="i-ph-circle-notch animate-spin text-lg"></div>
                      <span>{{ isUploading ? t('studio.uploading') : t('studio.publish') }}</span>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Content Guidelines Card -->
              <div v-motion-slide-visible-right :delay="200" class="glass-card p-6 border-white/5 opacity-60 hover:opacity-100 transition-opacity">
                <div class="flex gap-4">
                  <div class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                    <div class="i-ph-warning-diamond text-xl"></div>
                  </div>
                  <div class="space-y-1">
                    <h4 class="text-[10px] font-black text-white uppercase tracking-widest">{{ t('studio.safety_protocols') }}</h4>
                    <p class="text-[11px] text-white/40 leading-relaxed">
                      {{ t('studio.safety_protocols_hint') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Transition>
    </div>
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

