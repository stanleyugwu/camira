import _Toast, { ToastShowParams } from "react-native-toast-message";

/**
 * Convenience wrapper for Toast methods
 */
const Toast = {
  show: (
    type: "success" | "error" | "info",
    text1: string,
    text2?: string,
    config?: Exclude<ToastShowParams, "text1" | "text2">
  ) => {
    return _Toast.show({
      text1,
      text2,
      type,
      ...config,
    });
  },

  hide: _Toast.hide,
};

export default Toast;
