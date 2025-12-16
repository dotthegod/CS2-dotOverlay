# dotOverlay

CS2 Game State Integration (GSI) overlay + launcher.

## Run (dev)

```bash
npm install
npm start
```

- Launcher GUI starts the server and shows logs.
- Overlay runs at: `http://localhost:3000`

## Kills assets

By default the server looks for assets in a `kills/` folder (ignored by git).

Naming format supported:
- Image: `*_<n>_kill.png` or `*_<n>_kills.png`
- Audio: `*_<n>_kill_audio.mp3` or `*_<n>_kills_audio.mp3`

Example:
- `reaver_1_kill.png`
- `reaver_1_kill_audio.mp3`

## Build (server-only exe)

```bash
npm run build
```

This uses `pkg` and produces a console executable.
