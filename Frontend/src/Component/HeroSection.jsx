import React from 'react';
import { cn } from "../lib/utils.js";
import { GridPattern } from "../components/magicui/grid-pattern";
import Navbar from './Navbar.jsx';
import CardSwap, { Card } from '../components/CardSwap.jsx';
import { RainbowButton } from "../components/magicui/rainbow-button";
import { ShinyButton } from "../components/magicui/shiny-button";

function HeroSection() {
  return (
    <div className="relative flex size-full items-center justify-center overflow-hidden bg-background bg-black w-[100vw] h-[100vh]">
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)] ",
        )}
      />
      <Navbar />
      {/* 
      <StaggerChars
        text="JOBAI"
        className="font-extrabold text-[12rem] md:text-[15rem] lg:text-[20rem] relative z-10 text-white"
        hoverText="SKILL"
        hoverClassName="text-[#3b82f6]"
      />
      */}
      <div>
        <div className='z-10 relative mb-20'>
          <h1 className='text-white text-5xl font-black'>AI-Powered Skilling & </h1>
          <h1 className='text-white text-5xl font-black'>Employment Platform for India’s Youth</h1>
          <p className='text-white text-xl w-1/2 text-justify py-4'>
            Empowering millions of young Indians with personalized career guidance, AI-driven unemployment risk prediction, and blockchain-secured certifications.
          </p>
        </div>
        <div className="flex flex-row gap-4 relative z-20">
          <ShinyButton>Get Started Free</ShinyButton>
          <RainbowButton>Check Your Career Risk Score</RainbowButton>
        </div>
      </div>
      <div style={{ height: '600px', position: 'relative' }}>
        <CardSwap cardDistance={60} verticalDistance={70} delay={5000} pauseOnHover={false}>
          <Card
            className="bg-black rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border border-white/10"
            style={{ boxShadow: "0 8px 32px 0 rgba(255,255,255,0.25)" }}
          >
            <h3 className="text-white text-2xl font-bold mb-2">AI Career Guidance</h3>
            <p className="text-gray-300 text-center text-lg">
              Get personalized career recommendations powered by advanced AI, tailored to your unique skills and aspirations.
            </p>
            <span className="inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full mt-2">Personalized</span>
          </Card>
          <Card
            className="bg-black rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border border-white/10"
            style={{ boxShadow: "0 8px 32px 0 rgba(255,255,255,0.25)" }}
          >
            <h3 className="text-white text-2xl font-bold mb-2">Unemployment Risk Prediction</h3>
            <p className="text-gray-300 text-center text-lg">
              Proactively assess your risk of unemployment and receive actionable insights to stay ahead in your career.
            </p>
            <span className="inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full mt-2">AI Insights</span>
          </Card>
          <Card
            className="bg-black rounded-2xl p-8 flex flex-col items-center justify-center gap-4 border border-white/10"
            style={{ boxShadow: "0 8px 32px 0 rgba(255,255,255,0.25)" }}
          >
            <h3 className="text-white text-2xl font-bold mb-2">Blockchain Certifications</h3>
            <p className="text-gray-300 text-center text-lg">
              Earn and showcase tamper-proof, blockchain-secured certificates to boost your employability and credibility.
            </p>
            <span className="inline-block bg-white/10 text-white text-xs px-3 py-1 rounded-full mt-2">Verified</span>
          </Card>
        </CardSwap>
      </div>
    </div>
  );
}

export default HeroSection;