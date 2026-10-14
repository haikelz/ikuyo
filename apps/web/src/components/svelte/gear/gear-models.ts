import {
  BoxGeometry,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Path,
  PlaneGeometry,
  Shape,
  SRGBColorSpace,
  type Material,
  type Texture,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

type KeyFace = {
  main: string;
  kana?: string;
  shifted?: string;
  width?: number;
  dark?: boolean;
  logo?: boolean;
};

function roundedRectangle(
  path: Shape | Path,
  width: number,
  depth: number,
  radius = 0.08,
  x = 0,
  z = 0,
) {
  const left = x - width / 2;
  const right = x + width / 2;
  const bottom = z - depth / 2;
  const top = z + depth / 2;

  path.moveTo(left + radius, bottom);
  path.lineTo(right - radius, bottom);
  path.quadraticCurveTo(right, bottom, right, bottom + radius);
  path.lineTo(right, top - radius);
  path.quadraticCurveTo(right, top, right - radius, top);
  path.lineTo(left + radius, top);
  path.quadraticCurveTo(left, top, left, top - radius);
  path.lineTo(left, bottom + radius);
  path.quadraticCurveTo(left, bottom, left + radius, bottom);
  path.closePath();
}

function solid(
  parent: Group,
  material: Material,
  size: readonly [number, number, number],
  position: readonly [number, number, number],
  radius = 0.04,
) {
  const mesh = new Mesh(new RoundedBoxGeometry(...size, 3, radius), material);
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function horizontalShape(shape: Shape, height: number) {
  const geometry = new ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 8,
  });
  geometry.rotateX(-Math.PI / 2);
  return geometry;
}

function canvasTexture(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("A 2D context is required for device textures.");

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return { context, texture };
}

function keyLegend(face: KeyFace) {
  const width = Math.round(256 * (face.width ?? 1));
  const { context, texture } = canvasTexture(width, 256);
  context.fillStyle = face.dark ? "#eceee8" : "#111411";
  context.textBaseline = "middle";
  const font = '"Arial", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif';

  if (face.logo) {
    context.strokeStyle = "#eceee8";
    context.lineWidth = 9;
    context.lineJoin = "miter";
    context.beginPath();
    context.moveTo(53, 54);
    context.lineTo(53, 152);
    context.lineTo(129, 152);
    context.lineTo(129, 52);
    context.lineTo(161, 52);
    context.lineTo(161, 91);
    context.lineTo(184, 91);
    context.lineTo(184, 190);
    context.lineTo(131, 190);
    context.moveTo(34, 98);
    context.lineTo(129, 98);
    context.moveTo(91, 48);
    context.lineTo(91, 192);
    context.stroke();
  } else if (face.main === "Keep Refrigerated") {
    context.font = `500 56px ${font}`;
    context.fillText("Keep", 35, 91);
    context.fillText("Refrigerated", 35, 153);
  } else if (face.kana) {
    context.font = `700 ${face.shifted ? 70 : 100}px ${font}`;
    context.fillText(face.main, 29, face.shifted ? 183 : 68);
    context.font = `600 80px ${font}`;
    context.fillText(face.kana, width - 90, 180);
    if (face.shifted) {
      context.font = `700 66px ${font}`;
      context.fillText(face.shifted, 29, 64);
    }
  } else {
    context.font = `700 ${face.main.length > 2 ? 56 : 86}px ${font}`;
    context.textAlign = face.main.length > 2 ? "center" : "left";
    context.fillText(face.main, face.main.length > 2 ? width / 2 : 35, 136);
  }

  return texture;
}

