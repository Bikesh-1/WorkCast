import React from 'react'
import { motion } from "framer-motion";
import {
  User,
  Activity,
  BookOpen,
  ShieldCheck,
  BarChart2,
} from "lucide-react";

function Section3() {
  const steps = [
    {
      id: 1,
      title: "Create Your Profile",
      desc: "Upload your resume or add skills, interests and career goals in minutes.",
      icon: <User className="w-8 h-8" />,
    },
    {
      id: 2,
      title: "AI Career Analysis",
      desc: "Models analyze your strengths, regional job trends and risk signals.",
      icon: <Activity className="w-8 h-8" />,
    },
    {
      id: 3,
      title: "Personalized Skill Paths",
      desc: "Tailored course recommendations to close skill gaps and improve hiring fit.",
      icon: <BookOpen className="w-8 h-8" />,
    },
    {
      id: 4,
      title: "Earn Verified Certificates",
      desc: "Blockchain-backed certificates that employers can verify instantly.",
      icon: <ShieldCheck className="w-8 h-8"/>
    },
    {
      id: 5,
      title: "Track & Grow",
      desc: "Interactive dashboards to measure progress and discover opportunities.",
      icon: <BarChart2 className="w-8 h-8" />,
    },
  ];
  return (
    <section className="relative overflow-hidden py-20 bg-black">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-56 w-[600px] h-[600px]  rounded-full blur-3xl transform rotate-12" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white">
            How It Works
          </h2>
          <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-lg">
            A simple, five-step journey from profile to hire — powered by AI
            insights and verified credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: idx * 0.12, duration: 0.5, ease: "easeOut" }}
              className="group relative bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 flex flex-col items-start gap-4 hover:scale-105 transform transition"
            >
              <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 border border-white/6">
                <div className="text-white group-hover:text-orange-400">
                  {s.icon}
                </div>
              </div>

              <h3 className="text-white font-semibold text-lg">{s.title}</h3>
              <p className="text-gray-300 text-sm">{s.desc}</p>

              <div className="mt-auto flex items-center gap-2 text-xs text-gray-400"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Section3