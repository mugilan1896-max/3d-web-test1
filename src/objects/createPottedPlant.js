import * as THREE from 'three';

export function createPottedPlant({
  scale = 1,
  potColor = 0x8a5a3b,
  leafColor = 0x315d33,
  leafColorAlt = 0x23492a,
  potTopRadius = 0.22,
  potBottomRadius = 0.17,
  potHeight = 0.34,
  height = 1.2,
  stemCount = 3,
  leafCount = 7,
  variant = 1
} = {}) {
  const plant = new THREE.Group();

  const potMaterial = new THREE.MeshStandardMaterial({
    color: potColor,
    roughness: 0.8,
    metalness: 0.08
  });

  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(potTopRadius, potBottomRadius, potHeight, 18),
    potMaterial
  );
  pot.position.y = potHeight / 2;
  plant.add(pot);

  const stemMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a4b2c,
    roughness: 0.9,
    metalness: 0.04
  });

  const stemHeight = height * 0.75;

  for (let i = 0; i < stemCount; i++) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.05, stemHeight, 8),
      stemMaterial
    );
    const offset = (-0.12 + i * 0.12) * (1 + variant * 0.1);
    stem.position.set(offset, potHeight + stemHeight * 0.45, 0.02 * i);
    stem.rotation.z = (i % 2 === 0 ? 1 : -1) * (0.15 + i * 0.08);
    plant.add(stem);
  }

  const leafMaterial = new THREE.MeshStandardMaterial({
    color: leafColor,
    roughness: 0.9,
    metalness: 0.03
  });

  const leafMaterialAlt = new THREE.MeshStandardMaterial({
    color: leafColorAlt,
    roughness: 0.9,
    metalness: 0.03
  });

  for (let i = 0; i < leafCount; i++) {
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 8, 8),
      i % 2 === 0 ? leafMaterial : leafMaterialAlt
    );

    const spread = 0.12 + (i % 3) * 0.05;
    const angle = (i / leafCount) * Math.PI * 2 + variant * 0.7;
    const radius = 0.08 + (i % 4) * 0.04;
    const leafY = potHeight + 0.2 + (i / leafCount) * stemHeight * 0.8;

    leaf.scale.set(
      1.1 + (variant * 0.08),
      2.2 + (variant * 0.18),
      0.22
    );

    leaf.position.set(
      Math.cos(angle) * radius * 0.9,
      leafY,
      Math.sin(angle) * radius * 0.9
    );

    leaf.rotation.z = (i % 2 === 0 ? 1 : -1) * (0.5 + (i % 4) * 0.15);
    leaf.rotation.y = angle;
    leaf.rotation.x = 0.35 + (i % 3) * 0.12;

    if (variant > 1) {
      leaf.position.x *= 1.12;
      leaf.position.z *= 0.85;
    }

    plant.add(leaf);
  }

  plant.scale.setScalar(scale);
  plant.rotation.y = variant * 0.35;

  plant.traverse((mesh) => {
    if (mesh.isMesh) {
      mesh.castShadow = true;
      mesh.receiveShadow = true;
    }
  });

  return plant;
}
