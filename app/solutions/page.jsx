import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { solutions } from "@/lib/data";

export default function SolutionsPage() {
  return (
    <SiteShell>
      <section className="px-6 pb-20 pt-40">
        <SectionHeading eyebrow="Solutions" title="Integrated Energy And Technology Systems" text="Solar, backup power, CCTV, lighting, and electrical product solutions for Kenyan homes, businesses, schools, institutions, contractors, and government projects." />
        <div className="mx-auto grid w-[min(1120px,100%)] gap-6">
          {solutions.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <div className="grid overflow-hidden rounded-[2rem] border border-white/10 bg-surface md:grid-cols-[1.1fr_0.9fr]">
                <img src={item.image} alt={item.title} className="h-80 w-full object-cover md:h-full" />
                <div className="p-8 md:p-12">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-glow">0{index + 1}</p>
                  <h2 className="mt-5 font-heading text-4xl font-semibold">{item.title}</h2>
                  <p className="mt-5 text-lg leading-8 text-mist">{item.text}</p>
                  <Link href="/contact" className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 font-semibold text-night">
                    Plan This Solution <ArrowUpRight size={18} />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
