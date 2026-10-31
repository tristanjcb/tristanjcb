import * as THREE from 'three';
import { chapters, position, quality, sceneSettings, type SceneState } from './model';
export type Engine = {
  ready: Promise<void>;
  setActive: (value: boolean) => void;
  dispose: () => void;
};
export function createAurora(
  host: HTMLElement,
  state: { current: SceneState },
  onFailure: () => void,
): Engine {
  const tier = quality(window.innerWidth, navigator.hardwareConcurrency || 4);
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: !tier.modest,
    powerPreference: 'low-power',
    failIfMajorPerformanceCaveat: true,
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, tier.dpr));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.4;
  renderer.debug.onShaderError = () => queueMicrotask(onFailure);
  const canvas = renderer.domElement;
  canvas.dataset.auroraCanvas = '';
  canvas.setAttribute('aria-hidden', 'true');
  host.append(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 40);
  camera.position.z = 6;
  scene.add(new THREE.HemisphereLight(0xe5e9ff, 0x463357, 2.4));
  const key = new THREE.DirectionalLight(0xffffff, 4);
  key.position.set(2, 3, 4);
  scene.add(key);
  const cyan = new THREE.PointLight(0x74ddea, 25, 12);
  cyan.position.set(-3, 1, 2);
  scene.add(cyan);
  const pink = new THREE.PointLight(0xf3a9d7, 30, 12);
  pink.position.set(3, -2, 1);
  scene.add(pink);
  const fill = new THREE.DirectionalLight(0x9188f8, 3);
  fill.position.set(-2, -1, -3);
  scene.add(fill);
  const geometry = new THREE.SphereGeometry(1, tier.segments, Math.round(tier.segments * 0.7));
  const uv = geometry.getAttribute('uv');
  function target(chapter: (typeof chapters)[number]) {
    const values = new Float32Array(uv.count * 3);
    for (let i = 0; i < uv.count; i++) values.set(position(chapter, uv.getX(i), uv.getY(i)), i * 3);
    const clone = geometry.clone();
    clone.setAttribute('position', new THREE.BufferAttribute(values, 3));
    clone.computeVertexNormals();
    const normals = clone.getAttribute('normal').clone();
    clone.dispose();
    return { positions: new THREE.BufferAttribute(values, 3), normals };
  }
  const base = target('origin');
  geometry.setAttribute('position', base.positions);
  geometry.setAttribute('normal', base.normals);
  const targets = chapters.slice(1).map(target);
  geometry.morphAttributes.position = targets.map((value) => value.positions);
  geometry.morphAttributes.normal = targets.map((value) => value.normals);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xb5a7fb,
    metalness: 0.18,
    roughness: 0.25,
    iridescence: 1,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [180, 650],
    clearcoat: 1,
    clearcoatRoughness: 0.18,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
  const wireSource = new THREE.IcosahedronGeometry(1.9, 1);
  const linesGeometry = new THREE.EdgesGeometry(wireSource);
  wireSource.dispose();
  const linesMaterial = new THREE.LineBasicMaterial({
    color: 0x9188f8,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
  });
  const lines = new THREE.LineSegments(linesGeometry, linesMaterial);
  scene.add(lines);
  const dotsGeometry = new THREE.BufferGeometry();
  const dotPositions = new Float32Array(tier.particles * 3);
  for (let i = 0; i < tier.particles; i++) {
    const angle = i * 2.399963;
    const y = 1 - (2 * (i + 0.5)) / tier.particles;
    const radius = Math.sqrt(1 - y * y);
    const spread = 2.1 + (i % 7) * 0.13;
    dotPositions.set(
      [Math.cos(angle) * radius * spread, y * spread, Math.sin(angle) * radius * spread],
      i * 3,
    );
  }
  dotsGeometry.setAttribute('position', new THREE.BufferAttribute(dotPositions, 3));
  const dotsMaterial = new THREE.PointsMaterial({
    color: 0xb9b3ff,
    size: tier.modest ? 0.022 : 0.018,
    transparent: true,
    opacity: 0.65,
    sizeAttenuation: true,
    depthWrite: false,
  });
  const dots = new THREE.Points(dotsGeometry, dotsMaterial);
  scene.add(dots);
  const rings = new THREE.Group();
  const ringGeometry = new THREE.TorusGeometry(1.9, 0.003, 3, 100);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x74ddea,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.set(0.8 + i * 0.55, 0.2 + i * 0.4, i * 0.6);
    rings.add(ring);
  }
  scene.add(rings);
  const scaleTarget = new THREE.Vector3();
  const color = new THREE.Color();
  const targetColor = new THREE.Color();
  let frame = 0,
    active = false,
    disposed = false,
    previous = 0,
    elapsed = 0,
    lastStats = 0,
    slow = 0;
  let fps = tier.fps;
  let downgraded = false;
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.position.z = camera.aspect < 0.8 ? 7.6 : 6;
    camera.updateProjectionMatrix();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  const lost = (event: Event) => {
    event.preventDefault();
    stop();
    onFailure();
  };
  canvas.addEventListener('webglcontextlost', lost);
  function stop() {
    active = false;
    cancelAnimationFrame(frame);
    host.dataset.rendering = 'paused';
  }
  function draw(now: number) {
    if (disposed || !active) return;
    frame = requestAnimationFrame(draw);
    if (now - previous < 1000 / fps) return;
    const delta = Math.min((now - previous) / 1000, 0.06);
    previous = now;
    elapsed += delta;
    const start = performance.now();
    const current = state.current;
    const settings = sceneSettings(current.energy, current.density, current.palette);
    const chapter = chapters.indexOf(current.chapter);
    const blend = 1 - Math.exp(-delta * 3);
    for (let i = 0; i < 4; i++)
      mesh.morphTargetInfluences![i] +=
        ((chapter === i + 1 ? 1 : 0) - mesh.morphTargetInfluences![i]) * blend;
    const hex =
      settings.palette === 'ice'
        ? 0x74ddea
        : settings.palette === 'rose'
          ? 0xf3a9d7
          : current.chapter === 'music'
            ? 0x74ddea
            : current.chapter === 'creator'
              ? 0xf3a9d7
              : 0x9188f8;
    targetColor.setHex(hex);
    color.copy(material.color).lerp(targetColor, blend);
    material.color.copy(color);
    const speed = 0.035 + settings.energy * 0.13;
    mesh.rotation.y = elapsed * speed + current.pointer.x * 0.13;
    mesh.rotation.x = Math.sin(elapsed * 0.18) * 0.12 + current.pointer.y * 0.08;
    mesh.rotation.z = Math.sin(elapsed * 0.12) * 0.09;
    mesh.scale.setScalar(1 + Math.sin(elapsed * (0.4 + settings.energy)) * 0.035);
    material.opacity += ((chapter === 4 ? 0.12 : 1) - material.opacity) * blend;
    dots.rotation.y = -elapsed * speed * 0.35;
    dots.rotation.z = Math.sin(elapsed * 0.1) * 0.1;
    dots.scale.lerp(scaleTarget.setScalar(chapter === 4 ? 1.55 : 1), blend);
    dotsGeometry.setDrawRange(
      0,
      Math.round(settings.density * (downgraded ? Math.min(60, tier.particles) : tier.particles)),
    );
    dotsMaterial.color.lerp(targetColor, blend);
    dotsMaterial.opacity = current.dark ? 0.65 : 0.6;
    lines.rotation.copy(mesh.rotation);
    linesMaterial.color.lerp(targetColor, blend);
    linesMaterial.opacity += ((chapter === 1 ? 0.36 : 0.06) - linesMaterial.opacity) * blend;
    rings.rotation.y = elapsed * 0.025;
    ringMaterial.color.lerp(targetColor, blend);
    ringMaterial.opacity += ((chapter === 2 ? 0.35 : 0.06) - ringMaterial.opacity) * blend;
    renderer.toneMappingExposure = current.dark ? 1.4 : 1.1;
    try {
      renderer.render(scene, camera);
    } catch {
      stop();
      onFailure();
      return;
    }
    const duration = performance.now() - start;
    if (duration > 26) slow++;
    else slow = Math.max(0, slow - 1);
    if (slow > 30 && !downgraded) {
      downgraded = true;
      fps = 24;
      renderer.setPixelRatio(1);
      dotsGeometry.setDrawRange(0, Math.min(60, Math.round(settings.density * tier.particles)));
      host.dataset.quality = 'reduced';
    }
    if (now - lastStats > 1000) {
      host.dataset.drawCalls = String(renderer.info.render.calls);
      host.dataset.gpuGeometries = String(renderer.info.memory.geometries);
      host.dataset.gpuTextures = String(renderer.info.memory.textures);
      host.dataset.triangles = String(renderer.info.render.triangles);
      host.dataset.frameCpuMs = duration.toFixed(2);
      lastStats = now;
    }
  }
  const setActive = (value: boolean) => {
    if (disposed) return;
    if (value && !active) {
      active = true;
      previous = performance.now();
      host.dataset.rendering = 'active';
      frame = requestAnimationFrame(draw);
    } else if (!value) stop();
  };
  return {
    ready: renderer.compileAsync(scene, camera).then(() => {}),
    setActive,
    dispose() {
      if (disposed) return;
      disposed = true;
      stop();
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', lost);
      geometry.dispose();
      material.dispose();
      linesGeometry.dispose();
      linesMaterial.dispose();
      dotsGeometry.dispose();
      dotsMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      renderer.renderLists.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
