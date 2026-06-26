import type { Element, TextElement } from "@/types";
import type { LayoutPreset, LayoutPosition } from "@/data/layouts";

/**
 * Layout Engine: repositions existing elements on a slide
 * according to a layout preset's position definitions.
 *
 * Matching strategy:
 * 1. Text elements with large fontSize (>=36) → "title" positions
 * 2. Text elements with medium fontSize (24-35) → "subtitle" positions
 * 3. Remaining text elements → "body" positions
 * 4. Image elements → "image" positions
 * 5. Chart elements → "chart" positions
 * 6. Shape/other elements → "accent" positions
 *
 * Elements are repositioned in order; excess elements
 * stay in place if not enough layout positions.
 */
export function applyLayoutToElements(
  elements: Element[],
  layout: LayoutPreset
): Element[] {
  if (layout.positions.length === 0) {
    return elements; // Blank layout, don't move anything
  }

  // Categorize elements by their likely role
  const titleElements: Element[] = [];
  const subtitleElements: Element[] = [];
  const bodyElements: Element[] = [];
  const imageElements: Element[] = [];
  const chartElements: Element[] = [];
  const accentElements: Element[] = [];

  for (const el of elements) {
    if (el.type === "text") {
      const textEl = el as TextElement;
      if (textEl.fontSize >= 36) {
        titleElements.push(el);
      } else if (textEl.fontSize >= 24) {
        subtitleElements.push(el);
      } else {
        bodyElements.push(el);
      }
    } else if (el.type === "image") {
      imageElements.push(el);
    } else if (el.type === "chart") {
      chartElements.push(el);
    } else {
      accentElements.push(el);
    }
  }

  // Build a map of available positions by role
  const positionsByRole: Record<string, LayoutPosition[]> = {
    title: [],
    subtitle: [],
    body: [],
    image: [],
    chart: [],
    accent: [],
  };

  for (const pos of layout.positions) {
    positionsByRole[pos.role].push(pos);
  }

  // Assign elements to positions
  const assigned = new Set<string>();
  const result: Element[] = [...elements];

  function assignToPositions(
    elems: Element[],
    positions: LayoutPosition[]
  ) {
    const available = positions.filter(
      (_, i) => i < elems.length
    );
    for (let i = 0; i < available.length; i++) {
      const el = elems[i];
      const pos = available[i];
      const idx = result.findIndex((e) => e.id === el.id);
      if (idx !== -1) {
        result[idx] = {
          ...result[idx],
          x: pos.x,
          y: pos.y,
          width: pos.width,
          height: pos.height,
        } as Element;
        assigned.add(el.id);
      }
    }
  }

  // Assign in priority order
  assignToPositions(titleElements, positionsByRole.title);
  assignToPositions(subtitleElements, positionsByRole.subtitle);
  assignToPositions(bodyElements, positionsByRole.body);
  assignToPositions(imageElements, positionsByRole.image);
  assignToPositions(chartElements, positionsByRole.chart);
  assignToPositions(accentElements, positionsByRole.accent);

  // If there are unassigned text elements and remaining body positions,
  // assign subtitle elements to body positions
  const usedBodyCount = Math.min(
    bodyElements.length,
    positionsByRole.body.length
  );
  const remainingBodyPositions =
    positionsByRole.body.slice(usedBodyCount);
  const unassignedSubtitles = subtitleElements.filter(
    (el) => !assigned.has(el.id)
  );

  if (unassignedSubtitles.length > 0 && remainingBodyPositions.length > 0) {
    assignToPositions(unassignedSubtitles, remainingBodyPositions);
  }

  return result;
}
