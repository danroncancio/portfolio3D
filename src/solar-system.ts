import "./style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import CelestialBody from "./scripts/celestialBody";
import StarDome from "./scripts/starDome";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
//shaders
import sunVerShader from "./shaders/planets/sunVer.glsl";
import sunFragShader from "./shaders/planets/sunFrag.glsl";
import sunShineVerShader from "./shaders/planets/sunShineVer.glsl";
import sunShineFragShader from "./shaders/planets/sunShineFrag.glsl";

let ship: THREE.Group;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let debugParams = {
  play: false,
  orbitPasses: 0,
};
const gui = new dat.GUI({ name: "DebugMenu" }); // Debug util
const stats = new Stats();
let time = Date.now();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2e222f);
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  100000
);
camera.fov = 50;
// const camera = new THREE.OrthographicCamera(
//   innerWidth / -2,
//   innerWidth / 2,
//   innerHeight / 2,
//   innerHeight / -2,
//   -1000,
//   100000
// );

/**
 * Load models
 */
const modelsUrls = ["/assets/models/ships/craft_speederC.glb"];
const models = {};
const loader = new GLTFLoader();

loadShips();

function loadShips() {
  for (let i = 0; i < modelsUrls.length; i++) {
    loadModel(modelsUrls[i]).then((res: any) => {
      //console.log(res.scene);
      res.scene.traverse((node: any) => {
        if (node.isMesh) {
          node.castShadow = true;
          node.receiveShadow = true;
        }
      });
      res.scene.name = "ship";
      res.scene.position.set(2000, 0, 0);
      res.scene.scale.set(12, 12, 12);
      ship = res.scene;
      ship.add(pCamera);
      scene.add(ship);
    });
  }
}

function loadModel(url: string) {
  if (models[url]) {
    return models[url];
  }
  return (models[url] = loader.loadAsync(url, (e) => {}));
}

/**
 * Planet Camera
 */
const pCamera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  6000
);
pCamera.position.set(1200, 0, 2600);

/**
 * Sun light
 */
const sunLight = new THREE.PointLight(0xffffff, 2.6, 10000);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(1024, 1024);
//sunLight.shadow.camera.far = 1000;
//sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

/**
 * Star & Planets
 */
let bodies: CelestialBody[] = [];

const sun = new CelestialBody("sun", 50, 770, new THREE.Vector3(0, 0, 0));
sun.setPosition(0, 0, 0);
sun.geometry = new THREE.SphereGeometry(sun.radius, 30, 30);
sun.material = new THREE.ShaderMaterial({
  vertexShader: sunVerShader,
  fragmentShader: sunFragShader,
});

const projects = new CelestialBody(
  "projects",
  10,
  80,
  new THREE.Vector3(0, 0, 11)
);
projects.setPosition(2400, 250, 0);
projects.geometry = new THREE.SphereGeometry(projects.radius, 30, 30);
projects.material = new THREE.MeshLambertMaterial({
  color: "#165a4c",
});

bodies.push(sun, projects);
bodies.forEach((planet) => {
  console.log(planet.name, planet.mass.toLocaleString());
  if (planet.name !== "sun") {
    planet.castShadow = true;
    planet.receiveShadow = true;
  }
});

scene.add(...bodies);

/**
 * Star dome
 */
const testG = new THREE.Group();
const starMesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 2, 2));
testG.add(starMesh);
const starDome = new StarDome(
  starMesh,
  new THREE.Vector2(3, 13),
  new THREE.Vector2(0.1, 0.9)
);
scene.add(starDome.starGroup);

/**
 * Debug
 */
let bodiesPath: CelestialBody[] = [];
//let points: THREE.Vector3[] = [];

var folder1 = gui.addFolder("Orbit Visualizer");
folder1.add(debugParams, "play");
folder1
  .add(debugParams, "orbitPasses")
  .step(1)
  .min(0)
  .onChange(() => {});

// const curve = new THREE.EllipseCurve(
//   5,
//   0,
//   2400.030251018104,
//   2373.3839929125543,
//   0,
//   2 * Math.PI,
//   false,
//   0
// );

//const points = curve.getPoints(50);
//const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const ellipse = new THREE.Line(
//   geometry,
//   new THREE.LineBasicMaterial({ color: 0x444444, linewidth: 0.01 })
// );
// ellipse.rotation.set(1.57, 0.1, 0);
// folder1.add(ellipse.rotation, "x").step(0.01);
// folder1.add(ellipse.rotation, "y").step(0.01);

// scene.add(ellipse);

console.log(scene);

/**
 * Render loop
 */
function animate() {
  // Delta
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;

  stats.begin();

  /**
   * Calculate force and updates position of the bodies.
   */
  if (debugParams.play) {
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].updateVelocity(bodies, 0.09 * deltaTime);
    }
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].updatePosition(0.09 * deltaTime);
    }
  }

  renderer.render(scene, pCamera);
  //composer.render();
  controls.update();

  stats.end();
  requestAnimationFrame(animate);
}

function resize() {
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  //composer.setSize(innerWidth, innerHeight);
}

function createScene() {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  document.body.appendChild(renderer.domElement);
  controls = new OrbitControls(pCamera, renderer.domElement);
  controls.autoRotate = false;
  camera.position.z = 2500;

  resize();
  animate();
}

function calculatePostitions() {
  for (let i = 0; i < 100; i++) {
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].updateVelocity(bodies, 0.09);
    }
    for (let i = 0; i < bodies.length; i++) {
      bodies[i].updatePosition(0.09);
    }
  }
}

createScene();

addEventListener("resize", resize);
