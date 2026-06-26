"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePresentationStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loading } from "@/components/ui/loading";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Dropdown } from "@/components/ui/dropdown";

export default function DashboardPage() {
  const router = useRouter();
  const {
    presentations,
    isLoadingList,
    error,
    fetchPresentations,
    createPresentation,
    deletePresentation,
    renamePresentation,
  } = usePresentationStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchPresentations();
  }, [fetchPresentations]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setCreating(true);
    const id = await createPresentation(newTitle.trim());
    setCreating(false);
    setShowCreateModal(false);
    setNewTitle("");
    if (id) {
      router.push(`/editor/${id}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this presentation?")) {
      await deletePresentation(id);
    }
  };

  const handleRename = async (id: string, currentTitle: string) => {
    const newName = prompt("Enter new name:", currentTitle);
    if (newName && newName !== currentTitle) {
      await renamePresentation(id, newName);
    }
  };

  if (isLoadingList) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Presentations</h2>
        <Button onClick={() => setShowCreateModal(true)}>+ New Presentation</Button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {presentations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <p className="text-lg">No presentations yet</p>
          <p className="mt-1 text-sm">Create your first presentation to get started</p>
          <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
            Create Presentation
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {presentations.map((p) => (
            <Card key={p.id} className="relative group">
              <div
                className="cursor-pointer"
                onClick={() => router.push(`/editor/${p.id}`)}
              >
                <div className="mb-3 flex aspect-video items-center justify-center rounded bg-gray-100 text-4xl">
                  🎨
                </div>
                <h3 className="truncate font-medium">{p.title}</h3>
                <p className="mt-1 text-xs text-gray-500">
                  {new Date(p.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Dropdown
                  trigger={
                    <button className="rounded bg-white p-1 shadow hover:bg-gray-50">⋯</button>
                  }
                  items={[
                    { label: "Rename", onClick: () => handleRename(p.id, p.title) },
                    { label: "Delete", onClick: () => handleDelete(p.id), danger: true },
                  ]}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Presentation"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="My Presentation"
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating || !newTitle.trim()}>
              {creating ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
