import { motion } from "framer-motion";

const placeholderImages = [
  { id: 1, aspect: "aspect-[3/4]", label: "Campaign Poster — Dairy Industry" },
  { id: 2, aspect: "aspect-square", label: "Bookmark Design — Plant-Based Facts" },
  { id: 3, aspect: "aspect-[4/5]", label: "Street Art — Animal Liberation" },
  { id: 4, aspect: "aspect-[3/4]", label: "Infographic — Hidden Dairy in Snacks" },
  { id: 5, aspect: "aspect-square", label: "Zine Cover — Vegan India" },
  { id: 6, aspect: "aspect-[4/5]", label: "Workshop Poster — Transitioning Guide" },
];

const About = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
    className="container py-12 md:py-16"
  >
    {/* Mission */}
    <div className="max-w-prose mb-16">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">About Us</h1>
      <div className="space-y-4 text-lg leading-[1.7]">
        <p>
          We are a small, independent research collective documenting the vegan status
          of Indian snacks and street foods — one ingredient label at a time.
        </p>
        <p className="text-muted-foreground">
          Our approach is intersectional. We believe food justice, animal liberation,
          environmental sustainability, and worker rights are interconnected. This
          platform is a tool for informed consumption, not moral policing.
        </p>
      </div>
    </div>

    {/* Gallery */}
    <div>
      <h2 className="text-xl font-semibold mb-6">Our Work</h2>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {placeholderImages.map((img) => (
          <div
            key={img.id}
            className={`${img.aspect} bg-secondary rounded-lg overflow-hidden break-inside-avoid group relative`}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-center text-sm font-semibold text-muted-foreground leading-snug">
                {img.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default About;
