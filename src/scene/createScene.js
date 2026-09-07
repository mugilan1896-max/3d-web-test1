import * as THREE from 'three';

export function createScene(canvas) {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = false;

  return { scene, renderer };
}
