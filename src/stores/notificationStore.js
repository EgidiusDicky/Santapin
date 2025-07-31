// src/stores/notificationStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
  const showPopup = ref(false);
  const popupMessage = ref('');
  const popupType = ref('success'); // 'success', 'error', 'info'
  let timeoutId = null;

  function triggerPopup(message, type = 'success', duration = 2000) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    popupMessage.value = message;
    popupType.value = type;
    showPopup.value = true;

    timeoutId = setTimeout(() => {
      showPopup.value = false;
      timeoutId = null;
    }, duration);
  }

  // Fungsi untuk menutup popup secara manual (opsional)
  function hidePopup() {
    showPopup.value = false;
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  return {
    showPopup,
    popupMessage,
    popupType,
    triggerPopup,
    hidePopup
  };
});