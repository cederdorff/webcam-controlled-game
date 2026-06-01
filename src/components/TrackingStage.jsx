export function TrackingStage({
  canvasRef,
  isGameOver,
  isLoading,
  isRunning,
  onRestartGame,
  onStartGame,
  tracking,
  videoRef
}) {
  return (
    <div className="stage" data-running={isRunning ? "true" : "false"}>
      <video ref={videoRef} className="webcam-feed" playsInline muted />
      <canvas ref={canvasRef} className="landmark-layer" aria-hidden="true" />

      {isGameOver && (
        <div className="game-over-overlay" role="status" aria-live="polite">
          <h2>Game over</h2>
          <p>
            Score {tracking.score} • Best {tracking.best}
          </p>
          <button type="button" onClick={onRestartGame}>
            Restart game
          </button>
        </div>
      )}

      {!isRunning && (
        <div className="start-overlay">
          <button type="button" onClick={onStartGame} disabled={isLoading}>
            {isLoading ? "Loading..." : "Start game"}
          </button>
        </div>
      )}
    </div>
  );
}
