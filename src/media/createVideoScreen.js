import * as THREE from 'three';

// returns {mesh, videoEl, play, pause}
export async function createVideoScreen({ src, width = 1.6, height = 0.9, fallbackColor = 0x0d1016 }) {
  const fallbackMat = new THREE.MeshStandardMaterial({ color: fallbackColor, roughness: 0.55, metalness: 0.08 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), fallbackMat);

  const video = document.createElement('video');
  video.src = src;
  video.crossOrigin = 'anonymous';
  video.preload = 'auto';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.setAttribute('playsinline', 'true');

  const texture = new THREE.VideoTexture(video);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const screenMat = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });

  const tryFallback = () => {
    if (!video.videoWidth || !video.videoHeight) {
      mesh.material = fallbackMat;
      return;
    }
    mesh.material = screenMat;
  };

  video.onerror = () => {
    tryFallback();
  };
  video.onloadeddata = tryFallback;

  const play = () => {
    try {
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {});
      }
    } catch (e) {
      // ignore autoplay restrictions gracefully
    }
  };

  const pause = () => {
    try { video.pause(); } catch (e) { /* ignore */ }
  };

  return { mesh, videoEl: video, play, pause };
}
