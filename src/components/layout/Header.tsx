import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { company } from "@/content/company";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/95 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" aria-label={`${company.shortName} Startseite`}>
          <Image src="/ambivolt-logo.svg" alt={company.legalName} width={172} height={45} priority style={{ height: "auto" }} />
        </Link>
        <DesktopNav />
        <MobileMenu />
      </Container>
    </header>
  );
}
