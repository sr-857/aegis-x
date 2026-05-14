"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { useLocation } from "react-router-dom";

export function LoadingBar() {
  const pathname = useLocation().pathname;
  const [loading, setLoading] = useState(false);
  const scaleX = useSpring(0, { stiffness: 100, damping: 20 });
  const opacity = useTransform(scaleX, [0, 0.1, 1], [0, 1, 1]);

  useEffect(() => {
    setLoading(true);
    scaleX.set(0.3);
    const timer = setTimeout(() => {
      scaleX.set(1);
      setTimeout(() => {
        setLoading(false);
        scaleX.set(0);
      }, 200);
    }, 300);
    return () => clearTimeout(timer);
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
