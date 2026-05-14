"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/lib/stores/notification-store";
import { useToast } from "@/components/toast";
import { generateId } from "@/lib/utils";

const notificationTemplates = [
  { type: "alert" as const, title: "Critical CVE Detected", message: "CVE-2024-21626 signature matched on a scanned host", source: "scanner" },
  { type: "warning" as const, title: "TLS Certificate Expiring", message: "Certificate for internal host expires soon", source: "monitor" },
  { type: "success" as const, title: "Scan Completed", message: "Port scan finished — new hosts discovered", source: "scanner" },
  { type: "info" as const, title: "New Asset Discovered", message: "Host added to asset inventory", source: "discovery" },
  { type: "warning" as const, title: "Rate Limit Approaching", message: "Scanner approaching API rate limit", source: "system" },
  { type: "info" as const, title: "Worker Telemetry Update", message: "Worker resource usage updated", source: "monitor" },
];

export function useNotificationSimulator() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const { addToast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      const notification = {
        id: generateId(),
        type: template.type,
        title: template.title,
        message: `${template.message} — ${new Date().toLocaleTimeString()}`,
        timestamp: new Date().toISOString(),
        read: false,
        source: template.source,
      };
      addNotification(notification);

      if (notification.type === "alert" || notification.type === "warning") {
        addToast({
          type: notification.type === "alert" ? "error" : "warning",
          title: notification.title,
          message: notification.message,
        });
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [addNotification, addToast]);
}
