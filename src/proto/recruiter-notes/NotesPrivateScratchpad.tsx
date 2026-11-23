import { useState, useRef, useEffect } from "react";
import type { CandidateDetail } from "@/proto/candidate-panel/data";
import { MoreVerticalIcon } from "@/components/shared/Icon";
import {
  useRecruiterNotes,
  LockMiniIcon,
  PencilMiniIcon,
  TrashMiniIcon,
} from "./useRecruiterNotes";
import s from "./RecruiterNotes.module.css";

/**
 * Recruiter Notes — Private Scratchpad
 *
 * Hierarchy:
 *   1. Header: "Recruiter notes" (16px semibold) + "Private" pill badge
 *   2. Saved notes list: Crisp white cards with purple accent bar, timestamp, and kebab menu (⋮)
 *   3. Text input composer: Visually distinct active input field with clear placeholder & actions
 */
export function NotesPrivateScratchpad({ detail }: { detail: CandidateDetail }) {
  const {
    notes,
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
  } = useRecruiterNotes(detail);

  const [inputFocused, setInputFocused] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close kebab menu when clicking outside or pressing Escape
  useEffect(() => {
    if (!openMenuId) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId]);

  const showQuickActions = inputFocused || draftText.trim().length > 0;

  return (
    <div className={s.sectionWrap}>
      {/* Header */}
      <div className={s.headerRow}>
        <div className={s.titleGroup}>
          <h3 className={s.sectionTitle}>Recruiter notes</h3>
          <span
            className={s.privateBadge}
            title="Visible only to you — not shared with the employer or candidate"
          >
            <LockMiniIcon />
            <span>Private</span>
          </span>
        </div>
      </div>

      {/* Saved Notes: Rendered as distinct cards with kebab action menu */}
      {notes.length > 0 ? (
        <ul className={s.savedNotesList} aria-label="Recruiter notes list">
          {notes.map((note) => {
            const isEditing = editingId === note.id;
            const isMenuOpen = openMenuId === note.id;

            return (
              <li key={note.id} className={s.savedNoteCard}>
                {isEditing ? (
                  <form
                    className={s.composerForm}
                    style={{ marginTop: 0 }}
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveEdit(note.id);
                    }}
                  >
                    <textarea
                      className={s.textarea}
                      aria-label="Edit recruiter note"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                          e.preventDefault();
                          handleSaveEdit(note.id);
                        } else if (e.key === "Escape") {
                          cancelEditing();
                        }
                      }}
                      spellCheck={false}
                      autoFocus
                    />
                    <div className={s.composerFooter}>
                      <div className={s.composerActions}>
                        <button
                          type="button"
                          className={s.btnCancel}
                          onClick={cancelEditing}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className={s.btnPrimary}
                          disabled={!editText.trim()}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className={s.noteBody}>{note.text}</p>
                    <div className={s.noteFooter}>
                      <span className={s.metaTimestamp}>
                        {note.date}
                      </span>

                      {/* Kebab action menu: Edit and Delete */}
                      <div
                        className={s.kebabContainer}
                        ref={isMenuOpen ? menuRef : undefined}
                      >
                        <button
                          type="button"
                          className={`${s.kebabBtn} ${
                            isMenuOpen ? s.kebabBtnActive : ""
                          }`}
                          aria-label={`Options for note: ${note.text.slice(0, 24)}...`}
                          aria-haspopup="menu"
                          aria-expanded={isMenuOpen}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId((prev) =>
                              prev === note.id ? null : note.id
                            );
                          }}
                        >
                          <MoreVerticalIcon size={16} />
                        </button>

                        {isMenuOpen && (
                          <div className={s.dropdown} role="menu">
                            <button
                              type="button"
                              className={s.dropdownItem}
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                startEditing(note);
                              }}
                            >
                              <PencilMiniIcon />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              className={`${s.dropdownItem} ${s.dropdownItemDanger}`}
                              role="menuitem"
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDeleteNote(note.id);
                              }}
                            >
                              <TrashMiniIcon />
                              <span>Delete</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className={s.scratchpadEmpty}>
          No private notes yet. Record preferences, availability, compensation flexibility, or follow-up reminders below.
        </div>
      )}

      {/* Input Field / Composer: Visually distinct active input area */}
      <form
        className={s.quickCaptureBox}
        onSubmit={(e) => {
          e.preventDefault();
          handleAddNote();
          setInputFocused(false);
        }}
      >
        <textarea
          className={`${s.quickInput} ${
            showQuickActions ? s.quickInputExpanded : ""
          }`}
          aria-label={`Add a private note for ${detail.name}`}
          placeholder="Add a note (e.g., available after 5 PM, evaluating another offer)…"
          value={draftText}
          onFocus={() => setInputFocused(true)}
          onChange={(e) => setDraftText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              handleAddNote();
              setInputFocused(false);
            } else if (e.key === "Escape") {
              if (!draftText.trim()) {
                setInputFocused(false);
              }
            }
          }}
          spellCheck={false}
        />
        {showQuickActions && (
          <div className={s.composerFooter}>
            <div className={s.composerActions}>
              <button
                type="button"
                className={s.btnCancel}
                onClick={() => {
                  setDraftText("");
                  setInputFocused(false);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={s.btnPrimary}
                disabled={!draftText.trim()}
              >
                Add note
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
