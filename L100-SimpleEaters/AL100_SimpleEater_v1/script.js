/*
Based on simple math, move toward the food.
This works precisely because the eater knows where the food is.
The eater does not have a vision.

import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

@author: github.com/mastershin
@deployed: https://replit.com/@mastershin1/AL100SimpleEaterKaboomv1
*/

// Initialize Kaboom
kaboom({
    // width: 640,
    // height: 480,
    scale: 1,
    clearColor: [0, 0, 0, 1],
  })

  add([
    text("Artificial Life: Simple Eater v1", { size: 18 }),
    pos(10, 10),
  ]);
  
  add([
    text("github.com/mastershin/learn-artificial-life-101", { size: 12 }),
    color(0, 0, 0),
    pos(10, 30),
  ]);

  // Define constants
  const SPEED = 500
  const FOOD_SIZE = 16
  const LIFE_SIZE = 32
  
  // Function to get a random position within the game boundaries
  function getRandomPosition() {
    const center_x = width() / 2
    const center_y = height() / 2
    const x = rand(center_x - width() / 4, center_x + width() / 4)
    const y = rand(center_y - height() / 4, center_y + height() / 4)
  
    return vec2(x, y)
  }
  
  // Create the life form
  const life = add([
    circle(LIFE_SIZE, LIFE_SIZE),
    pos(getRandomPosition()),
    color(0, 0, 255),
    "life",
  ])
  
  // Create food
  let food = add([
    circle(FOOD_SIZE, FOOD_SIZE),
    pos(getRandomPosition()),
    color(0, 255, 0),
    "food",
  ])
  
  // Function to move life form towards the food
  function moveTowardsFood() {
    const lifePos = life.pos
    const foodPos = food.pos
  
    const direction = foodPos.sub(lifePos).unit()
    life.move(direction.scale(SPEED))
  }
  
  // Main game loop
  onUpdate(() => {
    moveTowardsFood()
  
    // Check for collision with food
    if (life.pos.dist(food.pos) < 2) {
      // Move the food to a new random position
      food.pos = getRandomPosition()
    }
  })
  