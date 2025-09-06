import React, { useRef, useEffect, useState } from 'react'
import { cn } from "../lib/utils.js";
import { DotPattern } from "../components/magicui/dot-pattern.jsx";
import { motion } from "framer-motion";

function useInView(ref, options = {}) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      options
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, options]);

  return inView;
}

const textVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      type: "spring",
      stiffness: 80,
    },
  }),
};

const problemVariants = {
  hidden: { opacity: 0, x: 60 },
  visible: (i = 1) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.5 + i * 0.12,
      duration: 0.6,
      type: "spring",
      stiffness: 80,
    },
  }),
};

function Section2() {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { threshold: 0.2 });

  return (
    <div
      ref={sectionRef}
      className="bg-white w-[100vw] h-[100vh] flex justify-center items-center relative overflow-hidden"
    >
      {/* Modern dot pattern background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DotPattern
          width={24}
          height={24}
          className="opacity-30 text-gray-300"
          glow={false}
        />
      </div>
      <motion.div
        className="bg-black rounded-3xl p-8 md:p-16 flex flex-col gap-10 shadow-2xl z-10 border border-white/10 backdrop-blur-md relative w-[85vw] h-[85vh]"
        initial={{ width: "85vw", height: "85vh", opacity: 1 }}
        animate={inView ? { width: "95vw", height: "95vh", opacity: 1 } : { width: "85vw", height: "85vh", opacity: 0.7 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="mb-8"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <motion.h1
            className="text-white font-extrabold text-3xl md:text-5xl tracking-tight mb-4 drop-shadow-lg"
            variants={textVariants}
            custom={0}
          >
            India’s Youth Deserve Better Opportunities
          </motion.h1>
          <motion.p
            className="text-white font-medium text-lg md:text-2xl w-full md:w-3/4 py-2 md:py-4 leading-relaxed"
            variants={textVariants}
            custom={1}
          >
            15% unemployment and millions entering the workforce each year—young talent faces skill mismatches, untrusted certifications, and poor career guidance.
          </motion.p>
        </motion.div>
        {/* Problem Points section absolutely positioned at right bottom, no bg */}
        <motion.div
          className="absolute bottom-8 right-8 w-[90vw] max-w-md md:w-[32vw] rounded-2xl p-0 z-20"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.4 } },
          }}
        >
          <motion.h2
            className="text-white font-extrabold text-2xl md:text-3xl mb-4 tracking-tight "
            variants={textVariants}
            custom={2}
          >
            Problem Points
          </motion.h2>
          <ul className="space-y-4 pl-2">
            {[
              {
                label: (
                  <>
                    <span className="font-bold">Generic Job Portals</span> – Only listings, <span className="italic">no personalized insights</span>.
                  </>
                ),
              },
              {
                label: (
                  <>
                    <span className="font-bold">Skill Mismatch</span> – Courses don’t align with market demand.
                  </>
                ),
              },
              {
                label: (
                  <>
                    <span className="font-bold">Fake Certificates</span> – Employers can’t trust unverifiable credentials.
                  </>
                ),
              },
              {
                label: (
                  <>
                    <span className="font-bold">Low Engagement</span> – <span className="italic">Generic recommendations</span> drive users away.
                  </>
                ),
              },
            ].map((item, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-3"
                variants={problemVariants}
                custom={idx}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <span className="mt-1 w-3 h-3 rounded-full bg-white inline-block"></span>
                <span className="text-white font-semibold text-base md:text-lg">{item.label}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Section2