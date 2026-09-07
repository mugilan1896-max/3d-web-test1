import * as THREE from 'three';
import { STATIONS } from '../config.js';

function material(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.55,
    metalness: options.metalness ?? 0.1,
    ...(options.emissive === undefined ? {} : { emissive: options.emissive }),
    emissiveIntensity: options.emissiveIntensity ?? 0
  });
}

function addBox(group, size, position, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material(color, options));
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function addPureWhiteBox(group, size, position) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  mesh.position.set(...position);
  group.add(mesh);
  return mesh;
}

function createPhotoGallery(group) {
  const gallery = new THREE.Group();
  gallery.position.set(4.55, 0, -3.86);
  addBox(gallery, [2.2, 1.85, 0.06], [0, 2.2, 0], 0x2e3032, { roughness: 0.82, metalness: 0.08 });

  const cardColors = [0xb9aaa0, 0x8b9b99, 0xc3b59f, 0xa99b91, 0x9ba8a5];
  cardColors.forEach((color, index) => {
    const topRow = index < 3;
    const rowIndex = topRow ? index : index - 3;
    const x = topRow ? -0.68 + rowIndex * 0.68 : -0.34 + rowIndex * 0.68;
    const y = topRow ? 2.62 : 1.93;
    addBox(gallery, [0.42, 0.54, 0.05], [x, y, 0.07], 0xe8e1d7, { roughness: 0.78 });
    addBox(gallery, [0.29, 0.38, 0.018], [x, y, 0.105], color, { roughness: 0.9 });
  });

  addBox(gallery, [1.55, 0.08, 0.3], [0, 1.05, 0.16], 0x3c2d29, { roughness: 0.78 });
  addBox(gallery, [0.42, 0.12, 0.2], [-0.4, 1.17, 0.28], 0x76534d, { roughness: 0.8 });
  addBox(gallery, [0.22, 0.16, 0.18], [0.16, 1.16, 0.27], 0xc4a46c, { roughness: 0.64 });
  group.add(gallery);
}

function createOuterPhotoFrames(group) {
  const frameMaterial = material(0x292c2f, { roughness: 0.44, metalness: 0.42 });
  const artworkMaterials = [
    material(0xb9aaa0, { roughness: 0.9 }),
    material(0x8b9b99, { roughness: 0.9 })
  ];
  const positions = [[2.68, 2.56], [6.28, 2.56]];

  positions.forEach(([x, y], index) => {
    addBox(group, [0.62, 0.82, 0.05], [x, y, -3.8], 0x292c2f, { roughness: 0.44, metalness: 0.42 });
    addBox(group, [0.43, 0.6, 0.018], [x, y, -3.765], artworkMaterials[index], { roughness: 0.9 });
    if (index === 0) {
      addBox(group, [0.34, 0.06, 0.018], [x, y + 0.12, -3.74], 0xf2eee5, { roughness: 0.84 });
      addBox(group, [0.34, 0.06, 0.018], [x, y - 0.12, -3.74], 0xf2eee5, { roughness: 0.84 });
    } else {
      addBox(group, [0.06, 0.46, 0.018], [x, y, -3.74], 0xf2eee5, { roughness: 0.84 });
      addBox(group, [0.22, 0.06, 0.018], [x + 0.08, y, -3.74], 0xf2eee5, { roughness: 0.84 });
    }
  });
}

export function createPhotobooth(scene, videoMesh) {
  const group = new THREE.Group();
  group.position.set(STATIONS.photobooth, 0, 0);

  const booth = new THREE.Group();
  booth.position.x = 0.72;
  addBox(booth, [2.4, 3.2, 1.08], [0, 1.62, 0], 0xb28f70, { roughness: 0.62, metalness: 0.08 });
  addPureWhiteBox(booth, [2.08, 2.76, 0.06], [0, 1.58, 0.57]);
  addBox(booth, [2.56, 0.14, 1.18], [0, 3.25, 0], 0x9b795f, { roughness: 0.64, metalness: 0.08 });
  addBox(booth, [2.68, 0.14, 1.24], [0, 0.06, 0], 0x9b795f, { roughness: 0.64, metalness: 0.08 });
  addPureWhiteBox(booth, [0.055, 2.78, 0.07], [-1.04, 1.58, 0.63]);
  addPureWhiteBox(booth, [0.055, 2.78, 0.07], [1.04, 1.58, 0.63]);

  const screenFrame = addBox(booth, [1.58, 1.0, 0.12], [0, 1.92, 0.65], 0x765944, { roughness: 0.46, metalness: 0.12 });
  if (videoMesh) {
    videoMesh.position.set(0, 1.93, 0.73);
    videoMesh.scale.set(1.16, 1.12, 1);
    booth.add(videoMesh);
  }
  const ringLight = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 10, 28), material(0xffe5bd, { emissive: 0xffb66f, emissiveIntensity: 0.48, roughness: 0.28 }));
  ringLight.rotation.x = Math.PI / 2;
  ringLight.position.set(0, 2.78, 0.7);
  booth.add(ringLight);
  const cameraBody = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.16, 16), material(0x22272b, { metalness: 0.72, roughness: 0.28 }));
  cameraBody.rotation.x = Math.PI / 2;
  cameraBody.position.set(0, 2.78, 0.7);
  booth.add(cameraBody);
  const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.025, 16), material(0x6b9aa3, { emissive: 0x16363b, emissiveIntensity: 0.35, metalness: 0.55, roughness: 0.2 }));
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 2.78, 0.81);
  booth.add(lens);

  addBox(booth, [0.72, 0.3, 0.22], [-0.48, 0.88, 0.67], 0xb28f70, { roughness: 0.62, metalness: 0.08 });
  addPureWhiteBox(booth, [0.34, 0.06, 0.035], [-0.48, 0.99, 0.79]);
  addBox(booth, [0.42, 0.1, 0.06], [0.48, 0.88, 0.7], 0x765944, { roughness: 0.46, metalness: 0.12 });
  addBox(booth, [0.25, 0.025, 0.035], [0.48, 0.94, 0.77], 0xffd39a, { emissive: 0x7a3e21, emissiveIntensity: 0.22, roughness: 0.35 });
  addBox(booth, [0.58, 0.08, 0.16], [0, 0.54, 0.69], 0xb28f70, { roughness: 0.62, metalness: 0.08 });
  addPureWhiteBox(booth, [0.36, 0.035, 0.035], [0, 0.54, 0.79]);
  group.add(booth);

  addBox(booth, [2.25, 0.018, 1.6], [0, 0.012, 0.7], 0x8b8179, { roughness: 0.98 });
  createPhotoGallery(group);
  createOuterPhotoFrames(group);

  const ringGlow = new THREE.PointLight(0xffc18a, 0.16, 2.6, 2);
  ringGlow.position.set(0, 2.78, 0.92);
  group.add(ringGlow);

  scene.add(group);
  return group;
}
