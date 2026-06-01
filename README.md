# Air Juggler (React + TensorFlow.js)

This project is a React implementation of the Codédex webcam game guide.
You control the game with your hands in front of your webcam.

The app uses:

- TensorFlow.js in the browser
- MediaPipe Hands via TensorFlow hand-pose detection
- React hooks and components for UI + game state

If you want the short version: start the game, hold one or two hands in frame,
and juggle the falling orbs so they do not hit the floor.

## What This React Version Includes

- A React game loop rendered on canvas
- Webcam access via getUserMedia
- Hand landmark detection with TensorFlow.js + MediaPipe runtime
- Palm-center conversion to simple x/y positions
- Collision-based gameplay, score, lives, and best score

## Quick Start

1. Install dependencies.

```bash
npm install
```

2. Start dev server.

```bash
npm run dev
```

3. Open the local URL printed in terminal (usually http://localhost:5173).

4. Click Start game and allow webcam access.

## React Project Structure

```text
src/
  App.jsx
  App.css
  index.css
  main.jsx
  game.js
  handTracking.js
  hooks/
    useHandTracking.js
  components/
    TrackingStage.jsx
    ControlPanel.jsx
    StatusPill.jsx
```

## How It Maps to the Original Guide (React Edition)

### Step 1: TensorFlow.js Libraries

In the non-React guide, scripts are added to index.html.
In this React version, the same scripts are added to index.html and React handles
the app structure around them.

Main imports live in src/handTracking.js:

- window.tf
- window.handPoseDetection

### Step 2: Loading State

The hook src/hooks/useHandTracking.js manages a loading mode.

The status pill shows states like:

- Loading TensorFlow.js
- Show your hands
- Hands detected
- Game over

### Step 3: Webcam Access

The hook requests webcam stream with:

```js
navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
```

It assigns stream to the video element and starts playback.

### Step 4: Load MediaPipe Hands Model

Detector setup is in src/handTracking.js using:

- Supported model: MediaPipeHands
- runtime: mediapipe
- solutionPath: jsDelivr MediaPipe Hands CDN
- maxHands: 2
- modelType: full

### Step 5: Real-Time Detection

Each frame in the hook:

1. Reads current video frame
2. Runs detector.estimateHands(video)
3. Converts landmarks to palm centers
4. Updates game physics
5. Draws to canvas

### Step 6: Landmark to Coordinates

The guide uses wrist + MCP bases to approximate palm center.
This project does the same with indices 0, 5, 9, 13, 17 and mirrors x so controls
feel natural in selfie mode.

### Step 7: Integrate with Game Loop

React integration split is:

- src/handTracking.js for ML and coordinate utilities
- src/game.js for gameplay update and rendering
- src/hooks/useHandTracking.js for orchestration
- src/components/\* for UI

## Gameplay Rules (This Version)

- You start with 3 lives.
- Balls fall with gravity.
- Touch balls with hand paddles to bounce them upward.
- Each successful bounce gives 1 point.
- If a ball hits the floor, you lose 1 life and that ball respawns.
- More balls spawn as score increases.
- Game ends at 0 lives.

## Core Files Explained

### src/handTracking.js

- Initializes TensorFlow backend
- Creates MediaPipe detector
- Estimates hands per frame
- Converts landmarks into palm-center positions

### src/game.js

- Creates game state
- Updates ball physics and collisions
- Draws hands and balls on canvas

### src/hooks/useHandTracking.js

- Requests camera access
- Controls start/stop/restart flow
- Runs the per-frame detection + game update loop
- Stores best score in localStorage

### src/components/TrackingStage.jsx

- Renders video and canvas layers
- Renders the HTML game-over overlay
- Shows start overlay button when game is not running

### src/components/ControlPanel.jsx

- Displays Score, Best, Lives, Hands
- Provides Start/Stop/Restart action button

## Troubleshooting

### Camera blocked

If you see Camera blocked:

- Allow camera permissions in your browser
- Make sure you are on localhost (not opening files directly)
- Close apps that lock the webcam

### Slow detection

- Close heavy browser tabs
- Use better lighting
- Keep hands centered and fully visible

### No hands detected

- Move closer to camera
- Keep your palm open for initial detection
- Reduce strong backlight from windows

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Credits

This project is inspired by the Codédex tutorial:
Make a Webcam Controlled Game with TensorFlow.js.

This repository version translates that guide into a React component + hook
architecture, så du kan bygge videre med et moderne React setup.
