<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="max-w-4xl mx-auto py-20 px-4">
    <div class="mb-16">
      <h1
        class="text-6xl font-900 text-void-900 dark:text-white uppercase tracking-tighter italic mb-4"
      >
        {{ t("footer.about") }}
      </h1>
      <div
        class="h-1.5 w-24 bg-primary-500 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"
      ></div>
    </div>

    <div
      class="prose prose-invert max-w-none text-void-600 dark:text-white/60 space-y-8 text-lg"
    >
      <p class="leading-relaxed">
        NewTube is a next-generation video platform designed for creators and
        viewers who demand a premium experience. Born from the desire to combine
        high-performance engineering with avant-garde design, we provide a space
        where content truly shines.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
        <div
          class="bg-black/5 dark:bg-white/5 p-8 rounded-2xl border border-black/5 dark:border-white/5"
        >
          <Icon
            name="ph:lightning-duotone"
            class="text-4xl text-primary-500 mb-4"
          />
          <h3
            class="text-xl font-bold text-void-900 dark:text-white mb-2 uppercase"
          >
            Performance First
          </h3>
          <p class="text-sm">
            Experience zero-latency browsing and lightning-fast video delivery
            powered by our proprietary edge network.
          </p>
        </div>
        <div
          class="bg-black/5 dark:bg-white/5 p-8 rounded-2xl border border-black/5 dark:border-white/5"
        >
          <Icon
            name="ph:palette-duotone"
            class="text-4xl text-primary-500 mb-4"
          />
          <h3
            class="text-xl font-bold text-void-900 dark:text-white mb-2 uppercase"
          >
            Avant-Garde Design
          </h3>
          <p class="text-sm">
            A minimal, immersive interface that puts the focus on what matters
            most: the content and the community.
          </p>
        </div>
      </div>

      <p class="leading-relaxed">
        Our mission is to democratize high-quality video distribution while
        maintaining a curated, premium feel. We believe that the platform should
        be as beautiful as the stories shared upon it.
      </p>
    </div>
  </div>
</template>
