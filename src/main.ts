import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// Scenes
import startScene from "./start";
import { generateUUID } from "three/src/math/MathUtils";

const clock = new THREE.Clock();
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let debugParams = {
  play: false,
  orbitPasses: 0,
};
//const gui = new dat.GUI({ name: "DebugMenu" }); // Debug util
const stats = new Stats();
let time = Date.now();
let currentScene: THREE.Scene;
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  10000
);
camera.fov = 50;

currentScene = startScene;

let ship: THREE.Group;

/**
 * Render loop
 */
function animate() {
  // Elapsed time
  const elapsedTime = clock.getElapsedTime();
  // Delta
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  stats.begin();

  if (currentScene === startScene) {
    if (currentScene.getObjectByName("ship") !== undefined) {
      ship = currentScene.getObjectByName("ship");

      ship.position.y += Math.sin(elapsedTime * 2) * 0.0005 * deltaTime;
    }
  }

  renderer.render(currentScene, camera);
  controls.update();

  stats.end();
  requestAnimationFrame(animate);
}

function resize() {
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
}

function createScene() {
  stats.showPanel(0);
  //document.body.appendChild(stats.dom);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = false;
  controls.target = new THREE.Vector3(0, 80, 0);
  camera.position.set(0, 90, 30);

  resize();
  animate();
}

createScene();

addEventListener("resize", resize);
