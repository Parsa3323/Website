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

export default function Animate() {
  const [frames, setFrames] = useState<KeyFrame[]>([{
    head: { x: 0, y: 0, z: 0 },
    left_arm: { x: 0, y: 0, z: 0 },
    right_arm: { x: 0, y: 0, z: 0 },
    left_leg: { x: 0, y: 0, z: 0 },
    right_leg: { x: 0, y: 0, z: 0 }
  }]);
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

  return (
    <div className="dark min-h-screen bg-[radial-gradient(circle_at_center,#18181b,#030303)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222224_1px,transparent_1px),linear-gradient(to_bottom,#222224_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <Input
            label="Animation Name"
            value={animationName}
            onChange={(e) => setAnimationName(e.target.value)}
            className="w-48"
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
          <div className="col-span-2 bg-content1 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <Canvas camera={{ position: [0, 2, 5] }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <ArmorStand frame={frames[currentFrame]} />
              <OrbitControls />
            </Canvas>
          </div>

          <div className="space-y-6">
            <div className="bg-content1 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Timeline</h3>
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
              />
            </div>

            <div className="bg-content1 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Current Frame</h3>
              {Object.entries(frames[currentFrame]).map(([part, angles]) => (
                <div key={part} className="mb-4">
                  <h4 className="text-md font-medium mb-2 capitalize">{part.replace('_', ' ')}</h4>
                  {Object.entries(angles).map(([axis, value]) => (
                    <div key={axis} className="mb-2">
                      <label className="text-sm uppercase">{axis}</label>
                      <Slider
                        value={value}
                        onChange={(val) => updateCurrentFrame(part as keyof KeyFrame, axis as 'x' | 'y' | 'z', val)}
                        min={-180}
                        max={180}
                        step={1}
                      />
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