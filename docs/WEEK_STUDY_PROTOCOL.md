# One-week natural community use — revised evaluation plan

Protocol: `week-natural-use-2026-10-06`. This replaces the default task-led procedure in the October 2 release. This is a **plan**, not participant findings. The current thesis Chapter 8 describes the earlier moderated within-participant procedure; its method and evidence table must be replaced with this plan before describing the new deployment as the thesis evaluation.

## Environment and participant experience

The desktop Web site remains a Sephora-informed simulation, with community navigation, groups, gallery, authored posts, replies and profiles. It is neither Sephora's service nor an independent new platform. Ten labelled fictional seed posts combine photo questions, text discussions, personal returns, product context, thanks and different experiences. Real participants can create additional text/photo-prop topics, comment, quote a sentence, retain a visual pin, appreciate, save, publish an experience and revisit. Shopping/service entries describe the wider ecosystem; there is no real checkout, diagnostic service or loyalty system.

Participants freely use the shared community for seven days. They may read without contributing, browse unrelated topics, return voluntarily and reject all AI. No required activity order, daily quota, completion meter or forced gratitude is present. Case-reference images are accessible from Groups as an optional resource rather than an entry gate. Contextual help appears only after request. Images reserve space, animate while loading and offer retry on failure.

The study enrolment is separate from browsing. `?study=1&lang=en&condition=embedded` opens a consent invitation; the same link with `condition=separate` configures the separate workspace. Use unique P codes. The participant's assigned condition and language remain fixed during the observation, and the same browser preserves anonymous identity and drafts. A participant can stop recording and still browse. Behaviour recording stops at seven days; optional final feedback can be saved afterward. Clearing local data does not remove public comments or database records.

## Research design and sampling

Begin with a small formative pilot (provisionally 4–6 adults). Observe whether the shell feels like the referenced community, controls are understandable, contributions can be retrieved and the environment permits natural participation. Do not train participants through the five AI interactions. Revise the interface before the main observation; do not pool substantially different pilot versions.

For an exploratory main study, provisionally retain the thesis target of 20–24 adults, assigned to one condition each for the whole week. Balance prior community participation and AI-writing familiarity where possible, document assignment in advance and record the actual sample and attrition. The comparison is **between participants**, not a forced two-task crossover. Both conditions use the same shell, seed content and preset wording. Embedded AI inherits local context and opens beside the current object; separate AI requires explicit context transfer into another workspace. Neither condition adds a required task sequence.

One shared community allows reciprocal encounters. It also means participants can encounter AI-assisted artefacts from another condition, different volumes of replies and unequal exposure to each feature. Report this spillover and do not treat each comment or click as an independent participant. A week in a small seeded research community cannot establish mature community culture or durable loyalty.

## Procedure without prescribed activities

1. Before participation, provide the approved information sheet, researcher contact, withdrawal route, retention period and any ethics details. These administrative details must come from the researcher's actual materials, not invented site text. Explain public contributions, private consented research records, fictional images and preset AI. Obtain separate consent for interview recording.
2. On enrolment, record the P code, chosen language, assigned condition, initial viewport/browser and consent. If needed, collect a short background survey separately; writing questions remain optional.
3. During the seven days, participants use the community whenever they wish. Do not prescribe posts, products, beauty trials, number of comments or AI usage. Offer support for technical failure without steering participation. No automated reminders or recruitment messages are configured.
4. At the end, invite optional feedback and a short retrospective interview. Ask participants to revisit one interaction they remember, rather than perform a missing feature. Include non-users of AI, quiet readers, people who did not return and uncomfortable or confusing moments. Leave unanswered fields missing. Blank notes are displayed as “no additional comment”, not coded as evidence of no mismatch.

## Evidence linked to the thesis questions

| Thesis question | Evidence | Interpretation |
|---|---|---|
| Sub-RQ 1: Requirements for socially embedded sharing and mutual assistance | Situated photo/text posts, quoted sources, retained image references, explicit limits, experience revisions; retrospective explanation of an actual episode | Identify requirements and breakdowns in this simulation. Apply visual-reference scoring only where an image was actually relevant. |
| Sub-RQ 2: AI as embedded collaborator rather than separate tool | Requests, acceptance/rejection, editing and source inspection; context transfer in the separate condition; navigation around a voluntary AI episode; interview on interruption and fit | Compare complete integration arrangements across participants. Different opportunities/exposure and spillover limit causal attribution. |
| Sub-RQ 3: AI use while maintaining reciprocal relationships | Real replies between participants, voluntarily returning to a discussion, attribution, optional thanks, experience sharing and perceived ownership/control | Look for reciprocal episodes and tensions. More comments or AI requests do not themselves mean better relationships. |

Analyse at the participant and interaction-episode levels. Report denominators: participants who encountered a feature, requested it, rejected it, edited it and published. Retain N/A and missing ratings separately, alongside nonparticipation and dropout; do not use a six-item sum as a validated scale. Triangulate artefacts, actual event traces and interview accounts. Review negative cases such as unwanted prompting, misattribution, pressure to express gratitude, preference for the separate assistant, or cosmetic claims beyond the source.

The original artefact rubric can inform qualitative review, but it must not impose an image pin or a hand-off on every text discussion. Evaluate reference retention, contextual boundaries and attribution only against the episode's available sources. Reconstruct a chain when one genuinely exists; do not invent a linear chain for free browsing.

## Implementation and data separation

Public topics, reactions and contributions are stored in `comments`; `metadata.thread_id` keeps topics separate, and `metadata.entity` distinguishes topic records and reactions from ordinary replies. Research activity and feedback are stored privately in `study_sessions`. Local drafts and JSON exports include per-thread work; CSV exports activity events. Accepted presets remain editable, and image pins and human author names travel with published contributions.

Earlier moderated records have their own protocol/version and private-room arrangement. They are retained and archived locally when enrolment replaces an old record. Do not pool them with week observations. The old moderated controls are available only for an explicitly restored legacy session (`?protocol=moderated`), not as the default study. Technical checks use TEST content/P998xxx codes; exclude these and earlier technical fixtures from research analysis. Default visitor views hide TEST-labelled posts/comments; `?qa=1` is for technical inspection only.

Passing technical and visual checks supports deployment readiness; it does not establish perceived fidelity, AI benefit or an actual seven-day effect. Those claims require recruited participant evidence.
