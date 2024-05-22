import { GraphicsEngine } from "M3D";

const SPEED = 0.1;
const LIFE_SIZE = 5;
const FOOD_SIZE = 2;

// import * as THREE from 'three';
// import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

class Vec3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    normalize() {
        const magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        return new Vec3(this.x / magnitude, this.y / magnitude, this.z / magnitude);
    }
}

class LifeForm {
    constructor(engine, size, color) {
        this.size = size;
        this.color = color;
        this.mesh = engine.createSphere(this.size, this.color, getRandomPosition());
        engine.addObject(this.mesh);
    }

    moveTowards(target, speed) {
        const dx = target.mesh.position.x - this.mesh.position.x;
        const dy = target.mesh.position.y - this.mesh.position.y;
        const dz = target.mesh.position.z - this.mesh.position.z;


        const direction = new Vec3(dx, dy, dz).normalize();
        this.mesh.position.x += direction.x * speed;
        this.mesh.position.y += direction.y * speed;
        this.mesh.position.z += direction.z * speed;
    }
}

class Food {
    constructor(engine, size, color) {
        this.size = size;
        this.color = color;
        this.mesh = engine.createSphere(this.size, this.color, getRandomPosition());
        engine.addObject(this.mesh);
    }
}

function getRandomPosition() {
    const x = (Math.random() - 0.5) * 10 - 5;
    const y = (Math.random() - 0.5) * 10 - 5;
    const z = Math.random() * 10 + 2;
    return new Vec3(x, y, z);
}

const engine = new GraphicsEngine();

const lifeForm = new LifeForm(engine, LIFE_SIZE, 0x0000ff);
const food = new Food(engine, FOOD_SIZE, 0x00ff00);

const floor = engine.createPlane(50, 0x051239);
//   const floor = engine.createCheckerFloor(100);
engine.addObject(floor);

const grid = engine.createGrid(50);
engine.addObject(grid);


function animate() {
    requestAnimationFrame(animate);

    lifeForm.moveTowards(food, SPEED);

    if (lifeForm.mesh.position.distanceTo(food.mesh.position) < 0.1) {
        food.mesh.position.copy(getRandomPosition());
    }

    engine.render();
}

animate();