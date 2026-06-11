"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, SunMedium, X } from "lucide-react";
import { useEffect, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { navItems } from "@/lib/data";

export default function SiteShell({ children }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame;
    const raf = (time) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll);

    const ctx = gsap.context(() => {
      gsap.utils.toArray(".gsap-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 44 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 84%"
            }
          }
        );
      });

      gsap.utils.toArray(".image-reveal").forEach((element) => {
        gsap.fromTo(
          element,
          { clipPath: "inset(16% 0 16% 0)", scale: 1.08 },
          {
            clipPath: "inset(0% 0 0% 0)",
            scale: 1,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: element,
              start: "top 82%"
            }
          }
        );
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      ctx.revert();
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-6"}`}>
        <nav className={`mx-auto flex w-[min(1120px,calc(100%-32px))] items-center justify-between rounded-full px-4 py-3 transition-all duration-500 ${scrolled ? "glass" : "bg-white/5"}`}>
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-orange-energy text-night shadow-glow">
              <SunMedium size={21} strokeWidth={2.6} />
            </span>
            <span className="font-heading text-lg font-semibold tracking-wide">ST Light</span>
          </Link>

          <div className="hidden items-center rounded-full bg-white/5 p-1 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm transition ${pathname === item.href ? "bg-white text-night" : "text-white/72 hover:text-white"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <Link href="/contact" className="hidden rounded-full bg-orange-energy px-5 py-2.5 text-sm font-semibold text-night transition hover:bg-orange-glow md:inline-flex">
            Get Free Quote
          </Link>

          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass mx-auto mt-3 grid w-[calc(100%-32px)] gap-1 rounded-3xl p-3 md:hidden"
          >
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-white/80 hover:bg-white/10">
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-white/10 bg-night px-6 py-12">
        <div className="mx-auto flex w-[min(1120px,100%)] flex-col gap-6 text-sm text-mist md:flex-row md:items-center md:justify-between">
          <p>ST Light, Solar Today Limited. Smart energy, security, and power backup solutions.</p>
          <div className="flex gap-5">
            <Link href="/solutions">Solutions</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </>
  );
}
