import { motion } from "framer-motion";

const sections = [
  {
    title: "Why Vegan?",
    body: "Veganism is a commitment to reducing harm — to animals, to the planet, and to ourselves. The animal agriculture industry is the second-largest contributor to greenhouse gas emissions globally. Every meal is a vote.",
    note: "Beyond the environment, it's about recognizing that sentient beings are not commodities. The dairy industry in India — often seen as \"harmless\" — involves systemic cruelty, including separation of calves from mothers and eventual slaughter when production declines.",
  },
  {
    title: "Transitioning in India",
    body: "India is uniquely positioned for plant-based living. With the world's largest vegetarian population and a culinary tradition rich in legumes, grains, and vegetables, the infrastructure already exists.",
    note: "The primary challenge isn't access to plant foods — it's hidden dairy. Ghee, paneer, curd, and milk powder appear in everything from biscuits to street food. This app exists to make those hidden ingredients visible.",
  },
  {
    title: "Systemic Activism & Animal Liberation",
    body: "Individual dietary change is necessary but insufficient. True animal liberation requires systemic change — policy reform, corporate accountability, and cultural shifts in how we relate to non-human animals.",
    note: "We advocate for an intersectional approach that connects animal rights with environmental justice, worker rights, and food sovereignty. The same systems that exploit animals exploit people.",
  },
];

const GoVegan = () => (
  <div className="mesh-gradient min-h-screen">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="container max-w-prose mx-auto py-12 md:py-20"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-10">Go Vegan</h1>

      <div className="space-y-12 text-lg leading-[1.7] text-foreground">
        {sections.map((s, i) => (
          <motion.section
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
          >
            <h2 className="text-xl font-semibold mb-3">{s.title}</h2>
            <p>{s.body}</p>
            <p className="mt-3 text-muted-foreground">{s.note}</p>
          </motion.section>
        ))}
      </div>
    </motion.div>
  </div>
);

export default GoVegan;
