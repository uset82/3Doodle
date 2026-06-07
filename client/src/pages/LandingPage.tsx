import { useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brush,
  Images,
  Palette,
  Sparkles,
  Star,
  Volume2,
  WandSparkles,
} from "lucide-react";
import doodleHero from "../../../attached_assets/doodling.png";

const featureTiles = [
  {
    icon: Brush,
    title: "Draw",
    text: "Big tools, bold colors, and a canvas that feels ready for little hands.",
    color: "bg-[#14b8c4]",
  },
  {
    icon: WandSparkles,
    title: "Transform",
    text: "Turn simple sketches into playful 3D-style creations.",
    color: "bg-[#ff477e]",
  },
  {
    icon: Volume2,
    title: "Play",
    text: "Save creations in the gallery and tap them for fun sounds.",
    color: "bg-[#8ac926]",
  },
];

const LandingPage = () => {
  const [, navigate] = useLocation();

  const handleStartDoodling = () => {
    navigate("/draw");
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#bdf4ff] text-[#23244d] studio-pattern">
      <section className="relative mx-auto flex w-full max-w-[1400px] flex-1 items-center px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <div className="z-10 grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="flex flex-col justify-center space-y-5"
          >
            <div className="inline-flex w-fit items-center gap-2 rounded-full border-4 border-white bg-[#fffdf7] px-4 py-2 font-nunito text-sm font-extrabold text-[#23244d] shadow-[0_8px_0_rgba(35,36,77,0.1)]">
              <Sparkles className="h-4 w-4 text-[#ff477e]" aria-hidden="true" />
              Toy studio for big ideas
            </div>

            <div className="space-y-3">
              <h1 className="font-nunito text-[clamp(2.8rem,7vw,5.5rem)] font-black leading-[0.9] tracking-normal text-[#23244d] drop-shadow-[0_4px_0_rgba(255,255,255,0.9)]">
                3Doodle
              </h1>
              <p className="max-w-xl font-quicksand text-lg font-bold leading-relaxed text-[#33406f] sm:text-xl">
                A colorful drawing studio where kids sketch, chat for ideas, and make a 3D-style gallery from their doodles.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleStartDoodling}
                className="toy-button bg-[#ff477e] text-lg text-white"
              >
                Start doodling
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </motion.button>
              <button
                type="button"
                onClick={handleStartDoodling}
                className="toy-button bg-[#fffdf7] text-[#23244d]"
              >
                <Palette className="h-5 w-5 text-[#14b8c4]" aria-hidden="true" />
                Open studio
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-3">
              {featureTiles.map((feature, index) => {
                const Icon = feature.icon;

                return (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
                    className="rounded-[1.25rem] border-4 border-white bg-[#fffdf7] p-4 shadow-[0_8px_0_rgba(35,36,77,0.08)]"
                  >
                    <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${feature.color} text-white shadow-[0_4px_0_rgba(35,36,77,0.12)]`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="font-nunito text-lg font-black text-[#23244d]">{feature.title}</h2>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-[#52607e]">{feature.text}</p>
                  </motion.article>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex items-center justify-center p-3 sm:p-5 lg:p-8"
          >
            <motion.button
              type="button"
              aria-label="Start doodling"
              title="Start doodling"
              onClick={handleStartDoodling}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="group relative w-full max-w-[620px] rounded-[2.5rem] p-2 text-left outline-none transition focus-visible:ring-4 focus-visible:ring-[#fff3b0]/80 focus-visible:ring-offset-4 focus-visible:ring-offset-[#bdf4ff] sm:p-3 lg:p-4"
            >
              <div
                aria-hidden="true"
                className="absolute inset-2 rounded-[2.5rem] bg-gradient-to-br from-[#ff477e]/25 via-[#ffd166]/20 to-[#14b8c4]/25 blur-2xl sm:inset-4"
              />

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative aspect-square w-full"
              >
                <div className="rounded-[2.2rem] bg-gradient-to-br from-[#ff477e] via-[#ffd166] to-[#14b8c4] p-[5px] shadow-[0_16px_48px_rgba(255,71,126,0.22),0_8px_24px_rgba(20,184,196,0.18)]">
                  <div className="relative aspect-square overflow-hidden rounded-[2rem] border-[8px] border-white bg-white shadow-[inset_0_2px_8px_rgba(35,36,77,0.08)]">
                    <img
                      src={doodleHero}
                      alt="Children drawing colorful 3Doodle art"
                      className="block h-full w-full select-none object-cover pointer-events-none"
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [0, 3, -2, 3, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-2 -right-2 z-10 flex items-center gap-1.5 rounded-2xl border-[3px] border-white bg-[#fff3b0] px-3 py-2 font-nunito text-xs font-black text-[#ff477e] shadow-[0_6px_0_rgba(35,36,77,0.1)] sm:-top-3 sm:-right-3 sm:px-3.5"
                >
                  <Images className="h-4 w-4" />
                  Gallery ready!
                </motion.div>

                <div className="absolute -top-4 -left-2 select-none pointer-events-none text-[#ff477e] sm:-top-5 sm:-left-3">
                  <Sparkles className="h-6 w-6 drop-shadow-[0_2px_4px_rgba(255,71,126,0.4)] sm:h-7 sm:w-7" />
                </div>
                <div className="absolute -bottom-3 -right-4 select-none pointer-events-none text-[#ffd166] sm:-bottom-4 sm:-right-5">
                  <Star className="h-5 w-5 fill-[#ffd166] drop-shadow-[0_2px_4px_rgba(255,209,102,0.5)] sm:h-6 sm:w-6" />
                </div>
                <div className="absolute top-1/2 -left-3 select-none pointer-events-none opacity-60 text-[#14b8c4] sm:-left-5">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="w-full shrink-0 overflow-hidden">
        <div className="h-3 bg-[#15b8c6]" />
        <div className="h-3 bg-[#ffcf33]" />
        <div className="h-5 bg-[#fff7d7]" />
      </footer>
    </main>
  );
};

export default LandingPage;
