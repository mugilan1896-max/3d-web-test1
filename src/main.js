import * as THREE from 'three';
import { createScene } from './scene/createScene.js';
import { createCamera } from './scene/createCamera.js';
import { createLighting } from './scene/createLighting.js';
import { createEnvironment } from './scene/createEnvironment.js';
import { createLandingRoom } from './objects/createLandingRoom.js';
import { createDesktopSetup } from './objects/createDesktopSetup.js';
import { createPhotobooth } from './objects/createPhotobooth.js';
import { createGamerStreamingSetup } from './objects/createGamerStreamingSetup.js';
import { createVideoScreen } from './media/createVideoScreen.js';
import { createScrollTimeline } from './animation/createScrollTimeline.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATIONS } from './config.js';
import { setupResize } from './utils/resize.js';

const canvas = document.querySelector('canvas.webgl');
const { scene, renderer } = createScene(canvas);
const { camera, cameraTarget } = createCamera();
createLighting(scene);
const environment = createEnvironment(scene);
const desktopDoor = environment.desktopDoor || null;
const photoboothDoor = environment.photoboothDoor || null;
const gamerDoor = environment.gamerDoor || null;
const snowWall = environment.snowWall || null;

let desktopVideoObj, photoboothVideoObj;

async function init() {
  const landing = createLandingRoom(scene);
  const landingCube = landing.cube || null;
  if (landingCube) {
    landingCube.rotation.y = 0;
  }
  const landingBaseY = landingCube ? landingCube.position.y : 0;

  desktopVideoObj = await createVideoScreen({ src: '/videos/desktop.mp4', width: 1.6, height: 0.95 });
  const desktop = createDesktopSetup(scene, desktopVideoObj.mesh);

  photoboothVideoObj = await createVideoScreen({ src: '/videos/photobooth.mp4', width: 1.2, height: 0.7 });
  const photobooth = createPhotobooth(scene, photoboothVideoObj.mesh);
  createGamerStreamingSetup(scene);

  scene.add(camera);

  setupResize(renderer, camera);

  const tl = createScrollTimeline({ camera, cameraTarget, renderer, videos: [desktopVideoObj, photoboothVideoObj], landingCube, desktopDoor, photoboothDoor, gamerDoor });
  // expose for debug
  window._APP = { camera, cameraTarget, tl, landingCube };

  // Ensure ScrollTrigger is registered here
  try { gsap.registerPlugin(ScrollTrigger); } catch (e) { /* already registered */ }
  try { window.ScrollTrigger = ScrollTrigger; } catch (e) { /* ignore */ }

  // Ensure ScrollTrigger measurements are up-to-date and synced to current scroll
  if (window.ScrollTrigger) {
    // refresh on next frame to allow DOM to settle
    requestAnimationFrame(() => {
      try { window.ScrollTrigger.refresh(); } catch (e) { /* ignore */ }
    });
  }

  // make sure page starts at top so landing rotation is visible from the start
  window.scrollTo(0, 0);
  let previousFrameTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);
    const currentFrameTime = performance.now();
    const delta = Math.min((currentFrameTime - previousFrameTime) / 1000, 0.05);
    previousFrameTime = currentFrameTime;
    try {
      if (landingCube && window.scrollY <= 1) {
        const t = performance.now() * 0.0015;
        landingCube.position.y = landingBaseY + Math.sin(t) * 0.03;
      }
    } catch (e) { /* ignore */ }
    if (snowWall) snowWall.update(delta);
    camera.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    renderer.render(scene, camera);
  }
  animate();
}

init().catch((error) => {
  console.error('Scene initialization failed:', error);
});
