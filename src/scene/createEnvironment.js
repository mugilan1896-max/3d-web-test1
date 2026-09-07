import * as THREE from 'three';
import { STATIONS } from '../config.js';

function createBrickWallTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, '#d9965f');
  base.addColorStop(0.2, '#cd7d45');
  base.addColorStop(0.5, '#c57239');
  base.addColorStop(1, '#a95d2a');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const brickW = 160;
  const brickH = 72;
  const mortar = 12;
  const rows = Math.ceil(canvas.height / (brickH + mortar));
  const cols = Math.ceil(canvas.width / (brickW + mortar));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * (brickW + mortar) + (row % 2 === 0 ? 0 : brickW / 2);
      const y = row * (brickH + mortar);

      const toneShift = (Math.random() - 0.5) * 32;
      const r = 190 + toneShift;
      const g = 116 + toneShift * 0.7;
      const b = 73 + toneShift * 0.5;

      const brickFill = ctx.createLinearGradient(x, y, x + brickW, y + brickH);
      brickFill.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
      brickFill.addColorStop(0.5, `rgb(${r - 10}, ${g - 8}, ${b - 4})`);
      brickFill.addColorStop(1, `rgb(${r - 26}, ${g - 16}, ${b - 8})`);
      ctx.fillStyle = brickFill;
      ctx.fillRect(x, y, brickW, brickH);

      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.fillRect(x + 6, y + 6, brickW - 12, 8);
      ctx.fillRect(x + 12, y + 25, brickW - 24, 2);
      ctx.fillStyle = 'rgba(80, 40, 20, 0.12)';
      ctx.fillRect(x + 10, y + 18, brickW - 20, 3);
      ctx.fillRect(x + 18, y + 36, brickW - 36, 2);

      ctx.strokeStyle = 'rgba(120, 70, 35, 0.18)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 1, y + 1, brickW - 2, brickH - 2);
    }
  }

  const overlay = ctx.createRadialGradient(canvas.width * 0.5, canvas.height * 0.3, 80, canvas.width * 0.5, canvas.height * 0.5, canvas.width);
  overlay.addColorStop(0, 'rgba(255,255,255,0.2)');
  overlay.addColorStop(0.5, 'rgba(255,255,255,0.06)');
  overlay.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createFloorTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const base = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  base.addColorStop(0, '#efefee');
  base.addColorStop(0.5, '#e3e3e2');
  base.addColorStop(1, '#d6d4d2');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tileSize = 128;
  const grout = 10;
  const tileInner = tileSize - grout * 2;

  for (let y = 0; y < canvas.height; y += tileSize) {
    for (let x = 0; x < canvas.width; x += tileSize) {
      const tileFill = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
      tileFill.addColorStop(0, '#f3f2f2');
      tileFill.addColorStop(1, '#d7d5d4');
      ctx.fillStyle = tileFill;
      ctx.fillRect(x + grout, y + grout, tileInner, tileInner);

      ctx.strokeStyle = 'rgba(160, 160, 160, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + grout, y + grout, tileInner, tileInner);

      ctx.strokeStyle = 'rgba(255,255,255,0.28)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + grout + 3, y + grout + 3, tileInner - 6, tileInner - 6);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 4);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createSlidingDoor(scene, wallXPos) {
  const doorGroup = new THREE.Group();
  doorGroup.position.set(wallXPos, 0, 0);

  // Door dimensions
  const doorWidth = 1.2;       // Z-direction width
  const doorHeight = 2.4;      // Y-direction height
  const doorThickness = 0.05;  // X-direction thickness
  const frameThickness = 0.12;
  const wallThickness = 0.2;

  // Doorway opening dimensions
  const doorwayWidth = doorWidth + 0.05;
  const doorwayHeight = doorHeight + 0.05;
  const doorwayStartY = 0;
  const doorwayStartZ = -doorwayWidth / 2;

  // Create wall sections with opening
  const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0xf2f2f0,
    roughness: 0.78,
    metalness: 0.04
  });

  // Top wall section (above doorway)
  const topWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, 4 - doorwayHeight, 8),
    wallMaterial
  );
  topWall.position.y = doorwayHeight + (4 - doorwayHeight) / 2;
  doorGroup.add(topWall);

  // Left wall section (left of doorway)
  const leftWallDepth = (8 - doorwayWidth) / 2;
  const leftWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, doorwayHeight, leftWallDepth),
    wallMaterial
  );
  leftWall.position.set(0, doorwayStartY + doorwayHeight / 2, -doorwayWidth / 2 - leftWallDepth / 2);
  doorGroup.add(leftWall);

  // Right wall section (right of doorway)
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(wallThickness, doorwayHeight, leftWallDepth),
    wallMaterial
  );
  rightWall.position.set(0, doorwayStartY + doorwayHeight / 2, doorwayWidth / 2 + leftWallDepth / 2);
  doorGroup.add(rightWall);

  // Door frame
  const frameMaterial = new THREE.MeshStandardMaterial({
    color: 0x42484b,
    roughness: 0.75,
    metalness: 0.18
  });

  const frameGroup = new THREE.Group();
  frameGroup.position.set(0, 0, 0);  // Center frame at doorway

  // Top frame bar
  const frameTop = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, frameThickness, doorWidth + frameThickness * 2),
    frameMaterial
  );
  frameTop.position.set(0, doorwayHeight + frameThickness / 2, 0);
  frameGroup.add(frameTop);

  // Left frame bar
  const frameLeft = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness, frameThickness),
    frameMaterial
  );
  frameLeft.position.set(0, doorHeight / 2, -doorWidth / 2 - frameThickness / 2);
  frameGroup.add(frameLeft);

  // Right frame bar
  const frameRight = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, doorHeight + frameThickness, frameThickness),
    frameMaterial
  );
  frameRight.position.set(0, doorHeight / 2, doorWidth / 2 + frameThickness / 2);
  frameGroup.add(frameRight);

  // Bottom frame bar
  const frameBottom = new THREE.Mesh(
    new THREE.BoxGeometry(frameThickness, frameThickness, doorWidth + frameThickness * 2),
    frameMaterial
  );
  frameBottom.position.set(0, -frameThickness / 2, 0);
  frameGroup.add(frameBottom);

  doorGroup.add(frameGroup);

  // Sliding door panel
  const doorPanelGroup = new THREE.Group();
  // Position at front face of wall (wall is 0.2 thick, centered at 0, so front face is at +0.1)
  doorPanelGroup.position.set(0.12, 0, 0);  // Start centered in doorway (CLOSED)

  const doorMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc7e2e8,
    transparent: true,
    opacity: 0.62,
    transmission: 0.45,
    roughness: 0.08,
    metalness: 0,
    side: THREE.DoubleSide
  });

  // Door panel overlaps the opening slightly so no edge gap appears when closed.
  const doorPanel = new THREE.Mesh(
    new THREE.BoxGeometry(doorThickness, doorwayHeight, doorwayWidth + 0.06),
    doorMaterial
  );
  doorPanel.position.set(0, doorwayHeight / 2, 0);
  doorPanelGroup.add(doorPanel);

  // Handle
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0x101214,
    roughness: 0.42,
    metalness: 0.55
  });

  const handle = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.12, 0.035),
    handleMaterial
  );
  handle.position.set(doorThickness / 2 + 0.01, doorwayHeight / 2, doorwayWidth / 2 - 0.15);
  doorPanelGroup.add(handle);

  doorGroup.add(doorPanelGroup);
  scene.add(doorGroup);

  return {
    group: doorGroup,
    panelGroup: doorPanelGroup,
    doorwayWidth,
    doorwayHeight,
    doorwayStartZ,
    maxSlideDistance: doorwayWidth
  };
}

