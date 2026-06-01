export function ControlPanel({ isGameOver, isLoading, isRunning, onRestartGame, onStartGame, onStopGame, tracking }) {
  return (
    <aside className="control-panel">
      <Metric label="Score" value={tracking.score} />
      <Metric label="Best" value={tracking.best} />
      <Metric label="Lives" value={tracking.lives} />
      <Metric label="Hands" value={tracking.hands} />

      <button
        type="button"
        className="camera-button"
        onClick={getActionHandler({ isGameOver, isRunning, onRestartGame, onStartGame, onStopGame })}
        disabled={isLoading}
      >
        {getCameraButtonLabel({ isGameOver, isLoading, isRunning })}
      </button>
    </aside>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function getActionHandler({ isGameOver, isRunning, onRestartGame, onStartGame, onStopGame }) {
  if (isGameOver) {
    return onRestartGame;
  }

  if (isRunning) {
    return onStopGame;
  }

  return onStartGame;
}

function getCameraButtonLabel({ isGameOver, isLoading, isRunning }) {
  if (isLoading) {
    return "Loading...";
  }

  if (isGameOver) {
    return "Restart game";
  }

  if (isRunning) {
    return "Stop game";
  }

  return "Start game";
}
