import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
  selectedTemplate: 'modern',
  currentStep: 0,
  notification: {
    open: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
  confirmDialog: {
    open: false,
    title: '',
    content: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setSelectedTemplate: (state, action) => {
      state.selectedTemplate = action.payload;
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      state.currentStep += 1;
    },
    prevStep: (state) => {
      state.currentStep = Math.max(0, state.currentStep - 1);
    },
    showNotification: (state, action) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        type: action.payload.type || 'info',
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    showConfirmDialog: (state, action) => {
      state.confirmDialog = {
        open: true,
        title: action.payload.title || 'Confirm',
        content: action.payload.content || 'Are you sure?',
        confirmText: action.payload.confirmText || 'Confirm',
        cancelText: action.payload.cancelText || 'Cancel',
        onConfirm: action.payload.onConfirm || null,
      };
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog.open = false;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSelectedTemplate,
  setCurrentStep,
  nextStep,
  prevStep,
  showNotification,
  hideNotification,
  showConfirmDialog,
  hideConfirmDialog,
} = uiSlice.actions;

export default uiSlice.reducer;