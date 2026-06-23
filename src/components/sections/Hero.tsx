import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { homeHero } from "@/content/home";

export function Hero() {
  return (
    <section className="bg-slate-900 text-white py-16 md:py-24">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          {/* Left column */}
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              {homeHero.titleLine1}
              <br />
              {homeHero.titleLine2}
            </h1>
            <p className="mt-4 text-lg text-white/70 md:text-xl">{homeHero.subtitle}</p>
            <ul className="mt-8 space-y-3">
              {homeHero.bullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-3 text-base">
                  <Icon name="check" className="h-5 w-5 flex-shrink-0 text-amber" />
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
              className="w-full max-w-md md:max-w-full object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
