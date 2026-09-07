import * as THREE from 'three';
import { STATIONS } from '../config.js';
import { createPottedPlant } from './createPottedPlant.js';

function createTvWallMounted(group) {
  const tvFrame = new THREE.Group();
  tvFrame.position.set(-1.85, 2.45, -3.15);

  const bezel = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 1.9, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x12161b, roughness: 0.35, metalness: 0.85 })
  );
  tvFrame.add(bezel);

  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 1.65),
    new THREE.MeshStandardMaterial({
      color: 0x0d1116,
      emissive: 0x111821,
      roughness: 0.18,
      metalness: 0.1,
      transparent: false
    })
  );
  screen.position.z = 0.09;
  tvFrame.add(screen);

  const stand = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.12, 0.18),
    new THREE.MeshStandardMaterial({ color: 0x1f2125, roughness: 0.5, metalness: 0.8 })
  );
  stand.position.set(0, -1.05, 0.04);
  tvFrame.add(stand);

  const mountBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.28, 0.52, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x25292d, roughness: 0.45, metalness: 0.72 })
  );
  mountBar.position.set(0, -0.7, 0.02);
  tvFrame.add(mountBar);

  group.add(tvFrame);
}

function createLandingPhotoFrames(group) {
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x29231f, roughness: 0.42, metalness: 0.35 });
  const artworkMaterials = [
    new THREE.MeshStandardMaterial({ color: 0xc8c5bc, roughness: 0.78 }),
    new THREE.MeshStandardMaterial({ color: 0x9caaa9, roughness: 0.78 }),
    new THREE.MeshStandardMaterial({ color: 0xb4a493, roughness: 0.78 })
  ];
  const frameGeometry = new THREE.BoxGeometry(1.15, 0.86, 0.08);
  const artworkGeometry = new THREE.PlaneGeometry(0.93, 0.64);
  const frames = [
    [-4.55, 3.22, 0],
    [0.55, 3.22, 1],
    [2.45, 2.28, 2]
  ];

  frames.forEach(([x, y, artworkIndex]) => {
    const frame = new THREE.Group();
    frame.position.set(x, y, -3.88);
    frame.add(new THREE.Mesh(frameGeometry, frameMaterial));

    const artwork = new THREE.Mesh(artworkGeometry, artworkMaterials[artworkIndex]);
    artwork.position.z = 0.045;
    frame.add(artwork);
    group.add(frame);
  });
}

function createLandingClock(group) {
  const clock = new THREE.Group();
  clock.position.set(4.25, 3.45, -3.9);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.7, 0.68, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x202428, roughness: 0.32, metalness: 0.7 })
  );
  clock.add(frame);

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 360;
  const context = canvas.getContext('2d');
  const texture = new THREE.CanvasTexture(canvas);
  const display = new THREE.Mesh(
    new THREE.PlaneGeometry(1.48, 0.46),
    new THREE.MeshBasicMaterial({ map: texture })
  );
  display.position.z = 0.045;
  clock.add(display);

  const updateTime = () => {
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).format(new Date());
    context.fillStyle = '#071317';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#77e4ed';
    context.font = '700 152px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(parts, canvas.width / 2, 148);
    context.font = '600 34px sans-serif';
    context.fillStyle = '#e8f5f3';
    context.fillText('IST  |  KOLKATA', canvas.width / 2, 292);
    texture.needsUpdate = true;
  };

  updateTime();
  window.setInterval(updateTime, 1000);
  group.add(clock);
}

function createClosedStorageRack(group) {
  const rack = new THREE.Group();
  rack.position.set(6.5, 1.1, -2.72);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 2.1, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x6d4d36, roughness: 0.72, metalness: 0.08 })
  );
  rack.add(body);

  const doorMat = new THREE.MeshStandardMaterial({ color: 0x4d311f, roughness: 0.8, metalness: 0.12 });
  const doorHeight = 0.58;
  const doorWidth = 0.38;

  const doorLeft = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.04), doorMat);
  doorLeft.position.set(-0.24, 0.55, 0.29);
  rack.add(doorLeft);

  const doorRight = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.04), doorMat);
  doorRight.position.set(0.24, 0.55, 0.29);
  rack.add(doorRight);

  const doorLowerLeft = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.04), doorMat);
  doorLowerLeft.position.set(-0.24, -0.48, 0.29);
  rack.add(doorLowerLeft);

  const doorLowerRight = new THREE.Mesh(new THREE.BoxGeometry(doorWidth, doorHeight, 0.04), doorMat);
  doorLowerRight.position.set(0.24, -0.48, 0.29);
  rack.add(doorLowerRight);

  const handleMat = new THREE.MeshStandardMaterial({ color: 0xc8b9a6, roughness: 0.4, metalness: 0.8 });
  const handleGeometry = new THREE.BoxGeometry(0.03, 0.08, 0.02);

  const handles = [
    [-0.12, 0.5, 0.28],
    [0.12, 0.5, 0.28],
    [-0.12, -0.46, 0.28],
    [0.12, -0.46, 0.28]
  ];

  handles.forEach(([x, y, z]) => {
    const handle = new THREE.Mesh(handleGeometry, handleMat);
    handle.position.set(x, y, z);
    rack.add(handle);
  });

  const topShelf = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.38), new THREE.MeshStandardMaterial({ color: 0x78543d, roughness: 0.8 }));
  topShelf.position.set(0, 0.9, 0.02);
  rack.add(topShelf);

  const midShelf = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.38), new THREE.MeshStandardMaterial({ color: 0x78543d, roughness: 0.8 }));
  midShelf.position.set(0, 0.08, 0.02);
  rack.add(midShelf);

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.06, 0.42), new THREE.MeshStandardMaterial({ color: 0x78543d, roughness: 0.8 }));
  base.position.set(0, -0.96, 0.02);
  rack.add(base);

  group.add(rack);

  const rackBox = new THREE.Box3().setFromObject(rack);
  const rackCenter = new THREE.Vector3();
  rackBox.getCenter(rackCenter);

  const smallPlants = [
    createPottedPlant({
      scale: 0.42,
      potColor: 0x8b5a3a,
      leafColor: 0x3e6d3f,
      leafColorAlt: 0x2a4f2d,
      potTopRadius: 0.14,
      potBottomRadius: 0.11,
      potHeight: 0.16,
      height: 0.5,
      stemCount: 2,
      leafCount: 6,
      variant: 1
    }),
    createPottedPlant({
      scale: 0.36,
      potColor: 0x78523a,
      leafColor: 0x486d46,
      leafColorAlt: 0x2f542d,
      potTopRadius: 0.13,
      potBottomRadius: 0.1,
      potHeight: 0.15,
      height: 0.46,
      stemCount: 2,
      leafCount: 5,
      variant: 2
    })
  ];

  smallPlants[0].position.set(rackCenter.x - 0.28, rackBox.max.y + 0.01, rackCenter.z - 0.12);
  smallPlants[1].position.set(rackCenter.x + 0.28, rackBox.max.y + 0.01, rackCenter.z + 0.08);
  smallPlants[0].rotation.y = -0.8;
  smallPlants[1].rotation.y = 0.7;

  smallPlants.forEach((plant) => rack.add(plant));

  return rack;
}