function createSnowyEndWall(scene, wallX) {
  const wallWidth = 8;
  const wallHeight = 5;
  const wallThickness = 0.22;
  const windowWidth = 4.8;
  const windowHeight = 2.8;
  const windowCenterY = 2.5;
  const windowCenterZ = 0.45;
  const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x7d8388, roughness: 0.84, metalness: 0.06 });
  const frameMaterial = new THREE.MeshStandardMaterial({ color: 0x293239, roughness: 0.32, metalness: 0.72 });
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xc7edf4,
    transparent: true,
    opacity: 0.2,
    transmission: 0.35,
    roughness: 0.08,
    side: THREE.DoubleSide
  });
  const wallGroup = new THREE.Group();
  const windowLeft = windowCenterZ - windowWidth / 2;
  const windowRight = windowCenterZ + windowWidth / 2;

  const addSection = (width, z, height = wallHeight, y = height / 2) => {
    if (width <= 0 || height <= 0) return;
    const section = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, height, width), wallMaterial);
    section.position.set(wallX, y, z);
    wallGroup.add(section);
  };

  addSection(windowLeft + wallWidth / 2, -wallWidth / 2 + (windowLeft + wallWidth / 2) / 2);
  addSection(wallWidth / 2 - windowRight, windowRight + (wallWidth / 2 - windowRight) / 2);
  addSection(windowWidth, windowCenterZ, windowCenterY - windowHeight / 2, (windowCenterY - windowHeight / 2) / 2);
  addSection(windowWidth, windowCenterZ, wallHeight - (windowCenterY + windowHeight / 2), windowCenterY + windowHeight / 2 + (wallHeight - windowCenterY - windowHeight / 2) / 2);

  const glass = new THREE.Mesh(new THREE.PlaneGeometry(windowWidth, windowHeight), glassMaterial);
  glass.rotation.y = Math.PI / 2;
  glass.position.set(wallX - wallThickness / 2 - 0.012, windowCenterY, windowCenterZ);
  wallGroup.add(glass);

  const frameX = wallX - wallThickness / 2 - 0.08;
  const addFrameBar = (height, width, y, z) => {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.16, height, width), frameMaterial);
    bar.position.set(frameX, y, z);
    wallGroup.add(bar);
  };
  addFrameBar(windowHeight + 0.28, 0.14, windowCenterY, windowLeft - 0.08);
  addFrameBar(windowHeight + 0.28, 0.14, windowCenterY, windowRight + 0.08);
  addFrameBar(0.14, windowWidth + 0.3, windowCenterY - windowHeight / 2 - 0.08, windowCenterZ);
  addFrameBar(0.14, windowWidth + 0.3, windowCenterY + windowHeight / 2 + 0.08, windowCenterZ);
  addFrameBar(windowHeight, 0.1, windowCenterY, windowCenterZ);
  scene.add(wallGroup);

  const snowCanvas = document.createElement('canvas');
  snowCanvas.width = 900;
  snowCanvas.height = 540;
  const snowContext = snowCanvas.getContext('2d');
  const sky = snowContext.createLinearGradient(0, 0, 0, snowCanvas.height);
  sky.addColorStop(0, '#5797b4');
  sky.addColorStop(0.58, '#b9dce5');
  sky.addColorStop(1, '#eaf7f8');
  snowContext.fillStyle = sky;
  snowContext.fillRect(0, 0, snowCanvas.width, snowCanvas.height);
  snowContext.fillStyle = '#d7e9ed';
  snowContext.beginPath();
  snowContext.moveTo(0, 390);
  snowContext.lineTo(170, 210);
  snowContext.lineTo(315, 350);
  snowContext.lineTo(485, 160);
  snowContext.lineTo(700, 350);
  snowContext.lineTo(900, 220);
  snowContext.lineTo(900, 540);
  snowContext.lineTo(0, 540);
  snowContext.closePath();
  snowContext.fill();
  const snowTexture = new THREE.CanvasTexture(snowCanvas);
  const snowyView = new THREE.Mesh(
    new THREE.PlaneGeometry(windowWidth - 0.18, windowHeight - 0.18),
    new THREE.MeshBasicMaterial({ map: snowTexture, side: THREE.DoubleSide })
  );
  snowyView.rotation.y = Math.PI / 2;
  snowyView.position.set(wallX + 0.04, windowCenterY, windowCenterZ);
  scene.add(snowyView);

  const baseImage = snowContext.getImageData(0, 0, snowCanvas.width, snowCanvas.height);
  const flakes = Array.from({ length: 90 }, () => ({
    x: Math.random() * snowCanvas.width,
    y: Math.random() * snowCanvas.height,
    radius: 2 + Math.random() * 4,
    speed: 20 + Math.random() * 42,
    drift: Math.random() * Math.PI * 2
  }));
  const drawSnowfall = () => {
    snowContext.putImageData(baseImage, 0, 0);
    snowContext.fillStyle = 'rgba(255, 255, 255, 0.92)';
    flakes.forEach((flake) => {
      snowContext.beginPath();
      snowContext.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      snowContext.fill();
    });
    snowTexture.needsUpdate = true;
  };
  drawSnowfall();

  const snowCount = 300;
  const positions = new Float32Array(snowCount * 3);
  const speeds = new Float32Array(snowCount);
  for (let i = 0; i < snowCount; i++) {
    positions[i * 3] = wallX - 0.02;
    positions[i * 3 + 1] = windowCenterY - windowHeight / 2 + Math.random() * windowHeight;
    positions[i * 3 + 2] = windowLeft + Math.random() * windowWidth;
    speeds[i] = 0.08 + Math.random() * 0.14;
  }
  const snowGeometry = new THREE.BufferGeometry();
  snowGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  scene.add(new THREE.Points(snowGeometry, new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.14,
    transparent: true,
    opacity: 0.96,
    depthWrite: false
  })));

  return {
    update(delta) {
      flakes.forEach((flake) => {
        flake.y += flake.speed * delta;
        flake.x += Math.sin(flake.drift + flake.y * 0.01) * 0.35;
        if (flake.y > snowCanvas.height + 8) flake.y = -8;
        if (flake.x < -8) flake.x = snowCanvas.width + 8;
        if (flake.x > snowCanvas.width + 8) flake.x = -8;
      });
      drawSnowfall();
      const currentPositions = snowGeometry.attributes.position.array;
      for (let i = 0; i < snowCount; i++) {
        currentPositions[i * 3 + 1] -= speeds[i] * delta;
        currentPositions[i * 3 + 2] += Math.sin(i + delta) * 0.0015;
        if (currentPositions[i * 3 + 1] < windowCenterY - windowHeight / 2) {
          currentPositions[i * 3 + 1] = windowCenterY + windowHeight / 2;
        }
      }
      snowGeometry.attributes.position.needsUpdate = true;
    }
  };
}

