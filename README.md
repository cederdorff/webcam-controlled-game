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

### What is TensorFlow.js?

TensorFlow.js is a JavaScript machine learning library that runs directly in the
browser.

In this project, TensorFlow.js is the engine that executes a pre-trained hand
tracking model on each webcam frame.

Why this is useful for students:

- You do not need a backend server for inference.
- You can experiment quickly in frontend code.
- You can build interactive AI features with normal web tools.

Important note: this project does not train a model. It uses a model that is
already trained and focuses on using model output in a real app.

### What is MediaPipe Hands here?

MediaPipe Hands is the hand landmark model used by the project. For each
detected hand, it returns 21 landmark points (x/y positions).

The app does not use all points equally. It computes a stable palm center from a
small landmark subset and uses that center as the paddle position in the game.

How the full app works:

1. The app asks for webcam permission.
2. A detector is initialized in the browser.
3. Each video frame is analyzed to detect hand landmarks.
4. Landmark points are converted to palm center positions.
5. Palm positions are used as game paddles.
6. The game loop updates physics, score, and lives.
7. Canvas is re-rendered with the latest game state.

### Data Flow (End to End)

Think of the app as a pipeline:

1. Input layer: webcam video frames
2. ML layer: detector estimates hand landmarks
3. Transform layer: landmarks are converted to palm coordinates
4. Game layer: coordinates affect collision and score
5. UI layer: status, score, and overlays update in React

This separation is important because it makes the code easier to debug and
extend.

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

### Architecture in Plain Language

- `App.jsx` is the page shell that wires components together.
- `useHandTracking.js` is the runtime brain. It controls start/stop/restart,
  talks to the detector, and triggers game updates each frame.
- `handTracking.js` is ML utility code. It initializes the detector and handles
  landmark-to-position conversion.
- `game.js` is pure game logic. It does not care about React. It only needs
  hand positions and time delta.
- `TrackingStage.jsx` is the visual stage (video + canvas + overlays).
- `ControlPanel.jsx` is the control/readout surface for the player.

This architecture helps students learn a key engineering idea:

- keep ML code, game logic, and UI rendering in separate modules.

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

## 6) How Students Should Use This Project

Use this project as a lab, not just a finished demo.

Recommended workflow:

1. Run the game and confirm baseline behavior.
2. Change one variable only (for example gravity).
3. Test in browser and observe result.
4. Commit that change with a clear message.
5. Repeat with one new change at a time.

What students should focus on learning:

- How ML output can drive interaction in real time.
- How to structure a project into clear modules.
- How frame loops and state updates affect UX.
- How to iterate safely with small testable changes.

Good beginner modifications:

1. Difficulty tuning: gravity, speed, lives.
2. Gameplay variation: spawn timing, scoring rules.
3. UX improvements: overlays, status text, restart flow.
4. Debug views: draw landmark points for learning.
5. Accessibility: clearer labels and larger controls.

## 7) Small Practice Tasks

Try these one at a time:

1. Change gravity to make the game easier/harder.
2. Increase or reduce hand paddle radius.
3. Add a combo multiplier for consecutive hits.
4. Add a pause button in the control panel.
5. Show an in-game countdown before start.

## 8) Troubleshooting

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

## 9) Useful Commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## 10) References

- Template repo:
  https://github.com/cederdorff/webcam-controlled-game
- Original explanation guide:
  https://www.codedex.io/projects/make-a-webcam-controlled-game-with-tensorflowjs
