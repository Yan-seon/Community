# Prototype–evaluation alignment review

Reviewed 2 October 2026 against the latest `outputs/Thesis_Integrated_EN.docx`, Chapters 6–8, and their verified manuscript sources. Prototype release: `4.1.0-study-ready`. This is a design-study readiness review, not participant evidence or an effectiveness finding.

## Decision

The previous deployed interface supported the two core activities but did not support the complete Chapter 8 procedure. The revised desktop-Web simulation supports a moderated pilot from background and the pre-AI fidelity gate through paired activities, reconstruction, transfer, interview, debrief and export. A successful technical walkthrough does not establish community equivalence or AI effectiveness. Those questions require the pilot and participant evidence.

| Chapter 8 requirement | Previous gap | Revised participant experience / evidence |
|---|---|---|
| Background and controlled setting | No background form or viewport record | Three background questions; fixed language, anonymous code, browser and initial viewport retained |
| Pre-AI fidelity gate | No dedicated baseline stage | Same Chapter 7 historical Web captures; AI-free exploration; navigation attempts, 1–7 similarity/N/A and mismatch response kept separate |
| Matched E/S comparison | Two conditions available, incomplete procedure | Four counterbalanced sequences retained; same shell, scenario facts, human replies, preset suggestions and edit/publish controls; difference remains contextual integration, transfer and local traces |
| Five optional AI interventions | Input bundle not always specific; some behavior unlogged | Relevant draft/question/quote/update/album visibly identified; AI request, transfer, acceptance, rejection, reference inspection and editing-on-blur logged |
| Reference persistence | Changing return photo could conceal the original pin | Original anchored photo retained alongside separate return photo; quoted human sentence and author retained |
| Review before album publication | Content and provenance hard to separate | Distinct experience, context/limits, quotation, original reference and return image; preview and explicit review confirmation recorded |
| Agency and community culture | Risk of a forced AI path | Direct member-reply route, self-authored contributions, AI rejection, optional thanks and personal recognition retained; no automatic gratitude or merit scoring |
| Responsibility reconstruction | Only a broad reflection | Four separate questions plus broad reflection and six individual ratings (N/A retained as null); answers copied into immutable phase snapshots |
| Break/reset | Next activity began immediately | Explicit break; fresh second-case workspace; prior snapshot preserved |
| Case C transfer | Only available as another exploratory post | Separate uncoached hand-swatch task after both activities; response, optional anchor, voluntary skip recorded separately from the two condition outcomes |
| Comparative interview | Not captured in the site | Five theme fields and overall preference, including neither/unsure; optional written-comparison skip retained; spoken recording consent remains outside the site |
| Debrief and completion | Completed after activity 2 | Explicit fixed-script debrief; full completion only after debrief; cloud completion flag follows the full procedure |
| Facilitator assistance | No structured capture | Observer notes with fixed assistance ladder and interruption category; no scoring feedback in participant UI |
| Data continuity | No post-pair events; weak stage resume | Stage-aware refresh restoration; post-pair events continue; JSON exports whole procedure and snapshots, CSV exports events; draft inputs are not logged on each keystroke |

## Evaluation boundaries

- Pilot: 4–6 adults. Main study: provisional 20–24; no actual recruitment or results claimed.
- Use a desktop browser and one language per session. Do not pool the earlier `4.0.0` protocol with the new full procedure; old records remain readable rather than being silently overwritten.
- Preserve the bundled E/S comparison. It cannot isolate AI placement from context transfer or trace arrangement separately.
- The fidelity rating records perception, not automatic approval. Decide and document baseline revisions before recruiting the main sample; retain low ratings and negative cases.
- The four artifact dimensions are manually scored by researchers. The website does not supply automated effectiveness scores or “correct” reconstruction answers.
- Public exploration comments are genuinely shared. Research-mode contributions use a private participant room; scripted members and AI presets remain simulated.
- The latest Chapter 8 still describes local handling in several places. The deployed version stores private study records and contributions in Supabase; approved participant information must describe that accurately. Screen/audio recording is not performed by this site.
- Chapter 8 labels the session 75–90 minutes; the table’s component ranges total approximately 80–96 minutes. Reserve 100 minutes for the pilot, measure actual duration, then reconcile the thesis timing before main recruitment.

## Verification evidence

See `technical-verification.json` and `screenshots/` for the automated technical walkthrough. These are QA fixtures labelled TEST, never participant results. Test checks cover full flow, rejection of AI, independent completion, optional thanks, changed-photo pin persistence, N/A, stage resume and own-session database persistence. Separate cross-context checks cover real comment publication and synchronization. Unit checks cover all four assignments and illegal/incomplete stage transitions.
