/*
 * Error handling composable for consistent error management across components
 */

import { ref, computed } from 'vue';

/**
 * @param {string} context - Context description for error logging
 */
export function useErrorHandling(context = 'Operation') {
  const error = ref(null);
  const isError = computed(() => Boolean(error.value));

  /**
   * Set an error with a message
   * @param {Error|string} err - Error object or message
   * @param {string} fallbackMessage - Fallback user message
   */
  function setError(err, fallbackMessage = 'Something went wrong') {
    console.error(`${context} Error:`, err);

    // Extract meaingful error message
    let userMessage = fallbackMessage;

    if (typeof err === 'string') {
      userMessage = err;
    } else if (err?.response?.data?.message) {
      userMessage = err.response.data.message;
    } else if (err?.message) {
      userMessage = err.message;
    }

    error.value = {
      message: userMessage,
      technical: err?.stack || err?.toString() || 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }

  function clearError() {
    error.value = null;
  }

  return {
    error: computed(() => error.value),
    isError,
    setError,
    clearError,
  };
}

/**
 * Get user-friendly error message for common API errors
 * @param {Error} error - Error object
 * @param {string} operation - Operation context
 */
export function getErrorMessage(error, operation = 'operation') {
  if (!error) return 'Unknown error occurred';

  // Network errors
  if (error.code === 'NETWORK_ERROR' || !navigator.onLine) {
    return 'Please check your internet connection and try again';
  }

  // HTTP status errors
  const status = error.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input and try again';
      case 401:
        return 'Authentication failed. Please log in again';
      case 403:
        return 'You do not have permission to perform this action';
      case 404:
        return 'The requested resource was not found';
      case 429:
        return 'Too many requests. Please wait a moment and try again';
      case 500:
        return 'Server error. Please try again later';
      case 503:
        return 'Service temporarily unavailable. Please try again later';
      default:
        return `Failed to complete ${operation}. Please try again`;
    }
  }

  // Timeout errors
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Request timed out. Please try again';
  }

  // Default fallback
  return `Failed to complete ${operation}. Please try again`;
}
