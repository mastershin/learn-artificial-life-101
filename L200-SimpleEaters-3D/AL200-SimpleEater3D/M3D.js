import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

class GraphicsEngine {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            5000,
        );
        this.camera.position.set(5, 5, 20);
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.antialias = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


        document.body.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();

        this.lights = [];
        this.addLights();
    }

    addLights() {
        this.lights[0] = new THREE.DirectionalLight(0xffffff, 1);
        this.lights[0].position.set(5, -5, 5);
        this.lights[0].castShadow = true;
        this.lights[0].shadow.mapSize.width = 4096;
        this.lights[0].shadow.mapSize.height = 4096;
        this.lights[0].shadow.camera.near = 0.5;
        this.lights[0].shadow.camera.far = 500;
        this.lights[0].shadow.camera.left = -500;
        this.lights[0].shadow.camera.right = 500;
        this.lights[0].shadow.camera.top = 500;
        this.lights[0].shadow.camera.bottom = -500;

        this.lights[1] = new THREE.DirectionalLight(0xffffff, 1);
        this.lights[1].position.set(-5, 5, 5);
        this.lights[1].castShadow = true;
        this.lights[1].shadow.mapSize.width = 4096;
        this.lights[1].shadow.mapSize.height = 4096;
        this.lights[1].shadow.camera.near = 0.5;
        this.lights[1].shadow.camera.far = 500;
        this.lights[1].shadow.camera.left = -500;
        this.lights[1].shadow.camera.right = 500;
        this.lights[1].shadow.camera.top = 500;
        this.lights[1].shadow.camera.bottom = -500;

        this.lights[2] = new THREE.AmbientLight(0xc0c0c0);

        /* this.lights[0].position.set(500, 500, 500); */
        this.lights[2].position.set(0, 0, 10);
        this.lights[2].castShadow = true;

        this.scene.add(this.lights[0]);
        // this.scene.add(this.lights[1]);
        this.scene.add(this.lights[2]);
    }

    addObject(object) {
        this.scene.add(object);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    createAxesHelper(size) {
        const axesHelper = new THREE.AxesHelper(size);
        return axesHelper;
    }
    createSphere(size, color, position) {
        const geometry = new THREE.SphereGeometry(size / 2, 32);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 100,
            opacity: 0.5,
        });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.copy(position);

        sphere.castShadow = true; //default is false
        sphere.receiveShadow = false; //default

        return sphere;
    }

    createPlane(size, color) {
        const geometry = new THREE.PlaneGeometry(size, size);
        // geometry.rotateX(-Math.PI / 2);
        const material = new THREE.MeshPhongMaterial({
            color: color,
            side: THREE.DoubleSide,
            opacity: 0.5,
        });
        const plane = new THREE.Mesh(geometry, material);
        plane.receiveShadow = true;
        return plane;
    }

    createGrid(size) {
        const grid = new THREE.GridHelper(size, size);
        grid.rotateX(-Math.PI / 2);
        grid.translateZ(0.1); // move grid up slightly to avoid z-fighting
        // grid.material.opacity = 0.5;
        // grid.material.transparent = true;
        grid.material.depthWrite = false; // disable depth writing to avoid z-fighting
        grid.material.side = THREE.DoubleSide; // render both sides of the grid
        // grid.receiveShadow = true;
        grid.material.color = new THREE.Color(0xCCCCCC);
        return grid;
    }

    createCheckerFloor(size, color) {
        // TODO: buggy, need fixing

        const segments = 10; // Number of segments (10x10)
        const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
        // geometry.rotateX(-Math.PI / 2);

        const colors = [];
        const color1 = new THREE.Color(0xffffff);
        const color2 = new THREE.Color(0x000000);

        for (let i = 0; i <= segments; i++) {
            for (let j = 0; j <= segments; j++) {
                const color = (i + j) % 2 === 0 ? color1 : color2;
                for (let k = 0; k < 6; k++) {
                    colors.push(color.r, color.g, color.b);
                }
            }
        }

        // Add the colors to the geometry
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.MeshBasicMaterial({ vertexColors: true });
        const floor = new THREE.Mesh(geometry, material);
        return floor
    }
}
export { GraphicsEngine };
