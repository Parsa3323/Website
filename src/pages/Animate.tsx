import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Button, Input } from '@heroui/react';
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
    setFrames([...frames, { ...frames[currentFrame] || defaultFrame }]);
    setCurrentFrame(frames.length);
  };

  const updateCurrentFrame = (part: keyof KeyFrame, axis: 'x' | 'y' | 'z', value: number) => {
    const newFrames = [...frames];
    if (!newFrames[currentFrame]) {
      newFrames[currentFrame] = { ...defaultFrame };
    }
    newFrames[currentFrame] = {
      ...newFrames[currentFrame],
      [part]: { ...newFrames[currentFrame][part], [axis]: value }
    };
    setFrames(newFrames);
  };

  const exportAnimation = () => {
    try {
      const cleanedFrames = frames.map(frame => ({
        head: { x: frame.head.x, y: frame.head.y, z: frame.head.z },
        left_arm: { x: frame.left_arm.x, y: frame.left_arm.y, z: frame.left_arm.z },
        right_arm: { x: frame.right_arm.x, y: frame.right_arm.y, z: frame.right_arm.z },
        left_leg: { x: frame.left_leg.x, y: frame.left_leg.y, z: frame.left_leg.z },
        right_leg: { x: frame.right_leg.x, y: frame.right_leg.y, z: frame.right_leg.z }
      }));

      const animation = {
        animations: {
          [animationName]: {
            interval: Math.max(1, Math.floor(interval)),
            loop: true,
            steps: cleanedFrames
          }
        }
      };
      
      const yamlStr = yaml.dump(animation, {
        indent: 2,
        lineWidth: -1,
        noRefs: true,
        quotingType: '"'
      });
      
      const blob = new Blob([yamlStr], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'animations.yml';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export animation:', error);
    }
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

  const currentFrameData = frames[currentFrame] || defaultFrame;

  return (
    <div className="dark min-h-screen bg-[radial-gradient(circle_at_center,#18181b,#030303)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222224_1px,transparent_1px),linear-gradient(to_bottom,#222224_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-gradient-to-b from-[#16161a] to-[#0d0d0e] border-b border-[#222224]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button
                as="a"
                href="/"
                color="primary"
                variant="light"
                isIconOnly
                className="rounded-full"
              >
                <Icon icon="lucide:arrow-left" className="w-5 h-5" />
              </Button>
              <Input
                label="Animation Name"
                value={animationName}
                onChange={(e) => setAnimationName(e.target.value)}
                className="w-48"
              />
            </div>
            <div className="flex gap-4">
              <Button
                color="primary"
                startContent={<Icon icon={isPlaying ? "lucide:pause" : "lucide:play"} />}
                onClick={playAnimation}
                className="rounded-full"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                color="primary"
                variant="bordered"
                startContent={<Icon icon="lucide:plus" />}
                onClick={addKeyFrame}
                className="rounded-full"
              >
                Add Keyframe
              </Button>
              <Button
                color="primary"
                startContent={<Icon icon="lucide:download" />}
                onClick={exportAnimation}
                className="rounded-full"
              >
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-4 gap-8">
            <div className="col-span-3 bg-gradient-to-b from-[#16161a] to-[#0d0d0e] rounded-lg overflow-hidden shadow-xl border border-[#222224]" style={{ height: '600px' }}>
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
                <gridHelper args={[10, 10, '#444444', '#222222']} />
              </Canvas>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-b from-[#16161a] to-[#0d0d0e] p-6 rounded-lg shadow-xl border border-[#222224]">
                <h3 className="text-lg font-semibold mb-4">Current Frame</h3>
                {Object.entries(currentFrameData).map(([part, angles]) => (
                  <div key={part} className="mb-6">
                    <h4 className="text-md font-medium mb-3 capitalize bg-gradient-to-br from-orange-500 via-primary-500 to-red-500 bg-clip-text text-transparent">
                      {part.replace('_', ' ')}
                    </h4>
                    {Object.entries(angles).map(([axis, value]) => (
                      <div key={axis} className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm uppercase bg-gradient-to-br from-orange-500 via-primary-500 to-red-500 bg-clip-text text-transparent font-medium">
                            {axis}
                          </label>
                          <Input
                            type="number"
                            value={value}
                            onChange={(e) => updateCurrentFrame(part as keyof KeyFrame, axis as 'x' | 'y' | 'z', Number(e.target.value))}
                            min={-180}
                            max={180}
                            className="w-20 text-right"
                          />
                        </div>
                        <input
                          type="range"
                          value={value}
                          onChange={(e) => updateCurrentFrame(part as keyof KeyFrame, axis as 'x' | 'y' | 'z', Number(e.target.value))}
                          min={-180}
                          max={180}
                          step={1}
                          className="w-full h-2 bg-[#222224] rounded-lg appearance-none cursor-pointer accent-primary-500"
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

      {/* Timeline */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#16161a] to-[#0d0d0e] border-t border-[#222224] p-4 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <div className="flex-grow">
              <input
                type="range"
                value={currentFrame}
                onChange={(e) => setCurrentFrame(Number(e.target.value))}
                min={0}
                max={frames.length - 1}
                step={1}
                className="w-full h-2 bg-[#222224] rounded-lg appearance-none cursor-pointer accent-primary-500"
              />
              <div className="flex justify-between mt-2 text-sm">
                <span className="text-default-400">Frame {currentFrame + 1}</span>
                <span className="text-default-400">Total Frames: {frames.length}</span>
              </div>
            </div>
            <div className="w-32">
              <Input
                type="number"
                label="Interval (ticks)"
                value={interval}
                min={1}
                onChange={(e) => setInterval(Math.max(1, Number(e.target.value)))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}