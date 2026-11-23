import { useState } from "react";
import type { CandidateDetail } from "@/proto/candidate-panel/data";
import {
  useRecruiterNotes,
  LockMiniIcon,
  PencilMiniIcon,
  TrashMiniIcon,
} from "./useRecruiterNotes";
import s from "./RecruiterNotes.module.css";

/**
 * Variant 2 — "Private Scratchpad"
 * Axis: Tinted Dossier Surface + Always-Ready Quick Input
 *
 * Groups private recruiter notes into a dedicated subtle surface container
 * with an application-specific privacy scope header and a zero-click quick
 * capture input at the bottom for fast note-taking during candidate calls.
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
  const showQuickActions = inputFocused || draftText.trim().length > 0;

  return (
    <div className={s.sectionWrap}>
      {/* Header */}
      <div className={s.headerRow}>
        <div className={s.titleGroup}>
          <h3 className={s.sectionTitle}>Recruiter notes</h3>
          <span className={s.privateBadge}>
            <LockMiniIcon />
            <span>Private</span>
          </span>
        </div>
      </div>

      {/* Dedicated Private Scratchpad Container */}
      <div className={s.scratchpadSurface}>
        {notes.length > 0 ? (
          <ul className={s.scratchpadList} aria-label="Recruiter notes list">
            {notes.map((note) => {
              const isEditing = editingId === note.id;

              return (
                <li key={note.id} className={s.scratchpadEntry}>
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
                      />
                      <div className={s.composerFooter}>
                        <span className={s.shortcutHint}>⌘ + Enter to save</span>
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
                      <div className={s.metaRow}>
                        <span className={s.metaTimestamp}>
                          {note.author} · {note.date}
                        </span>
                        <div className={s.noteActions}>
                          <button
                            type="button"
                            className={s.actionLink}
                            onClick={() => startEditing(note)}
                            aria-label="Edit note"
                          >
                            <PencilMiniIcon />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className={`${s.actionLink} ${s.actionLinkDanger}`}
                            onClick={() => handleDeleteNote(note.id)}
                            aria-label="Delete note"
                          >
                            <TrashMiniIcon />
                            <span>Delete</span>
                          </button>
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
            No notes yet for this application. Record preferences, availability,
            comp flexibility, or follow-up reminders below.
          </div>
        )}

        {/* Always-ready quick capture form at bottom of scratchpad */}
        <form
          className={s.quickCaptureForm}
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
                setInputFocused(false);
              }
            }}
            spellCheck={false}
          />
          {showQuickActions && (
            <div className={s.composerFooter}>
              <span className={s.shortcutHint}>⌘ + Enter to save</span>
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
    </div>
  );
}
