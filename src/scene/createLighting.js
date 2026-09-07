import * as THREE from 'three';

export function createLighting(scene) {
  const hemi = new THREE.HemisphereLight(0xdfe7ff, 0x20202a, 0.6);


    scene.add(hemi);
  
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(5, 8, 5);
    key.castShadow = false;
    scene.add(key);
  
    const fill = new THREE.PointLight(0xfff9f0, 0.25, 20);
    fill.position.set(12, 3, 2);
    scene.add(fill);
}