export function createEnvironment(scene) {
  const roomLength = STATIONS.gamer + 10;

  const wallTexture = createBrickWallTexture();
  wallTexture.repeat.set(roomLength / 12, 1.45);

  // floor
  const floorGeo = new THREE.PlaneGeometry(roomLength, 8);
  const floorTexture = createFloorTileTexture();
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTexture,
    color: 0xf1f1ef,
    roughness: 0.96,
    metalness: 0.02
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(roomLength / 2 - 6, 0, 0);
  scene.add(floor);

  // ceiling
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x555a5e,
    roughness: 0.88,
    metalness: 0.04,
    emissive: 0x25282b,
    emissiveIntensity: 0.55,
    side: THREE.DoubleSide
  });
  const ceil = new THREE.Mesh(floorGeo, ceilingMaterial);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(roomLength / 2 - 6, 5, 0);
  scene.add(ceil);

  const ledMaterial = new THREE.MeshBasicMaterial({ color: 0xfff8e8 });
  const ledGeometry = new THREE.BoxGeometry(4.2, 0.035, 0.16);
  const ledPositions = [
    [1, -1.75], [1, 1.75],
    [8, -1.75], [8, 1.75],
    [15, -1.75], [15, 1.75],
    [22, -1.75], [22, 1.75],
    [29, -1.75], [29, 1.75],
    [36, -1.75], [36, 1.75]
  ];
  ledPositions.forEach(([x, z]) => {
    const led = new THREE.Mesh(ledGeometry, ledMaterial);
    led.position.set(x, 4.96, z);
    scene.add(led);

    const ledLight = new THREE.PointLight(0xfff8e8, 0.22, 7);
    ledLight.position.set(x, 4.75, z);
    scene.add(ledLight);
  });

  // back wall with warm brick texture and subtle softness
  const wallGeo = new THREE.PlaneGeometry(roomLength, 5);
  const wall = new THREE.Mesh(
    wallGeo,
    new THREE.MeshStandardMaterial({
      map: wallTexture,
      color: 0xd68c50,
      roughness: 0.82,
      metalness: 0.02,
      bumpMap: wallTexture,
      bumpScale: 0.08
    })
  );
  wall.position.set(roomLength / 2 - 6, 2.5, -4);
  scene.add(wall);

  // simple dividers at station boundaries
  // Only photobooth divider has been replaced with sliding door
  // So no static divider here anymore

  // subtle ceiling lights
  for (let i = 0; i < 6; i++) {
    const l = new THREE.PointLight(0xffffff, 0.08, 6);
    l.position.set(i * (roomLength / 6) - 2, 4.6, 0);
    scene.add(l);
  }

  // Create sliding doors at wall divider positions
  const desktopDoor = createSlidingDoor(scene, STATIONS.desktop - 2);
  const photoboothDoor = createSlidingDoor(scene, STATIONS.photobooth - 2);
  const gamerDoor = createSlidingDoor(scene, STATIONS.gamer - 2);
  const snowWall = createSnowyEndWall(scene, STATIONS.gamer + 4);
  return { desktopDoor, photoboothDoor, gamerDoor, snowWall };
}
