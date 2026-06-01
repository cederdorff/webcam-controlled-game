import { ControlPanel } from "./components/ControlPanel";
import { StatusPill } from "./components/StatusPill";
import { TrackingStage } from "./components/TrackingStage";
import { useHandTracking } from "./hooks/useHandTracking";
import "./App.css";

function App() {
  const { canvasRef, isGameOver, isLoading, isRunning, restartGame, startGame, stopGame, tracking, videoRef } =
    useHandTracking();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">TensorFlow.js + React</p>
          <h1>Air Juggler</h1>
        </div>
        <StatusPill mode={tracking.mode} label={tracking.label} />
      </header>

      <section className="workspace" aria-label="Hand controlled object">
        <TrackingStage
          canvasRef={canvasRef}
          isGameOver={isGameOver}
          isLoading={isLoading}
          isRunning={isRunning}
          onRestartGame={restartGame}
          onStartGame={startGame}
          tracking={tracking}
          videoRef={videoRef}
        />

        <ControlPanel
          isGameOver={isGameOver}
          isLoading={isLoading}
          isRunning={isRunning}
          onRestartGame={restartGame}
          onStartGame={startGame}
          onStopGame={stopGame}
          tracking={tracking}
        />
      </section>
    </main>
  );
}

export default App;
