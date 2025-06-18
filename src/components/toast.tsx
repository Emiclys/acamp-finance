import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

interface ToastContextType {
  showToast: (
    title: string,
    message: string,
    type?: "success" | "error" | "info",
    duration?: number
  ) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const colors = {
  success: "#27ae60",
  error: "#e74c3c",
  info: "#23272f",
};

interface ToastState {
  open: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number;
}

const initialState: ToastState = {
  open: false,
  title: "",
  message: "",
  type: "info",
  duration: 3000,
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastState>(initialState);
  const [visible, setVisible] = useState(false);
  const showToast = useCallback(
    (
      title: string,
      message: string,
      type: "success" | "error" | "info" = "info",
      duration = 3000
    ) => {
      setToast({ open: true, title, message, type, duration });
      setVisible(true);
    },
    []
  );
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 300); // tempo do fadeOut
  }, []);

  useEffect(() => {
    if (!toast.open) return;
    setVisible(true);
    const timer = setTimeout(handleClose, toast.duration);
    return () => clearTimeout(timer);
  }, [toast.open, toast.duration, handleClose]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.open && (
        <div
          style={{
            position: "fixed",
            left: 25,
            bottom: 25,
            minWidth: 280,
            maxWidth: 360,
            background: "#fff",
            color: colors[toast.type],
            borderLeft: `6px solid ${colors[toast.type]}`,
            borderRadius: 8,
            boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
            zIndex: 9999,
            padding: "20px 24px 20px 18px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            animation: `${visible ? "fadeIn" : "fadeOut"} 0.2s forwards`,
            pointerEvents: visible ? "auto" : "none",
            opacity: visible ? 1 : 0,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              fontSize: 17,
              marginBottom: 4,
              wordBreak: "break-word",
            }}
          >
            {toast.title}
          </div>
          <div
            style={{
              fontSize: 15,
              color: "#23272f",
              wordBreak: "break-word",
            }}
          >
            {toast.message}
          </div>
          <button
            onClick={handleClose}
            style={{
              alignSelf: "flex-end",
              background: "none",
              border: "none",
              color: colors[toast.type],
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              marginTop: 8,
            }}
            aria-label="Fechar notificação"
          >
            Fechar
          </button>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
              from { opacity: 1; transform: translateY(0); }
              to { opacity: 0; transform: translateY(20px); }
            }
          `}</style>
        </div>
      )}
    </ToastContext.Provider>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro do ToastProvider");
  return ctx.showToast;
}

// Uso: Envolva sua aplicação com <ToastProvider> e chame useToast() para exibir toasts.
// Exemplo:
// const showToast = useToast();
// showToast("Título", "Mensagem", "success");

export default function Toast() {
  return null;
}
