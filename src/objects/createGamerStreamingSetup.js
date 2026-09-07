import * as THREE from 'three';
import { STATIONS } from '../config.js';

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.5,
    metalness: options.metalness ?? 0.2,
    ...(options.emissive === undefined ? {} : { emissive: options.emissive }),
    emissiveIntensity: options.emissiveIntensity ?? 0
  });
}

function addBox(group, size, position, color, options = {}) {
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.5,
    metalness: options.metalness ?? 0.2,
    ...(options.emissive === undefined ? {} : { emissive: options.emissive }),
    emissiveIntensity: options.emissiveIntensity ?? 0
  });
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function createAcousticWall(group) {
  const wall = new THREE.Group();
  wall.position.set(0, 0, -3.82);
  const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x34363b, roughness: 0.92, metalness: 0.05 });
  [-1.05, -0.35, 0.35, 1.05].forEach((x) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.54, 1.05, 0.08), panelMaterial);
    panel.position.set(x, 3.15, 0);
    panel.rotation.z = x < 0 ? 0.035 : -0.035;
    wall.add(panel);
  });
  group.add(wall);
}

function createGamingWallStickers(group) {
  const stickerMaterial = new THREE.MeshBasicMaterial({ color: 0x1fc4dc, side: THREE.DoubleSide });
  const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x151c22, side: THREE.DoubleSide });

  const controllerSticker = new THREE.Group();
  controllerSticker.position.set(-2.25, 2.72, -3.955);
  controllerSticker.add(new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.26), darkMaterial));
  const controllerDot = new THREE.Mesh(new THREE.CircleGeometry(0.035, 12), stickerMaterial);
  controllerDot.position.set(0.13, -0.035, 0.006);
  controllerSticker.add(controllerDot);
  group.add(controllerSticker);

  const playSticker = new THREE.Group();
  playSticker.position.set(2.22, 2.72, -3.955);
  playSticker.add(new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.48), darkMaterial));
  const playMark = new THREE.Mesh(new THREE.CircleGeometry(0.14, 3), stickerMaterial);
  playMark.rotation.z = Math.PI / 2;
  playMark.position.z = 0.006;
  playSticker.add(playMark);
  group.add(playSticker);

}

function addCylinderBetween(group, start, end, radius, material) {
  const direction = new THREE.Vector3().subVectors(end, start);
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, direction.length(), 12), material);
  mesh.position.copy(start).add(end).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  group.add(mesh);
}

function createDesk(group) {
  addBox(group, [3.2, 0.14, 0.94], [0, 1.02, -1.65], 0x252a2e, { roughness: 0.38, metalness: 0.48 });
  [-1.28, 1.28].forEach((x) => addBox(group, [0.1, 0.92, 0.1], [x, 0.5, -1.65], 0x15191c, { roughness: 0.42, metalness: 0.72 }));
  addBox(group, [2.25, 0.06, 0.06], [0, 0.35, -1.65], 0x15191c, { roughness: 0.42, metalness: 0.72 });
  addBox(group, [2.35, 0.025, 0.7], [0, 1.105, -1.61], 0x11171c, { roughness: 0.96, metalness: 0.02 });
}

function createMonitors(group) {
  const bezelMaterial = material(0x101417, { roughness: 0.3, metalness: 0.62 });
  const screenMaterials = [
    material(0x123e52, { emissive: 0x07516b, emissiveIntensity: 0.26, roughness: 0.25 }),
    material(0x1d3546, { emissive: 0x163f65, emissiveIntensity: 0.24, roughness: 0.25 })
  ];

  [-0.68, 0.68].forEach((x, index) => {
    const monitor = new THREE.Group();
    monitor.position.set(x, 1.68, -2.05);
    monitor.scale.setScalar(0.9);
    monitor.rotation.y = index === 0 ? 0.025 : -0.025;
    monitor.add(new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.76, 0.09), bezelMaterial));
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.62), screenMaterials[index]);
    screen.position.z = 0.052;
    monitor.add(screen);
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.08), bezelMaterial);
    stand.position.y = -0.5;
    monitor.add(stand);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.035, 0.22), bezelMaterial);
    base.position.set(0, -0.65, 0);
    monitor.add(base);
    group.add(monitor);
  });

  const webcamBody = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.1, 0.1), bezelMaterial);
  webcamBody.position.set(0, 2.38, -2.0);
  group.add(webcamBody);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.025, 14), material(0x6fa9b4, { emissive: 0x164c58, emissiveIntensity: 0.35, metalness: 0.45, roughness: 0.2 }));
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 2.38, -1.94);
  group.add(lens);
}

