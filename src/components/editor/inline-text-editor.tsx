"use client";

import { useCallback, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Color from "@tiptap/extension-color";
import type { TextElement } from "@/types";
import { useEditorStore } from "@/store/editor-store";

interface InlineTextEditorProps {
  element: TextElement;
  onClose: () => void;
}

const FONT_FAMILIES = [
  "Inter",
  "Arial",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Verdana",
  "Roboto",
  "Open Sans",
];

export function InlineTextEditor({ element, onClose }: InlineTextEditorProps) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const containerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: element.content,
    editorProps: {
      attributes: {
        style: `
          font-size: ${element.fontSize}px;
          font-family: ${element.fontFamily};
          font-weight: ${element.fontWeight};
          color: ${element.color};
          text-align: ${element.textAlign};
          line-height: ${element.lineHeight};
          outline: none;
          white-space: pre-wrap;
          word-break: break-word;
          width: 100%;
          height: 100%;
        `,
      },
    },
  });

  // Save content on blur / close
  const saveContent = useCallback(() => {
    if (!editor) return;
    const text = editor.getText();
    updateElement(element.id, { content: text });
    onClose();
  }, [editor, element.id, updateElement, onClose]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        saveContent();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [saveContent]);

  // Focus editor when mounted
  useEffect(() => {
    if (editor) {
      editor.commands.focus("end");
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Floating toolbar */}
      <div
        className="absolute -top-10 left-0 flex items-center gap-1 bg-white rounded shadow-lg border border-gray-200 px-2 py-1 z-50"
        style={{ whiteSpace: "nowrap" }}
      >
        {/* Font family select */}
        <select
          className="text-xs border border-gray-300 rounded px-1 py-0.5"
          value={element.fontFamily}
          onChange={(e) => {
            editor.chain().focus().setFontFamily(e.target.value).run();
            updateElement(element.id, { fontFamily: e.target.value });
          }}
        >
          {FONT_FAMILIES.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>

        {/* Font size input */}
        <input
          type="number"
          className="w-12 text-xs border border-gray-300 rounded px-1 py-0.5"
          value={element.fontSize}
          min={8}
          max={200}
          onChange={(e) => {
            const size = parseInt(e.target.value, 10);
            if (size >= 8 && size <= 200) {
              updateElement(element.id, { fontSize: size });
            }
          }}
        />

        {/* Bold */}
        <button
          className={`px-1.5 py-0.5 text-xs rounded ${
            editor.isActive("bold") ? "bg-blue-100 text-blue-700" : "text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          <strong>B</strong>
        </button>

        {/* Italic */}
        <button
          className={`px-1.5 py-0.5 text-xs rounded ${
            editor.isActive("italic") ? "bg-blue-100 text-blue-700" : "text-gray-700"
          }`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          <em>I</em>
        </button>

        {/* Color picker */}
        <input
          type="color"
          className="w-5 h-5 p-0 border-0 cursor-pointer"
          value={element.color}
          onChange={(e) => {
            editor.chain().focus().setColor(e.target.value).run();
            updateElement(element.id, { color: e.target.value });
          }}
          title="Text color"
        />

        {/* Alignment buttons */}
        <button
          className={`px-1.5 py-0.5 text-xs rounded ${
            element.textAlign === "left" ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            editor.chain().focus().setTextAlign("left").run();
            updateElement(element.id, { textAlign: "left" });
          }}
          title="Align left"
        >
          ←
        </button>
        <button
          className={`px-1.5 py-0.5 text-xs rounded ${
            element.textAlign === "center" ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            editor.chain().focus().setTextAlign("center").run();
            updateElement(element.id, { textAlign: "center" });
          }}
          title="Align center"
        >
          ↔
        </button>
        <button
          className={`px-1.5 py-0.5 text-xs rounded ${
            element.textAlign === "right" ? "bg-blue-100" : ""
          }`}
          onClick={() => {
            editor.chain().focus().setTextAlign("right").run();
            updateElement(element.id, { textAlign: "right" });
          }}
          title="Align right"
        >
          →
        </button>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="w-full h-full overflow-hidden"
      />
    </div>
  );
}
