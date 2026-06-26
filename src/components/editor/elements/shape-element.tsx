"use client";

import type { ShapeElement } from "@/types";

interface ShapeElementViewProps {
  element: ShapeElement;
}

export function ShapeElementView({ element }: ShapeElementViewProps) {
  const { shapeType, fillColor, strokeColor, strokeWidth, width, height } =
    element;

  const renderShape = () => {
    switch (shapeType) {
      case "rectangle":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="pointer-events-none"
          >
            <rect
              x={strokeWidth / 2}
              y={strokeWidth / 2}
              width={width - strokeWidth}
              height={height - strokeWidth}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "circle":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="pointer-events-none"
          >
            <ellipse
              cx={width / 2}
              cy={height / 2}
              rx={(width - strokeWidth) / 2}
              ry={(height - strokeWidth) / 2}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "triangle":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="pointer-events-none"
          >
            <polygon
              points={`${width / 2},${strokeWidth} ${width - strokeWidth},${height - strokeWidth} ${strokeWidth},${height - strokeWidth}`}
              fill={fillColor}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
            />
          </svg>
        );

      case "arrow":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="pointer-events-none"
          >
            <defs>
              <marker
                id={`arrowhead-${element.id}`}
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={strokeColor || fillColor}
                />
              </marker>
            </defs>
            <line
              x1={strokeWidth}
              y1={height / 2}
              x2={width - strokeWidth - 10}
              y2={height / 2}
              stroke={strokeColor || fillColor}
              strokeWidth={strokeWidth || 2}
              markerEnd={`url(#arrowhead-${element.id})`}
            />
          </svg>
        );

      case "line":
        return (
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="pointer-events-none"
          >
            <line
              x1={strokeWidth}
              y1={height / 2}
              x2={width - strokeWidth}
              y2={height / 2}
              stroke={strokeColor || fillColor}
              strokeWidth={strokeWidth || 2}
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return <div className="w-full h-full">{renderShape()}</div>;
}
