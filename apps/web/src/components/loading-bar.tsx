"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";

export function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const scaleX = useSpring(0, { stiffness: 100, damping: 20 });
  const opacity = useTransform(scaleX, [0, 0.1, 1], [0, 1, 1]);

  useEffect(() => {
    setLoading(true);
    scaleX.set(0.3);

    const outer = setTimeout(() => {
      scaleX.set(1);
    }, 300);

    const inner = setTimeout(() => {
      setLoading(false);
      scaleX.set(0);
    }, 500);

    return () => {
      clearTimeout(outer);
      clearTimeout(inner);
    };
  }, [pathname, scaleX]);

  if (!loading) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5"
      style={{ opacity }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40"
        style={{ scaleX, transformOrigin: "0%" }}
      />
    </motion.div>
  );
}