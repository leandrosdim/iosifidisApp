import { useState } from "react";

export function useMessageHandler() {
  // 🧠 Prevent use during SSR
  if (typeof window === "undefined") {
    return {
      success: false,
      error: false,
      message: "",
      messageType: "success",
      showMessage: false,
      showSuccess: () => {},
      showError: () => {},
      closeMessage: () => {},
    };
  }

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showMessage, setShowMessage] = useState(false);

  const showSuccess = (msg) => {
    setSuccess(true);
    setError(false);
    setMessage(msg);
    setMessageType("success");
    setShowMessage(true);
  };

  const showError = (msg) => {
    setSuccess(false);
    setError(true);
    setMessage(msg);
    setMessageType("error");
    setShowMessage(true);
  };

  const closeMessage = () => {
    setSuccess(false);
    setError(false);
    setShowMessage(false);
  };

  return {
    success,
    error,
    message,
    messageType,
    showMessage,
    showSuccess,
    showError,
    closeMessage,
  };
}
