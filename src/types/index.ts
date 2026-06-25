// Element types
export type ElementType = "text" | "image" | "shape" | "chart" | "icon" | "video";

export type AnimationType = "none" | "fade" | "fly" | "slide" | "zoom" | "bounce" | "spin";

export type ChartType = "bar" | "line" | "area" | "pie" | "donut" | "radar";

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  animation: AnimationType;
  animationDelay: number;
}

export interface TextElement extends BaseElement {
  type: "text";
  content: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  lineHeight: number;
  color: string;
  textAlign: "left" | "center" | "right";
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  referrerPolicy?: "no-referrer";
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shapeType: "rectangle" | "circle" | "triangle" | "arrow" | "line";
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
}

export interface ChartElement extends BaseElement {
  type: "chart";
  chartType: ChartType;
  chartTitle: string;
  chartData: ChartDataPoint[];
  chartColors: string[];
}

export interface IconElement extends BaseElement {
  type: "icon";
  iconName: string;
  color: string;
}

export interface VideoElement extends BaseElement {
  type: "video";
  src: string;
  autoplay: boolean;
  muted: boolean;
}

export type Element = TextElement | ImageElement | ShapeElement | ChartElement | IconElement | VideoElement;

// Slide types
export type BackgroundType = "color" | "gradient" | "image";
export type TransitionMode = "none" | "fade" | "slide" | "zoom";

export interface Slide {
  id: string;
  backgroundType: BackgroundType;
  backgroundValue: string;
  elements: Element[];
  transitionMode: TransitionMode;
  notes: string;
}

// Presentation types
export interface Presentation {
  id: string;
  title: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}

// Theme types
export interface Theme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}
