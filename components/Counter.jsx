"use client";

import { useEffect, useRef, useState } from "react";

export default function Counter({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value.includes("/") ? value : "0");

  useEffect(() => {
    if (value.includes("/")) return;
    const target = Number(value.replace(/\D/g, ""));
    const suffix = value.replace(/[0-9]/g, "");
    const node = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / 1300, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(`${Math.round(target * eased).toLocaleString()}${suffix}`);
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    });
    if (node) observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}
