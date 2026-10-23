# Percussion Assignment Pro

Orchestral percussion setups are notoriously hard to plan: one wrong assignment and a timpani player is sprinting across the stage mid-movement. Percussion Assignment Pro is an AI-powered consultant that takes a piece — or an entire concert program — and returns a realistic, playability-first plan: how many percussionists you need, the complete instrument list, and a difficulty-rated assignment for every player.

**Live app**: https://percussion-assignment.lovable.app

## How It Works

The workflow is deliberately simple — describe the music in whichever way is most convenient:

1. **Enter the music.** You have three ways to do it:
   - **Text** — type a piece, composer, or genre (e.g., "Stravinsky — The Rite of Spring").
   - **Image** — upload a photo or screenshot of a concert program (JPEG, PNG, HEIC from your phone, WebP). Every work on the program is analyzed.
   - **URL** — paste a link to a concert webpage. The page is fetched and the full program is extracted.
2. **Let the consultant work.** The analysis streams in live, structured like a professional orchestration brief.
3. **Read the plan.** Each work gets its own section; multi-work programs close with a whole-concert summary covering total players, the combined instrument list, and changeover considerations.

For every piece, the response follows a consistent structure:

- **Piece Identification** — the work, composer, and relevant context restated clearly.
- **Number of Percussionists** — the *minimum* (fewest players with doubling) and the *ideal* (enough that no critical overlaps or unplayable transitions occur).
- **Full Instrument List** — exact types and quantities ("5-octave marimba", "Germanic crash cymbals", "5 timpani").
- **Percussionist Assignments** — players labeled Percussionist 1, 2, 3…, assigned from most to least challenging, grouped by setup proximity and technique similarity, each ending with a **Difficulty: HIGH / MEDIUM / LOW** rating.
- **Relevant Notes** — complexity level per part (Beginner / Intermediate / Advanced) and the technical skills required (4-mallet proficiency, fast switching, rhythmic precision, extended techniques).
- **Additional Tips** — setup advice, transition strategies, and common professional practice.

The analysis is grounded in a playability-first rule set: it never suggests fewer players than required to cover the parts, never assigns physically impossible overlaps, and states plainly when it is unsure rather than guessing the instrumentation.

## Key Capabilities

- **Whole-concert analysis** — a single photo or link yields a per-piece plan plus a combined summary: total percussionists across the program, a de-duplicated master instrument list, and shared-instrument/changeover notes.
- **Three input modes** — typed queries, phone-captured program photos (with automatic HEIC/HEIF conversion), and webpage scraping all feed the same analysis.
- **Difficulty-graded assignments** — every player carries a HIGH / MEDIUM / LOW difficulty badge rendered inline, so you can see at a glance where your strongest players belong.
- **Streaming results** — the plan renders progressively as the AI writes it, with a mobile-optimized, dark, high-contrast layout designed to be readable on a music stand or in the pit.

## Tech Stack & Architecture

| Layer | Technology |
| --- | --- |
| Frontend | React 18 + TypeScript, Vite |
| Styling | Tailwind CSS with a custom dark orchestral design system (gold accents, Instrument Serif / DM Sans typography) |
| Markdown rendering | react-markdown |
| Backend | Supabase Edge Function (`analyze-percussion`), serverless — no database tables, no auth required |
| AI | Lovable AI Gateway (OpenAI-compatible chat completions API), multimodal (text + image), streamed as SSE |
| Image handling | heic2any for client-side HEIC/HEIF → JPEG conversion |

The browser sends the text, image, or URL payload to the `analyze-percussion` edge function, which validates the input, fetches and sanitizes webpage content server-side, builds the multimodal prompt with the consultant system prompt, and streams the model's response back to the client as server-sent events. The AI gateway credential lives only in the function's runtime environment — nothing sensitive ships to the browser.

## Local Development

**Prerequisites:** Node.js and npm ([install via nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
git clone <repository-url>
cd <repository-name>
npm install
cp .env.example .env
npm run dev
```

Then fill in the `.env` values — all three are publishable browser-side values:

```sh
VITE_SUPABASE_PROJECT_ID=""
VITE_SUPABASE_URL=""
VITE_SUPABASE_PUBLISHABLE_KEY=""
```

These point at the Supabase project that hosts the `analyze-percussion` edge function. The AI gateway key (`LOVABLE_API_KEY`) is injected into the edge function's runtime automatically by Lovable Cloud — it is never stored in this repository. If you're deploying outside Lovable, configure that secret in your own Supabase project's function environment.

**Useful commands:**

```sh
npm run dev        # start the dev server
npm run build      # production build
npm run lint       # ESLint
npm run test       # run unit tests
```

## Roadmap

- **Save & share assignments** — persist analyses with shareable links so a plan can be sent to players or stage crew before the first rehearsal.
- **PDF / print export** — one-tap export of the instrument list and stage plot as a rehearsal-ready handout.
- **Editable assignments** — manually swap instruments between players and have the tool flag any transitions it makes unplayable.
- **Setup diagrams** — a visual stage plot showing each player's position and instrument layout, not just the text list.

## Built With Lovable

This project is developed in the [Lovable editor](https://lovable.dev/projects/14bcb71f-6d86-4dd6-9a9d-c86b25e2235c). Every change made in Lovable is committed straight to this repository; the code is yours — push to `main` and your changes sync back into Lovable.
