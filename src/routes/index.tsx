import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { SectionOpener } from '@/components/casa/SectionOpener';
import { EditorialButton } from '@/components/casa/EditorialButton';
import { Rule } from '@/components/casa/Rule';
import { QuietLink } from '@/components/casa/QuietLink';
import casaOraculaLogo from '@/assets/casa-oracula-logo.png';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  const handleStartQuiz = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      navigate({ to: '/quiz' });
    }, 1200);
  }, [navigate]);

  return (
    <main className="min-h-screen bg-paper selection:bg-oxblood/10 selection:text-oxblood overflow-x-hidden relative">
      {/* Transição de entrada */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-paper flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
          <div className="w-12 h-12 rounded-full border border-leaf/30 animate-pulse" />
          <p className="text-ink-3 font-serif italic text-base tracking-wide">
            Atravessando o primeiro limiar...
          </p>
        </div>
      )}

      {/* Atmosfera visual de fundo */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full bg-leaf/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-oxblood/[0.04] blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-5xl mx-auto px-6 py-20">
        
        {/* Identidade: Casa Orácula */}
        <header className="animate-in fade-in slide-in-from-bottom-4 duration-1000 mb-20">
          <img
            src={casaOraculaLogo}
            alt="Casa Orácula"
            className="w-48 md:w-64 h-auto select-none mx-auto opacity-80"
            draggable={false}
          />
        </header>

        {/* Sala de Visita */}
        <section className="text-center space-y-12 mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <SectionOpener 
            eyebrow="Sala de Visita"
            title="A Casa Orácula ensina como sustentar processos humanos."
            lead="Existe uma pergunta que precisa ser ouvida antes de entrar na Casa. Sua Voz é a bússola deste território."
            className="items-center"
          />
          
          <div className="flex flex-col items-center gap-6">
            <EditorialButton 
              onClick={handleStartQuiz}
              className={cn("px-16", isTransitioning && "opacity-50 pointer-events-none")}
            >
              Descobrir minha Voz
            </EditorialButton>
            <p className="caption text-ink-3/50 text-[10px]">Experiência Gratuita • Inicie agora</p>
          </div>
        </section>

        <Rule className="w-full opacity-10 mb-32" />

        {/* Ecossistema Oracular */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-32 w-full mb-32">
          
          {/* Clube Oracular */}
          <section className="space-y-6">
            <SectionOpener 
              eyebrow="Clube Oracular"
              title="Sustentação e Prática"
              lead="Onde o cotidiano se torna solo fértil para a percepção profunda e a integração da sabedoria oracular."
            />
            <EditorialButton variant="ghost" className="w-fit" to="/">Conhecer Clube</EditorialButton>
          </section>

          {/* Formação Orácula */}
          <section className="space-y-6">
            <SectionOpener 
              eyebrow="Formação Orácula"
              title="Caminho de Maestria"
              lead="Para quem deseja mergulhar na condução de processos e na filosofia que sustenta a Casa Orácula."
            />
            <EditorialButton variant="ghost" className="w-fit" to="/">Ver Formação</EditorialButton>
          </section>

          {/* Jardim da Heroína */}
          <section className="space-y-6">
            <SectionOpener 
              eyebrow="Jardim da Heroína"
              title="Território de Cura"
              lead="Um mergulho nos arquétipos e nas águas profundas do feminino essencial."
            />
            <EditorialButton variant="ghost" className="w-fit" to="/">Explorar Jardim</EditorialButton>
          </section>

          {/* Atlas Orácula */}
          <section className="space-y-6">
            <SectionOpener 
              eyebrow="Atlas Orácula"
              title="Mapeamento Simbólico"
              lead="Navegação conceitual pelas ferramentas e pela visão de mundo que compõem este ecossistema."
            />
            <EditorialButton variant="ghost" className="w-fit" to="/">Abrir Atlas</EditorialButton>
          </section>

        </div>

        <Rule className="w-full opacity-10 mb-20" />

        {/* Utilitários: Casa das Máquinas */}
        <footer className="w-full flex flex-col md:flex-row justify-between items-center gap-12 py-12 border-t border-ink/5 opacity-60">
          <div className="flex gap-8">
            <QuietLink to="/" className="text-[11px]">Casa das Máquinas</QuietLink>
            <QuietLink to="/" className="text-[11px]">Sobre a Casa</QuietLink>
          </div>
          
          <div className="text-[10px] uppercase tracking-widest text-ink-3">
            Casa Orácula &copy; 2024
          </div>
        </footer>

      </div>
    </main>
  );
}
