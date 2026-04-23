<script setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { t } = useI18n()

const form = ref({
  title: '',
  description: '',
  videoFile: null,
  thumbnailFile: null
})

const isUploading = ref(false)
const progress = ref({
  status: '',
  percent: 0
})
const uploadSuccess = ref(false)

const handleVideoSelect = (e) => {
  form.value.videoFile = e.target.files[0]
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
    if (form.value.thumbnailFile) {
      progress.value = { status: 'Uploading thumbnail', percent: 60 }
      const thumbExt = form.value.thumbnailFile.name.split('.').pop()
      const thumbFileName = `${Math.random()}.${thumbExt}`
      const thumbPath = `${user.value.id}/${thumbFileName}`

      await supabase.storage
        .from('thumbnails')
        .upload(thumbPath, form.value.thumbnailFile)

      const { data: { publicUrl: tUrl } } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(thumbPath)
      
      thumbnailUrl = tUrl
    }

    progress.value = { status: 'Finalizing', percent: 90 }

    const { error: dbError } = await supabase.from('videos').insert({
      user_id: user.value.id,
      title: form.value.title,
      description: form.value.description,
      video_url: videoUrl,
      thumbnail_url: thumbnailUrl,
      status: 'published'
    })

    if (dbError) throw dbError

    progress.value = { status: 'Done', percent: 100 }
    uploadSuccess.value = true
    form.value = { title: '', description: '', videoFile: null, thumbnailFile: null }
  } catch (error) {
    console.error('Upload failed:', error)
    alert('Upload failed: ' + error.message)
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="px-4 md:px-8 py-8 relative max-w-3xl mx-auto">
    <div class="space-y-8">
      
      <div>
        <h1 class="text-2xl font-bold text-white mb-1">{{ t('studio.upload') }}</h1>
        <p class="text-white/60 text-sm">Upload a new video to your channel.</p>
      </div>

      <div v-if="uploadSuccess" class="bg-green-500/10 border border-green-500/20 rounded-xl p-6 flex flex-col items-center text-center space-y-4">
        <div class="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
          <div class="i-ph-check-circle text-2xl"></div>
        </div>
        <div>
          <h3 class="text-green-400 font-medium">{{ t('studio.success') }}</h3>
          <p class="text-green-400/60 text-sm">{{ t('studio.success_subtitle') }}</p>
        </div>
        <button @click="uploadSuccess = false" class="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors">
          Upload another
        </button>
      </div>

      <form v-else @submit.prevent="uploadVideo" class="bg-[#18181b] border border-white/5 rounded-2xl p-6 md:p-8 space-y-6">

        <!-- Video File Selection -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-white/90">Video File</label>
          <div class="border-2 border-dashed border-white/10 rounded-xl p-8 hover:border-white/20 transition-colors bg-[#27272a]/50 text-center relative group">
            <input
              type="file"
              accept="video/*"
              @change="handleVideoSelect"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              required
            />
            <div class="space-y-2 pointer-events-none">
              <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-white/40 group-hover:text-white/60 group-hover:scale-110 transition-all">
                <div class="i-ph-upload-simple text-xl"></div>
              </div>
              <div v-if="form.videoFile" class="text-white font-medium">{{ form.videoFile.name }}</div>
              <div v-else class="text-white/60 text-sm">Drag and drop or click to select</div>
            </div>
          </div>
        </div>

        <!-- Thumbnail Selection -->
        <div class="space-y-3">
          <label class="text-sm font-medium text-white/90">{{ t('studio.cover_artwork') }}</label>
          <div class="border border-white/10 rounded-xl p-4 flex items-center gap-4 bg-[#27272a]/50 relative hover:border-white/20 transition-colors">
             <input
              type="file"
              accept="image/*"
              @change="handleThumbnailSelect"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div class="w-16 h-10 bg-[#18181b] rounded overflow-hidden flex items-center justify-center shrink-0 border border-white/5">
              <div v-if="!form.thumbnailFile" class="i-ph-image text-white/20"></div>
              <div v-else class="text-[10px] text-white/60 font-medium">Selected</div>
            </div>
            <div class="flex-1">
              <div v-if="form.thumbnailFile" class="text-white text-sm truncate">{{ form.thumbnailFile.name }}</div>
              <div v-else class="text-white/60 text-sm">Select thumbnail image (optional)</div>
            </div>
          </div>
        </div>

        <div class="h-px bg-white/5"></div>

        <!-- Metadata -->
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-white/90">{{ t('studio.title') }}</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="glass-input w-full"
              :placeholder="t('studio.entry_name_placeholder')"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-white/90">{{ t('studio.description') }}</label>
            <textarea
              v-model="form.description"
              class="glass-input w-full min-h-[120px] resize-y"
              :placeholder="t('studio.description_placeholder')"
            ></textarea>
          </div>
        </div>

        <!-- Progress / Submit -->
        <div class="pt-4 flex items-center justify-between">
          <div class="flex-1 pr-8">
            <div v-if="isUploading" class="space-y-2">
              <div class="flex justify-between text-xs font-medium text-white/60">
                <span>{{ progress.status }}</span>
                <span>{{ progress.percent }}%</span>
              </div>
              <div class="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div class="h-full bg-white transition-all duration-300" :style="{ width: `${progress.percent}%` }"></div>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            :disabled="isUploading || !form.videoFile || !form.title"
            class="btn-primary shrink-0"
          >
            {{ isUploading ? 'Publishing...' : t('studio.publish') }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>
