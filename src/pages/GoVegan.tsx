import { motion } from "framer-motion";

const GoVegan = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
    className="container max-w-prose mx-auto py-12 md:py-16"
  >
    <h1 className="text-3xl md:text-4xl font-bold mb-8">Go Vegan</h1>

    <div className="space-y-10 text-lg leading-[1.7] text-foreground">
      <section>
        <h2 className="text-xl font-semibold mb-3">Why Vegan?</h2>
        <p>
          Veganism is a commitment to reducing harm — to animals, to the planet, and to
          ourselves. The animal agriculture industry is the second-largest contributor to
          greenhouse gas emissions globally. Every meal is a vote.
        </p>
        <p className="mt-3 text-muted-foreground">
          Beyond the environment, it's about recognizing that sentient beings are not
          commodities. The dairy industry in India — often seen as "harmless" — involves
          systemic cruelty, including separation of calves from mothers and eventual
          slaughter when production declines.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Transitioning in India</h2>
        <p>
          India is uniquely positioned for plant-based living. With the world's largest
          vegetarian population and a culinary tradition rich in legumes, grains, and
          vegetables, the infrastructure already exists.
        </p>
        <p className="mt-3 text-muted-foreground">
          The primary challenge isn't access to plant foods — it's hidden dairy. Ghee,
          paneer, curd, and milk powder appear in everything from biscuits to street
          food. This app exists to make those hidden ingredients visible.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">
          Systemic Activism & Animal Liberation
        </h2>
        <p>
          Individual dietary change is necessary but insufficient. True animal liberation
          requires systemic change — policy reform, corporate accountability, and cultural
          shifts in how we relate to non-human animals.
        </p>
        <p className="mt-3 text-muted-foreground">
          We advocate for an intersectional approach that connects animal rights with
          environmental justice, worker rights, and food sovereignty. The same systems
          that exploit animals exploit people.
        </p>
      </section>
    </div>
  </motion.div>
);

export default GoVegan;
