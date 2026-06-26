"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LaserPointerProps {
  active: boolean;
}

interface Trail {
  x: number;
  y: number;
  id: number;
}

export function LaserPointer({ active }: LaserPointerProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trails, setTrails] = useState<Trail[]>([]);
  const trailId = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    trailId.current++;
    setTrails((prev) => [
      ...prev.slice(-8),
      { x: e.clientX, y: e.clientY, id: trailId.current },
    ]);
  }, []);

  useEffect(() => {
    if (!active) return;
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [active, handleMouseMove]);

  // Fade out old trails
  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setTrails((prev) => prev.slice(-6));
    }, 100);
    return () => clearInterval(interval);
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{ cursor: "none" }}
    >
      {/* Trail circles */}
      {trails.map((t, i) => (
        <div
          key={t.id}
          className="absolute rounded-full bg-red-500"
          style={{
            left: t.x - 4,
            top: t.y - 4,
            width: 8,
            height: 8,
            opacity: ((i + 1) / trails.length) * 0.4,
          }}
        />
      ))}
      {/* Main dot */}
      <div
        className="absolute rounded-full bg-red-600 shadow-lg shadow-red-500/50"
        style={{
          left: position.x - 6,
          top: position.y - 6,
          width: 12,
          height: 12,
        }}
      />
    </div>
  );
}
