import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 py-12 text-center selection:bg-wine/10 selection:text-wine">
      <div className="max-w-3xl space-y-12 animate-in fade-in duration-1000 slide-in-from-bottom-8">
        {/* Symbolic Header */}
        <div className="space-y-4">
          <h2 className="text-gold tracking-[0.3em] uppercase text-sm font-medium">
            Casa Orácula
          </h2>
          <h1 className="text-wine text-5xl md:text-7xl font-serif leading-tight">
            Descubra a voz da sua <span className="italic">psique</span>
          </h1>
        </div>

        {/* Narrative Copy */}
        <p className="text-wine/80 text-lg md:text-xl leading-relaxed max-w-xl mx-auto font-light">
          Um portal para o autoconhecimento profundo através de arquétipos, 
          escrita simbólica e travessias sonoras.
        </p>

        {/* Main CTA */}
        <div className="flex flex-col items-center gap-6 pt-8">
          <Link
            to="/quiz"
            className="group relative px-10 py-4 bg-wine text-bone font-serif text-xl rounded-sm transition-all duration-300 hover:bg-wine/90 hover:scale-[1.02] shadow-lg shadow-wine/20"
          >
            Inicie sua Jornada
            <span className="absolute -bottom-2 -right-2 w-full h-full border border-gold/30 -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-300" />
          </Link>
          
          <p className="text-forest/60 text-sm italic">
            Descubra seu arquétipo em menos de 5 minutos
          </p>
        </div>

        {/* Symbolic Footer Element */}
        <div className="pt-24 opacity-30">
          <div className="w-px h-24 bg-gradient-to-b from-gold to-transparent mx-auto" />
        </div>
      </div>
    </div>
  );
}
