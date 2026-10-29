"use client";

import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import RealisticTooth, { type DisplayMode, type ToothKind } from "./RealisticTooth";

export type DentalPost = {
  id: number;
  lengthMm: number;
  diameterMm: number;
  rootIndex: number;
  apexDistanceMm: number;
  offsetXmm: number;
  offsetZmm: number;
};

type Props = {
  toothId: number;
  heightMm: number;
  widthMm: number;
  posts: DentalPost[];
  showCement: boolean;
  mode: DisplayMode;
};

function kindFromFDI(id: number): ToothKind {
  const n = id % 10;
  if (n <= 2) return "incisor";
  if (n === 3) return "canine";
  if (n === 4 || n === 5) return "premolar";
  return "molar";
}

const TOOTH_MODELS: Record<number, string> = {
  11: "/models/maxillary_left_central_incisor.glb",
  12: "/models/maxillary_lateral_incisor.glb",
  13: "/models/maxillary_canine.glb",
  14: "/models/maxillary_first_premolar.glb",
  15: "/models/maxillary_second_premolar.glb",
  16: "/models/maxillary_first_molar.glb",
  17: "/models/maxillary_second_molar.glb",
  18: "/models/maxillary_third_molar.glb",
  21: "/models/maxillary_left_central_incisor.glb",
  22: "/models/maxillary_lateral_incisor.glb",
  23: "/models/maxillary_canine.glb",
  24: "/models/maxillary_first_premolar.glb",
  25: "/models/maxillary_second_premolar.glb",
  26: "/models/maxillary_first_molar.glb",
  27: "/models/maxillary_second_molar.glb",
  28: "/models/maxillary_third_molar.glb",
  31: "/models/mandibular_left_central_incisor.glb",
  32: "/models/mandibular_left_lateral_incisor.glb",
  33: "/models/mandibular_left_canine.glb",
  34: "/models/mandibular_first_premolar.glb",
  35: "/models/mandibular_left_second_premolar.glb",
  36: "/models/mandibular_first_molar.glb",
  37: "/models/mandibular_second_molar.glb",
  38: "/models/mandibular_third_molar.glb",
  41: "/models/mandibular_left_central_incisor.glb",
  42: "/models/mandibular_left_lateral_incisor.glb",
  43: "/models/mandibular_left_canine.glb",
  44: "/models/mandibular_first_premolar.glb",
  45: "/models/mandibular_left_second_premolar.glb",
  46: "/models/mandibular_first_molar.glb",
  47: "/models/mandibular_second_molar.glb",
  48: "/models/mandibular_third_molar.glb",
};


function rootLayout(kind: ToothKind, widthMm: number) {
  const w = Math.max(widthMm, 2);

  if (kind === "molar") {
    return [
      { label: "Raiz vestibular mesial", x: -w * 0.16, z: -w * 0.08 },
      { label: "Raiz vestibular distal", x: w * 0.16, z: -w * 0.08 },
      { label: "Raiz palatina/lingual", x: 0, z: w * 0.12 },
    ];
  }

  if (kind === "premolar") {
    return [
      { label: "Raiz vestibular", x: -w * 0.12, z: 0 },
      { label: "Raiz palatina/lingual", x: w * 0.12, z: 0 },
    ];
  }

  return [{ label: "Raiz única", x: 0, z: 0 }];
}

function Scene({ toothId, heightMm, widthMm, posts, showCement, mode }: Props) {
  const kind = kindFromFDI(toothId);
  const safeHeight = Math.max(1, heightMm);
  const safeWidth = Math.max(1, widthMm);
  const rootBottomY = -safeHeight / 2;
  const roots = rootLayout(kind, safeWidth);
  const holographic = mode === "Holográfico";

  const postMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: holographic ? "#8cecff" : "#dce6ee",
    roughness: holographic ? 0.2 : 0.24,
    metalness: holographic ? 0.22 : 0.06,
    clearcoat: 1,
    emissive: holographic ? "#087ba7" : "#000000",
    emissiveIntensity: holographic ? 0.65 : 0,
  }), [holographic]);

  const cementMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: holographic ? "#38caff" : "#b8a5a0",
    roughness: 0.35,
    transparent: true,
    opacity: holographic ? 0.32 : 0.4,
    depthWrite: !holographic,
  }), [holographic]);

  return (
    <>
      <color attach="background" args={[holographic ? "#03101f" : "#111923"]} />
      <ambientLight intensity={holographic ? 0.8 : 1.15} />
      <directionalLight position={[25, 30, 25]} intensity={holographic ? 1.8 : 2.2} castShadow />
      <pointLight position={[-20, 10, -15]} intensity={holographic ? 1.6 : 0.7} color={holographic ? "#24bfff" : "#ffffff"} />

      <Suspense fallback={null}>
        <RealisticTooth
          modelPath={TOOTH_MODELS[toothId] ?? TOOTH_MODELS[16]}
          heightMm={safeHeight}
          widthMm={safeWidth}
          kind={kind}
          mode={mode}
          shadeColor="#f1e6cf"
        />

        {posts.map((post) => {
          const root = roots[Math.min(Math.max(post.rootIndex, 0), roots.length - 1)];
          const length = THREE.MathUtils.clamp(post.lengthMm, 0.1, safeHeight);
          const diameter = THREE.MathUtils.clamp(post.diameterMm, 0.1, Math.max(0.2, safeWidth * 0.3));
          const apexDistance = THREE.MathUtils.clamp(post.apexDistanceMm, 0, safeHeight);
          // Este modelo aparece com as raízes voltadas para cima.
// A distância apical é medida a partir da extremidade superior.
const rootTopY = safeHeight / 2;
const tipY = rootTopY - apexDistance;
const centerY = tipY - length / 2;
          return (
            <group key={post.id} position={[root.x + post.offsetXmm, centerY, root.z + post.offsetZmm]}>
              {showCement && (
                <mesh material={cementMaterial}>
                  <cylinderGeometry args={[diameter / 2 + 0.18, diameter / 2 + 0.18, length, 24]} />
                </mesh>
              )}
              <mesh material={postMaterial} castShadow>
                <cylinderGeometry args={[diameter / 2, diameter / 2, length, 24]} />
              </mesh>
            </group>
          );
        })}
        <Environment preset="studio" />
        <ContactShadows position={[0, rootBottomY, 0]} opacity={holographic ? 0.12 : 0.25} scale={safeHeight * 2} blur={2} />
      </Suspense>

      <OrbitControls makeDefault enableDamping minDistance={safeHeight * 0.7} maxDistance={Math.max(safeHeight * 8, 80)} target={[0, 0, 0]} />
    </>
  );
}

export default function DentalViewer(props: Props) {
  return (
    <Canvas shadows dpr={[1, 1.7]} camera={{
      position: [props.heightMm * 0.9, props.heightMm * 0.55, props.heightMm * 2.5],
      fov: 35, near: 0.1, far: 5000,
    }}>
      <Scene {...props} />
    </Canvas>
  );
}
