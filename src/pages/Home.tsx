import React from "react";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="dark min-h-screen bg-[radial-gradient(circle_at_center,#18181b,#030303)] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#222224_1px,transparent_1px),linear-gradient(to_bottom,#222224_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="text-center space-y-8 py-20">
          <h1 className="text-6xl font-bold">
            <span className="bg-gradient-to-br from-orange-500 via-primary-500 to-red-500 bg-clip-text text-transparent">
              Advanced Armor Stands
            </span>
          </h1>
        </div>

        <div className="flex gap-4 justify-center relative z-10">
          <Button
            size="lg"
            color="primary"
            variant="shadow"
            startContent={<Icon icon="lucide:wand-2" />}
            as={Link}
            to="/animate"
          >
            Create Animations
          </Button>
          <Button
            size="lg"
            variant="bordered"
            className="border-2"
            startContent={<Icon icon="mdi:github" className="text-2xl" />}
            as="a"
            href="https://github.com/Parsa3323/AdvancedArmorStands"
            target="_blank"
          >
            GitHub
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 py-16 relative z-10">
          <FeatureCard
            icon="lucide:wand-2"
            title="Easy To Use"
            description="This plugin has easy to use commands, inventories and types."
          />
          <FeatureCard
            icon="lucide:layers"
            title="Version Support"
            description="This plugin support from 1.8x to the latest version of minecraft (1.21)."
          />
          <FeatureCard
            icon="lucide:headset"
            title="Active Support"
            description="This plugin has active support and updates, with a discord server."
          />
          <FeatureCard
            icon="lucide:settings"
            title="Open Source"
            description="This plugin is open source and free to use, modify and distribute."
          />
        </div>
      </div>
    </main>
  );
}

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Button
      className="w-full h-full p-6 border-2 border-[#222224] bg-gradient-to-b from-[#16161a] to-[#131316]"
      variant="flat"
      color="default"
    >
      <div className="flex flex-col items-start w-full text-left">
        <Icon icon={icon} className="w-8 h-8 text-primary-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2 w-full text-left">
          <span className="bg-gradient-to-br from-orange-500 via-primary-500 to-red-500 bg-clip-text text-transparent">
            {title}
          </span>
        </h3>
        <p className="text-default-400 w-full text-left">{description}</p>
      </div>
    </Button>
  );
}