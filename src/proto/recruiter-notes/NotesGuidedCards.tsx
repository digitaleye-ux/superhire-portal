import type { CandidateDetail } from "@/proto/candidate-panel/data";
import {
  useRecruiterNotes,
  LockMiniIcon,
  PlusMiniIcon,
  PencilMiniIcon,
  TrashMiniIcon,
} from "./useRecruiterNotes";
import s from "./RecruiterNotes.module.css";

const STARTER_PROMPTS = [
  {
    label: "Preferences",
    snippet: "Prefers remote roles; open to relocating for the right team.",
  },
  {
    label: "Compensation",
    snippet: "Flexible on expected CTC depending on the opportunity.",
  },
  {
    label: "Availability",
    snippet: "Available for calls after 5 PM on weekdays.",
  },
  {
    label: "Competing offer",
    snippet: "Interested in the company but currently evaluating another offer.",
  },
  {
    label: "Follow-up",
    snippet: "Check with candidate about decision on Friday.",
  },
];

/**
 * Variant 3 — "Guided Cards"
 * Axis: Contained Note Cards + 1-Click Starter Prompt Chips
 *
 * Renders each note inside a distinct bordered card and provides optional
 * recruiting prompt chips (Preferences, Compensation, Availability, Competing offer, Follow-up)
 * when composing a new note so recruiters remember what belongs here without rigid categories.
 */
export function NotesGuidedCards({ detail }: { detail: CandidateDetail }) {
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

  const insertPromptSnippet = (snippet: string) => {
    setIsAdding(true);
    setDraftText(
      draftText.trim() ? `${draftText.trim()} ${snippet}` : snippet
    );
  };

  return (
    <div className={s.sectionWrap}>
      {/* Header Row with top-right "+ Add a note" button */}
      <div className={s.headerRow}>
        <div className={s.titleGroup}>
          <h3 className={s.sectionTitle}>Recruiter notes</h3>
          <span className={s.privateBadge}>
            <LockMiniIcon />
            <span>Private</span>
          </span>
        </div>

        {!isAdding && (
          <button
            type="button"
            className={s.headerAddBtn}
            onClick={() => setIsAdding(true)}
          >
            <PlusMiniIcon />
            <span>Add a note</span>
          </button>
        )}
      </div>

      <p className={s.helperText}>
        Keep track of useful information about this candidate. Only visible to
        you for this application.
      </p>

      {/* Active Composer with 1-Click Recruiting Starter Prompts */}
      {isAdding && (
        <form
          className={s.composerForm}
          onSubmit={(e) => {
            e.preventDefault();
            handleAddNote();
          }}
        >
          <div className={s.promptBar}>
            <span className={s.promptBarLabel}>Quick prompts:</span>
            <div className={s.chipRow}>
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={s.promptChip}
                  onClick={() => insertPromptSnippet(p.snippet)}
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>

          <textarea
            className={s.textarea}
            aria-label={`Add a private note for ${detail.name}`}
            placeholder="Write a private note for this application…"
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
            <span className={s.shortcutHint}>⌘ + Enter to save</span>
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
      )}

      {/* Contained Cards List or Guided Empty State */}
      {notes.length > 0 ? (
        <ul className={s.cardList} aria-label="Recruiter notes list">
          {notes.map((note) => {
            const isEditing = editingId === note.id;

            return (
              <li key={note.id} className={s.noteCard}>
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
        !isAdding && (
          <div className={s.emptyCardBox}>
            <p className={s.emptyCardText}>
              No private notes for {detail.name} yet. Tap a prompt to start:
            </p>
            <div className={s.chipRow}>
              {STARTER_PROMPTS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={s.promptChip}
                  onClick={() => insertPromptSnippet(p.snippet)}
                >
                  + {p.label}
                </button>
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
