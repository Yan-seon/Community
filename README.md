# Beauty House — community research simulation

A case-informed desktop Web simulation of an image-led beauty community, retaining recognisable community navigation and conversation patterns. This release uses English only. Not affiliated with Sephora.

The five assistance moments (question wording, previewing and entering related discussions, sentence-context follow-up, experience structuring, and comparing an experience before passing it on) use deterministic presets, **not a live AI model**. Scenario members and images are fictional research props. Visitor comments are real contributions stored in Supabase.

## Run locally

Use Node 22.13 or newer:

```sh
npm ci
cp .env.example .env.local
# Add the Supabase project URL and publishable key to .env.local.
npm run dev
```

`npm run build:netlify` produces `dist-netlify`. Netlify reads `netlify.toml`; add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to build environment variables. Never use a secret/service-role key in the browser.

## Community and week observation

Default entry is a freely navigable community, with shared topics/comments, gallery, groups, search, appreciation, saved posts and optional five-moment AI help. There is no required task sequence. Text questions need no image pin; selected pins and sentence authors remain visible after publication. Images show loading/retry states. Post/comment drafts survive interrupted browsing.

Anonymous Supabase sign-in must be enabled. Public week-study contributions use the shared room; consented research records use owner-only `study_sessions`. Existing A/B/C database categories are retained, and `metadata.thread_id` separates additional topics. No new schema migration is required for this release.

Use `/?lang=en` to browse; `/?post=A&lang=en` opens a case. For seven-day observation, assign a unique P code and send `/?study=1&lang=en&condition=embedded` or `condition=separate`. The condition/language stay fixed during the observation. All feedback writing fields are optional; blank notes remain missing in the data. JSON exports include week metadata, feedback and per-thread work; CSV exports events. Earlier moderated records are retained separately and must not be pooled with this protocol.

## Testing

```sh
npm run typecheck
node --experimental-strip-types --test tests/community-v3.test.ts tests/week-community.test.ts tests/interaction-patterns.test.ts
npm run build:netlify
```

With Playwright available, run `tests/distinct-interactions.browser.cjs` and `tests/english-ui.browser.cjs` (`TEST_URL` defaults to localhost:4180). Checks use TEST content/P998xxx codes, not participant evidence. Default views hide TEST fixtures; `?qa=1` exposes them for inspection. The earlier full-study browser script is an archived procedure, not the current default.

## Evaluation and participant data

See [week plan](docs/WEEK_STUDY_PROTOCOL.md). The method is natural use over seven days, with an exploratory between-participant condition comparison. The revised thesis Chapter 8 specifies this plan; the earlier guided procedure is archived. Shared social encounters and condition spillover must be reported; technical passing checks are not findings of fidelity or effectiveness.

The researcher supplies the actual approved information sheet, contact, withdrawal route and retention period before recruitment. Do not enter personal/sensitive information. Public contributions are visible to visitors; private records are accessible to the owner and project administrator. Browser clearing does not remove database records. Product/service pathways describe the ecosystem but do not perform real checkout, diagnosis or loyalty transactions. No invitation messages, reminders or recording are configured.
