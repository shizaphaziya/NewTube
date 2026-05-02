<script setup lang="ts">
import { useConfirm } from "~/composables/useConfirm";

const { isOpen, message, handleConfirm } = useConfirm();
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-sm p-0 overflow-hidden border-none bg-transparent shadow-none">
      <div class="glass-card w-full p-8 shadow-2xl text-center relative overflow-hidden">
        <!-- Monochrome structural glow -->
        <div
          class="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-[60px] pointer-events-none"
        ></div>

        <Icon
          name="ph:warning-circle-bold"
          class="text-5xl text-muted-foreground mx-auto mb-6"
        />
        <p
          class="text-foreground text-[15px] font-medium leading-relaxed mb-8 px-2"
        >
          {{ message }}
        </p>
        <div class="flex gap-4">
          <Button
            variant="outline"
            @click="handleConfirm(false)"
            class="flex-1 rounded-xl"
          >
            {{ $t("common.cancel") || "Cancel" }}
          </Button>
          <Button
            variant="destructive"
            @click="handleConfirm(true)"
            class="flex-1 rounded-xl font-bold uppercase tracking-widest text-[11px]"
          >
            {{ $t("common.confirm") || "Confirm" }}
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
