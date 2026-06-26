"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Slide, TransitionMode } from "@/types";
import { ElementRenderer } from "@/components/editor/element-renderer";
import { getAnimationStyle } from "@/lib/animations";

interface SlideStageProps {
  slide: Slide;
  slideIndex: number;
  direction: number; // 1 = forward, -1 = backward
}

const transitionVariants = {
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    animate: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  },
  zoom: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.2, opacity: 0 },
  },
};

function getSlideBackground(slide: Slide): React.CSSProperties {
  if (slide.backgroundType === "color")
    return { backgroundColor: slide.backgroundValue || "#ffffff" };
  if (slide.backgroundType === "gradient")
    return { background: slide.backgroundValue };
  if (slide.backgroundType === "image")
    return {
      backgroundImage: `url(${slide.backgroundValue})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  return { backgroundColor: "#ffffff" };
}

export function SlideStage({ slide, slideIndex, direction }: SlideStageProps) {
  const transition = slide.transitionMode || "none";
  const variants = transitionVariants[transition] || transitionVariants.none;

  return (
    <AnimatePresence mode="wait" custom={direction}>
      <motion.div
        key={slide.id}
        custom={direction}
        initial={transition === "none" ? false : "initial"}
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div
          className="relative w-full h-full"
          style={getSlideBackground(slide)}
        >
          {slide.elements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                transform: `rotate(${element.rotation}deg)`,
                ...getAnimationStyle(element.animation, element.animationDelay),
              }}
            >
              <ElementRenderer element={element} />
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
