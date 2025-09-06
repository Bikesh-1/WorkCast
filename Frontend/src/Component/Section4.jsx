import React from 'react';
import { cn } from "../lib/utils.js";
import { Marquee } from "../components/magicui/marquee.jsx";

function Section4() {
  const reviews = [
    {
      name: "Jack",
      username: "@jack",
      body: "The AI career analysis showed me exactly which skills I was missing. The personalized courses actually got me job-ready.",
      img: "https://avatar.vercel.sh/jack",
    },
    {
      name: "Jill",
      username: "@jill",
      body: "Finally, a certificate I can show employers without worrying about fakes. Blockchain-backed badges gave me confidence in interviews.",
      img: "https://avatar.vercel.sh/jill",
    },
    {
      name: "John",
      username: "@john",
      body: "We hired directly from the platform. The verified profiles saved us weeks of screening.",
      img: "https://avatar.vercel.sh/john",
    },
    {
      name: "Jane",
      username: "@jane",
      body: "The AI analysis showed me my skill gaps and got me internship-ready in 3 months.",
      img: "https://avatar.vercel.sh/jane",
    },
    {
      name: "Jenny",
      username: "@jenny",
      body: "Blockchain certificates gave me instant credibility with recruiters on LinkedIn.",
      img: "https://avatar.vercel.sh/jenny",
    },
    {
      name: "James",
      username: "@james",
      body: "We hired faster with verified profiles — saved us weeks of screening.",
      img: "https://avatar.vercel.sh/james",
    },
  ];

  const firstRow = reviews.slice(0, Math.floor(reviews.length / 2));
  const secondRow = reviews.slice(Math.floor(reviews.length / 2));

  function ReviewCard({ img, name, username, body }) {
    return (
      <figure
        className={cn(
          "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          // light styles
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          // dark styles
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
          // text white
          "text-white"
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img className="rounded-full" width="32" height="32" alt="" src={img} />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium text-white">
              {name}
            </figcaption>
            <p className="text-xs font-medium text-white/60">{username}</p>
          </div>
        </div>
        <blockquote className="mt-2 text-sm">{body}</blockquote>
      </figure>
    );
  }

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-black text-white">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black to-transparent"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black to-transparent"></div>
    </div>
  );
}

export default Section4;