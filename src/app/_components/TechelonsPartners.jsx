"use client";

import React from "react";
import Image from "next/image";
import { LogoCarousel } from "@/components/ui/logo-carousel";

// Single source of truth for all logo data
const PARTNER_LOGOS = [
  {
    id: 1,
    name: "Apple",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 209,
    height: 256,
  },
  {
    id: 2,
    name: "Supabase",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 109,
    height: 113,
  },
  {
    id: 3,
    name: "Vercel",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 256,
    height: 222,
  },
  {
    id: 4,
    name: "Lowes",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 91,
    height: 43,
  },
  {
    id: 5,
    name: "Ally",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 556,
    height: 318,
  },
  {
    id: 6,
    name: "Pierre",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 74,
    height: 20,
  },
  {
    id: 7,
    name: "BMW",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 800,
    height: 800,
  },
  {
    id: 8,
    name: "Claude AI",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 512,
    height: 512,
  },
  {
    id: 9,
    name: "Next.js",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 180,
    height: 180,
  },
  {
    id: 10,
    name: "TailwindCSS",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 54,
    height: 33,
  },
  {
    id: 11,
    name: "Upstash",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 256,
    height: 341,
  },
  {
    id: 12,
    name: "TypeScript",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 256,
    height: 256,
  },
  {
    id: 13,
    name: "Stripe",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 512,
    height: 214,
  },
  {
    id: 14,
    name: "OpenAI",
    src: "/assets/Events/AI_Artistry_23.jpg",
    width: 256,
    height: 260,
  },
];

// Single reusable Logo component
function Logo({ logo, ...props }) {
  return (
    <Image
      src={logo.src}
      alt={logo.name}
      width={logo.width}
      height={logo.height}
      {...props}
    />
  );
}

// Transform the data for LogoCarousel consumption
const carouselLogos = PARTNER_LOGOS.map(logo => ({
  id: logo.id,
  name: logo.name,
  img: (props) => <Logo logo={logo} {...props} />
}));

// Constants for configuration
const COLUMN_COUNT = 5;
const NEW_CULT_URL = "https://www.newcult.co";

export default function TechelonsPartners() {
  return (
    <section className="space-y-8 py-24">
      <div className="mx-auto flex w-full max-w-screen-lg flex-col items-center space-y-8">
        <div className="text-center">
          <a href={NEW_CULT_URL} target="_blank" rel="noopener noreferrer">
            <h1 className ="text-4xl font-bold">Join new cult</h1>
          </a>
        </div>

        <LogoCarousel columnCount={COLUMN_COUNT} logos={carouselLogos} /> 
      </div>
    </section>
  );
} 