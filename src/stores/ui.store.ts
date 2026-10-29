import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  const isSidebarOpen = ref(false)
  const activeModal = ref<string | null>(null)

  function openModal(name: string) {
    activeModal.value = name
  }

  function closeModal() {
    activeModal.value = null
  }

  return { isSidebarOpen, activeModal, openModal, closeModal }
})
