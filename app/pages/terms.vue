<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <div class="max-w-4xl mx-auto py-20 px-4">
    <div class="mb-16">
      <h1 class="text-6xl font-900 text-void-900 dark:text-white uppercase tracking-tighter italic mb-4">
        {{ t('footer.terms') }}
      </h1>
      <div class="h-1.5 w-24 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
    </div>

    <div class="prose prose-invert max-w-none text-void-600 dark:text-white/60 space-y-8">
      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">1. Acceptance of Terms</h2>
        <p>By accessing and using NewTube, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">2. Content Ownership</h2>
        <p>You retain all ownership rights to the content you upload. However, by sharing content, you grant NewTube a non-exclusive license to host, display, and distribute that content.</p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">3. Prohibited Content</h2>
        <p>NewTube strictly prohibits content that is illegal, harmful, threatening, abusive, harassing, defamatory, or violates the intellectual property rights of others.</p>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-void-900 dark:text-white uppercase mb-4">4. Account Security</h2>
        <p>You are responsible for maintaining the confidentiality of your account and password. NewTube cannot and will not be liable for any loss or damage arising from your failure to comply with this.</p>
      </section>
    </div>
  </div>
</template>
