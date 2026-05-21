import { ref } from 'vue'

/**
 * Shared client-side state for the cite session lifecycle.
 *
 * Owned by the launcher; set to false by `closePopup()` to make the launcher
 * fall back to its idle state across every popup-dismiss path (copy success,
 * Esc, outside click).
 */
export const isCiteModeActive = ref(false)
