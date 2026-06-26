# Presenter Unit — Design

## Summary
- **Architecture**: Full-screen client route + Framer Motion transitions + CSS element animations
- **Components**: 5 (Presenter View, Slide Stage, Laser Pointer, Notes/Timer Dock, Animation Audit)
- **Libraries**: framer-motion (transitions), CSS keyframes (element animations)
- **Stories**: US-15, US-16, US-17, US-24, US-27, US-28

## Components

### 1. Presenter View (route)
- **Route**: `/present/[id]`
- **Purpose**: Full-screen slideshow
- **Responsibilities**: Load presentation, full-screen API, keyboard nav (←/→/Space/Esc), slide index state

### 2. Slide Stage
- **Purpose**: Render active slide full-screen with scale-to-fit + transition
- **Technology**: Framer Motion AnimatePresence for slide transitions (fade/slide/zoom per transitionMode)
- **Responsibilities**: Scale 960×540 to fill screen, apply transition between slides, render elements with entrance animations

### 3. Laser Pointer (US-16)
- **Purpose**: Virtual laser pointer with trail
- **Technology**: Track mouse, render red dot + fading trail circles
- **Responsibilities**: Toggle on/off (key "L"), follow cursor, dynamic trail

### 4. Notes & Timer Dock (US-17)
- **Purpose**: Overlay showing speaker notes + elapsed timer
- **Responsibilities**: Toggle (key "N"), show current slide notes, elapsed time since start

### 5. Animation Audit (US-28)
- **Purpose**: Warn about animation issues in editor
- **Technology**: lib function + editor warning badge
- **Responsibilities**: Detect density >6 animated elements, opacity=0 + animation, overlapping same-animation no-stagger

## Element Entrance Animations (CSS)
| animation | CSS keyframe |
|-----------|-------------|
| fade | opacity 0→1 |
| fly | translateY(40px)→0 + fade |
| slide | translateX(-40px)→0 |
| zoom | scale(0.8)→1 + fade |
| bounce | bounce keyframe |
| spin | rotate + fade |

Applied with `animation-delay: ${animationDelay}s`

## Keyboard Controls
| Key | Action |
|-----|--------|
| → / Space | Next slide |
| ← | Previous slide |
| Esc | Exit presenter |
| L | Toggle laser pointer |
| N | Toggle notes/timer |

## Traceability
| Requirement | Component(s) | Status |
|-------------|-------------|--------|
| US-15 (Full-screen) | Presenter View, Slide Stage | ✅ |
| US-16 (Laser pointer) | Laser Pointer | ✅ |
| US-17 (Notes & timer) | Notes & Timer Dock | ✅ |
| US-24 (Transitions) | Slide Stage (Framer Motion) | ✅ |
| US-27 (Element animations) | Slide Stage (CSS) | ✅ |
| US-28 (Animation audit) | Animation Audit | ✅ |
