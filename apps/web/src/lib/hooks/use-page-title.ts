"use client";

import { useEffect } from "react";

const baseTitle = "AEGIS - Reconnaissance Intelligence Suite";

export function usePageTitle(title?: string) {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${baseTitle}`;
    } else {
      document.title = baseTitle;
    }
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
}
