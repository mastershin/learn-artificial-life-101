// @date: 2024-05-22
// @author: Jae Y Shin, github.com/mastershin

import { GraphicsEngine } from "M3D";
import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

const container = document.getElementById('threejs-container');

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// document.body.appendChild(renderer.domElement);

container.appendChild(renderer.domElement);

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(50, 50, 100);
controls.update();

// UI controls
const speedInput = document.getElementById('speed');
const gridSizeInput = document.getElementById('gridSize');
const cellSizeInput = document.getElementById('cellSize');
const resetButton = document.getElementById('reset');

let gridSize = parseInt(gridSizeInput.value);
let cellSize = parseFloat(cellSizeInput.value);
let speed = parseInt(speedInput.value);
let grid = [];
let nextGrid = [];
let frameCount = 0; // Frame counter
const cellPool = [];
const animationDuration = 500; // in milliseconds
let lastUpdateTime = 0;

// Initialize the grid with random values
function initializeGrid() {
    grid = [];
    nextGrid = [];
    for (let x = 0; x < gridSize; x++) {
        grid[x] = [];
        nextGrid[x] = [];
        for (let y = 0; y < gridSize; y++) {
            grid[x][y] = [];
            nextGrid[x][y] = [];
            for (let z = 0; z < gridSize; z++) {
                const value = Math.random() > 0.85 ? 1 : 0;
                grid[x][y][z] = value;
                nextGrid[x][y][z] = value;
            }
        }
    }
}

// Create a group to hold the cell meshes
const cellGroup = new THREE.Group();
scene.add(cellGroup);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(50, 50, 50);
scene.add(pointLight);

// Function to create a cell mesh
function createCell(x, y, z, color) {
    const geometry = new THREE.BoxGeometry(cellSize, cellSize, cellSize);
    const material = new THREE.MeshStandardMaterial({ color: color });
    const cell = new THREE.Mesh(geometry, material);
    cell.position.set(x * cellSize, y * cellSize, z * cellSize);
    return cell;
}

// Function to get a cell from the pool or create a new one
function getCell(x, y, z, color) {
    let cell;
    if (cellPool.length > 0) {
        cell = cellPool.pop();
        animateCell(cell, { x: x * cellSize, y: y * cellSize, z: z * cellSize }, color);
    } else {
        cell = createCell(x, y, z, color);
    }
    return cell;
}

// Function to animate cell position and color
function animateCell(cell, targetPosition, color) {
    const startPosition = { ...cell.position };
    const startColor = new THREE.Color(cell.material.color.getHex());
    const endColor = new THREE.Color(color);
    const startTime = performance.now();

    function update() {
        const elapsed = performance.now() - startTime;
        const t = Math.min(elapsed / animationDuration, 1);

        cell.position.lerpVectors(startPosition, targetPosition, t);
        cell.material.color.lerpColors(startColor, endColor, t);

        if (t < 1) {
            requestAnimationFrame(update);
        }
    }

    update();
}

// Function to recycle a cell
function recycleCell(cell) {
    cell.visible = false;
    cellPool.push(cell);
}

// Function to update the cell group
function updateCellGroup() {
    for (let i = cellGroup.children.length - 1; i >= 0; i--) {
        recycleCell(cellGroup.children[i]);
    }

    /*
    // slower method (for-loop)
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                if (grid[x][y][z] === 1) {
                    const color = new THREE.Color(`hsl(${(x / gridSize) * 360}, 100%, 50%)`);
                    const cell = getCell(x - gridSize / 2, y - gridSize / 2, z - gridSize / 2, color.getHex());
                    cell.visible = true;
                    cellGroup.add(cell);
                }
            }
        }
    }
    */

    // parallel method (Promise.all)

    // Define a function to process a single cell
    const processCell = (x, y, z) => {
        if (grid[x][y][z] === 1) {
            const color = new THREE.Color(`hsl(${(x / gridSize) * 360}, 100%, 50%)`);
            const cell = getCell(x - gridSize / 2, y - gridSize / 2, z - gridSize / 2, color.getHex());
            cell.visible = true;
            cellGroup.add(cell);
        }
    };

    // Create an array of cell coordinates
    const cellCoords = [];
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                cellCoords.push([x, y, z]);
            }
        }
    }

    // Use map to process each cell in parallel
    Promise.all(cellCoords.map(([x, y, z]) => {
        return new Promise(resolve => {
            processCell(x, y, z);
            resolve();
        });
    })).then(() => {
        // All cells have been processed
        console.log('All cells processed!');
    });

}

// Function to count live neighbors
function countNeighbors(x, y, z) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {
                if (i === 0 && j === 0 && k === 0) continue;
                const nx = x + i;
                const ny = y + j;
                const nz = z + k;
                if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize && nz >= 0 && nz < gridSize) {
                    count += grid[nx][ny][nz];
                }
            }
        }
    }
    return count;
}


// Function to update the grid based on Game of Life rules
function updateGrid() {
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            for (let z = 0; z < gridSize; z++) {
                const liveNeighbors = countNeighbors(x, y, z);
                if (grid[x][y][z] === 1) {
                    if (liveNeighbors < 2 || liveNeighbors > 4) {
                        nextGrid[x][y][z] = 0; // Cell dies
                    } else {
                        nextGrid[x][y][z] = 1; // Cell lives
                    }
                } else {
                    if (liveNeighbors === 3) {
                        nextGrid[x][y][z] = 1; // Cell becomes alive
                    } else {
                        nextGrid[x][y][z] = 0; // Cell stays dead
                    }
                }
            }
        }
    }

    // Swap grids
    let temp = grid;
    grid = nextGrid;
    nextGrid = temp;
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const currentTime = performance.now();
    if (currentTime - lastUpdateTime >= speed * 10) {
        lastUpdateTime = currentTime;
        updateGrid();
        updateCellGroup();
    }

    controls.update();
    renderer.render(scene, camera);
}

// Initialize and start the animation
initializeGrid();
updateCellGroup();
animate();

// UI event listeners
speedInput.addEventListener('input', () => {
    speed = parseInt(speedInput.value);
});

gridSizeInput.addEventListener('input', () => {
    gridSize = parseInt(gridSizeInput.value);
    initializeGrid();
    updateCellGroup();
});

cellSizeInput.addEventListener('input', () => {
    cellSize = parseFloat(cellSizeInput.value);
    updateCellGroup();
});

resetButton.addEventListener('click', () => {
    initializeGrid();
    updateCellGroup();
});