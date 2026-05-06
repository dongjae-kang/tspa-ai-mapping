# AI-Era T&S Framework Mapping

Interactive companion site for DongJae Kang's Columbia SIPA final paper on how AI-related social media crises challenge existing Trust and Safety frameworks. The site includes a data-driven Mapping Visualizer for event-level framework inspection and a Hybrid-Agency Diagnostic Flag prototype that applies harm-axis and actor-axis coding in parallel.

## Stack choice

This prototype uses React + Vite instead of Next.js. The handoff allowed a simpler static alternative, and this choice keeps the site fully static, easier to redeploy, and compatible with the already-available local toolchain in this workspace. The site has no backend requirements.

## Local development

1. `npm install`
2. `npm run dev`
3. Open the local Vite URL shown in the terminal

## Build and checks

- `npm run lint`
- `npm run build`

## Updating the dataset

Replace the JSON files in `public/data/`:

- `public/data/events.json`
- `public/data/dual-coding-lookup.json`

The UI populates filters dynamically from the event data, so new years, platforms, or AI involvement types appear automatically without code changes.

## Deployment

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Use the default Vite build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Redeploy whenever `public/data/` or source files change.

## Notes on handoff ambiguities

- The written handoff asked for five placeholder events, but the preferred default diagnostic example referenced a separate "Meta AI Discover feed incident" that was not included in the provided seed list. This build falls back to the first dataset event unless that specific event is later added to `events.json`.
- Platform filters are fully data-driven. If future events span multiple ecosystems, using a broader `platform_family` label such as `Cross-platform` is supported without code changes.
