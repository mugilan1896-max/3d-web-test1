import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { STATIONS, CAMERA_POSITIONS } from '../config.js';

gsap.registerPlugin(ScrollTrigger);

export function createScrollTimeline({ camera, cameraTarget, renderer, videos = [], landingCube = null, desktopDoor = null, photoboothDoor = null, gamerDoor = null }) {
  const sceneEase = 'power3.inOut';

  // Set the master timeline to start when the desktop panel becomes relevant
  // so that the landing panel scroll can be used for the cube rotation.
  const desktopStart = () => {
    const el = document.querySelector('.panel.desktop');
    return el ? el.offsetTop - window.innerHeight : 0;
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.scroll-space',
      start: desktopStart,
      end: () => document.body.scrollHeight - window.innerHeight,
      scrub: 1.6,
      pin: false,
    }
  });

  // The cube rotation is handled by a dedicated ScrollTrigger tied to the landing panel,
  // so it completes during the user's scroll through that panel before the master timeline starts.
  if (landingCube) {
    const cubeScroll = { trigger: '.panel.landing', start: 'top top', end: 'bottom top', scrub: 1.4 };
    const cubeMotion = gsap.timeline({ scrollTrigger: cubeScroll });
    cubeMotion.to(landingCube.position, { x: -1.85, y: 2.45, z: -8.5, ease: 'none' });
    cubeMotion.to(landingCube.scale, { x: 6, y: 6, z: 6, ease: 'none' }, 0);
    cubeMotion.to(landingCube.rotation, { y: Math.PI * 2, ease: 'none' }, 0);
  }

  // Animate sliding doors when scrolling through their respective sections
  // Desktop door slides LEFT (negative Z direction) as user scrolls forward
  if (desktopDoor && desktopDoor.panelGroup) {
    gsap.to(desktopDoor.panelGroup.position, {
      z: -desktopDoor.maxSlideDistance,  // Slide LEFT (negative Z)
      ease: sceneEase,
      scrollTrigger: {
        trigger: '.panel.landing',
        start: 'bottom 76%',
        end: 'bottom 64%',
        scrub: 0.9,
      }
    });
  }

  // Photobooth door slides LEFT (negative Z direction) as user scrolls forward
  if (photoboothDoor && photoboothDoor.panelGroup) {
    gsap.to(photoboothDoor.panelGroup.position, {
      z: -photoboothDoor.maxSlideDistance,  // Slide LEFT (negative Z)
      ease: sceneEase,
      scrollTrigger: {
        trigger: '.panel.desktop',
        start: 'bottom 76%',
        end: 'bottom 64%',
        scrub: 0.9,
      }
    });
  }

  if (gamerDoor && gamerDoor.panelGroup) {
    gsap.to(gamerDoor.panelGroup.position, {
      z: -gamerDoor.maxSlideDistance,
      ease: sceneEase,
      scrollTrigger: {
        trigger: '.panel.photobooth',
        start: 'bottom 76%',
        end: 'bottom 64%',
        scrub: 0.9,
      }
    });
  }

  // move from landing to desktop approach (this starts when the master timeline becomes active)
  tl.to(camera.position, { x: CAMERA_POSITIONS.desktopApproach.x, y: CAMERA_POSITIONS.desktopApproach.y + 0.18, z: CAMERA_POSITIONS.desktopApproach.z, ease: sceneEase, duration: 1.6 });
  tl.to(cameraTarget, { x: STATIONS.desktop, y: 1.4, z: 0, ease: sceneEase, duration: 1.2 }, '<');

  tl.to(camera.position, { x: CAMERA_POSITIONS.desktopFocus.x, y: CAMERA_POSITIONS.desktopFocus.y, z: CAMERA_POSITIONS.desktopFocus.z, ease: sceneEase, duration: 0.9 });
  tl.to(cameraTarget, { x: STATIONS.desktop, y: 1.55, z: 0, ease: sceneEase, duration: 0.9 }, '<');

  tl.to(camera.position, { x: CAMERA_POSITIONS.photoboothApproach.x, y: CAMERA_POSITIONS.photoboothApproach.y + 0.2, z: CAMERA_POSITIONS.photoboothApproach.z, ease: sceneEase, duration: 1.8 });
  tl.to(cameraTarget, { x: STATIONS.photobooth, y: 1.4, z: 0, ease: sceneEase, duration: 1.8 }, '<');

  tl.to(camera.position, { x: CAMERA_POSITIONS.photoboothFocus.x, y: CAMERA_POSITIONS.photoboothFocus.y, z: CAMERA_POSITIONS.photoboothFocus.z, ease: sceneEase, duration: 0.9 });
  tl.to(cameraTarget, { x: STATIONS.photobooth, y: 1.6, z: 0, ease: sceneEase, duration: 0.9 }, '<');

  tl.to(camera.position, { x: CAMERA_POSITIONS.gamerApproach.x, y: CAMERA_POSITIONS.gamerApproach.y + 0.2, z: CAMERA_POSITIONS.gamerApproach.z, ease: sceneEase, duration: 1.8 });
  tl.to(cameraTarget, { x: STATIONS.gamer, y: 1.4, z: 0, ease: sceneEase, duration: 1.8 }, '<');

  tl.to(camera.position, { x: CAMERA_POSITIONS.gamerFocus.x, y: CAMERA_POSITIONS.gamerFocus.y, z: CAMERA_POSITIONS.gamerFocus.z, ease: sceneEase, duration: 0.9 });
  tl.to(cameraTarget, { x: STATIONS.gamer, y: 1.55, z: 0, ease: sceneEase, duration: 0.9 }, '<');

  ScrollTrigger.create({
    trigger: '.panel.desktop',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => { videos.forEach(v => v.play && v.play()); },
    onEnterBack: () => { videos.forEach(v => v.play && v.play()); },
    onLeave: () => { videos.forEach(v => v.pause && v.pause()); }
  });

  ScrollTrigger.create({
    trigger: '.panel.photobooth',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => { videos.forEach(v => v.play && v.play()); },
    onEnterBack: () => { videos.forEach(v => v.play && v.play()); },
    onLeave: () => { videos.forEach(v => v.pause && v.pause()); }
  });

  return tl;
}
