import { SlidersHorizontal } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { products } from "@/lib/data";

const categories = ["Solar Panels", "Batteries", "Inverters", "CCTV", "Lighting"];

export default function ProductsPage() {
  return (
    <SiteShell>
      <section className="px-6 pb-24 pt-40">
        <SectionHeading eyebrow="Products" title="Showcase, Not Storefront" text="A premium view of the systems and components ST Light deploys across residential, commercial, and institutional projects." />
        <div className="mx-auto mb-10 flex w-[min(1120px,100%)] flex-wrap gap-3">
          {categories.map((category) => (
            <button key={category} className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm text-white/80">
              <SlidersHorizontal size={15} /> {category}
            </button>
          ))}
        </div>
        <div className="mx-auto grid w-[min(1120px,100%)] gap-5 md:grid-cols-3">
          {products.map(([title, subtitle, spec, image], index) => (
            <Reveal key={title} delay={index * 0.04}>
              <article className="group overflow-hidden rounded-[2rem] border border-white/10 bg-surface">
                <div className="aspect-[5/4] overflow-hidden">
                  <img src={image} alt={title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                </div>
                <div className="p-6">
                  <p className="text-sm text-orange-glow">{subtitle}</p>
                  <h2 className="mt-2 font-heading text-3xl font-semibold">{title}</h2>
                  <p className="mt-4 text-mist">{spec}</p>
                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-white/70">
                    <span className="rounded-2xl bg-white/6 p-3">Certified</span>
                    <span className="rounded-2xl bg-white/6 p-3">Project-ready</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
