"use client";

import { useCallback, useEffect, useState } from "react";

const unreadMessageEvent = "unread-messages-changed";

export function notifyUnreadMessageCountChanged() {
  window.dispatchEvent(new Event(unreadMessageEvent));
}

export function useUnreadMessageCount() {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await fetch("/api/chats/unread-count", { cache: "no-store" });
      if (!response.ok) return;
      const data = await response.json() as { unreadCount?: number };
      setUnreadCount(data.unreadCount ?? 0);
    } catch {
      // Keep the last known count when the request fails.
    }
  }, []);

  useEffect(() => {
    void refreshUnreadCount();
    const intervalId = window.setInterval(refreshUnreadCount, 10000);
    window.addEventListener(unreadMessageEvent, refreshUnreadCount);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener(unreadMessageEvent, refreshUnreadCount);
    };
  }, [refreshUnreadCount]);

  return unreadCount;
}
