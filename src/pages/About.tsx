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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    className="container py-12 md:py-20"
  >
    <div className="mb-16 max-w-prose">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl md:leading-snug">
        About Us
      </h1>
      <div className="mt-6 space-y-4 text-lg leading-[1.7] text-foreground">
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

    <div>
      <h2 className="font-serif text-xl font-semibold tracking-tight text-foreground md:mb-8">
        Our Work
      </h2>
      <div className="columns-1 gap-5 space-y-5 sm:columns-2 lg:columns-3">
        {placeholderImages.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
            whileHover={{ scale: 1.01 }}
            className={`${img.aspect} break-inside-avoid rounded-3xl border border-border/60 bg-card shadow-card transition-shadow hover:shadow-card-hover relative overflow-hidden`}
          >
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <p className="text-center text-sm font-medium leading-snug text-muted-foreground">
                {img.label}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export default About;
