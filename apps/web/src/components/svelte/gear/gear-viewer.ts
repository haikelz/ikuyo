import {
  ACESFilmicToneMapping,
  Box3,
  DirectionalLight,
  HemisphereLight,
  Mesh,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  ShadowMaterial,
  SRGBColorSpace,
  TOUCH,
  Texture,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Group,
  type Material,
  type WebGLRenderTarget,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createKeyboard, createPlayer } from "./gear-models";

export type GearKind = "player" | "keyboard";
export type ViewCommand = "reset" | "top" | "left" | "right" | "up" | "down" | "in" | "out";
export type ModelView = "default" | "top" | "custom";
export type GearViewer = {
  move: (command: ViewCommand) => void;
  dispose: () => void;
};

export async function createGearViewer(
  canvas: HTMLCanvasElement,
  kind: GearKind,
  screenSrc: string | undefined,
  onViewChange: (view: ModelView) => void,
  onUnavailable: () => void,
): Promise<GearViewer> {
  const scene = new Scene();
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;
  renderer.setClearColor(0x000000, 0);

  const camera = new PerspectiveCamera(35, 1, 0.1, 150);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableDamping = false;
  controls.rotateSpeed = 0.75;
  controls.zoomSpeed = 0.8;
  controls.minPolarAngle = 0.015;
  controls.maxPolarAngle = Math.PI - 0.08;
  // One finger can still scroll the page; two fingers orbit and pinch the model.
  controls.touches.ONE = null;
  controls.touches.TWO = TOUCH.DOLLY_ROTATE;
  canvas.style.touchAction = "pan-y";

  let frame: number | undefined;
  let resizeObserver: ResizeObserver | undefined;
  let environment: WebGLRenderTarget | undefined;
  let screen: Texture | undefined;
  let disposed = false;
  let framing = false;

  function render() {
    if (disposed || frame !== undefined) return;
    frame = requestAnimationFrame(() => {
      frame = undefined;
      if (!disposed) renderer.render(scene, camera);
    });
  }

  function changed() {
    if (!framing) onViewChange("custom");
    render();
  }

  function contextLost(event: Event) {
    event.preventDefault();
    onUnavailable();
  }

  function dispose() {
    disposed = true;
    if (frame !== undefined) cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    controls.removeEventListener("change", changed);
    controls.dispose();
    canvas.removeEventListener("webglcontextlost", contextLost);

    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    const textures = new Set<Texture>();
    if (screen) textures.add(screen);
    scene.traverse((object) => {
      if (object instanceof DirectionalLight) object.shadow.dispose();
      if (!(object instanceof Mesh)) return;
      geometries.add(object.geometry);
      for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
        materials.add(material);
        for (const value of Object.values(material)) {
          if (value instanceof Texture) textures.add(value);
        }
      }
    });
    for (const geometry of geometries) geometry.dispose();
    for (const material of materials) material.dispose();
    for (const texture of textures) texture.dispose();
    environment?.dispose();
    scene.clear();
    renderer.dispose();
  }

  try {
    let model: Group;
    if (kind === "keyboard") {
      model = createKeyboard();
    } else {
      if (!screenSrc) throw new Error("The player screen texture is required.");
      screen = await new TextureLoader().loadAsync(screenSrc);
      screen.colorSpace = SRGBColorSpace;
      screen.anisotropy = renderer.capabilities.getMaxAnisotropy();
      model = createPlayer(screen);
    }
    scene.add(model);

    const room = new RoomEnvironment();
    const pmrem = new PMREMGenerator(renderer);
    environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.65;
    room.dispose();
    pmrem.dispose();

    scene.add(new HemisphereLight(0xffffff, 0x5d6872, 1.3));
    const light = new DirectionalLight(0xfff8ed, 2.65);
    light.position.set(-5, 12, 7);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.left = -14;
    light.shadow.camera.right = 14;
    light.shadow.camera.top = 14;
    light.shadow.camera.bottom = -14;
    light.shadow.camera.far = 40;
    light.shadow.normalBias = 0.045;
    light.shadow.bias = -0.0003;
    light.shadow.radius = 4;
    scene.add(light);
    const fill = new DirectionalLight(0xd7e5ff, 0.9);
    fill.position.set(8, 5, -9);
    scene.add(fill);

    const ground = new Mesh(new PlaneGeometry(50, 50), new ShadowMaterial({ opacity: 0.16 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.03;
    ground.receiveShadow = true;
    scene.add(ground);
    renderer.shadowMap.needsUpdate = true;

    const bounds = new Box3().setFromObject(model);
    const target = bounds.getCenter(new Vector3());
    controls.target.copy(target);
    const defaultDirection = new Vector3(kind === "keyboard" ? 1.4 : 3.5, 11, 10).normalize();
    let fitDistance = 1;

    function fittedDistance() {
      const inverseRotation = camera.quaternion.clone().invert();
      const verticalSlope = Math.tan((camera.fov * Math.PI) / 360);
      const horizontalSlope = verticalSlope * camera.aspect;
      let distance = 0;
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) {
            const corner = new Vector3(x, y, z).sub(target).applyQuaternion(inverseRotation);
            distance = Math.max(
              distance,
              Math.abs(corner.x) / horizontalSlope + corner.z,
              Math.abs(corner.y) / verticalSlope + corner.z,
            );
          }
        }
      }
      return distance * 1.18;
    }

    function frameModel(view: "default" | "top") {
      const direction = view === "top" ? new Vector3(0, 1, 0.015).normalize() : defaultDirection;
      camera.position.copy(target).addScaledVector(direction, 20);
      camera.lookAt(target);
      fitDistance = fittedDistance();
      controls.minDistance = fitDistance * 0.4;
      controls.maxDistance = fitDistance * 2.4;
      camera.position.copy(target).addScaledVector(direction, fitDistance);
      framing = true;
      controls.update();
      framing = false;
      onViewChange(view);
      render();
    }

    function resize() {
      const { width, height } = canvas.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const nextDistance = fittedDistance();
      camera.position
        .sub(target)
        .multiplyScalar(nextDistance / fitDistance)
        .add(target);
      fitDistance = nextDistance;
      controls.minDistance = fitDistance * 0.4;
      controls.maxDistance = fitDistance * 2.4;
      framing = true;
      controls.update();
      framing = false;
      render();
    }

    const { width, height } = canvas.getBoundingClientRect();
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    frameModel("default");
    controls.addEventListener("change", changed);
    canvas.addEventListener("webglcontextlost", contextLost);
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return {
      move(command) {
        if (disposed) return;
        if (command === "reset" || command === "top") {
          frameModel(command === "reset" ? "default" : "top");
          return;
        }
        if (command === "left") controls.rotateLeft(Math.PI / 12);
        if (command === "right") controls.rotateLeft(-Math.PI / 12);
        if (command === "up") controls.rotateUp(Math.PI / 12);
        if (command === "down") controls.rotateUp(-Math.PI / 12);
        if (command === "in") controls.dollyOut(1.18);
        if (command === "out") controls.dollyIn(1.18);
        controls.update();
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
