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
    <div className="min-h-screen bg-paper selection:bg-oxblood/10 selection:text-oxblood overflow-hidden relative">
      {/* 1. Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 bg-paper flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
          <div className="w-12 h-12 rounded-full border border-leaf/30 animate-pulse" />
          <p className="text-ink-3 font-serif italic text-base tracking-wide">
            Atravessando o primeiro limiar…
          </p>
        </div>
      )}

      {/* 2. Hero Atmosphere */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] rounded-full bg-leaf/[0.08] blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-oxblood/[0.04] blur-[100px]" />
      </div>

      <style>{`
        @keyframes mandala-breathe {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .mandala-animation {
          animation: mandala-breathe 8s ease-in-out infinite;
        }
      `}</style>

      {/* 3. Main Content (Sala de Visita) */}
      <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-6 py-20 text-center space-y-16">
        
        {/* Logo/Identity */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <img
            src={casaOraculaLogo}
            alt="Casa Orácula"
            className="w-48 md:w-64 h-auto select-none mx-auto opacity-80"
            draggable={false}
          />
        </div>

        {/* Sensory/Symbolic Portal */}
        <div className="relative flex items-center justify-center py-12">
          {/* Subtle Glow */}
          <div className="absolute w-64 h-64 bg-leaf/10 rounded-full blur-3xl mandala-animation" />
          
          {/* Breathing Mandala Placeholder (using stylized circle for visual fidelity) */}
          <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 border border-leaf/20 rounded-full flex items-center justify-center p-4 mandala-animation">
            <div className="w-full h-full border border-leaf/40 rounded-full rotate-45 flex items-center justify-center">
               <div className="w-2 h-2 bg-leaf/60 rounded-full" />
            </div>
            {/* Outer rings */}
            <div className="absolute inset-0 border border-leaf/10 rounded-full scale-110" />
            <div className="absolute inset-0 border border-leaf/5 rounded-full scale-125" />
          </div>
        </div>

        {/* Portal Text */}
        <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
          <div className="space-y-4">
            <p className="caption text-ink-3">Antes de entrar na Casa…</p>
            <p className="serif-lead text-ink-2">
              existe uma pergunta que precisa ser ouvida.
            </p>
            <h1 className="display-lg italic text-ink pt-2">
              Sua Voz.
            </h1>
          </div>
          
          <div className="w-12 h-px bg-rule mx-auto" />
          
          <div className="space-y-8 pt-4">
             <p className="text-[11px] uppercase tracking-[0.25em] text-ink-3/60">
                Respire um instante…
             </p>
             
             <div className="flex flex-col items-center gap-6">
                <EditorialButton 
                  onClick={handleStartQuiz}
                  className={cn("w-full sm:w-fit px-12", isTransitioning && "opacity-50 pointer-events-none")}
                >
                  Descobrir minha Voz
                </EditorialButton>
                
                <p className="caption text-ink-3/40 text-[10px]">
                  Leva menos de 3 minutos
                </p>
             </div>
          </div>
        </div>

        {/* Path Indicator */}
        <div className="pt-24 animate-in fade-in duration-1000 delay-700">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-ink-3/30 font-semibold">
            <span>Quiz da Voz</span>
            <span className="w-4 h-px bg-rule" />
            <span>Travessia</span>
            <span className="w-4 h-px bg-rule" />
            <span>Casa Orácula</span>
          </div>
        </div>

        {/* Final Whisper */}
        <div className="max-w-xs mx-auto animate-in fade-in duration-1000 delay-1000 opacity-40">
           <p className="text-[10px] italic text-ink-3 leading-relaxed">
             A Casa Orácula ensina como sustentar processos humanos com consciência.
           </p>
        </div>

        {/* Access link (Quiet) */}
        <div className="fixed bottom-8 right-8 animate-in fade-in duration-1000 delay-1000">
           <QuietLink to="/" className="text-[10px] pointer-events-none opacity-20">
             Acesso Profissional
           </QuietLink>
        </div>
      </div>
    </div>
  );
}
