# Air Juggler Student Guide (React + TensorFlow.js)

This project teaches you how to build a webcam-controlled game in React using
TensorFlow.js hand tracking.

Template repository:
https://github.com/cederdorff/webcam-controlled-game

Learning inspiration and theory:
https://www.codedex.io/projects/make-a-webcam-controlled-game-with-tensorflowjs

The goal is both:

- set up the project locally
- understand how webcam + machine learning + game logic work together

## What You Will Build

You will run a game called Air Juggler.

- Your webcam detects your hand positions.
- Falling balls bounce when your hand "paddles" hit them.
- You score points by keeping balls in the air.
- The game ends when lives reach zero.

## 1) Local Setup from the Template Repo

### Create Your Own Copy

1. Open the template:
   https://github.com/cederdorff/webcam-controlled-game
2. Click Use this template.
3. Create a new repository in your own GitHub account.

### Clone and Run

1. Open your new repository on GitHub.
2. Click the green Code button.
3. Choose Open with GitHub Desktop.
4. In GitHub Desktop, choose a local folder and click Clone.
5. In GitHub Desktop, click Open in Visual Studio Code.
6. In VS Code, open a terminal and run:

```bash
npm install
npm run dev
```

Open the local URL shown in terminal (usually http://localhost:5173), then:

1. Click Start game
2. Allow webcam permission
3. Put one or two hands in frame

Important: run on localhost through Vite. Do not open files directly from disk.

## 2) How It Works and What It Uses

This project uses:

- React for UI components and app state
- Vite for local development and build tooling
- TensorFlow.js (loaded from CDN) to run ML in the browser
- MediaPipe Hands model through `@tensorflow-models/hand-pose-detection`
- Browser webcam APIs (`getUserMedia`) for live video
- HTML Canvas for real-time game rendering

How the full app works:

1. The app asks for webcam permission.
2. A detector is initialized in the browser.
3. Each video frame is analyzed to detect hand landmarks.
4. Landmark points are converted to palm center positions.
5. Palm positions are used as game paddles.
6. The game loop updates physics, score, and lives.
7. Canvas is re-rendered with the latest game state.

### Traditional Rules vs Machine Learning

In traditional computer vision, you would hand-code rules like colors, shapes,
and edge logic. That quickly breaks with lighting changes, skin tone variation,
or different camera angles.

In machine learning, a model learns patterns from many examples and predicts
results for new input. Here, the model predicts hand landmarks from webcam
frames.

### Why TensorFlow.js

TensorFlow.js runs ML in the browser:

- no backend required
- webcam data can stay on-device
- easy to combine with React apps

### What MediaPipe Hands Provides

The detector predicts 21 hand landmarks per hand.
This app uses those points to estimate a stable palm center and control game
interactions.

### Frame-by-Frame Pipeline

Every frame does this:

1. Read webcam frame
2. Run hand detection
3. Convert landmarks to palm positions
4. Update game physics and score
5. Draw game state on canvas

## 3) Project Structure and Responsibilities

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

- `handTracking.js`: model setup + hand position utilities
- `game.js`: gameplay state, collisions, rendering
- `useHandTracking.js`: orchestrates camera, detection loop, and game updates
- `TrackingStage.jsx`: video + canvas + game-over HTML overlay
- `ControlPanel.jsx`: score/lives/hands + start/stop/restart controls

## 4) How the Game Logic Works

- You start with 3 lives.
- Balls fall due to gravity.
- Hand positions are treated like circular paddles.
- Ball-hand collisions bounce balls and increase score.
- Ball hits floor => lose 1 life, ball respawns.
- At higher score, more balls spawn.
- When lives are 0, game over.

## 5) Learning Path for Students

Follow this order to understand the project quickly:

1. `App.jsx` to see top-level composition
2. `TrackingStage.jsx` to understand visual layers
3. `useHandTracking.js` to follow runtime flow
4. `handTracking.js` to inspect ML setup
5. `game.js` to inspect game rules and rendering
6. `ControlPanel.jsx` for UI state display

## 6) Small Practice Tasks

Try these one at a time:

1. Change gravity to make the game easier/harder.
2. Increase or reduce hand paddle radius.
3. Add a combo multiplier for consecutive hits.
4. Add a pause button in the control panel.
5. Show an in-game countdown before start.

## 7) Troubleshooting

### Camera blocked

- Allow camera permissions in browser settings
- Ensure no other app is locking the webcam
- Use localhost, not file-opened HTML

### Slow or unstable tracking

- Use better lighting
- Keep hands fully visible
- Move closer to camera
- Close heavy tabs/apps

### Model not loading

- Check internet access (CDN scripts are used)
- Hard refresh browser
- Restart `npm run dev`

## 8) Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## 9) References

- Template repo:
  https://github.com/cederdorff/webcam-controlled-game
- Original explanation guide:
  https://www.codedex.io/projects/make-a-webcam-controlled-game-with-tensorflowjs

Denne guide er skrevet til elever, så den er nem at følge, men stadig grundig
nok til at du forstår hvordan delene hænger sammen.
