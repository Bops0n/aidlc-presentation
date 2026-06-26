import type { AnimationType } from "@/types";

export function getAnimationStyle(
  animation: AnimationType,
  delay: number = 0
): React.CSSProperties {
  if (animation === "none") return {};

  const animationMap: Record<string, string> = {
    fade: "anim-fade 0.5s ease forwards",
    fly: "anim-fly 0.6s ease forwards",
    slide: "anim-slide 0.5s ease forwards",
    zoom: "anim-zoom 0.5s ease forwards",
    bounce: "anim-bounce 0.8s ease forwards",
    spin: "anim-spin 0.6s ease forwards",
  };

  return {
    opacity: 0,
    animation: animationMap[animation] || "",
    animationDelay: `${delay}s`,
    animationFillMode: "forwards",
  };
}
