import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

// Wiederkehrender Beratungs-CTA-Balken (hellgrau, wie Original) auf den Produktseiten.
export function BeratungsCtaBand() {
  return (
    <section className="relative bg-[#ededed] py-14 md:py-16">
      {/* kleine weiße Pfeil-Spitze (Notch) oben mittig */}
      <div className="absolute left-1/2 top-0 h-0 w-0 -translate-x-1/2 border-x-[16px] border-t-[16px] border-x-transparent border-t-white" />
      <Container>
        <div className="flex flex-col items-center gap-7 text-center">
          <h2 className="max-w-2xl text-2xl font-bold text-ink md:text-3xl">
            Fragen Sie Ihr <span className="text-amber">Beratungsgespräch</span> über unser Kontaktformular an!
          </h2>
          <Button href="/kontakt/" variant="primary" className="!bg-[#222d35] hover:!bg-slate-800">
            Hier klicken
          </Button>
        </div>
      </Container>
    </section>
  );
}
