import { Instagram, Youtube, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const links = [
  { label: "Follow on Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "Watch on YouTube", href: "https://youtube.com", icon: Youtube },
];

const JoinUs = () => (
  <div className="mesh-gradient min-h-[calc(100vh-4rem)]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] py-16"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">Join Us</h1>
      <p className="text-muted-foreground text-lg mb-10 text-center max-w-md">
        Connect with the community. Share findings. Demand transparency.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {links.map((link, i) => (
          <motion.div
            key={link.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 + i * 0.1 }}
          >
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full h-14 text-base font-semibold justify-start gap-3 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover"
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
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.4 }}
        >
          <Button
            asChild
            size="lg"
            className="w-full h-14 text-base font-semibold justify-start gap-3 rounded-2xl mt-2 transition-all duration-300 hover:scale-[1.02]"
          >
            <a href="mailto:hello@isthisvegan.in" aria-label="Contact us via email">
              <Mail size={20} />
              Contact Us
            </a>
          </Button>
        </motion.div>
      </div>
    </motion.div>
  </div>
);

export default JoinUs;
