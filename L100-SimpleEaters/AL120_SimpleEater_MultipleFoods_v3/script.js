/*
v3 has some improvements over v2:
- UI control for eater's speed
- UI control for food regeneration rate
- UI control for food eating time
- multiple foods

Based on simple math, move toward the food.
This works precisely because the eater knows where the food is.
The eater does not have a vision.

@author: Jae Shin - mastershin at gmail dot com
@source: github.com/mastershin/learn-artificial-life-101
@deployed: https://replit.com/@mastershin1/AL120SimpleEaterMultipleFoodsv3
*/

// Initialize Kaboom
kaboom({
  width: 800, // Set a specific width
  height: 600, // Set a specific height
  scale: 1,
  clearColor: [0, 0, 0, 1],
  debug: true,
  global: true,
  canvas: document.querySelector("#game"),

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
const FOOD_SIZE = 20
const LIFE_RADIUS = 30
const HEAD_RADIUS = 10
const MARGIN = 100  // display margin
const MAX_FOOD = 1000

// Get references to the input elements
const speedInput = document.getElementById('speed')
const foodRegenRateInput = document.getElementById('foodRegenRate')
const speedValueDisplay = document.getElementById('speedValue')
const foodRegenRateValueDisplay = document.getElementById('foodRegenRateValue')
const foodEatingTimeInput = document.getElementById('foodEatingTime')
const foodEatingTimeValueDisplay = document.getElementById('foodEatingTimeValue')


// Initialize variables with default values
let SPEED = parseInt(speedInput.value)
let foodRegenRate = parseFloat(foodRegenRateInput.value)
let foodEatingTime = parseInt(foodEatingTimeInput.value)

// Update the display values
speedValueDisplay.textContent = SPEED
foodRegenRateValueDisplay.textContent = foodRegenRate
foodEatingTimeValueDisplay.textContent = foodEatingTime

// Add event listeners to update variables when inputs change
speedInput.addEventListener('input', () => {
  SPEED = parseInt(speedInput.value)
  speedValueDisplay.textContent = SPEED
})

foodRegenRateInput.addEventListener('input', () => {
  foodRegenRate = parseFloat(foodRegenRateInput.value)
  foodRegenRateValueDisplay.textContent = foodRegenRate
  resetFoodRegenLoop()
})

foodEatingTimeInput.addEventListener('input', () => {
  foodEatingTime = parseInt(foodEatingTimeInput.value)
  foodEatingTimeValueDisplay.textContent = foodEatingTime
})

// Function to get a random position within the game boundaries
function getRandomPosition(radius) {
  const x = rand(MARGIN, width() - radius * 2 - MARGIN)
  const y = rand(MARGIN, height() - radius * 2 - MARGIN)
  return vec2(x, y)
}

// Food class
class Food {
  constructor(position) {
    this.pos = position || getRandomPosition(FOOD_SIZE / 2)
    this.level = 255
    this.entity = add([
      circle(FOOD_SIZE / 2),
      pos(this.pos),
      color(0, 255, 0),
      "food",
    ])
  }

  reset() {
  }

  updateColor() {
    this.entity.color.g = this.level
  }
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

// Array to hold food objects
let foods = []

// Function to get the closest food
function getClosestFood() {
  return foods.reduce((closest, food) => {
    return life.pos.dist(food.pos) < life.pos.dist(closest.pos) ? food : closest
  })
}

function isDistanceCloseEnough(food) {
  return life.pos.dist(food.pos) < 5
}

// Function to move life form towards the closest food
function moveTowardsFood() {
  if (foods.length === 0) return

  const closestFood = getClosestFood()
  const direction = closestFood.pos.sub(life.pos).unit()

  if (isDistanceCloseEnough(closestFood)) return

  life.move(direction.scale(SPEED))

  const headOffset = direction.scale(LIFE_RADIUS)
  head.pos = life.pos.add(headOffset)
}

function removeDepletedFood() {
  foods = foods.filter(food => {
    if (food.level <= foodEatingTime) {
      destroy(food.entity)
      return false
    }
    return true
  })
}

// Main loop
onUpdate(() => {
  moveTowardsFood()

  foods.forEach(food => {
    if (isDistanceCloseEnough(food)) {
      food.level -= 5
      food.updateColor()
    }
  })

  removeDepletedFood()

  // Update body position
  body.pos = life.pos
})

// Function to add food at mouse click position
onClick(() => {
  foods.push(new Food(mousePos()))
});

let foodRegenLoop = null
// Function to reset the food regeneration loop with the new rate
function resetFoodRegenLoop() {
  if (foodRegenLoop) {
    foodRegenLoop.cancel()
  }
  foodRegenLoop = loop(foodRegenRate, () => {
    if (foods.length < MAX_FOOD) {
      foods.push(new Food())
    }
  })
}

resetFoodRegenLoop()