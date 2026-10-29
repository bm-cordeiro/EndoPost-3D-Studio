
"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export type ToothKind = "incisor" | "canine" | "premolar" | "molar";
export type DisplayMode =
  | "Realista"
  | "Transparente"
  | "Holográfico";
type Props = {
  heightMm: number;
  widthMm: number;
  kind: ToothKind;
  modelPath: string;
  mode: DisplayMode;
  shadeColor?: string;
};

export default function RealisticTooth({
  heightMm,
  widthMm,
  kind,
  modelPath,
  mode,
  shadeColor = "#f1e6cf",
}: Props) {
  const gltf = useGLTF(modelPath);

  const tooth = useMemo(() => {
    const clone = gltf.scene.clone(true);
    clone.updateMatrixWorld(true);

    // Mede o modelo original.
    const bounds = new THREE.Box3().setFromObject(clone);
    const size = bounds.getSize(new THREE.Vector3());
    const center = bounds.getCenter(new THREE.Vector3());

    const targetHeight = Math.max(1, heightMm);
    const targetWidth = Math.max(1, widthMm);
    const targetDepth = targetWidth * (kind === "incisor" ? 0.72 : 0.9);

    // Evita divisão por zero em modelos inválidos.
    const sx = targetWidth / Math.max(size.x, 0.0001);
    const sy = targetHeight / Math.max(size.y, 0.0001);
    const sz = targetDepth / Math.max(size.z, 0.0001);

    // Primeiro escala, depois centraliza usando a escala aplicada.
    clone.scale.set(sx, sy, sz);
    clone.position.set(
      -center.x * sx,
      -center.y * sy,
      -center.z * sz
    );

    clone.updateMatrixWorld(true);

    clone.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      obj.castShadow = true;
      obj.receiveShadow = true;

      const sourceMaterials = Array.isArray(obj.material)
  ? obj.material
  : [obj.material];

const materials = sourceMaterials.map((source) => {
  const material = source.clone() as THREE.MeshStandardMaterial;

  if (mode === "Holográfico") {
    material.color = new THREE.Color("#6edbff");
    material.emissive = new THREE.Color("#087ba7");
    material.emissiveIntensity = 0.75;
    material.transparent = true;
    material.opacity = 0.62;
    material.depthWrite = false;
    material.wireframe = false;
    material.metalness = 0.25;
    material.roughness = 0.22;
  } else if (mode === "Transparente") {
    material.color = new THREE.Color(shadeColor);
    material.emissive = new THREE.Color("#000000");
    material.emissiveIntensity = 0;
    material.transparent = true;
    material.opacity = 0.30;
    material.depthWrite = false;
    material.wireframe = false;
    material.roughness = 0.32;
  } else {
    material.color = new THREE.Color(shadeColor);
    material.emissive = new THREE.Color("#000000");
    material.emissiveIntensity = 0;
    material.transparent = false;
    material.opacity = 1;
    material.depthWrite = true;
    material.wireframe = false;
    material.roughness = 0.32;
  }

  return material;
});

obj.material = Array.isArray(obj.material)
  ? materials
  : materials[0];
    });

    return clone;
  }, [gltf.scene, heightMm, widthMm, kind, mode, shadeColor]);

  return <primitive object={tooth} />;
}
