import SiteShell from "@/components/SiteShell";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { projects } from "@/lib/data";

export default function ProjectsPage() {
  return (
    <SiteShell>
      <section className="px-6 pb-24 pt-40">
        <SectionHeading eyebrow="Projects" title="Visual Proof Of Capability" text="Masonry-style project stories for commercial energy, institutional reliability, security coverage, and modern residential power." />
        <div className="mx-auto columns-1 gap-5 w-[min(1120px,100%)] md:columns-2">
          {projects.concat(projects.slice(0, 2)).map((project, index) => (
            <Reveal key={`${project.title}-${index}`} className="mb-5 break-inside-avoid" delay={(index % 3) * 0.05}>
              <article className="group relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-surface">
                <img src={project.image} alt={project.title} className={`${index % 2 ? "min-h-[460px]" : "min-h-[360px]"} image-reveal h-full w-full object-cover transition duration-700 group-hover:scale-105`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
                <div className="absolute bottom-0 p-7">
                  <div className="mb-4 flex gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                    <span className="rounded-full bg-orange-energy px-3 py-2 text-night">{project.capacity}</span>
                    <span className="rounded-full bg-white/14 px-3 py-2 backdrop-blur">{project.location}</span>
                  </div>
                  <h2 className="font-heading text-3xl font-semibold">{project.title}</h2>
                  <p className="mt-3 text-white/75">{project.type}</p>
                  <p className="mt-4 max-h-0 overflow-hidden text-sm leading-6 text-white/74 opacity-0 transition-all duration-500 group-hover:max-h-28 group-hover:opacity-100">{project.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
