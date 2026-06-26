"use client";

import { useEffect, useRef, useState } from "react";
import { useEditorStore } from "@/store/editor-store";
import type { ImageElement } from "@/types";

interface MediaPickerProps {
  onClose: () => void;
}

type Tab = "upload" | "unsplash" | "my-uploads";

interface UnsplashResult {
  id: string;
  thumb: string;
  regular: string;
  alt: string;
  author: string;
}

interface UploadRecord {
  id: string;
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

function insertImage(onClose: () => void, src: string, referrer?: "no-referrer") {
  const el: ImageElement = {
    id: crypto.randomUUID(),
    type: "image",
    x: 200,
    y: 120,
    width: 400,
    height: 300,
    rotation: 0,
    opacity: 100,
    animation: "none",
    animationDelay: 0,
    src,
    ...(referrer && { referrerPolicy: referrer }),
  };
  useEditorStore.getState().addElement(el);
  onClose();
}

export function MediaPicker({ onClose }: MediaPickerProps) {
  const [tab, setTab] = useState<Tab>("upload");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[700px] max-w-[92vw] max-h-[85vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
          <h2 className="text-base font-semibold text-gray-800">Insert Image</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded text-gray-500 hover:bg-gray-100"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-5 gap-1">
          <TabButton active={tab === "upload"} onClick={() => setTab("upload")}>
            Upload
          </TabButton>
          <TabButton active={tab === "unsplash"} onClick={() => setTab("unsplash")}>
            Unsplash
          </TabButton>
          <TabButton active={tab === "my-uploads"} onClick={() => setTab("my-uploads")}>
            My Uploads
          </TabButton>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === "upload" && <UploadTab onClose={onClose} />}
          {tab === "unsplash" && <UnsplashTab onClose={onClose} />}
          {tab === "my-uploads" && <MyUploadsTab onClose={onClose} />}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
        active
          ? "border-blue-600 text-blue-600"
          : "border-transparent text-gray-500 hover:text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function UploadTab({ onClose }: { onClose: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Upload failed");
      }
      insertImage(onClose, json.data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <span className="text-sm">Uploading…</span>
        ) : (
          <>
            <span className="text-3xl mb-2">🖼</span>
            <span className="text-sm font-medium">Click to choose an image</span>
            <span className="text-xs text-gray-400 mt-1">
              JPEG, PNG, WebP, SVG — max 10MB
            </span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function UnsplashTab({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnsplashResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}`);
      const json = await res.json();
      setResults(json.data?.results || []);
      if (json.data?.message) setMessage(json.data.message);
    } catch {
      setMessage("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={search} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Unsplash photos…"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      {message && <p className="text-sm text-gray-500 mb-3">{message}</p>}

      {loading ? (
        <p className="text-sm text-gray-400 text-center py-8">Loading…</p>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => insertImage(onClose, p.regular, "no-referrer")}
              title={`${p.alt} — ${p.author}`}
              className="aspect-square overflow-hidden rounded-md border border-gray-200 hover:ring-2 hover:ring-blue-400"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.thumb}
                alt={p.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MyUploadsTab({ onClose }: { onClose: () => void }) {
  const [uploads, setUploads] = useState<UploadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/upload");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error?.message || "Failed to load uploads");
        if (active) setUploads(json.data || []);
      } catch (err: any) {
        if (active) setError(err.message || "Failed to load uploads");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-400 text-center py-8">Loading…</p>;
  }
  if (error) {
    return <p className="text-sm text-red-600 text-center py-8">{error}</p>;
  }
  if (uploads.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No uploads yet.</p>;
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {uploads.map((u) => (
        <button
          key={u.id}
          onClick={() => insertImage(onClose, u.url)}
          title={u.filename}
          className="aspect-square overflow-hidden rounded-md border border-gray-200 hover:ring-2 hover:ring-blue-400"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={u.url} alt={u.filename} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  );
}
