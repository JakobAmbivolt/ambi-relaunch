import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { company } from "@/content/company";
import { projectInquiry } from "@/content/navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" aria-label={`${company.shortName} Startseite`} className="shrink-0">
          <Image
            src="/ambivolt-logo.svg"
            alt={company.legalName}
            width={172}
            height={45}
            priority
            className="h-auto w-[132px] sm:w-[150px] lg:w-[172px]"
          />
        </Link>
        <DesktopNav />
        {/* Mobil/Tablet: Projektanfrage-CTA immer sichtbar in der Kopfzeile neben dem Burger */}
        <div className="flex shrink-0 items-center gap-1.5 xl:hidden">
          <Button
            href={projectInquiry.href}
            variant="darkAccent"
            tickClassName="bg-amber"
            className="px-3 py-2.5 text-[0.62rem] tracking-[0.08em]"
          >
            {projectInquiry.shortLabel}
          </Button>
          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
