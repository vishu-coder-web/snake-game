import './style.css'

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const buttons = Array.from(document.querySelectorAll('.btn'));

let snake = [
  {x: 10, y: 10},
];
const food = {x: 0, y: 0};

let speed = 500;
let deltaX = 10, deltaY = 0;
let gameOver = false;
let score = 0;
let highscore = Number(
    localStorage.getItem("snakeHighScore") || 0
);
let currentDirection = "right";

const actions = {
  up:() => {
    deltaX = 0;
    deltaY = -10;
  },
  down: () => {
    deltaX = 0;
    deltaY = 10;
  },
  right: () => {
    deltaX = 10;
    deltaY = 0;
  },
  left: () => {
    deltaX = -10;
    deltaY = 0;
  }
};

const getOppositeDirection = (direction) => {
  const opposites = {
    "up": "down",
    "right": "left",
    "left": "right",
    "down": "up"
  }

  return opposites[direction];
}

const generateFood = () => {
  const newX = Math.floor(Math.random() * (canvas.width / 10)) * 10;
  const newY = Math.floor(Math.random() * (canvas.height / 10)) * 10;

  food.x = newX;
  food.y = newY;
};

const gameOverFun = () => {
  gameOver = true;
  if (score > highscore){
      highscore = score;
      localStorage.setItem("snakeHighScore", highscore);
    }
}

const isFoodEaten = () => {
  const headX = snake[0].x, headY = snake[0].y;

  if(headX == food.x && headY == food.y){
    generateFood();
    snake.push({
      x: snake[snake.length - 1].x,
      y: snake[snake.length - 1].y
    });
    score++;
  }
};

const render = () => {
  context.clearRect(0, 0, canvas.width, canvas.height)

  // rendering food
  context.fillStyle = "green";
  context.fillRect(food.x, food.y, 10, 10);

  context.fillStyle = "red";

  // drawing snake
  for (const part of snake) {
    context.fillRect(part.x, part.y, 10, 10);
  }

  // rendering score
  context.fillStyle = "white";
  context.fillText(`Score: ${score}, High: ${highscore}`, canvas.width - 100, 20);

  if(gameOver){
    context.font = "14px Arial"
    context.fillStyle = "red";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Try Again!", canvas.width / 2, canvas.height / 2);
  }
};

const update = () => {
  let x = 0, y = 0;

  for (let i = 0; i < snake.length; i++) {
    if(i === 0){
      // if it's head of the snake
      x = snake[i].x;
      y = snake[i].y;

      snake[i].x += deltaX;
      snake[i].y += deltaY;
    }else{
      // if it's body of the snake
      let localX = 0, localY = 0;

      localX = snake[i].x;
      localY = snake[i].y;

      snake[i].x = x;
      snake[i].y = y;

      x = localX;
      y = localY;
    }
  }
};


const checkGameOver = () => {
  const headX = snake[0].x, headY = snake[0].y;
  if(headX < 0 || headY < 0) gameOverFun();

  if(headX >= canvas.width || headY >= canvas.height) gameOverFun();

  // Self-Collision
  for (let i = 1; i < snake.length; i++) {
      if (headX === snake[i].x && headY === snake[i].y) gameOverFun();
  }
};

const reset = () => {
  snake = [
    {x: 10, y: 10}
  ];
  food.x = 50;
  food.y = 50;
  deltaX = 10;
  deltaY = 0;
  gameOver = false;
  score = 0;
};

// adding eventlistners to buttons
for (const button of buttons) {
  button.addEventListener('click', (e) => {
    if(gameOver){
      reset();
      startGameLoop();
      return;
    }

    const newDirection = e.target.dataset.action.toLowerCase();
    const action = actions[newDirection];

    if(action && getOppositeDirection(currentDirection) !== newDirection) {
      action();
      currentDirection = newDirection;
    };
  });
}

document.addEventListener('keydown', (e) => {
  if(gameOver){
    reset();
    startGameLoop();
    return;
  }

  if(e.key.toLowerCase().startsWith("arrow")){
    const newDirection = e.key.toLowerCase().replace("arrow","");
    const action = actions[newDirection];

    if(action && getOppositeDirection(currentDirection) !== newDirection) {
      action();
      currentDirection = newDirection;
    };
  }
});

generateFood();
let gameLoop = null;

function startGameLoop(argument) {
  gameLoop = setInterval(() => {
    checkGameOver();
    isFoodEaten();
    update();
    render();

    if(gameOver){
      render();
      if(gameLoop) clearInterval(gameLoop);
    }
  }, speed);
}

startGameLoop();
