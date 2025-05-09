import React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ArmorStandProps {
  frame: {
    head: { x: number; y: number; z: number };
    left_arm: { x: number; y: number; z: number };
    right_arm: { x: number; y: number; z: number };
    left_leg: { x: number; y: number; z: number };
    right_leg: { x: number; y: number; z: number };
  };
}

export default function ArmorStand({ frame }: ArmorStandProps) {
  const bodyRef = React.useRef<THREE.Group>();
  const headRef = React.useRef<THREE.Mesh>();
  const leftArmRef = React.useRef<THREE.Mesh>();
  const rightArmRef = React.useRef<THREE.Mesh>();
  const leftLegRef = React.useRef<THREE.Mesh>();
  const rightLegRef = React.useRef<THREE.Mesh>();

  useFrame(() => {
    if (!headRef.current || !leftArmRef.current || !rightArmRef.current || !leftLegRef.current || !rightLegRef.current) return;

    // Convert degrees to radians
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    headRef.current.rotation.set(toRad(frame.head.x), toRad(frame.head.y), toRad(frame.head.z));
    leftArmRef.current.rotation.set(toRad(frame.left_arm.x), toRad(frame.left_arm.y), toRad(frame.left_arm.z));
    rightArmRef.current.rotation.set(toRad(frame.right_arm.x), toRad(frame.right_arm.y), toRad(frame.right_arm.z));
    leftLegRef.current.rotation.set(toRad(frame.left_leg.x), toRad(frame.left_leg.y), toRad(frame.left_leg.z));
    rightLegRef.current.rotation.set(toRad(frame.right_leg.x), toRad(frame.right_leg.y), toRad(frame.right_leg.z));
  });

  return (
    <group ref={bodyRef}>
      {/* Base */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#666666" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.1, 0]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Arms */}
      <mesh ref={leftArmRef} position={[0.2, 0.8, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      <mesh ref={rightArmRef} position={[-0.2, 0.8, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      {/* Legs */}
      <mesh ref={leftLegRef} position={[0.1, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>

      <mesh ref={rightLegRef} position={[-0.1, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.4, 0.1]} />
        <meshStandardMaterial color="#888888" />
      </mesh>
    </group>
  );
}