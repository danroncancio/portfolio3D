import * as THREE from "three";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Resurrect 64 Palette

//const gui = new dat.GUI({ name: "DebugMenu" }); // Debug util
let ship: THREE.Group;
let palmLong: THREE.Group;
let shortLong: THREE.Group;
let startPlanet: THREE.Group;
let astronautSit: THREE.Group;
let astronaut: THREE.Group;

const startScene = new THREE.Scene();
startScene.background = new THREE.Color(0x8fd3ff);
startScene.fog = new THREE.Fog(0x0b5e65, 0.1, 180);

/**
 * Load models
 */
const modelsUrls = [
  "/assets/models/ships/ship.glb",
  "/assets/models/trees/palm_detailed_long.gltf",
  "/assets/models/trees/palm_detailed_short.gltf",
  "assets/models/planets/starter.glb",
  "assets/models/persons/astronaut.glb",
];
const models = {};
const loader = new GLTFLoader();

loadShips();

function loadShips() {
  for (let i = 0; i < modelsUrls.length; i++) {
    loadModel(modelsUrls[i]).then((res: any) => {
      console.log(res.scene);
      res.scene.traverse((node: any) => {
        if (node.isMesh) {
          node.receiveShadow = true;
        }
      });

      if (res.scene.children[0].name === "craft_speederC") {
        res.scene.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.material.metalness = 0.4;
          }
        });
        res.scene.name = "ship";
        ship = res.scene;

        ship.scale.set(2, 2, 2);
        ship.position.set(-3, 80, -2);
        ship.rotation.set(0, -9, 0);

        startScene.add(ship);
      }

      if (res.scene.name === "palm_detailed_long") {
        res.scene.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
          }
        });
        palmLong = res.scene;

        palmLong.scale.set(3, 3, 3);
        palmLong.position.set(-7, 79.5, 20);

        startScene.add(palmLong);
      }

      if (res.scene.name === "palm_detailed_short") {
        res.scene.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
          }
        });
        shortLong = res.scene;

        shortLong.scale.set(3, 3, 3);
        shortLong.position.set(-1, 79.5, 18.5);

        startScene.add(shortLong);
      }

      if (res.scene.children[0].name === "StartPlanet") {
        startPlanet = res.scene;

        startPlanet.scale.set(1, 1, 1);
        startPlanet.rotation.set(0, 3, 0);

        startScene.add(startPlanet);
      }

      if (res.scene.children[0].name === "astronaut_sit") {
        res.scene.traverse((node: any) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.material.metalness = 0.4;
          }
        });

        astronautSit = res.scene;

        astronautSit.scale.set(2, 2, 2);
        astronautSit.position.set(2, 79.6, 1.4);
        astronautSit.rotation.set(0, 2.5, 0);

        startScene.add(astronautSit);
      }
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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xaaaaaa, 1.0);
startScene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
// shadow camera
directionalLight.shadow.camera.top = 70;
directionalLight.shadow.camera.right = 70;
directionalLight.shadow.camera.left = -70;
directionalLight.shadow.camera.bottom = -70;
// map size
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

directionalLight.position.set(0, 200, 0);
directionalLight.castShadow = true;
const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
startScene.add(directionalLight);
//startScene.add(helper);

directionalLight.shadow;

/**
 * Planet
 */

const planet = new THREE.Mesh(
  new THREE.SphereBufferGeometry(80, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0x8fd3ff })
);
planet.castShadow = true;
planet.receiveShadow = true;
planet.visible = false;

startScene.add(planet);

export default startScene;
