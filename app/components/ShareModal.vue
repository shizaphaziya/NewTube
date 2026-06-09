<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useToast } from "~/components/ui/toast/use-toast";
import { useClipboard } from "@vueuse/core";

const props = defineProps({
  videoId: {
    type: String,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:isOpen"]);

const { t } = useI18n();
const { toast } = useToast();

const open = computed({
  get: () => props.isOpen,
  set: (val) => emit("update:isOpen", val),
});

// Since we are running in the browser, we construct the URLs based on location.
const siteUrl = computed(() => {
  if (import.meta.client) {
    return window.location.origin;
  }
  return "";
});

const watchLink = computed(() => `${siteUrl.value}/watch/${props.videoId}`);
const embedCode = computed(
  () =>
    `<iframe src="${siteUrl.value}/embed/${props.videoId}" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
);

const { copy: copyToClipboard } = useClipboard();

const copyLink = async () => {
  await copyToClipboard(watchLink.value);
  toast({
    title: t("watch.link_copied"),
  });
};

const copyEmbed = async () => {
  await copyToClipboard(embedCode.value);
  toast({
    title: t("watch.embed_copied"),
  });
};
</script>

<template>
  <Dialog :open="open" @update:open="open = $event">
    <DialogContent class="sm:max-w-md bg-background/90 backdrop-blur-2xl border-border/10 rounded-[2rem] shadow-2xl p-8">
      <DialogHeader>
        <DialogTitle class="text-2xl font-900 uppercase tracking-tight italic">{{ t("watch.share_video") }}</DialogTitle>
      </DialogHeader>

      <div class="space-y-8 mt-6">
        <!-- Direct Link -->
        <div class="space-y-3">
          <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {{ t("watch.copy_link") }}
          </label>
          <div class="flex items-center gap-3 relative">
            <Input
              :value="watchLink"
              readonly
              class="pr-24 h-14 bg-muted/30 border-border/10 rounded-2xl text-sm"
            />
            <Button
              @click="copyLink"
              variant="secondary"
              class="absolute right-2 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              {{ t("watch.copy") }}
            </Button>
          </div>
        </div>

        <!-- Embed Code -->
        <div class="space-y-3">
          <label class="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            {{ t("watch.embed_code") }}
          </label>
          <div class="flex items-start gap-3 relative">
            <Textarea
              :value="embedCode"
              readonly
              class="pr-24 min-h-[100px] bg-muted/30 border-border/10 rounded-2xl text-xs font-mono resize-none leading-relaxed"
            />
            <Button
              @click="copyEmbed"
              variant="secondary"
              class="absolute right-2 top-2 h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
            >
              {{ t("watch.copy") }}
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
