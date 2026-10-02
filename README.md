# Beauty House — community research simulation

A case-informed desktop Web simulation of an image-led beauty community, retaining recognisable community navigation and conversation patterns. English and Chinese interfaces. Not affiliated with Sephora.

The five assistance moments (question wording, finding a member response, sentence-context follow-up, experience structuring, and passing experience on) use deterministic presets, **not a live AI model**. Scenario members and images are fictional research props. Visitor comments are real contributions stored in Supabase.

## Run locally

Use Node 22.13 or newer:

```sh
npm ci
cp .env.example .env.local
# Add the Supabase project URL and publishable key to .env.local.
npm run dev
```

`npm run build:netlify` produces `dist-netlify`. Netlify reads `netlify.toml`; add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to build environment variables. Never use a secret/service-role key in the browser.

## Supabase

Anonymous sign-in must be enabled. `supabase/setup.sql` creates comments, owner-only study sessions, row-level policies, and the Realtime publication. Exploration comments use the shared room. Starting a consented paired study creates a fresh anonymous identity, including when a computer is reused. The study uses an identity-specific room, keeping other participants' contributions out of the comparison.

## Testing

- `npm run typecheck`
- `node --experimental-strip-types --test tests/community-v3.test.ts`
- Two independent browsers: publish a comment, observe it in the other browser, reload, and inspect sentence/image references.

Open `/?post=A&lang=en` (or B/C, zh) for a direct conversation link. The flask icon starts the full moderated study (background → AI-free fidelity gate → activity 1 and reconstruction/ratings → break → activity 2 and reflection → Case C → comparative interview → debrief/export); use anonymous P codes and the researcher's assigned sequence. JSON exports contain both activity snapshots, four reconstruction answers per activity, six ratings with N/A, all research stages, facilitator notes and event logs. CSV exports events only. Full completion is recorded after debrief, rather than after the two paired activities. Drafts and unfinished reflections resume after refresh. Completed records are also saved in Supabase's `study_sessions` table. Technical smoke tests use TEST names and P900xxx codes and are not participant findings.

## Participant data

Do not enter personal or sensitive information. Shared comments are visible to site visitors. Study records are visible to their session owner and the project administrator. Clearing browser drafts does not delete database records; participants can request deletion from the researcher using their participant code. The researcher manages consent, recruitment, moderation, and retention before formal collection.

## Study preparation

See [facilitator guide](docs/FACILITATOR_GUIDE.md) and [alignment review](docs/ALIGNMENT.md). Pilot with 4–6 participants before the provisional main study. Technical browser checks are optional Playwright scripts and write labelled TEST fixtures: set `TEST_URL`, `PLAYWRIGHT_PATH` and `TEST_ARTIFACTS`, then run `node tests/full-study.browser.cjs`. The site does not score effectiveness or record audio/screens. Historical screenshot sources are attributed inside the pre-AI gate.
