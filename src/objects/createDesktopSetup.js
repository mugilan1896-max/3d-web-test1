import * as THREE from 'three';
import { STATIONS } from '../config.js';

function createLargeStorageDesk(group) {
  const desk = new THREE.Group();
  desk.position.set(3.35, 0, -3.35);

  const topSurface = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.08, 0.52),
    new THREE.MeshStandardMaterial({ color: 0x5a4033, roughness: 0.68, metalness: 0.12 })
  );
  topSurface.position.set(0, 1.28, 0);
  desk.add(topSurface);

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.08, 1.18, 0.42),
    new THREE.MeshStandardMaterial({ color: 0x2b3034, roughness: 0.54, metalness: 0.48 })
  );
  body.position.set(0, 0.62, 0);
  desk.add(body);

  const inset = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.72, 0.025),
    new THREE.MeshStandardMaterial({ color: 0x171b1f, roughness: 0.72, metalness: 0.3 })
  );
  inset.position.set(0, 0.65, 0.225);
  desk.add(inset);

  const legMat = new THREE.MeshStandardMaterial({ color: 0x62676b, roughness: 0.3, metalness: 0.9 });
  [-0.46, 0.46].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.62, 0.05), legMat);
    leg.position.set(x, 0.28, 0);
    desk.add(leg);
  });

  const topShelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.02, 0.05, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x6b4a39, roughness: 0.7, metalness: 0.08 })
  );
  topShelf.position.set(0, 1.56, 0);
  desk.add(topShelf);

  group.add(desk);
  return desk;
}

function createDesktopSideFeatures(group) {
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x25292d, roughness: 0.42, metalness: 0.48 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.08, 0.06), frameMaterial);
  frame.position.set(-2.62, 2.7, -3.86);
  group.add(frame);

  const artwork = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.88), new THREE.MeshStandardMaterial({ color: 0xb2a18d, roughness: 0.82 }));
  artwork.position.set(-2.62, 2.7, -3.82);
  group.add(artwork);

  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.22, 16), new THREE.MeshStandardMaterial({ color: 0x4b3830, roughness: 0.8 }));
  pot.position.set(-2.52, 0.88, -2.88);
  group.add(pot);
  const foliage = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 8), new THREE.MeshStandardMaterial({ color: 0x557158, roughness: 0.9 }));
  foliage.scale.set(0.75, 1.15, 0.75);
  foliage.position.set(-2.52, 1.2, -2.88);
  group.add(foliage);
}

export function createDesktopSetup(scene, videoMesh) {
  const group = new THREE.Group();
  group.position.set(STATIONS.desktop + 1.8, 0, 0);

  const deskTop = new THREE.Mesh(
    new THREE.BoxGeometry(4.0, 0.22, 1.9),
    new THREE.MeshStandardMaterial({ color: 0x5f4334, roughness: 0.8, metalness: 0.1 })
  );
  deskTop.position.set(0, 0.9, 0.15);
  group.add(deskTop);

  const deskFrontLip = new THREE.Mesh(
    new THREE.BoxGeometry(3.8, 0.08, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x3d2e27, roughness: 0.7, metalness: 0.12 })
  );
  deskFrontLip.position.set(0, 0.96, 0.92);
  group.add(deskFrontLip);

  const legMat = new THREE.MeshStandardMaterial({ color: 0x1d1f22, roughness: 0.72, metalness: 0.7 });
  const legPositions = [
    [-1.7, 0.42, -0.65],
    [1.7, 0.42, -0.65],
    [-1.7, 0.42, 0.7],
    [1.7, 0.42, 0.7],
  ];

  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.92, 0.16), legMat);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  const monitorGroup = new THREE.Group();
  const monitorBody = new THREE.Mesh(
    new THREE.BoxGeometry(2.8, 1.72, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x111417, metalness: 0.72, roughness: 0.28 })
  );
  monitorGroup.add(monitorBody);

  const monitorRear = new THREE.Mesh(
    new THREE.BoxGeometry(2.58, 1.48, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x0a0d10, roughness: 0.28, metalness: 0.18 })
  );
  monitorRear.position.set(0, 0, -0.02);
  monitorGroup.add(monitorRear);

  if (videoMesh) {
    videoMesh.position.set(0, 0, 0.06);
    videoMesh.rotation.y = 0;
    videoMesh.scale.set(1.04, 1.04, 1.04);
    monitorGroup.add(videoMesh);
  } else {
    const fallbackScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(2.4, 1.28),
      new THREE.MeshStandardMaterial({ color: 0x101820, emissive: 0x0d1420, emissiveIntensity: 0.2, roughness: 0.25 })
    );
    fallbackScreen.position.set(0, 0, 0.07);
    monitorGroup.add(fallbackScreen);
  }

  const standNeck = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.28, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x1d2126, roughness: 0.45, metalness: 0.8 })
  );
  standNeck.position.set(0, -0.84, 0.06);
  monitorGroup.add(standNeck);

  monitorGroup.position.set(-0.1, 1.75, 0.2);
  monitorGroup.rotation.y = 0.04;
  group.add(monitorGroup);

  const screenGlow = new THREE.PointLight(0x9ec9ff, 0.22, 4.2, 2);
  screenGlow.position.set(-0.1, 1.75, 1.05);
  group.add(screenGlow);

  const keyboard = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.08, 0.48),
    new THREE.MeshStandardMaterial({ color: 0xe8ecef, roughness: 0.78, metalness: 0.08 })
  );
  keyboard.position.set(-0.05, 1.02, 0.88);
  group.add(keyboard);

  const keyboardInset = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 0.02, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x1c2126, roughness: 0.9, metalness: 0.04 })
  );
  keyboardInset.position.set(-0.05, 1.06, 0.88);
  group.add(keyboardInset);

  const mouse = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.04, 0.1),
    new THREE.MeshStandardMaterial({ color: 0x15181b, roughness: 0.72, metalness: 0.4 })
  );
  mouse.position.set(0.98, 1.03, 0.88);
  group.add(mouse);

  const mousePad = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 0.03, 0.56),
    new THREE.MeshStandardMaterial({ color: 0x1a1b1f, roughness: 0.9, metalness: 0.14 })
  );
  mousePad.position.set(0.96, 1.0, 0.88);
  group.add(mousePad);

  const cpu = new THREE.Group();
  const cpuBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.45, 0.62),
    new THREE.MeshStandardMaterial({ color: 0xced3d6, roughness: 0.6, metalness: 0.28 })
  );
  cpuBody.position.set(1.8, 0.82, -0.72);
  cpu.add(cpuBody);

  const cpuFront = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 1.2, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x111519, roughness: 0.7, metalness: 0.22 })
  );
  cpuFront.position.set(1.8, 0.82, -0.39);
  cpu.add(cpuFront);

  const cpuFan = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.05, 20),
    new THREE.MeshStandardMaterial({ color: 0x2f3439, roughness: 0.46, metalness: 0.9 })
  );
  cpuFan.rotation.x = Math.PI / 2;
  cpuFan.position.set(1.8, 1.06, -0.38);
  cpu.add(cpuFan);

  group.add(cpu);

  createDesktopSideFeatures(group);

  scene.add(group);
  return group;
}
