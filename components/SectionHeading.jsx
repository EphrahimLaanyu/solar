import { Reveal } from "@/components/Reveal";

export default function SectionHeading({ eyebrow, title, text }) {
  return (
    <Reveal className="mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-4 text-xs font-bold uppercase tracking-[0.28em] text-orange-glow">{eyebrow}</p>
      <h2 className="font-heading text-4xl font-semibold tracking-tight text-white md:text-6xl">{title}</h2>
      {text && <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-mist">{text}</p>}
    </Reveal>
  );
}
