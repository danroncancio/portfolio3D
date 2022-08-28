import * as THREE from "three";
import lerp from "../utils/lerp";

class StarDome {
  starMesh: THREE.Mesh;
  radiusMinMax: THREE.Vector2;
  count: number = 1000;
  calibrationDst: number = 2000;
  brightnessMinMax: THREE.Vector2;
  starGroup: THREE.Group;

  constructor(
    starMesh: THREE.Mesh,
    radiusMinMax: THREE.Vector2,
    brightnessMinMax: THREE.Vector2
  ) {
    this.starMesh = starMesh;
    this.radiusMinMax = radiusMinMax;
    this.brightnessMinMax = brightnessMinMax;
    this.starGroup = new THREE.Group();

    const starDst = 10000; //camera.far - radiusMinMax.y;
    const scale = starDst / this.calibrationDst;
    console.log(starDst, scale);

    for (let i = 0; i < this.count; i++) {
      let star = new THREE.Mesh().copy(this.starMesh);
      let t = this.smallestRandomValue(6);
      star.position.copy(this.randomSpherePoint().multiplyScalar(starDst));
      star.scale.copy(
        new THREE.Vector3(1, 1, 1).multiplyScalar(
          lerp(radiusMinMax.x, radiusMinMax.y, t) * scale
        )
      );
      star.material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xffffff).lerp(
          new THREE.Color(0x000000),
          lerp(brightnessMinMax.x, brightnessMinMax.y, t)
        ),
      });
      //console.log(star.material);
      star.name = "star" + i;
      this.starGroup.add(star);
    }
  }

  smallestRandomValue(iterations: number): number {
    let r = 1.0;
    for (let i = 0; i < iterations; i++) {
      r = Math.min(r, Math.random());
    }

    return r;
  }

  randomSpherePoint(): THREE.Vector3 {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    let x = 1 * Math.sin(phi) * Math.cos(theta);
    let y = 1 * Math.sin(phi) * Math.sin(theta);
    let z = 1 * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  }
}

export default StarDome;
