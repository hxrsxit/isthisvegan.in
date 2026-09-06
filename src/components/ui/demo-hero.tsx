import SmoothScrollHero from "@/components/ui/smooth-scroll-hero";

const DemoOne = () => {
  return (
    <div className="relative min-h-screen">
      <SmoothScrollHero
        scrollHeight={1500}
        desktopImage="https://images.unsplash.com/photo-1540420773420-3366772f4999?q=80&w=2000&auto=format&fit=crop"
        mobileImage="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1000&auto=format&fit=crop"
        initialClipPercentage={25}
        finalClipPercentage={75}
      />
    </div>
  );
};

export { DemoOne };
