"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, BadgeCheck, BatteryCharging, Bolt, Building2, Camera, ChevronRight, Headphones, ShieldCheck, Sparkles, SunMedium, Zap } from "lucide-react";
import SiteShell from "@/components/SiteShell";
import Counter from "@/components/Counter";
import { Reveal } from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import { images, products, projects, solutions, stats, testimonials } from "@/lib/data";

const icons = [SunMedium, Building2, Camera, Bolt];

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 700], [0, 180]);
  const opacity = useTransform(scrollY, [0, 680], [1, 0.22]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <motion.img
        src={images.hero}
        alt="Solar panel installation across a modern energy landscape"
        style={{ y, opacity }}
        className="absolute inset-0 h-[115%] w-full object-cover image-mask"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/42 to-night" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_36%,rgba(249,115,22,0.30),transparent_22rem)]" />
      <motion.div
        animate={{ x: [0, 22, 0], y: [0, -18, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="absolute right-[8%] top-[26%] h-56 w-56 rounded-full bg-orange-energy/25 blur-3xl"
      />

      <div className="relative mx-auto flex min-h-screen w-[min(1180px,calc(100%-32px))] flex-col justify-end pb-10 pt-36 md:pb-20">
        <Reveal>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-orange-energy shadow-glow" />
            Kenya's premium solar and technology partner
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="max-w-5xl font-heading text-5xl font-semibold tracking-tight text-white text-balance md:text-7xl lg:text-8xl">
            Powering Kenya's Future Through Smart Solar Technology
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 md:text-xl">
            Reliable solar energy systems, security solutions, and electrical products for homes and businesses.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link href="/contact" className="inline-flex items-center justify-center gap-3 rounded-full bg-orange-energy px-7 py-4 font-semibold text-night shadow-glow transition hover:bg-orange-glow">
              Get Free Quote <ArrowUpRight size={20} />
            </Link>
            <Link href="/products" className="inline-flex items-center justify-center gap-3 rounded-full border border-white/18 bg-white/8 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:bg-white/16">
              Explore Products <ChevronRight size={20} />
            </Link>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-4 md:grid-cols-4">
          {stats.map(([value, label], index) => (
            <Reveal key={label} delay={0.12 + index * 0.05}>
              <div className="glass rounded-[2rem] p-5">
                <p className="font-heading text-4xl font-semibold"><Counter value={value} /></p>
                <p className="mt-2 text-sm text-white/65">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="Solutions" title="Engineered For Homes, Enterprises, And Institutions" text="ST Light brings solar, power backup, security, and lighting into one premium technology ecosystem." />
      <div className="mx-auto grid w-[min(1120px,100%)] gap-5 md:grid-cols-2">
        {solutions.map((item, index) => {
          const Icon = icons[index];
          return (
            <Reveal key={item.title} delay={index * 0.06}>
              <Link href="/solutions" className="group relative block h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-surface shadow-soft">
                <img src={item.image} alt={item.title} className="image-reveal absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/48 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <div className="mb-5 grid h-12 w-12 place-items-center rounded-full bg-orange-energy text-night">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-heading text-3xl font-semibold">{item.title}</h3>
                  <p className="mt-3 max-w-md text-white/72">{item.text}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="bg-white/[0.03] px-6 py-24">
      <SectionHeading eyebrow="Products" title="Premium Technology, Presented With Restraint" text="A curated showcase of solar and security systems without the clutter of a marketplace." />
      <div className="mx-auto grid w-[min(1120px,100%)] gap-5 md:grid-cols-4">
        {products.slice(0, 4).map(([title, subtitle, spec, image], index) => (
          <Reveal key={title} delay={index * 0.06}>
            <Link href="/products" className="group block overflow-hidden rounded-[2rem] border border-white/10 bg-night p-4 transition hover:-translate-y-2 hover:border-orange-energy/50">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem] bg-white/5">
                <img src={image} alt={title} className="image-reveal h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-110" />
              </div>
              <div className="p-3">
                <p className="text-sm text-orange-glow">{subtitle}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-mist">{spec}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedProjects() {
  return (
    <section className="px-6 py-24">
      <SectionHeading eyebrow="Projects" title="Built For Real Kenyan Energy Demands" text="Commercial rooftops, institutions, homes, and smart security deployments delivered with enterprise precision." />
      <div className="mx-auto grid w-[min(1120px,100%)] gap-5 md:grid-cols-2">
        {projects.slice(0, 2).map((project, index) => (
          <Reveal key={project.title} delay={index * 0.08}>
            <Link href="/projects" className="group relative block min-h-[500px] overflow-hidden rounded-[2rem] border border-white/10">
              <img src={project.image} alt={project.title} className="image-reveal absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/28 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="mb-5 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                  <span className="rounded-full bg-orange-energy px-3 py-2 text-night">{project.capacity}</span>
                  <span className="rounded-full bg-white/12 px-3 py-2 backdrop-blur">{project.location}</span>
                </div>
                <h3 className="font-heading text-4xl font-semibold">{project.title}</h3>
                <p className="mt-4 max-w-xl text-white/76">{project.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function WhyChoose() {
  const items = [
    [BadgeCheck, "Certified Experts", "Design, installation, and support from experienced technical teams."],
    [ShieldCheck, "Quality Products", "Carefully selected solar, electrical, and security technology."],
    [Headphones, "Nationwide Support", "Reliable after-sales support for homes, sites, and institutions."],
    [BatteryCharging, "Competitive Pricing", "Premium systems planned around measurable long-term value."]
  ];
  return (
    <section className="bg-radial-energy px-6 py-24">
      <SectionHeading eyebrow="Why ST Light" title="A Partner Built For Trust" />
      <div className="mx-auto grid w-[min(1120px,100%)] gap-5 md:grid-cols-4">
        {items.map(([Icon, title, text], index) => (
          <Reveal key={title} delay={index * 0.06}>
            <div className="glass h-full rounded-[2rem] p-6">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-energy text-night">
                <Icon size={22} />
              </div>
              <h3 className="mt-7 font-heading text-2xl font-semibold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-mist">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="overflow-hidden px-6 py-24">
      <SectionHeading eyebrow="Clients" title="Trusted By Homes And Organizations" />
      <div className="mx-auto flex w-[min(1120px,100%)] gap-5 overflow-x-auto pb-4 hide-scrollbar">
        {testimonials.map(([name, role, quote], index) => (
          <Reveal key={name} delay={index * 0.08} className="min-w-[320px] flex-1">
            <div className="glass h-full rounded-[2rem] p-7">
              <div className="mb-7 flex items-center gap-1 text-orange-glow">
                {Array.from({ length: 5 }).map((_, i) => <Sparkles key={i} size={16} fill="currentColor" />)}
              </div>
              <p className="text-xl leading-8 text-white/88">"{quote}"</p>
              <div className="mt-9 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-orange-energy font-bold text-night">{name[0]}</div>
                <div>
                  <p className="font-semibold">{name}</p>
                  <p className="text-sm text-mist">{role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Marquee() {
  const labels = ["Victron Energy", "Huawei Solar", "Canadian Solar", "Dahua", "Growatt", "JA Solar"];
  return (
    <section className="border-y border-white/10 bg-white/[0.03] py-8">
      <div className="flex overflow-hidden">
        {[0, 1].map((loop) => (
          <motion.div key={loop} animate={{ x: ["0%", "-100%"] }} transition={{ repeat: Infinity, duration: 24, ease: "linear" }} className="flex shrink-0 gap-12 px-6">
            {labels.map((label) => (
              <span key={`${loop}-${label}`} className="font-heading text-2xl font-semibold text-white/22">{label}</span>
            ))}
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative overflow-hidden px-6 py-28">
      <img src={images.architecture} alt="Modern architecture powered by solar" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
      <Reveal className="relative mx-auto w-[min(1120px,100%)]">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.28em] text-orange-glow">Switch with confidence</p>
        <h2 className="max-w-3xl font-heading text-5xl font-semibold tracking-tight md:text-7xl">Ready To Switch To Solar?</h2>
        <Link href="/contact" className="mt-10 inline-flex items-center gap-3 rounded-full bg-orange-energy px-7 py-4 font-semibold text-night shadow-glow transition hover:bg-orange-glow">
          Request Consultation <Zap size={20} />
        </Link>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <Marquee />
      <Solutions />
      <FeaturedProducts />
      <FeaturedProjects />
      <WhyChoose />
      <Testimonials />
      <CTA />
    </SiteShell>
  );
}