function keycapGeometry(width: number, height: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
  const rings = [
    { width: width - 0.05, depth: 0.95, radius: 0.045, y: 0 },
    { width: width - 0.13, depth: 0.87, radius: 0.055, y: height * 0.63 },
    { width: width - 0.29, depth: 0.72, radius: 0.085, y: height },
  ];
  const cornerSteps = 6;
  const ringSize = (cornerSteps + 1) * 4;

  for (const ring of rings) {
    const halfWidth = ring.width / 2 - ring.radius;
    const halfDepth = ring.depth / 2 - ring.radius;
    const corners = [
      [halfWidth, halfDepth],
      [-halfWidth, halfDepth],
      [-halfWidth, -halfDepth],
      [halfWidth, -halfDepth],
    ];

    for (const [corner, center] of corners.entries()) {
      for (let step = 0; step <= cornerSteps; step++) {
        const angle = (corner + step / cornerSteps) * (Math.PI / 2);
        const z = center[1] + Math.sin(angle) * ring.radius;
        vertices.push(
          center[0] + Math.cos(angle) * ring.radius,
          ring.y === height ? height - 0.025 * (1 - (z / 0.36) ** 2) : ring.y,
          z,
        );
      }
    }
  }

  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let index = 0; index < ringSize; index++) {
      const next = (index + 1) % ringSize;
      const lower = ring * ringSize;
      const upper = lower + ringSize;
      indices.push(lower + index, upper + index, lower + next);
      indices.push(lower + next, upper + index, upper + next);
    }
  }

  // A cylindrical dish and independent top normals avoid star-shaped shading
  // on the long spacebar while preserving the sculpted keycap silhouette.
  const topStart = vertices.length / 3;
  const columns = 16;
  const halfWidth = (width - 0.29) / 2;
  const radius = 0.085;
  // Match the sidewall's arc samples to keep the rounded corners closed.
  const rimRows = Array.from(
    { length: cornerSteps },
    (_, step) => 0.36 - radius + radius * Math.cos((step * Math.PI) / (2 * cornerSteps)),
  );
  const rowPositions = [
    ...rimRows.map((z) => -z),
    ...Array.from({ length: 13 }, (_, row) => (row / 12 - 0.5) * 2 * (0.36 - radius)),
    ...rimRows.toReversed(),
  ];
  for (const [row, z] of rowPositions.entries()) {
    const cornerZ = Math.max(0, Math.abs(z) - 0.36 + radius);
    const edgeX = halfWidth - radius + Math.sqrt(Math.max(0, radius ** 2 - cornerZ ** 2));
    for (let column = 0; column <= columns; column++) {
      vertices.push(
        (column / columns - 0.5) * 2 * edgeX,
        height - 0.025 * (1 - (z / 0.36) ** 2),
        z,
      );
      if (row < rowPositions.length - 1 && column < columns) {
        const current = topStart + row * (columns + 1) + column;
        const nextRow = current + columns + 1;
        indices.push(current, nextRow, current + 1);
        indices.push(current + 1, nextRow, nextRow + 1);
      }
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const normals = geometry.getAttribute("normal");
  for (let index = topStart; index < vertices.length / 3; index++) {
    const slope = (-0.05 * vertices[index * 3 + 2]) / 0.36 ** 2;
    const length = Math.sqrt(1 + slope ** 2);
    normals.setXYZ(index, 0, 1 / length, slope / length);
  }
  return geometry;
}

export function createKeyboard() {
  const keyboard = new Group();
  keyboard.name = "NOIR Timeless82 V1";
  const shell = new MeshStandardMaterial({ color: "#e0e1d9", roughness: 0.72 });
  const pale = new MeshStandardMaterial({ color: "#d8d9d0", roughness: 0.77 });
  const dark = new MeshStandardMaterial({ color: "#0a0d0e", roughness: 0.7 });
  const plate = new MeshStandardMaterial({ color: "#262b2a", roughness: 0.83 });
  const recess = new MeshStandardMaterial({ color: "#070b0c", roughness: 0.95 });
  const stem = new MeshStandardMaterial({ color: "#e7e9dd", roughness: 0.54 });
  const clearSwitch = new MeshPhysicalMaterial({
    color: "#a3b4b0",
    roughness: 0.18,
    transparent: true,
    opacity: 0.48,
    metalness: 0.05,
    clearcoat: 1,
  });
  const centerX = 8.325;
  const centerZ = 3.15;

  solid(keyboard, shell, [17.39, 0.5, 7.04], [0, 0.33, 0], 0.13);
  solid(keyboard, plate, [16.9, 0.09, 6.55], [0, 0.58, 0], 0.05);

  const frameShape = new Shape();
  roundedRectangle(frameShape, 17.39, 7.04, 0.15);
  const opening = (x: number, z: number, width: number, depth: number) => {
    const hole = new Path();
    roundedRectangle(hole, width, depth, 0.06, x + width / 2 - centerX, -(z + depth / 2 - centerZ));
    frameShape.holes.push(hole);
  };

  opening(-0.03, -0.03, 1.06, 1.06);
  for (const x of [1.25, 5.5, 9.75]) opening(x, -0.03, 4.05, 1.06);
  opening(14, -0.03, 1.05, 1.06);
  opening(15.45, 0.06, 1.2, 0.87);
  opening(15.65, 1.28, 1.06, 4.04);

  const typing = new Path();
  for (const [index, [x, z]] of [
    [-0.03, 1.28],
    [15.03, 1.28],
    [15.03, 4.3],
    [14.03, 4.3],
    [14.03, 5.3],
    [13.03, 5.3],
    [13.03, 6.33],
    [-0.03, 6.33],
  ].entries()) {
    if (index === 0) typing.moveTo(x - centerX, -(z - centerZ));
    else typing.lineTo(x - centerX, -(z - centerZ));
  }
  typing.closePath();
  frameShape.holes.push(typing);

  const arrows = new Path();
  for (const [index, [x, z]] of [
    [14.22, 4.3],
    [15.28, 4.3],
    [15.28, 5.34],
    [16.28, 5.34],
    [16.28, 6.33],
    [13.22, 6.33],
    [13.22, 5.34],
    [14.22, 5.34],
  ].entries()) {
    if (index === 0) arrows.moveTo(x - centerX, -(z - centerZ));
    else arrows.lineTo(x - centerX, -(z - centerZ));
  }
  arrows.closePath();
  frameShape.holes.push(arrows);

  const frame = new Mesh(horizontalShape(frameShape, 0.18), shell);
  frame.position.y = 0.49;
  frame.castShadow = true;
  frame.receiveShadow = true;
  keyboard.add(frame);

  const capGeometries = new Map<string, BufferGeometry>();
  function addKey(x: number, z: number, face: KeyFace, height = 0.38) {
    const width = face.width ?? 1;
    const cacheKey = `${width}:${height}`;
    let geometry = capGeometries.get(cacheKey);
    if (!geometry) {
      geometry = keycapGeometry(width, height);
      capGeometries.set(cacheKey, geometry);
    }

    const cap = new Mesh(geometry, face.dark ? dark : pale);
    cap.name = face.logo ? "Milk logo key" : face.main || "Spacebar";
    cap.position.set(x + width / 2 - centerX, 0.66, z + 0.5 - centerZ);
    cap.castShadow = true;
    cap.receiveShadow = true;
    keyboard.add(cap);

    if (face.main || face.logo) {
      const legendGeometry = new PlaneGeometry(width - 0.38, 0.62, 1, 12);
      legendGeometry.rotateX(-Math.PI / 2);
      const positions = legendGeometry.getAttribute("position");
      for (let index = 0; index < positions.count; index++) {
        const z = positions.getZ(index);
        positions.setY(index, height - 0.025 * (1 - (z / 0.36) ** 2) + 0.003);
      }
      const legend = new Mesh(
        legendGeometry,
        new MeshBasicMaterial({
          map: keyLegend(face),
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          toneMapped: false,
        }),
      );
      legend.position.copy(cap.position);
      keyboard.add(legend);
    }
  }

  addKey(0, 0, { main: "", dark: true, logo: true }, 0.43);
  addKey(14, 0, { main: "", dark: true, logo: true }, 0.43);

  for (const [bank, x] of [1.25, 5.5, 9.75].entries()) {
    const bankShape = new Shape();
    roundedRectangle(bankShape, 4.03, 1, 0.04);
    for (let index = 0; index < 4; index++) {
      const hole = new Path();
      roundedRectangle(hole, 0.73, 0.72, 0.01, index - 1.5, 0);
      bankShape.holes.push(hole);

      const ledAtBack = bank === 0 && (index === 1 || index === 2);
      solid(
        keyboard,
        stem,
        [0.095, 0.035, 0.08],
        [x + index + 0.5 - centerX, 0.64, (ledAtBack ? 0.23 : 0.82) - centerZ],
        0.008,
      );
    }

    const bankPlate = new Mesh(horizontalShape(bankShape, 0.09), plate);
    bankPlate.position.set(x + 2 - centerX, 0.62, 0.5 - centerZ);
    bankPlate.castShadow = true;
    bankPlate.receiveShadow = true;
    keyboard.add(bankPlate);
    solid(keyboard, recess, [4, 0.025, 0.96], [x + 2 - centerX, 0.6325, 0.5 - centerZ], 0.01);
  }

  for (const x of [0, 15.65]) {
    const z = 1.3;
    const switchX = x + 0.5 - centerX;
    const switchZ = z + 0.5 - centerZ;
    solid(keyboard, recess, [0.94, 0.12, 0.95], [switchX, 0.66, switchZ]);
    solid(keyboard, clearSwitch, [0.73, 0.25, 0.74], [switchX, 0.79, switchZ], 0.05);
    solid(keyboard, clearSwitch, [0.53, 0.09, 0.54], [switchX, 0.94, switchZ], 0.025);
    solid(keyboard, stem, [0.15, 0.15, 0.37], [switchX, 0.97, switchZ], 0.01);
    solid(keyboard, stem, [0.37, 0.15, 0.15], [switchX, 0.97, switchZ], 0.01);
  }

  const numberFaces = [
    ["1", "ぬ", "!"],
    ["2", "ふ", "@"],
    ["3", "あ", "#"],
    ["4", "う", "$"],
    ["5", "え", "%"],
    ["6", "お", "^"],
    ["7", "や", "&"],
    ["8", "ゆ", "*"],
    ["9", "よ", "("],
    ["0", "わ", ")"],
    ["−", "ほ", "−"],
    ["=", "へ", "+"],
  ];
  for (const [index, [main, kana, shifted]] of numberFaces.entries()) {
    addKey(index + 1, 1.3, { main, kana, shifted }, 0.44);
  }
  addKey(13, 1.3, { main: "←", width: 2 }, 0.44);

  function addRow(z: number, keys: readonly KeyFace[], height: number) {
    let x = 0;
    for (const face of keys) {
      addKey(x, z, face, height);
      x += face.width ?? 1;
    }
  }

  addRow(
    2.3,
    [
      { main: "⇥", width: 1.5 },
      ...[
        ["Q", "た"],
        ["W", "て"],
        ["E", "い"],
        ["R", "す"],
        ["T", "か"],
        ["Y", "ん"],
        ["U", "な"],
        ["I", "に"],
        ["O", "ら"],
        ["P", "せ"],
      ].map(([main, kana]) => ({ main, kana })),
      { main: "[", kana: "゛", shifted: "{" },
      { main: "]", kana: "゜", shifted: "}" },
      { main: "\\", kana: "む", shifted: "|", width: 1.5 },
    ],
    0.4,
  );

  addRow(
    3.3,
    [
      { main: "⇩", width: 1.75 },
      ...[
        ["A", "ち"],
        ["S", "と"],
        ["D", "し"],
        ["F", "は"],
        ["G", "き"],
        ["H", "く"],
        ["J", "ま"],
        ["K", "の"],
        ["L", "り"],
      ].map(([main, kana]) => ({ main, kana })),
      { main: ";", kana: "れ", shifted: ":" },
      { main: "'", kana: "け", shifted: '"' },
      { main: "Keep Refrigerated", width: 2.25, dark: true },
    ],
    0.36,
  );

  addRow(
    4.3,
    [
      { main: "⇧", width: 2.25 },
      ...[
        ["Z", "つ"],
        ["X", "さ"],
        ["C", "そ"],
        ["V", "ひ"],
        ["B", "こ"],
        ["N", "み"],
        ["M", "も"],
      ].map(([main, kana]) => ({ main, kana })),
      { main: ",", kana: "ね", shifted: "<" },
      { main: ".", kana: "る", shifted: ">" },
      { main: "/", kana: "め", shifted: "?" },
      { main: "⇧", width: 1.75 },
    ],
    0.38,
  );

  addRow(
    5.3,
    [
      { main: "Control", width: 1.25 },
      { main: "250mL", width: 1.25 },
      { main: "Alt", width: 1.25 },
      { main: "", width: 6.25, dark: true },
      { main: "Alt" },
      { main: "Soya" },
      { main: "Ctrl" },
    ],
    0.36,
  );

  for (const [index, main] of ["Delete", "PgUp", "PgDn"].entries()) {
    addKey(15.65, 2.3 + index, { main }, 0.4);
  }
  addKey(14.25, 4.3, { main: "↑", dark: true });
  for (const [index, main] of ["←", "↓", "→"].entries()) {
    addKey(13.25 + index, 5.3, { main, dark: true }, 0.36);
  }

  for (let index = 0; index < 4; index++) {
    const indicator = new Mesh(new CylinderGeometry(0.043, 0.043, 0.012, 16), recess);
    indicator.position.set(15.33 - centerX, 0.675, 1.57 + index * 0.41 - centerZ);
    keyboard.add(indicator);
  }
  solid(keyboard, shell, [1.2, 0.05, 0.87], [16.05 - centerX, 0.655, 0.495 - centerZ]);
  const glass = new MeshPhysicalMaterial({
    color: "#050a0b",
    roughness: 0.14,
    metalness: 0.25,
    clearcoat: 1,
  });
  solid(keyboard, glass, [1.03, 0.015, 0.59], [16.05 - centerX, 0.687, 0.495 - centerZ], 0.025);

  for (const x of [-6.9, 6.9]) {
    for (const z of [-2.65, 2.65]) {
      solid(keyboard, dark, [1.1, 0.11, 0.45], [x, 0.065, z], 0.03);
    }
  }
  return keyboard;
}

export function createPlayer(screen: Texture) {
  const player = new Group();
  player.name = "FiiO SNOWSKY ECHO MINI";
  const { context, texture: grain } = canvasTexture(256, 256);
  let seed = 1267;
  for (let z = 0; z < 256; z++) {
    for (let x = 0; x < 256; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const light = 155 + (seed % 55);
      context.fillStyle = `rgb(${light - 30}, ${light + 12}, ${light + 20})`;
      context.fillRect(x, z, 1, 1);
    }
  }

  const blue = new MeshPhysicalMaterial({
    color: "#82bed0",
    map: grain,
    roughness: 0.44,
    metalness: 0.45,
    clearcoat: 0.25,
  });
  const side = new MeshStandardMaterial({ color: "#173b4e", roughness: 0.63, metalness: 0.35 });
  const black = new MeshPhysicalMaterial({ color: "#060b11", roughness: 0.19, clearcoat: 1 });
  solid(player, side, [7.7, 1.14, 5.3], [0, 0.65, 0], 0.11);
  solid(player, blue, [7.66, 0.12, 5.25], [0, 1.24, 0], 0.04);
  for (const x of [-3.55, 3.55]) {
    solid(player, blue, [0.55, 0.12, 5.25], [x, 1.32, 0], 0.025);
  }

  solid(player, black, [6.48, 0.035, 3.79], [0, 1.31, -0.58], 0.035);
  const display = new Mesh(
    new PlaneGeometry(6.3, 3.55),
    new MeshBasicMaterial({ map: screen, toneMapped: false }),
  );
  display.rotation.x = -Math.PI / 2;
  display.position.set(0, 1.333, -0.58);
  player.add(display);

  solid(player, blue, [6.48, 0.09, 0.97], [0, 1.315, 2.055], 0.016);
  const { context: label, texture: branding } = canvasTexture(1536, 230);
  label.fillStyle = "#347487";
  label.textBaseline = "middle";
  label.font = "500 77px Arial, sans-serif";
  label.fillText("SNOWSKY", 175, 130);
  label.font = "500 65px Arial, sans-serif";
  label.fillText("ECHO", 1100, 136);
  label.fillRect(1322, 99, 151, 61);
  label.fillStyle = "#c5e1e6";
  label.font = "500 42px Arial, sans-serif";
  label.fillText("MINI", 1340, 131);
  label.strokeStyle = "#347487";
  label.lineWidth = 12;
  label.lineCap = "round";
  for (let branch = 0; branch < 6; branch++) {
    const angle = (branch * Math.PI) / 3;
    label.beginPath();
    label.moveTo(107 + Math.cos(angle) * 13, 130 + Math.sin(angle) * 13);
    label.lineTo(107 + Math.cos(angle) * 49, 130 + Math.sin(angle) * 49);
    label.stroke();
  }

  const brandingMesh = new Mesh(
    new PlaneGeometry(6.3, 0.9),
    new MeshBasicMaterial({
      map: branding,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
    }),
  );
  brandingMesh.rotation.x = -Math.PI / 2;
  brandingMesh.position.set(0, 1.362, 2.055);
  player.add(brandingMesh);

  const seam = new Mesh(new BoxGeometry(7.42, 0.025, 0.018), black);
  seam.position.set(0, 0.38, 2.653);
  player.add(seam);
  return player;
}
