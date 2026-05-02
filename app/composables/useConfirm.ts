import { ref } from "vue";

const isOpen = ref(false);
const message = ref("");
const resolvePromise = ref<((value: boolean) => void) | null>(null);

export const useConfirm = () => {
  const confirm = (msg: string): Promise<boolean> => {
    message.value = msg;
    isOpen.value = true;
    return new Promise((resolve) => {
      resolvePromise.value = resolve;
    });
  };

  const handleConfirm = (value: boolean) => {
    isOpen.value = false;
    if (resolvePromise.value) {
      resolvePromise.value(value);
      resolvePromise.value = null;
    }
  };

  return {
    isOpen,
    message,
    confirm,
    handleConfirm,
  };
};
