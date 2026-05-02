import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isAuthModalOpen: false,
    isSidebarOpen: false,
    activePipVideo: null as {
      id: string;
      title: string;
      url: string;
      user_id: string;
    } | null,
    guestHistory: [] as string[],
  }),
  actions: {
    openAuthModal() {
      this.isAuthModalOpen = true;
    },
    closeAuthModal() {
      this.isAuthModalOpen = false;
    },
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    setPipVideo(video: any) {
      this.activePipVideo = video;
    },
    clearPipVideo() {
      this.activePipVideo = null;
    },
    addToHistory(videoId: string) {
      if (!this.guestHistory.includes(videoId)) {
        this.guestHistory.unshift(videoId);
        if (this.guestHistory.length > 50) {
          this.guestHistory.pop();
        }
      }
    },
  },
  persist: {
    storage: persistedState.localStorage,
    pick: ["guestHistory"],
  },
});
