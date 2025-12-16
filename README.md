# dotOverlay for CS2

**dotOverlay** is a highly customizable, feature-rich external overlay for Counter-Strike 2. It uses Valve's Game State Integration (GSI) to display real-time game events with "hype" style feedback, including Street Fighter-style combo counters, MLG hitmarkers, and custom kill banners.

![Overlay Preview](<img width="406" height="341" alt="image" src="https://github.com/user-attachments/assets/3161bdd2-1796-4598-aae4-284834eaf7db" />) *<!-- Replace with actual screenshot -->*

## ✨ Features

- **Street Fighter Combo Counter**: Visual combo streak that updates with every kill in the round.
- **MLG Hitmarker**: Classic "X" hitmarker animation on every kill.
- **Custom Kill Banners & Audio**: Plays specific images and sounds based on your kill count (1 kill, 2 kills, etc.).
- **Bomb Timer**: Visual 40-second countdown timer when the bomb is planted.
- **Health HUD**: Clean, readable status display.
- **Settings Panel**:
  - Toggle individual features (Sounds, Images, Combo, Health, Bomb, Hitmarker).
  - Adjust volume.
  - **Reposition Mode**: Drag and drop HUD elements to customize your layout.
- **GUI Launcher**: Easy-to-use Electron app to manage the server and select asset folders.

## 🚀 Installation

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- Counter-Strike 2

### 2. Setup CS2 Game State Integration
To let the overlay receive data from the game, you must place a config file in your CS2 `cfg` folder.

1.  Navigate to your CS2 cfg folder:
    `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg`
2.  Create a new file named `gamestate_integration_dotoverlay.cfg`.
3.  Paste the following content into it:

```cfg
"dotOverlay"
{
    "uri" "http://127.0.0.1:3000"
    "timeout" "5.0"
    "buffer"  "0.0"
    "throttle" "0.0"
    "heartbeat" "30.0"
    "data"
    {
        "provider"            "1"
        "map"                 "1"
        "round"               "1"
        "player_id"           "1"
        "player_state"        "1"
        "player_match_stats"  "1"
        "bomb"                "1"
    }
}
```

### 3. Install Dependencies
Open a terminal in the project folder and run:
```bash
npm install
```

## 🎮 Usage

### Running the Overlay
1.  Start the launcher:
    ```bash
    npm start
    ```
2.  The **dotOverlay Manager** window will appear.
3.  (Optional) Click **Browse** to select a custom folder containing your kill images/sounds.
4.  Click **Start Server**.
5.  Click **Open Overlay in Browser** (or manually go to `http://localhost:3000`).
6.  Add this URL as a **Browser Source** in OBS for streaming, or keep it open on a second monitor.

### Customizing Assets (Kills Folder)
You can provide your own images and sounds for kills. The server looks for files matching this pattern in your selected `kills` folder:

- **Images**: `*_<number>_kill.png` or `*_<number>_kills.png`
- **Audio**: `*_<number>_kill_audio.mp3` or `*_<number>_kills_audio.mp3`

**Examples:**
- 1 Kill: `reaver_1_kill.png`, `reaver_1_kill_audio.mp3`
- 3 Kills: `mytheme_3_kills.png`, `mytheme_3_kills_audio.mp3`

*Note: The prefix (e.g., "reaver", "mytheme") does not matter; the system matches based on the number and suffix.*

## ⚙️ Configuration & HUD Layout

- **Open Settings**: The settings panel is visible by default. Double-click anywhere on the background to toggle fullscreen (settings hide in fullscreen).
- **Reposition HUD**:
  1.  Open the Settings panel.
  2.  Click the **Reposition** button.
  3.  Drag elements (Health, Combo, Bomb, Kill Banner) to your desired location.
  4.  Click **Save** at the bottom of the screen to persist your layout.

## 📦 Building (Suggested)

To create a standalone executable for the server (console-only version):

```bash
npm run build
```
This generates `dotOverlay.exe`.

## 🛠️ Troubleshooting

- **Overlay not updating?**
  - Ensure the GSI config file is in the correct CS2 folder.
  - Check if the server log in the Manager app shows "New Kill Detected" or "Round changed".
- **Audio not playing?**
  - Browsers block auto-playing audio. Click anywhere on the overlay page once to enable audio context.
  - Check the volume slider in the Settings panel.

## 📄 License
MIT
