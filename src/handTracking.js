const PALM_INDICES = [0, 5, 9, 13, 17];

export const READY_STATUS = {
  mode: "idle",
  label: "Ready to play",
  score: 0,
  best: 0,
  lives: 3,
  hands: 0
};

export async function createHandDetector() {
  const tf = window.tf;
  const handPoseDetection = window.handPoseDetection;

  if (!tf || !handPoseDetection) {
    throw new Error("TensorFlow.js libraries are not loaded");
  }

  await tf.setBackend("webgl");
  await tf.ready();

  const model = handPoseDetection.SupportedModels.MediaPipeHands;

  return handPoseDetection.createDetector(model, {
    runtime: "mediapipe",
    solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
    modelType: "full",
    maxHands: 2
  });
}

export async function estimateHands(detector, video) {
  return detector.estimateHands(video);
}

export function getPalmPositions(hands, frameWidth) {
  return hands.map((hand) => {
    const palm = PALM_INDICES.map((index) => hand.keypoints[index]);
    const avgX = palm.reduce((sum, keypoint) => sum + keypoint.x, 0) / palm.length;
    const avgY = palm.reduce((sum, keypoint) => sum + keypoint.y, 0) / palm.length;

    return {
      // Mirror horizontally to match the selfie camera preview.
      x: frameWidth - avgX,
      y: avgY,
      handedness: hand.handedness || "Unknown",
      score: hand.score || 0
    };
  });
}

export function resizeCanvasToVideo(canvas, video) {
  const width = video.videoWidth || 640;
  const height = video.videoHeight || 480;

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
}

export function clearCanvas(canvas) {
  const context = canvas?.getContext("2d");

  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
}
