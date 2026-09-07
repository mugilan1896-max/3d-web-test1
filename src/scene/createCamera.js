import * as THREE from 'three';
import { CAMERA_POSITIONS } from '../config.js';

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(CAMERA_POSITIONS.landing.x, CAMERA_POSITIONS.landing.y, CAMERA_POSITIONS.landing.z);
  const cameraTarget = new THREE.Vector3(0, 1.2, 0);
  return { camera, cameraTarget };
}
