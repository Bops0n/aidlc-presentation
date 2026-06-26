import { invokeBedrockWithTool } from "./bedrock";
import type { Slide, TextElement, ChartElement, Element } from "@/types";

const SYSTEM_PROMPT = `You are a professional presentation layout architect. 
Given a topic, create a structured presentation with 5-8 slides.

Rules:
1. Arrange slides sequentially: Introduction → Key Points → Details → Conclusion
2. Each slide must have a "layout" type: "title", "two-column", "image-focus", or "content"
3. If the topic involves metrics, analytics, finances, or comparisons, include chart elements with chartData
4. Keep text concise — bullet points preferred
5. Suggest appropriate animations for key elements
6. Include speaker notes for each slide`;

const PRESENTATION_TOOL = {
  name: "create_presentation",
  description: "Create a structured presentation with slides and elements",
  input_schema: {
    type: "object" as const,
    properties: {
      title: { type: "string", description: "Presentation title" },
      theme: {
        type: "object",
        properties: {
          backgroundColor: { type: "string", description: "Hex color" },
          textColor: { type: "string", description: "Hex color" },
          accentColor: { type: "string", description: "Hex color" },
          headingFont: { type: "string" },
          bodyFont: { type: "string" },
        },
        required: [
          "backgroundColor",
          "textColor",
          "accentColor",
          "headingFont",
          "bodyFont",
        ],
      },
      slides: {
        type: "array",
        items: {
          type: "object",
          properties: {
            slideTitle: { type: "string" },
            layout: {
              type: "string",
              enum: ["title", "two-column", "image-focus", "content"],
            },
            elements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: {
                    type: "string",
                    enum: ["title", "body", "bullet", "chart"],
                  },
                  content: { type: "string" },
                  suggestedAnimation: {
                    type: "string",
                    enum: ["none", "fade", "fly", "zoom"],
                  },
                  chartType: {
                    type: "string",
                    enum: ["bar", "line", "area", "pie", "donut", "radar"],
                  },
                  chartTitle: { type: "string" },
                  chartData: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        value: { type: "number" },
                      },
                    },
                  },
                },
                required: ["type", "content"],
              },
            },
            notes: { type: "string" },
          },
          required: ["slideTitle", "layout", "elements"],
        },
      },
    },
    required: ["title", "theme", "slides"],
  },
};

// Layout mapping: convert AI layout type to pixel positions on 960×540
function mapLayout(
  layout: string,
  elements: any[],
  theme: any
): Element[] {
  const mapped: Element[] = [];
  let yOffset = 40;

  for (const el of elements) {
    if (el.type === "title") {
      const textEl: TextElement = {
        id: crypto.randomUUID(),
        type: "text",
        x: 80,
        y: layout === "title" ? 200 : yOffset,
        width: 800,
        height: layout === "title" ? 80 : 60,
        rotation: 0,
        opacity: 100,
        animation: (el.suggestedAnimation as TextElement["animation"]) || "none",
        animationDelay: 0,
        content: el.content || "Title",
        fontSize: layout === "title" ? 48 : 36,
        fontFamily: theme.headingFont || "Inter",
        fontWeight: "700",
        lineHeight: 1.2,
        color: theme.textColor || "#1f2937",
        textAlign: layout === "title" ? "center" : "left",
      };
      mapped.push(textEl);
      yOffset += layout === "title" ? 100 : 70;
    } else if (el.type === "body" || el.type === "bullet") {
      let x = 80;
      let w = 800;
      if (layout === "two-column") {
        const bodyElements = elements.filter(
          (e) => e.type === "body" || e.type === "bullet"
        );
        const bodyIndex = bodyElements.indexOf(el);
        x = bodyIndex % 2 === 0 ? 80 : 500;
        w = 380;
      } else if (layout === "image-focus") {
        x = 520;
        w = 360;
      }

      const textEl: TextElement = {
        id: crypto.randomUUID(),
        type: "text",
        x,
        y: yOffset,
        width: w,
        height: 200,
        rotation: 0,
        opacity: 100,
        animation: (el.suggestedAnimation as TextElement["animation"]) || "none",
        animationDelay: mapped.length * 0.1,
        content: el.content || "",
        fontSize: 20,
        fontFamily: theme.bodyFont || "Inter",
        fontWeight: "400",
        lineHeight: 1.5,
        color: theme.textColor || "#374151",
        textAlign: "left",
      };
      mapped.push(textEl);

      if (layout === "two-column") {
        const bodyElements = elements.filter(
          (e) => e.type === "body" || e.type === "bullet"
        );
        const bodyIndex = bodyElements.indexOf(el);
        if (bodyIndex % 2 === 1) {
          yOffset += 220;
        }
      } else {
        yOffset += 220;
      }
    } else if (el.type === "chart" && el.chartData) {
      const chartEl: ChartElement = {
        id: crypto.randomUUID(),
        type: "chart",
        x: layout === "image-focus" ? 80 : 80,
        y: yOffset,
        width: layout === "image-focus" ? 400 : 800,
        height: layout === "image-focus" ? 340 : 300,
        rotation: 0,
        opacity: 100,
        animation: (el.suggestedAnimation as ChartElement["animation"]) || "fade",
        animationDelay: 0.2,
        chartType: el.chartType || "bar",
        chartTitle: el.chartTitle || el.content || "Chart",
        chartData: el.chartData || [],
        chartColors: [
          theme.accentColor || "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      };
      mapped.push(chartEl);
      yOffset += 320;
    }
  }

  return mapped;
}

export async function generateSlides(prompt: string): Promise<{
  title: string;
  slides: Slide[];
}> {
  const result = await invokeBedrockWithTool(
    SYSTEM_PROMPT,
    prompt,
    PRESENTATION_TOOL
  );

  // Map AI output to Slide[] with pixel positions
  const slides: Slide[] = (result.slides || []).map((s: any) => ({
    id: crypto.randomUUID(),
    backgroundType: "color" as const,
    backgroundValue: result.theme?.backgroundColor || "#ffffff",
    elements: mapLayout(s.layout, s.elements || [], result.theme || {}),
    transitionMode: "fade" as const,
    notes: s.notes || "",
  }));

  return {
    title: result.title || "Generated Presentation",
    slides,
  };
}
