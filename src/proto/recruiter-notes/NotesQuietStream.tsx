import type { CandidateDetail } from "@/proto/candidate-panel/data";
import {
  useRecruiterNotes,
  LockMiniIcon,
  PlusMiniIcon,
  PencilMiniIcon,
  TrashMiniIcon,
} from "./useRecruiterNotes";
import s from "./RecruiterNotes.module.css";

/**
 * Variant 1 — "Quiet Stream"
 * Axis: Borderless Typographic List + Progressive Bottom Trigger
 *
 * Follows the exact minimal hierarchy from the brief:
 * - "Recruiter notes" (16px semibold) + "Private" badge
 * - "Keep track of useful information about this candidate."
 * - Clean borderless note entries separated by subtle hairline dividers
 * - "Added by you · 18 Nov, 2:30 PM" + inline Edit / Delete
 * - "+ Add a note" button below the notes list
 */
export function NotesQuietStream({ detail }: { detail: CandidateDetail }) {
  const {
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
  } = useRecruiterNotes(detail);

  return (
    <div className={s.sectionWrap}>
      {/* Header: Title + Private badge */}
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

      {/* Purpose description */}
      <p className={s.helperText}>
        Keep track of useful information about this candidate.
      </p>

      {/* Notes Stream */}
      {notes.length > 0 && (
        <ul className={s.streamList} aria-label="Recruiter notes list">
          {notes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <li key={note.id} className={s.streamItem}>
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
      )}

      {/* Progressive "+ Add a note" trigger or active form */}
      {isAdding ? (
        <form
          className={s.composerForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddNote();
          }}
        >
          <textarea
            className={s.textarea}
            aria-label={`Add a private note for ${detail.name}`}
            placeholder="Jot down preferences, compensation flexibility, call availability, or follow-up reminders…"
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleAddNote();
              } else if (e.key === "Escape") {
                setIsAdding(false);
              }
            }}
            spellCheck={false}
          />
          <div className={s.composerFooter}>
            <span className={s.shortcutHint}>
              Visible only to you · ⌘ + Enter to save
            </span>
            <div className={s.composerActions}>
              <button
                type="button"
                className={s.btnCancel}
                onClick={() => {
                  setIsAdding(false);
                  setDraftText("");
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={s.btnPrimary}
                disabled={!draftText.trim()}
              >
                Save note
              </button>
            </div>
          </div>
        </form>
      ) : (
        <button
          type="button"
          className={s.addNoteTrigger}
          onClick={() => setIsAdding(true)}
        >
          <PlusMiniIcon />
          <span>Add a note</span>
        </button>
      )}
    </div>
  );
}
