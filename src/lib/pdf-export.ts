import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 540;

/**
 * Capture a DOM node (a slide rendered at exact 960×540) into a PNG data URL.
 */
async function captureNode(node: HTMLElement): Promise<string> {
  const canvas = await html2canvas(node, {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    scale: 2, // retina quality
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: false,
  });
  return canvas.toDataURL("image/png");
}

/**
 * Export slides (already rendered as offscreen DOM nodes) into a multi-page PDF.
 * Each node becomes one landscape page sized 960×540 — layout matches web preview.
 *
 * @param slideNodes - array of DOM elements, each rendering one slide at 960×540
 * @param title - presentation title (used for filename)
 */
export async function exportSlidesToPdf(
  slideNodes: HTMLElement[],
  title: string
): Promise<void> {
  if (slideNodes.length === 0) return;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [CANVAS_WIDTH, CANVAS_HEIGHT],
  });

  for (let i = 0; i < slideNodes.length; i++) {
    const imgData = await captureNode(slideNodes[i]);
    if (i > 0) pdf.addPage([CANVAS_WIDTH, CANVAS_HEIGHT], "landscape");
    pdf.addImage(imgData, "PNG", 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }

  const safeTitle = (title || "presentation").replace(/[^a-z0-9]+/gi, "_");
  pdf.save(`${safeTitle}.pdf`);
}
