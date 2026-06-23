import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Highlight } from "@/components/ui/Highlight";
import { homeHero } from "@/content/home";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-t-[6px] border-amber bg-slate-900 text-white">
      {/* Dach-Hintergrundbild mit dunklem Overlay */}
      <Image
        src={homeHero.bgImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-slate-900/60" />

      <Container className="relative py-16 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          {/* Left column */}
          <div>
            <h1 className="flex flex-col items-start gap-3 text-4xl font-bold leading-none md:text-5xl lg:text-6xl">
              <Highlight color="green">{homeHero.titleLine1}</Highlight>
              <Highlight color="amber">{homeHero.titleLine2}</Highlight>
            </h1>
            <div className="mt-6">
              <Highlight color="muted" className="text-lg font-medium md:text-2xl">
                {homeHero.subtitle}
              </Highlight>
            </div>
            <ul className="mt-8 space-y-3">
              {homeHero.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-lg">
                  <Icon name="check" className="h-6 w-6 flex-shrink-0 text-white" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right column */}
          <div className="flex justify-center md:justify-end">
            <Image
              src={homeHero.image}
              alt="AmbiVolt Photovoltaik-Montagesysteme"
              width={980}
              height={883}
              priority
              className="w-full max-w-md object-contain md:max-w-full"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