function createDesktopEssentials(group) {
  addBox(group, [1.28, 0.045, 0.57], [-0.2, 1.12, -1.34], 0x11171d, { roughness: 0.9, metalness: 0.05 });
  addBox(group, [0.62, 0.035, 0.28], [0.72, 1.125, -1.34], 0x151a20, { roughness: 0.85, metalness: 0.1 });
  addBox(group, [0.08, 0.025, 0.14], [0.98, 1.155, -1.34], 0x263039, { roughness: 0.45, metalness: 0.5 });
  const armMaterial = material(0x12171b, { roughness: 0.3, metalness: 0.78 });
  addCylinderBetween(group, new THREE.Vector3(-1.18, 1.08, -1.35), new THREE.Vector3(-1.18, 1.68, -1.72), 0.028, armMaterial);
  addCylinderBetween(group, new THREE.Vector3(-1.18, 1.68, -1.72), new THREE.Vector3(-0.92, 1.73, -1.85), 0.028, armMaterial);
  const microphone = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.3, 16), material(0x242b31, { roughness: 0.25, metalness: 0.72 }));
  microphone.rotation.z = Math.PI / 2;
  microphone.position.set(-0.78, 1.73, -1.87);
  group.add(microphone);
}

function createPcTower(group) {
  addBox(group, [0.62, 1.18, 0.58], [1.28, 0.61, -1.58], 0x12171b, { roughness: 0.32, metalness: 0.58 });
  addBox(group, [0.42, 0.78, 0.025], [1.28, 0.64, -1.275], 0x0a1117, { emissive: 0x007da4, emissiveIntensity: 0.18, roughness: 0.25, metalness: 0.2 });
  addBox(group, [0.08, 0.03, 0.03], [1.28, 1.05, -1.255], 0x21a9c6, { emissive: 0x087b91, emissiveIntensity: 0.36, roughness: 0.3, metalness: 0.3 });
}

function createChair(group) {
  const chair = new THREE.Group();
  chair.position.set(-0.7, 0, 1.3);
  chair.scale.setScalar(0.78);
  addBox(chair, [0.88, 0.9, 0.2], [0, 1.2, 0.32], 0x20262b, { roughness: 0.62, metalness: 0.12 });
  addBox(chair, [0.9, 0.18, 0.82], [0, 0.72, -0.05], 0x20262b, { roughness: 0.62, metalness: 0.12 });
  addBox(chair, [0.1, 0.62, 0.1], [0, 0.4, -0.05], 0x151a1e, { roughness: 0.4, metalness: 0.72 });

  addBox(chair, [0.06, 0.06, 0.72], [0, 0.08, -0.05], 0x151a1e, { roughness: 0.4, metalness: 0.72 });
  [-0.28, 0.28].forEach((x) => addBox(chair, [0.05, 0.05, 0.48], [x, 0.08, -0.05], 0x151a1e, { roughness: 0.4, metalness: 0.72 }));

  const wheelMaterial = material(0x11161a, { roughness: 0.5, metalness: 0.58 });
  [[-0.34, -0.05], [0.34, -0.05], [-0.24, -0.34], [0.24, -0.34], [0, 0.28]].forEach(([x, z]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.12, 12), wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.03, z);
    chair.add(wheel);
  });
  group.add(chair);
}

function createAccentLight(group) {
  const light = new THREE.PointLight(0x20b9de, 0.16, 3.5);
  light.position.set(0, 1.55, -3.2);
  group.add(light);
}

export function createGamerStreamingSetup(scene) {
  const group = new THREE.Group();
  group.position.set(STATIONS.gamer + 0.8, 0, 0);

  createAcousticWall(group);
  createGamingWallStickers(group);
  createDesk(group);
  createMonitors(group);
  createDesktopEssentials(group);
  createPcTower(group);
  createChair(group);
  createAccentLight(group);

  scene.add(group);
  return group;
}