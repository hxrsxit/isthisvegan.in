import { Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const links = [
  {
    label: "Follow on Instagram",
    href: "https://instagram.com",
    icon: Instagram,
  },
  {
    label: "Watch on YouTube",
    href: "https://youtube.com",
    icon: Youtube,
  },
];

const JoinUs = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
    className="container flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-16"
  >
    <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">Join Us</h1>
    <p className="text-muted-foreground text-lg mb-10 text-center max-w-md">
      Connect with the community. Share findings. Demand transparency.
    </p>

    <div className="flex flex-col gap-4 w-full max-w-sm">
      {links.map((link) => (
        <Button
          key={link.label}
          asChild
          variant="outline"
          size="lg"
          className="h-14 text-base font-semibold justify-start gap-3"
        >
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            <link.icon size={20} />
            {link.label}
          </a>
        </Button>
      ))}

      <Button
        asChild
        size="lg"
        className="h-14 text-base font-semibold justify-start gap-3 mt-2"
      >
        <a href="mailto:hello@isthisvegan.in" aria-label="Contact us via email">
          <Mail size={20} />
          Contact Us
        </a>
      </Button>
    </div>
  </motion.div>
);

export default JoinUs;
