/*
v2 has some improvements over v1:
- has an eye toward the food (but not actual vision yet)
- introduce delay when eating

Based on simple math, move toward the food.
This works precisely because the eater knows where the food is.
The eater does not have a vision.

@author: Jae Shin - mastershin at gmail dot com
@source: github.com/mastershin/learn-artificial-life-101
@deployed: https://replit.com/@mastershin1/AL110SimpleEaterWithEyev2
*/

// Initialize Kaboom
kaboom({
  // width: 640,
  // height: 480,
  scale: 1,
  clearColor: [0, 0, 0, 1],
})

add([
  text("Artificial Life: Simple Eater with an eye v2", { size: 18 }),
  pos(10, 10),
]);

add([
  text("github.com/mastershin/learn-artificial-life-101", { size: 12 }),
  color(0, 0, 0),
  pos(10, 30),
]);

// Define constants
const SPEED = 500
const FOOD_SIZE = 20
const LIFE_RADIUS = 30
const HEAD_RADIUS = 10
const MARGIN = 100

// Function to get a random position within the game boundaries
function getRandomPosition(radius) {
  const x = rand(MARGIN, width() - radius * 2 - MARGIN)
  const y = rand(MARGIN, height() - radius * 2 - MARGIN)
  return vec2(x, y)
}

// Create the life form with a head and body
const life = add([
  pos(getRandomPosition(LIFE_RADIUS)),
  "life",
])

const body = add([
  circle(LIFE_RADIUS),
  pos(life.pos),
  color(0, 0, 255),
  "body",
])

const head = add([
  circle(HEAD_RADIUS),
  pos(life.pos.add(vec2(LIFE_RADIUS, 0))),
  color(255, 0, 0),
  "head",
])

// Create food
let food = add([
  circle(FOOD_SIZE / 2),
  pos(getRandomPosition(FOOD_SIZE / 2)),
  color(0, 255, 0),
  "food",
])

const DEFAULT_FOOD_LEVEL = 255
let food_level = DEFAULT_FOOD_LEVEL

function isDistanceCloseEnough() {
  return life.pos.dist(food.pos) < 5
}
// Function to move life form towards the food
function moveTowardsFood() {
  const lifePos = life.pos
  const foodPos = food.pos
  const direction = foodPos.sub(lifePos).unit()
  // const angle = direction.angle()

  // if close enough, skip moving, otherwise it will jitter
  if (isDistanceCloseEnough())
    return

  // Move life form toward the food
  life.move(direction.scale(SPEED))

  const headOffset = direction
  headOffset.x *= LIFE_RADIUS
  headOffset.y *= LIFE_RADIUS
  head.pos = life.pos.add(headOffset)
}

// Main loop
onUpdate(() => {
  moveTowardsFood()

  // Check for collision with food
  if (isDistanceCloseEnough()) {
    // Move the food to a new random position
    food_level--
    if (food_level <= 100) {
      food_level = DEFAULT_FOOD_LEVEL
      food.pos = getRandomPosition(FOOD_SIZE / 2)
    }
  }

  // change green color intensity
  food.color.g = food_level

  // Update body position
  body.pos = life.pos
})
