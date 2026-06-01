const BALL_COLORS = ["#f95d6a", "#27a0ff", "#ffbe3b", "#65d98f", "#b18cff"];

const BASE_BALL_RADIUS = 18;
const HAND_RADIUS = 54;
const GRAVITY = 1180;
const MAX_BALL_SPEED = 880;
const BALL_BOUNCE = 0.84;
const FLOOR_MARGIN = 8;
const START_LIVES = 3;

export function createGameState(width, height, bestScore = 0) {
  return {
    width,
    height,
    hands: [],
    score: 0,
    best: bestScore,
    lives: START_LIVES,
    over: false,
    balls: [createBall(width, height)],
    spawnThreshold: 12
  };
}

export function updateGame(gameState, deltaSeconds, hands) {
  if (gameState.over) {
    return gameState;
  }

  gameState.hands = hands;

  for (const ball of gameState.balls) {
    stepBall(ball, gameState, deltaSeconds);
  }

  if (gameState.score >= gameState.spawnThreshold && gameState.balls.length < 4) {
    gameState.balls.push(createBall(gameState.width, gameState.height));
    gameState.spawnThreshold += 12;
  }

  if (gameState.lives <= 0) {
    gameState.over = true;
    gameState.best = Math.max(gameState.best, gameState.score);
  }

  return gameState;
}

export function drawGame(context, gameState) {
  context.clearRect(0, 0, gameState.width, gameState.height);

  for (const hand of gameState.hands) {
    drawHandPaddle(context, hand);
  }

  for (const ball of gameState.balls) {
    drawBall(context, ball);
  }
}

function stepBall(ball, gameState, deltaSeconds) {
  ball.cooldown = Math.max(0, ball.cooldown - deltaSeconds);
  ball.vy += GRAVITY * deltaSeconds;

  if (ball.vx > MAX_BALL_SPEED) {
    ball.vx = MAX_BALL_SPEED;
  }

  if (ball.vx < -MAX_BALL_SPEED) {
    ball.vx = -MAX_BALL_SPEED;
  }

  if (ball.vy > MAX_BALL_SPEED) {
    ball.vy = MAX_BALL_SPEED;
  }

  ball.x += ball.vx * deltaSeconds;
  ball.y += ball.vy * deltaSeconds;

  bounceAgainstWalls(ball, gameState.width);
  bounceAgainstHands(ball, gameState);

  const floor = gameState.height - FLOOR_MARGIN;

  if (ball.y + ball.radius >= floor) {
    gameState.lives -= 1;
    respawnBall(ball, gameState.width, gameState.height);
  }
}

function bounceAgainstWalls(ball, width) {
  if (ball.x - ball.radius <= 0) {
    ball.x = ball.radius;
    ball.vx = Math.abs(ball.vx);
  }

  if (ball.x + ball.radius >= width) {
    ball.x = width - ball.radius;
    ball.vx = -Math.abs(ball.vx);
  }
}

function bounceAgainstHands(ball, gameState) {
  if (ball.cooldown > 0) {
    return;
  }

  for (const hand of gameState.hands) {
    const dx = ball.x - hand.x;
    const dy = ball.y - hand.y;
    const distance = Math.hypot(dx, dy);
    const overlap = HAND_RADIUS + ball.radius - distance;

    if (overlap <= 0) {
      continue;
    }

    const nx = distance === 0 ? 0 : dx / distance;
    const ny = distance === 0 ? -1 : dy / distance;

    ball.x += nx * overlap;
    ball.y += ny * overlap;
    ball.vx += nx * 220;
    ball.vy = Math.min(-220, ball.vy * -BALL_BOUNCE - 160);
    ball.cooldown = 0.09;

    gameState.score += 1;
    gameState.best = Math.max(gameState.best, gameState.score);
    break;
  }
}

function respawnBall(ball, width, height) {
  const fresh = createBall(width, height);

  ball.x = fresh.x;
  ball.y = fresh.y;
  ball.vx = fresh.vx;
  ball.vy = fresh.vy;
  ball.color = fresh.color;
  ball.cooldown = 0.4;
}

function createBall(width, height) {
  return {
    x: width * (0.3 + Math.random() * 0.4),
    y: height * 0.2,
    vx: (Math.random() - 0.5) * 190,
    vy: -180 - Math.random() * 120,
    radius: BASE_BALL_RADIUS + Math.random() * 6,
    color: BALL_COLORS[Math.floor(Math.random() * BALL_COLORS.length)],
    cooldown: 0
  };
}

function drawHandPaddle(context, hand) {
  context.beginPath();
  context.arc(hand.x, hand.y, HAND_RADIUS, 0, Math.PI * 2);
  context.fillStyle = "rgba(60, 242, 193, 0.15)";
  context.fill();
  context.lineWidth = 3;
  context.strokeStyle = "rgba(60, 242, 193, 0.85)";
  context.stroke();

  context.beginPath();
  context.arc(hand.x, hand.y, 7, 0, Math.PI * 2);
  context.fillStyle = "#3cf2c1";
  context.fill();
}

function drawBall(context, ball) {
  const gradient = context.createRadialGradient(
    ball.x - ball.radius * 0.35,
    ball.y - ball.radius * 0.4,
    ball.radius * 0.2,
    ball.x,
    ball.y,
    ball.radius
  );

  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, ball.color);

  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.fillStyle = gradient;
  context.fill();
}
