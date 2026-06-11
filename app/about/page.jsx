import { Crown, Goal, Users } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { images } from "@/lib/data";

const timeline = [
  ["2014", "Solar Today Limited begins serving Kenyan homes and businesses."],
  ["2017", "Expanded into power backup, electrical products, and institutional projects."],
  ["2021", "Integrated CCTV, solar lighting, and smart security into the solutions portfolio."],
  ["Today", "Positioned as ST Light: a premium energy and technology solutions partner."]
];

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="px-6 pb-24 pt-40">
        <SectionHeading eyebrow="About ST Light" title="Energy Independence, Delivered With Precision" text="ST Light combines modern solar engineering, quality products, and dependable service for Kenya's evolving energy needs." />
        <div className="mx-auto grid w-[min(1120px,100%)] gap-8 md:grid-cols-[0.95fr_1.05fr]">
          <Reveal>
            <img src={images.team} alt="ST Light professional team" className="h-full min-h-[520px] rounded-[2rem] object-cover" />
          </Reveal>
          <div className="grid gap-5">
            {[
              [Goal, "Mission", "Accelerate energy independence through reliable solar, security, and power backup solutions."],
              [Crown, "Premium Standard", "Deliver clean design, certified products, and installation quality worthy of enterprise projects."],
              [Users, "Team", "A technical and advisory team supporting homeowners, businesses, contractors, and institutions."]
            ].map(([Icon, title, text], index) => (
              <Reveal key={title} delay={index * 0.06}>
                <div className="glass rounded-[2rem] p-7">
                  <Icon className="text-orange-glow" size={28} />
                  <h2 className="mt-5 font-heading text-3xl font-semibold">{title}</h2>
                  <p className="mt-3 leading-7 text-mist">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-24 w-[min(1120px,100%)]">
          <p className="mb-8 text-xs font-bold uppercase tracking-[0.28em] text-orange-glow">Timeline</p>
          <div className="grid gap-5 md:grid-cols-4">
            {timeline.map(([year, text], index) => (
              <Reveal key={year} delay={index * 0.06}>
                <div className="h-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
                  <p className="font-heading text-4xl font-semibold text-orange-glow">{year}</p>
                  <p className="mt-5 leading-7 text-white/74">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
