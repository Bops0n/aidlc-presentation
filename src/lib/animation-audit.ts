import type { Slide } from "@/types";

export interface AnimationWarning {
  slideIndex: number;
  type: "density" | "invisible" | "pileup";
  message: string;
}

export function auditAnimations(slides: Slide[]): AnimationWarning[] {
  const warnings: AnimationWarning[] = [];
  slides.forEach((slide, slideIndex) => {
    const animated = slide.elements.filter((e) => e.animation && e.animation !== "none");
    // Density: > 6 animated elements
    if (animated.length > 6) {
      warnings.push({ slideIndex, type: "density", message: `Slide ${slideIndex + 1}: ${animated.length} animated elements may feel overwhelming (>6)` });
    }
    // Invisible: animation but opacity 0
    slide.elements.forEach((e) => {
      if (e.animation && e.animation !== "none" && e.opacity === 0) {
        warnings.push({ slideIndex, type: "invisible", message: `Slide ${slideIndex + 1}: an element has animation but opacity 0 (invisible)` });
      }
    });
    // Pileup: overlapping elements with same animation and same delay
    for (let i = 0; i < animated.length; i++) {
      for (let j = i + 1; j < animated.length; j++) {
        const a = animated[i], b = animated[j];
        const overlap = !(a.x + a.width < b.x || b.x + b.width < a.x || a.y + a.height < b.y || b.y + b.height < a.y);
        if (overlap && a.animation === b.animation && a.animationDelay === b.animationDelay) {
          warnings.push({ slideIndex, type: "pileup", message: `Slide ${slideIndex + 1}: overlapping elements share the same animation without staggered delay` });
        }
      }
    }
  });
  return warnings;
}
