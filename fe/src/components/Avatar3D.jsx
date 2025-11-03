import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import './Avatar3D.css';

/**
 * Avatar model component with lip sync animation
 */
const AvatarModel = ({ audioData, isPlaying }) => {
  const meshRef = useRef();
  const [model, setModel] = useState(null);
  const headRef = useRef();
  const eyesRef = useRef();
  
  // Load avatar model (placeholder - replace with actual GLTF model)
  useEffect(() => {
    // Create a simple avatar mesh if no model is loaded
    // In production, use GLTFLoader to load actual 3D model
    createSimpleAvatar();
  }, []);
  
  const createSimpleAvatar = () => {
    // Create a simple head shape
    const group = new THREE.Group();
    
    // Head (sphere)
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xffdbac,
      roughness: 0.7,
      metalness: 0.1
    });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.scale.set(1, 1.1, 0.9);
    group.add(head);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.2, 0.7);
    group.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.2, 0.7);
    group.add(rightEye);
    
    // Mouth (simple placeholder)
    const mouthGeometry = new THREE.TorusGeometry(0.3, 0.05, 8, 16, Math.PI);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.3, 0.7);
    mouth.rotation.x = Math.PI;
    group.add(mouth);
    
    setModel(group);
  };
  
  // Animation loop for lip sync
  useFrame((state) => {
    if (!model) return;
    
    // Idle animation - subtle head movement
    if (!isPlaying) {
      model.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      model.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    }
    
    // Lip sync animation based on audio data
    if (isPlaying && audioData && audioData.volume > 0) {
      const volume = audioData.volume;
      
      // Find mouth mesh and animate
      const mouth = model.children.find(child => 
        child.geometry instanceof THREE.TorusGeometry
      );
      
      if (mouth) {
        // Scale mouth based on audio volume
        const scaleAmount = 1 + volume * 0.5;
        mouth.scale.set(scaleAmount, scaleAmount, 1);
        
        // Move mouth slightly
        mouth.position.y = -0.3 - (volume * 0.1);
      }
      
      // Subtle head movement while speaking
      model.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      model.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    } else if (model.children.length > 3) {
      // Reset mouth to normal position
      const mouth = model.children.find(child => 
        child.geometry instanceof THREE.TorusGeometry
      );
      if (mouth) {
        mouth.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
        mouth.position.y = THREE.MathUtils.lerp(mouth.position.y, -0.3, 0.1);
      }
    }
  });
  
  return model ? <primitive object={model} ref={meshRef} /> : null;
};

/**
 * Avatar3D Component - 3D avatar with lip sync
 */
const Avatar3D = ({ audioData, isPlaying }) => {
  return (
    <div className="avatar-container">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls 
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={8}
          target={[0, 0, 0]}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} />
        
        {/* Environment */}
        <Environment preset="studio" />
        
        {/* Avatar Model */}
        <AvatarModel audioData={audioData} isPlaying={isPlaying} />
        
        {/* Background */}
        <mesh position={[0, 0, -5]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#e0e7ff" />
        </mesh>
      </Canvas>
      
      {/* Status indicator */}
      <div className={`speaking-indicator ${isPlaying ? 'active' : ''}`}>
        {isPlaying ? '🔊 Speaking...' : '💤 Idle'}
      </div>
    </div>
  );
};

export default Avatar3D;

