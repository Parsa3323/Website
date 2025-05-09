import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button, Input, Slider } from '@heroui/react';
import { Icon } from '@iconify/react';
import * as yaml from 'js-yaml';
import ArmorStand from '../components/ArmorStand';

interface KeyFrame {
  head: { x: number; y: number; z: number };
  left_arm: { x: number; y: number; z: number };
  right_arm: { x: number; y: number; z: number };
  left_leg: { x: number; y: number; z: number };
  right_leg: { x: number; y: number; z: number };
}

const defaultFrame: KeyFrame = {
  head: { x: 0, y: 0, z: 0 },
  left_arm: { x: 0, y: 0, z: 0 },
  right_arm: { x: 0, y: 0, z: 0 },
  left_leg: { x: 0, y: 0, z: 0 },
  right_leg: { x: 0, y: 0, z: 0 }
};

export default function Animate() {
  const [frames, setFrames] = useState<KeyFrame[]>([defaultFrame]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationName, setAnimationName] = useState('wave');
  const [interval, setInterval] = useState(10);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number>();

  const addKeyFrame = () => {
    setFrames([...frames, { ...frames[currentFrame] }]);
    setCurrentFrame(frames.length);
  };

  const updateCurrentFrame = (part: keyof KeyFrame, axis: 'x' | 'y' | 'z', value: number) => {
    const newFrames = [...frames];
    newFrames[currentFrame] = {
      ...newFrames[currentFrame],
      [part]: { ...newFrames[currentFrame][part], [axis]: value }
    };
    setFrames(newFrames);
  };

  const exportAnimation = () => {
    const animation = {
      animations: {
        [animationName]: {
          interval,
          loop: true,
          steps: frames
        }
      }
    };
    
    const yamlStr = yaml.dump(animation);
    const blob = new Blob([yamlStr], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${animationName}.yml`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const playAnimation = () => {
    if (isPlaying) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    let frameIndex = currentFrame;
    const animate = () => {
      frameIndex = (frameIndex + 1) % frames.length;
      setCurrentFrame(frameIndex);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  // Ensure we always have a valid frame
  const currentFrameData = frames[currentFrame] || defaultFrame;

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222224_1px,transparent_1px),linear-gradient(to_bottom,#222224_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8 bg-gray-800 p-4 rounded-lg">
          <Input
            label="Animation Name"
            value={animationName}
            onChange={(e) => setAnimationName(e.target.value)}
            className="w-48 bg-gray-700"
          />
          <div className="flex gap-4">
            <Button
              color="primary"
              startContent={<Icon icon={isPlaying ? "lucide:pause" : "lucide:play"} />}
              onClick={playAnimation}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              color="primary"
              variant="bordered"
              startContent={<Icon icon="lucide:plus" />}
              onClick={addKeyFrame}
            >
              Add Keyframe
            </Button>
            <Button
              color="primary"
              startContent={<Icon icon="lucide:download" />}
              onClick={exportAnimation}
            >
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 bg-gray-800 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <Canvas camera={{ position: [0, 2, 5] }} shadows>
              <ambientLight intensity={0.3} />
              <directionalLight 
                position={[5, 5, 5]} 
                intensity={1} 
                castShadow 
                shadow-mapSize={[1024, 1024]}
              />
              <pointLight position={[-5, 5, -5]} intensity={0.5} />
              <ArmorStand frame={currentFrameData} />
              <OrbitControls />
            </Canvas>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">Timeline</h3>
              <Slider
                value={currentFrame}
                onChange={setCurrentFrame}
                max={frames.length - 1}
                className="mb-4"
              />
              <Input
                type="number"
                label="Interval (ticks)"
                value={interval}
                onChange={(e) => setInterval(Number(e.target.value))}
                className="bg-gray-700"
              />
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4 text-white">Current Frame</h3>
              {Object.entries(currentFrameData).map(([part, angles]) => (
                <div key={part} className="mb-6">
                  <h4 className="text-md font-medium mb-3 capitalize text-gray-300">{part.replace('_', ' ')}</h4>
                  {Object.entries(angles).map(([axis, value]) => (
                    <div key={axis} className="mb-4">
                      <label className="text-sm uppercase text-gray-400 block mb-2">{axis}</label>
                      <Slider
                        value={value}
                        onChange={(val) => updateCurrentFrame(part as keyof KeyFrame, axis as 'x' | 'y' | 'z', val)}
                        min={-180}
                        max={180}
                        step={1}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-400 mt-1 block">{value}°</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}