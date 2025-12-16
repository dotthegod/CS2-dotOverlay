# dotOverlay for CS2

**dotOverlay** is a highly customizable, feature-rich external overlay for Counter-Strike 2. It uses Valve's Game State Integration (GSI) to display real-time game events with "hype" style feedback, including Street Fighter-style combo counters, MLG hitmarkers, and custom kill banners.

<img width="406" height="341" alt="image" src="https://github.com/user-attachments/assets/769b84e4-95b7-4120-94b6-089fa5fd735a" />

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

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- Counter-Strike 2

### Setup CS2 Game State Integration
To let the overlay receive data from the game, you must place a config file in your CS2 `cfg` folder.

1.  Navigate to your CS2 cfg folder:
    `C:\Program Files (x86)\Steam\steamapps\common\Counter-Strike Global Offensive\game\csgo\cfg`
2.  Create a new file named `gamestate_integration_custom.cfg`.
3.  Paste the following content into it:

```cfg
"MyCustomIntegration"
{
    "uri"           "http://127.0.0.1:3000"
    "timeout"       "5.0"
    "buffer"        "0.0"
    "throttle"      "0.0"
    "heartbeat"     "10.0"
    "data"
    {
        "provider"            "1"
        "map"                 "1"
        "round"               "1"
        "player_id"           "1"
        "player_state"        "1"
        "player_weapons"      "1"
        "player_match_stats"  "1"
        "bomb"                "1"
        "phase_countdowns"    "1"
    }
}
```

## 🎮 Usage

### Running the Overlay

1.  Start the launcher via this command or just open the dotOverlay_1_0.exe
    ```bash
    npm start
    ```
2.  The **dotOverlay Manager** window will appear.
3.  (Optional) Click **Browse** to select a custom folder containing your kill images/sounds.
4.  Click **Start Server**.
5.  Open your game (you can't use fullscreen windowed)
6.  Open Shift+Tab menu and open web browser
   <img width="892" height="62" alt="image" src="https://github.com/user-attachments/assets/aa04160e-64e5-4130-bf01-63e48dcd837a" />
   
7.  Go to `http://localhost:3000/` in the web browser.
8.  If you done everything correctly you should be in this page.
   <img width="1031" height="813" alt="image" src="https://github.com/user-attachments/assets/c6cb90dd-d7dc-403e-bba5-60878e0c121f" />
   
9.  Pin the browser using the button on the top right.
10. Double click anywhere to fullscreen it.
11. Press Esc or Shift+Tab again to close the Steam layout. (This should remove the icons on the top) (❗❗ DO NOT SKIP THIS ONE OR IT WON'T WORK CORRECTLY ❗❗)
12. Alt+Tab twice to re-open the CS2
13. It should work now

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/7e6ed381-0e5e-4938-a15c-611487cfef48" />



### Customizing Assets (Kills Folder)
You can provide your own images and sounds for kills. The server looks for files matching this pattern in your selected `kills` folder:

- **Images**: `*_<number>_kill.png` or `*_<number>_kills.png`
- **Audio**: `*_<number>_kill_audio.mp3` or `*_<number>_kills_audio.mp3`

**Examples:**
- 1 Kill: `reaver_1_kill.png`, `reaver_1_kill_audio.mp3`
- 3 Kills: `mytheme_3_kills.png`, `mytheme_3_kills_audio.mp3`

*Note: The prefix (e.g., "reaver", "mytheme") does not matter; the system matches based on the number and suffix.*

### Setting up killbanners

After running the script this GUI will appear.

<img width="781" height="587" alt="image" src="https://github.com/user-attachments/assets/3eab6141-bb74-435c-a6f2-d0664143778c" />

In this GUI you should input your killbanner folder to `Kills Asset Folder` section.

I suggest you to use [Valorant killbanners from this website](https://kingdomarchives.com/killbanners).

Your killbanner folder should look like this:
<img width="192" height="264" alt="image" src="https://github.com/user-attachments/assets/8a5f9e00-e16c-43f2-a01d-5ead860a5b0b" />



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
