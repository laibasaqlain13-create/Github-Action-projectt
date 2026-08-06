import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const craftRoutes = ["embroidery", "crochet", "zardozi", "machine-stitching", "fabric-painting"];

export default function AboutPage() {
  const featuredCrafts = craftRoutes
    .map((route) => categories.find((category) => category.route === route))
    .filter((category): category is (typeof categories)[number] => Boolean(category));

  return (
    <main className="overflow-x-clip bg-[#fffaf7] text-[#2d1f25]">
      <section className="relative overflow-hidden border-b border-[#f0deda] bg-[#fffdfb]">
        <div className="pointer-events-none absolute right-8 top-8 hidden text-8xl text-[#8b1e4d]/5 lg:block">✿</div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:py-16">
          <div className="relative z-10">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#8b1e4d]">Our Story</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#2d1f25] sm:text-5xl" style={{ fontFamily: "Playfair Display, serif" }}>
              About <span className="text-[#8b1e4d]">HunarConnect</span>
            </h1>
            <div className="mt-5 flex items-center gap-3 text-[#8b1e4d]/60">
              <span className="h-px w-24 bg-current" />
              <span className="text-2xl">✿</span>
              <span className="h-px w-24 bg-current" />
            </div>
            <h2 className="mt-6 text-2xl font-semibold text-[#8b1e4d]" style={{ fontFamily: "Playfair Display, serif" }}>
              Connecting Hands. Preserving Heritage.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              HunarConnect is a platform dedicated to empowering skilled artisans and connecting them with people who value authentic handmade crafts. We preserve traditional art forms while creating opportunities for artisans to share their talent with the world.
            </p>
            <a href="#how-it-works" className="mt-7 inline-flex rounded-lg bg-[#8b1e4d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f173d]">
              Our Journey
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="relative aspect-[1.3/1] overflow-hidden rounded-[3rem] bg-[#f9e3e4] shadow-xl shadow-[#8b1e4d]/10">
              <Image src="/images/categories/zardozi.jpg" alt="Artisan creating detailed zardozi embroidery" fill priority className="object-cover" />
            </div>
            <div className="relative mx-auto -mt-16 w-[13.5rem] rounded-2xl bg-white p-5 text-center shadow-xl shadow-[#8b1e4d]/15 sm:absolute sm:-bottom-5 sm:-left-10 sm:mt-0">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f7dce1] text-2xl text-[#8b1e4d]">♥</div>
              <h3 className="mt-3 font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>Support Artisans</h3>
              <p className="mt-2 text-sm leading-5 text-slate-600">Empowering skilled artisans and preserving traditional crafts.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff0ea]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <InfoBlock icon="◎" title="Our Mission">To empower artisans by providing a platform to showcase their skills, connect with customers, and grow their businesses.</InfoBlock>
          <InfoBlock icon="◉" title="Our Vision">A world where traditional crafts thrive, artisans are valued and supported, and handmade is celebrated.</InfoBlock>
          <InfoBlock icon="◇" title="Our Values"><span className="block">• Respect for craftsmanship</span><span className="block">• Empowerment</span><span className="block">• Authenticity</span><span className="block">• Community</span></InfoBlock>
        </div>
      </section>

      <section id="how-it-works" className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.25fr_.9fr] lg:px-8">
        <div>
          <SectionTitle>How <span className="text-[#8b1e4d]">HunarConnect</span> Works</SectionTitle>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["1", "Discover", "Browse through various craft categories and skilled artisans."],
              ["2", "Connect", "Explore artisan profiles, work samples, and customer reviews."],
              ["3", "Communicate", "Chat with artisans, share requirements, and get quotes."],
              ["4", "Collaborate", "Work together to bring your ideas to life."],
            ].map(([number, title, text]) => <div key={number} className="rounded-2xl border border-[#f0e1dc] bg-white p-5 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#8b1e4d] text-sm font-bold text-white">{number}</span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-5 text-slate-600">{text}</p></div>)}
          </div>
        </div>
        <div className="rounded-2xl border border-[#f0e1dc] bg-white p-6 shadow-sm">
          <SectionTitle><span className="text-[#8b1e4d]">HunarConnect</span> in Numbers</SectionTitle>
          <div className="mt-7 grid grid-cols-2 gap-6 text-center sm:grid-cols-4 lg:grid-cols-2">
            {[['500+', 'Skilled Artisans'], ['20+', 'Craft Categories'], ['1000+', 'Happy Customers'], ['5000+', 'Completed Projects']].map(([number, label]) => <div key={label}><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-[#f8dfe3] text-[#8b1e4d]">✦</div><p className="mt-3 text-2xl font-semibold text-[#8b1e4d]" style={{ fontFamily: "Playfair Display, serif" }}>{number}</p><p className="mt-1 text-xs font-medium text-slate-600">{label}</p></div>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 pb-14 sm:px-6 lg:grid-cols-[.95fr_1.55fr_1fr] lg:px-8">
        <div>
          <SectionTitle>Why Choose <span className="text-[#8b1e4d]">HunarConnect?</span></SectionTitle>
          <ul className="mt-5 space-y-3 text-sm text-slate-700">{["Authentic handmade crafts", "Verified and skilled artisans", "Secure communication", "Fair pricing and transparent process", "Supporting local communities"].map((item) => <li key={item} className="flex gap-3"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#8b1e4d] text-xs text-white">✓</span>{item}</li>)}</ul>
        </div>
        <div>
          <SectionTitle>Crafts That <span className="text-[#8b1e4d]">Connect Us</span></SectionTitle>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5">
            {featuredCrafts.map((craft) => <Link key={craft.route} href={`/categories/${craft.route}`} className="group text-center"><div className="relative aspect-square overflow-hidden rounded-xl bg-[#f5e5e0]"><Image src={craft.image} alt={craft.name} fill sizes="(min-width: 1024px) 120px, 30vw" className="object-cover transition duration-300 group-hover:scale-105" /></div><p className="mt-2 text-xs font-semibold text-slate-700">{craft.name === "Machine Stitching" ? "Sewing" : craft.name}</p></Link>)}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-[#fde9e8] p-7 text-center">
          <div className="text-4xl text-[#8b1e4d]">✿</div>
          <h2 className="mt-4 text-2xl font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>Be Part of <span className="text-[#8b1e4d]">Our Journey</span></h2>
          <p className="mt-4 text-sm leading-6 text-slate-600">Whether you are an artisan looking to grow your business or someone who appreciates handmade crafts, you belong here.</p>
          <Link href="/register" className="mt-6 rounded-lg bg-[#8b1e4d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6f173d]">Join HunarConnect Today</Link>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return <article className="flex gap-4 md:border-r md:border-[#ead7d1] md:pr-6 last:border-0"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f7d9db] text-2xl text-[#8b1e4d]">{icon}</span><div><h2 className="text-xl font-semibold" style={{ fontFamily: "Playfair Display, serif" }}>{title}</h2><div className="mt-2 text-sm leading-6 text-slate-600">{children}</div></div></article>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-2xl font-semibold text-[#2d1f25] sm:text-3xl" style={{ fontFamily: "Playfair Display, serif" }}>{children}</h2>;
}
