import { useEffect, useRef, useState } from "react";
import {
  READY_STATUS,
  clearCanvas,
  createHandDetector,
  estimateHands,
  getPalmPositions,
  resizeCanvasToVideo
} from "../handTracking";
import { createGameState, drawGame, updateGame } from "../game";

export function useHandTracking() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectorRef = useRef(null);
  const streamRef = useRef(null);
  const gameRef = useRef(null);
  const animationRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const runningRef = useRef(false);

  const [isRunning, setIsRunning] = useState(false);
  const [tracking, setTracking] = useState(READY_STATUS);

  function stopGame() {
    runningRef.current = false;
    cancelAnimationFrame(animationRef.current);
    animationRef.current = 0;
    lastFrameTimeRef.current = 0;

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    const video = videoRef.current;

    if (video) {
      video.srcObject = null;
    }

    clearCanvas(canvasRef.current);

    const best = Math.max(tracking.best, gameRef.current?.best || 0);

    setIsRunning(false);
    setTracking((current) => ({
      ...READY_STATUS,
      best,
      label: "Ready to play",
      mode: "idle",
      score: current.score
    }));
  }

  async function runFrame(frameTime) {
    if (!runningRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const detector = detectorRef.current;

    if (!video || !canvas || !detector) {
      animationRef.current = requestAnimationFrame(runFrame);
      return;
    }

    resizeCanvasToVideo(canvas, video);

    if (!gameRef.current) {
      gameRef.current = createGameState(canvas.width, canvas.height, tracking.best);
    }

    const deltaSeconds = getDelta(frameTime, lastFrameTimeRef.current);
    lastFrameTimeRef.current = frameTime;

    try {
      const hands = await estimateHands(detector, video);
      const palmPositions = getPalmPositions(hands, canvas.width);
      const game = updateGame(gameRef.current, deltaSeconds, palmPositions);
      const context = canvas.getContext("2d");

      if (context) {
        drawGame(context, game);
      }

      setTracking({
        mode: game.over ? "error" : palmPositions.length > 0 ? "tracking" : "searching",
        label: game.over ? "Game over" : palmPositions.length > 0 ? "Hands detected" : "Show your hands",
        score: game.score,
        best: game.best,
        lives: game.lives,
        hands: palmPositions.length
      });

      if (game.over) {
        runningRef.current = false;
      }
    } catch (error) {
      console.error(error);
      runningRef.current = false;
      setTracking((current) => ({
        ...current,
        mode: "error",
        label: "Tracking failed"
      }));
    }

    if (runningRef.current) {
      animationRef.current = requestAnimationFrame(runFrame);
    }
  }

  async function startGame() {
    if (isRunning || tracking.mode === "loading") {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setTracking((current) => ({
        ...current,
        mode: "error",
        label: "Camera unavailable"
      }));
      return;
    }

    setTracking((current) => ({
      ...current,
      mode: "loading",
      label: "Loading TensorFlow.js"
    }));

    try {
      if (!detectorRef.current) {
        detectorRef.current = await createHandDetector();
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 }
      });

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        throw new Error("Missing video element");
      }

      video.srcObject = stream;
      await video.play();

      const bestScore = Number(window.localStorage.getItem("air-juggler-best")) || tracking.best;

      gameRef.current = createGameState(video.videoWidth || 640, video.videoHeight || 480, bestScore);
      lastFrameTimeRef.current = 0;
      runningRef.current = true;
      setIsRunning(true);
      setTracking({
        mode: "searching",
        label: "Show your hands",
        score: 0,
        best: bestScore,
        lives: 3,
        hands: 0
      });
      animationRef.current = requestAnimationFrame(runFrame);
    } catch (error) {
      console.error(error);
      stopGame();
      setTracking((current) => ({
        ...current,
        mode: "error",
        label: getCameraErrorLabel(error)
      }));
    }
  }

  function restartGame() {
    if (!isRunning) {
      startGame();
      return;
    }

    if (!canvasRef.current) {
      return;
    }

    gameRef.current = createGameState(canvasRef.current.width || 640, canvasRef.current.height || 480, tracking.best);

    runningRef.current = true;
    setTracking((current) => ({
      ...current,
      mode: "searching",
      label: "Show your hands",
      score: 0,
      lives: 3,
      hands: 0
    }));

    cancelAnimationFrame(animationRef.current);
    animationRef.current = requestAnimationFrame(runFrame);
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animationRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      detectorRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!tracking.best) {
      return;
    }

    window.localStorage.setItem("air-juggler-best", String(tracking.best));
  }, [tracking.best]);

  return {
    canvasRef,
    isGameOver: tracking.mode === "error" && tracking.label === "Game over",
    isLoading: tracking.mode === "loading",
    isRunning,
    restartGame,
    startGame,
    stopGame,
    tracking,
    videoRef
  };
}

function getDelta(frameTime, lastFrameTime) {
  if (!lastFrameTime) {
    return 1 / 60;
  }

  const raw = (frameTime - lastFrameTime) / 1000;
  return Math.min(Math.max(raw, 1 / 144), 1 / 20);
}

function getCameraErrorLabel(error) {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "Camera blocked";
  }

  return "Unable to start camera";
}
