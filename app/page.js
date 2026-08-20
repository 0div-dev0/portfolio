import Hero from "@/components/hero";
import Navbar from "@/components/navbar";

const SECTIONS = [
  { id: "about", title: "About", desc: "Learn more about me and my work." },
  { id: "gallery", title: "Gallery", desc: "A collection of my projects and experiments." },
  { id: "play", title: "Play", desc: "Interactive demos and playful experiments." },
  { id: "contact", title: "Contact", desc: "Get in touch — I'd love to hear from you." },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      {SECTIONS.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="relative flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center"
        >
          <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-md text-lg text-muted">
            {section.desc}
          </p>
        </section>
      ))}
    </>
  );
}
