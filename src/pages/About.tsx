// src/pages/About.tsx
import { Shield, BookOpen, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Human First",
    text: "Every analysis on Ryabina's Gambit comes from a person sitting with a position, not an engine spitting out a number.",
  },
  {
    icon: BookOpen,
    title: "Learning Over Scores",
    text: "We care about the reasoning behind a move — the idea, the mistake, the plan — not just whether it was best.",
  },
  {
    icon: Users,
    title: "All Ratings Welcome",
    text: "A beginner's honest confusion is as valuable here as a grandmaster's certainty.",
  },
];

function About() {
  return (
    <div className="min-h-screen bg-[#080a09] px-10 py-12">
      <header className="border-b border-[#2b2117] pb-8">
        <p className="font-serif text-xs tracking-[0.25em] text-[#806c4e]">
          ABOUT
        </p>

        <h1 className="mt-3 font-serif text-5xl text-[#d9c8aa]">
          Ryabina's Gambit
        </h1>

        <p className="mt-4 max-w-2xl font-serif text-base leading-relaxed text-[#8e806b]">
          A library of chess games analyzed by humans of all ratings —
          built for players who want to understand ideas, not just
          memorize evaluations.
        </p>
      </header>

      <section className="mt-10 grid grid-cols-3 gap-5">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <div
              key={value.title}
              className="rounded-xl border border-[#352819] bg-[#0c0e0d] p-6"
            >
              <Icon size={26} className="text-[#a67b36]" />

              <h2 className="mt-4 font-serif text-lg text-[#d4c4a6]">
                {value.title}
              </h2>

              <p className="mt-2 font-serif text-sm leading-relaxed text-[#8e806b]">
                {value.text}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default About;