function createModernStorageDesk(group) {
  const desk = new THREE.Group();
  desk.position.set(10.2, 0.65, -2.8);

  // Main desk top surface
  const topSurface = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 0.06, 0.55),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3, metalness: 0.2 })
  );
  topSurface.position.set(0, 0.65, 0);
  desk.add(topSurface);

  // Left storage compartment
  const leftBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.6, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.5, metalness: 0.6 })
  );
  leftBox.position.set(-0.42, 0.3, 0);
  desk.add(leftBox);

  // Right storage compartment
  const rightBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.6, 0.48),
    new THREE.MeshStandardMaterial({ color: 0x2a2d31, roughness: 0.5, metalness: 0.6 })
  );
  rightBox.position.set(0.42, 0.3, 0);
  desk.add(rightBox);

  // Left shelf door
  const leftDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.54, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1a1d20, roughness: 0.6, metalness: 0.7 })
  );
  leftDoor.position.set(-0.42, 0.3, 0.26);
  desk.add(leftDoor);

  // Right shelf door
  const rightDoor = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 0.54, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x1a1d20, roughness: 0.6, metalness: 0.7 })
  );
  rightDoor.position.set(0.42, 0.3, 0.26);
  desk.add(rightDoor);

  // Metal frame legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.4, metalness: 0.9 });
  const legPositions = [
    [-0.56, 0.15, -0.18],
    [0.56, 0.15, -0.18],
    [-0.56, 0.15, 0.18],
    [0.56, 0.15, 0.18]
  ];

  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.3, 0.05), legMat);
    leg.position.set(x, y, z);
    desk.add(leg);
  });

  group.add(desk);
  return desk;
}

export function createLandingRoom(scene) {
  const group = new THREE.Group();
  group.position.set(STATIONS.landing, 0, 0);

  const cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
  const cubeMat = new THREE.MeshStandardMaterial({
    color: 0x55d68d,
    metalness: 0.76,
    roughness: 0.18,
    emissive: 0x1d6d48,
    emissiveIntensity: 0.55
  });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  cube.position.set(2.65, 1.2, 1.4);
  cube.rotation.x = 0.35;
  cube.rotation.z = 0.18;
  group.add(cube);

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42, 0.5, 0.38, 24),
    new THREE.MeshStandardMaterial({ color: 0x191a1d, roughness: 0.7, metalness: 0.3 })
  );
  pedestal.position.set(cube.position.x, 0.19, cube.position.z);
  group.add(pedestal);

  createTvWallMounted(group);
  createLandingPhotoFrames(group);
  createLandingClock(group);
  const rack = createClosedStorageRack(group);

  const largePlants = [
    createPottedPlant({
      scale: 0.92,
      potColor: 0x7a4d33,
      leafColor: 0x3d6d40,
      leafColorAlt: 0x2d4f2f,
      potTopRadius: 0.32,
      potBottomRadius: 0.22,
      potHeight: 0.42,
      height: 1.2,
      stemCount: 3,
      leafCount: 8,
      variant: 1
    }),
    createPottedPlant({
      scale: 1.04,
      potColor: 0x865a39,
      leafColor: 0x466f42,
      leafColorAlt: 0x335a35,
      potTopRadius: 0.28,
      potBottomRadius: 0.2,
      potHeight: 0.38,
      height: 1.32,
      stemCount: 3,
      leafCount: 7,
      variant: 2
    })
  ];

  largePlants[0].position.set(-4.8, 0, -1.85);
  largePlants[1].position.set(1.9, 0, -1.7);
  largePlants[0].rotation.y = -0.5;
  largePlants[1].rotation.y = 0.6;

  largePlants.forEach((plant) => group.add(plant));

  scene.add(group);
  return { group, cube, rack };
}
