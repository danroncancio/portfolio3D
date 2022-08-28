import * as THREE from "three";

class CelestialBody extends THREE.Mesh {
  name: string;
  surfaceGravity: number;
  mass: number;
  radius: number;
  initialVelocity: THREE.Vector3;
  currentVelocity: THREE.Vector3;

  initialPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  perihelion: THREE.Vector3 = new THREE.Vector3(0, 0, 0); // Closest point to the sun
  aphelion: THREE.Vector3 = new THREE.Vector3(0, 0, 0); // Farthest point from the sun

  constructor(
    name: string,
    surfaceGravity: number,
    radius = 0,
    initialVelocity = new THREE.Vector3()
  ) {
    super();
    this.name = name;
    this.surfaceGravity = surfaceGravity;
    this.mass = (surfaceGravity * radius * radius) / 0.01;
    this.radius = radius;
    this.initialVelocity = initialVelocity;
    this.currentVelocity = this.initialVelocity;
  }

  updateVelocity(allBodies: CelestialBody[], timeStep: number) {
    allBodies.forEach((otherBody) => {
      if (otherBody != this) {
        let sqrDst = otherBody.position.distanceToSquared(this.position);

        let forceDir = new THREE.Vector3(
          otherBody.position.x - this.position.x,
          otherBody.position.y - this.position.y,
          otherBody.position.z - this.position.z
        ).normalize();
        let acceleration = forceDir.multiplyScalar(
          (0.0001 * otherBody.mass) / sqrDst
        );
        this.currentVelocity.add(acceleration.multiplyScalar(timeStep));
        if (this.name === "sun") {
        }
        //console.log("currentVelocity", this.currentVelocity);
        if (otherBody.name === "sun") {
          let Dst = otherBody.position.distanceTo(this.position);
          //console.log(Dst);
        }
      }
    });
  }

  updatePosition(timeStep: number) {
    if (this.name !== "sun") {
      let currentVelocityCopy = new THREE.Vector3().copy(this.currentVelocity);
      this.position.add(currentVelocityCopy.multiplyScalar(timeStep));
    }
  }

  setPosition(x: number, y: number, z: number) {
    this.position.set(x, y, z);
    this.initialPosition.copy(this.position);
    console.log(this.name, this.initialPosition);
  }
}

export default CelestialBody;
