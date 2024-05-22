import * as THREE from "three";
import { OrbitControls } from "OrbitControls";

class GraphicsEngine {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000,
    );
    this.camera.position.set(200, 300, 300);
    this.camera.up.set(0, 0, 1);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 0, 0);
    this.controls.update();

    this.lights = [];
    this.addLights();
  }

  addLights() {
    this.lights[0] = new THREE.DirectionalLight(0x808080, 2);
    this.lights[0].castShadow = true;
    this.lights[0].shadow.mapSize.width = 2048;
    this.lights[0].shadow.mapSize.height = 2048;
    this.lights[0].shadow.camera.near = 0.5;
    this.lights[0].shadow.camera.far = 5000;

    this.lights[1] = new THREE.DirectionalLight(0x808080, 2);
    this.lights[1].castShadow = true;
    this.lights[1].shadow.mapSize.width = 2048;
    this.lights[1].shadow.mapSize.height = 2048;
    this.lights[1].shadow.camera.near = 0.5;
    this.lights[1].shadow.camera.far = 5000;

    this.lights[2] = new THREE.AmbientLight(0x505050);

    this.lights[0].position.set(500, 500, 500);
    this.lights[1].position.set(-200, -200, 500);
    this.lights[2].position.set(0, 0, -100);

    this.scene.add(this.lights[0]);
    this.scene.add(this.lights[1]);
    this.scene.add(this.lights[2]);
  }

  addObject(object) {
    this.scene.add(object);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  createSphere(size, color, position) {
    const geometry = new THREE.SphereGeometry(size / 2, 32);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 100,
    });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.copy(position);
    sphere.castShadow = true;
    return sphere;
  }

  createPlane(size, color) {
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;
    return plane;
  }
}
export { GraphicsEngine };
