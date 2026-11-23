import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { CandidateDetail, CandidateNote } from "@/proto/candidate-panel/data";

export interface UseRecruiterNotesReturn {
  notes: CandidateNote[];
  isAdding: boolean;
  setIsAdding: (val: boolean) => void;
  draftText: string;
  setDraftText: (val: string) => void;
  editingId: string | null;
  editText: string;
  setEditText: (val: string) => void;
  handleAddNote: (text?: string) => void;
  startEditing: (note: CandidateNote) => void;
  cancelEditing: () => void;
  handleSaveEdit: (id: string) => void;
  handleDeleteNote: (id: string) => void;
}

function formatNowTimestamp(): string {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-GB", { month: "short" });
  const time = now.toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${day} ${month}, ${time}`;
}

export function useRecruiterNotes(detail: CandidateDetail): UseRecruiterNotesReturn {
  const [notes, setNotes] = useState<CandidateNote[]>(detail.recruiterNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [draftText, setDraftText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  // Sync notes when switching candidates
  useEffect(() => {
    setNotes(detail.recruiterNotes);
    setIsAdding(false);
    setDraftText("");
    setEditingId(null);
    setEditText("");
  }, [detail.item.id, detail.recruiterNotes]);

  const handleAddNote = useCallback(
    (overrideText?: string) => {
      const value = (overrideText ?? draftText).trim();
      if (!value) return;

      const newNote: CandidateNote = {
        id: `rn-${Date.now()}`,
        author: "Added by you",
        authorRole: "recruiter",
        date: formatNowTimestamp(),
        text: value,
      };

      setNotes((prev) => [newNote, ...prev]);
      setDraftText("");
      setIsAdding(false);
      toast.success("Private note added");
    },
    [draftText]
  );

  const startEditing = useCallback((note: CandidateNote) => {
    setEditingId(note.id);
    setEditText(note.text);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingId(null);
    setEditText("");
  }, []);

  const handleSaveEdit = useCallback(
    (id: string) => {
      const value = editText.trim();
      if (!value) return;

      setNotes((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                text: value,
                date: `${formatNowTimestamp()} (edited)`,
              }
            : n
        )
      );
      setEditingId(null);
      setEditText("");
      toast.success("Note updated");
    },
    [editText]
  );

  const handleDeleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setEditingId((prev) => (prev === id ? null : prev));
    toast("Note deleted");
  }, []);

  return {
    notes,
    isAdding,
    setIsAdding,
    draftText,
    setDraftText,
    editingId,
    editText,
    setEditText,
    handleAddNote,
    startEditing,
    cancelEditing,
    handleSaveEdit,
    handleDeleteNote,
  };
}

export function LockMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function PlusMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

export function PencilMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

export function TrashMiniIcon({ className }: { className?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
  );
}
