"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { X, CheckCircle2, AlertTriangle, Info, XCircle } from "lucide-react";

type NotificationType = "success" | "error" | "info" | "warning";

interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  dismissible?: boolean;
}

interface NotificationContextType {
  addNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  addNotification: () => {},
});

export const useNotification = () => useContext(NotificationContext);

const iconMap = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap = {
  success: {
    bg: "bg-[#F2F8F0]",
    border: "border-[#1D8102]",
    icon: "text-[#1D8102]",
    text: "text-[#1D8102]",
  },
  error: {
    bg: "bg-[#FDECE9]",
    border: "border-[#D13212]",
    icon: "text-[#D13212]",
    text: "text-[#D13212]",
  },
  warning: {
    bg: "bg-[#FEF8E7]",
    border: "border-[#F89256]",
    icon: "text-[#F89256]",
    text: "text-[#8A6500]",
  },
  info: {
    bg: "bg-[#F1FAFF]",
    border: "border-[#0972d3]",
    icon: "text-[#0972d3]",
    text: "text-[#0972d3]",
  },
};

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((type: NotificationType, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    setNotifications((prev) => [...prev, { id, type, message, dismissible: true }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (notifications.length === 0) return;
    const timer = setTimeout(() => {
      setNotifications((prev) => prev.slice(1));
    }, 5000);
    return () => clearTimeout(timer);
  }, [notifications]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {/* Notification Container */}
      <div className="fixed top-[48px] right-4 z-[200] flex flex-col gap-2 max-w-lg w-full pointer-events-none">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type];
          const styles = styleMap[notification.type];
          return (
            <div
              key={notification.id}
              className={`${styles.bg} border-l-4 ${styles.border} px-4 py-3 rounded-sm shadow-lg flex items-start gap-3 pointer-events-auto animate-slide-in`}
            >
              <Icon size={18} className={`${styles.icon} flex-shrink-0 mt-0.5`} />
              <p className={`${styles.text} text-sm flex-1`}>{notification.message}</p>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-[#414d5c] hover:text-[#0f141a] flex-shrink-0"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}
