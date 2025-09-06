import React from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "../components/ui/accordion";

function Section6() {
  return (
    <div className="bg-black p-8 text-white">
            <h1 className='text-6xl font-black p-4'>Frequently Asked Questions (FAQ)</h1>
      <Accordion type="single" collapsible className="w-full text-white">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-white">How does the AI career analysis work?</AccordionTrigger>
          <AccordionContent className="text-white">
          Our AI models analyze your resume, skills, and job market data to identify risk factors and recommend personalized growth paths.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-white">Are the certificates really blockchain-secured?</AccordionTrigger>
          <AccordionContent className="text-white">
          Yes. Each certificate is stored on a blockchain, making it tamper-proof and instantly verifiable by employers.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-white">Is the platform free to use?</AccordionTrigger>
          <AccordionContent className="text-white">
          Basic features like career analysis and recommendations are free. Premium features like advanced dashboards and exclusive courses may be paid.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-white">Who can use this platform?</AccordionTrigger>
          <AccordionContent className="text-white">
          Students, job seekers, and working professionals who want to upskill, as well as employers who want to hire verified talent.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-5">
          <AccordionTrigger className="text-white">Which industries do you cover?</AccordionTrigger>
          <AccordionContent className="text-white">
          We focus on IT, Data, AI/ML, and Business roles initially, with more domains being added regularly.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-6">
          <AccordionTrigger className="text-white">How do employers verify my certificates?</AccordionTrigger>
          <AccordionContent className="text-white">
          Employers can scan a QR code or use our verification portal to instantly confirm the authenticity of your certificates.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default Section6