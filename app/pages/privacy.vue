<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="max-w-4xl mx-auto py-20 px-4">
    <div class="mb-16">
      <h1 class="text-6xl font-900 text-void-900 dark:text-white uppercase tracking-tighter italic mb-4">
        {{ t('footer.privacy') }}
      </h1>
      <div class="h-1.5 w-24 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
    </div>

    <div class="prose prose-invert max-w-none text-void-600 dark:text-white/60 space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">Data Collection</h2>
        <p>We collect information that you provide directly to us, such as when you create an account, upload content, or communicate with us.</p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">Usage Information</h2>
        <p>We automatically collect information about how you interact with our service, including the videos you watch and the searches you perform, to improve your experience.</p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">Cookies and Tracking</h2>
        <p>NewTube uses cookies and similar technologies to remember your preferences and provide a personalized experience. You can control cookie settings in your browser.</p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">Security</h2>
        <p>We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction.</p>
      </section>
    </div>
  </div>
</template>
