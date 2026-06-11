import { Mail, MapPin, Phone } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import SectionHeading from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { images } from "@/lib/data";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="px-6 pb-24 pt-40">
        <SectionHeading eyebrow="Contact" title="Start Your Energy Project" text="Request a consultation for solar installations, CCTV systems, backup power, lighting, or electrical products." />
        <div className="mx-auto grid w-[min(1120px,100%)] overflow-hidden rounded-[2rem] border border-white/10 bg-surface md:grid-cols-2">
          <Reveal className="relative min-h-[540px] p-8 md:p-12">
            <img src={images.contact} alt="Modern ST Light consultation office" className="absolute inset-0 h-full w-full object-cover opacity-35" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/58 to-transparent" />
            <div className="relative flex h-full flex-col justify-end">
              <h2 className="font-heading text-4xl font-semibold">Talk To ST Light</h2>
              <div className="mt-8 grid gap-4 text-white/78">
                <p className="flex items-center gap-3"><Phone className="text-orange-glow" size={20} /> +254 700 000 000</p>
                <p className="flex items-center gap-3"><Mail className="text-orange-glow" size={20} /> hello@stlight.co.ke</p>
                <p className="flex items-center gap-3"><MapPin className="text-orange-glow" size={20} /> Nairobi, Kenya</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="p-8 md:p-12">
            <form className="grid gap-5">
              {["Full name", "Email address", "Phone number", "Project location"].map((label) => (
                <label key={label} className="grid gap-2 text-sm text-white/70">
                  {label}
                  <input className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-white outline-none transition focus:border-orange-energy" />
                </label>
              ))}
              <label className="grid gap-2 text-sm text-white/70">
                What do you need?
                <textarea rows="5" className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-white outline-none transition focus:border-orange-energy" />
              </label>
              <button className="rounded-full bg-orange-energy px-7 py-4 font-semibold text-night shadow-glow transition hover:bg-orange-glow">
                Request Consultation
              </button>
            </form>
          </Reveal>
        </div>
        <div className="mx-auto mt-6 h-80 w-[min(1120px,100%)] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(249,115,22,0.22),rgba(17,24,39,0.95))]">
          <div className="grid h-full place-items-center text-center">
            <div>
              <p className="font-heading text-3xl font-semibold">Nairobi Project Coverage Map</p>
              <p className="mt-3 text-mist">Prototype map area for office location and service coverage.</p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
