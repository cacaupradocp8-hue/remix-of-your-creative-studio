import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/quiz/resultado')({
  component: ResultPage,
});

const ARCHETYPES = {
  Amante: {
    title: "A Amante",
    description: "Sua força reside na sensorialidade, no prazer e na busca incessante pela harmonia e beleza. Você é a guardiã do deleite e da inspiração estética.",
    traits: ["Sensualidade", "Expressividade", "Magnetismo", "Busca pela Beleza"],
    advice: "Sua jornada agora é ancorar esse prazer em sua voz autêntica."
  },
  Guardiã: {
    title: "A Guardiã",
    description: "Sua força reside na proteção, na estrutura e no cuidado com o que é essencial. Você é o porto seguro e a base que sustenta o sagrado.",
    traits: ["Resiliência", "Proteção", "Organização", "Sustentação"],
    advice: "Sua jornada agora é descobrir que a vulnerabilidade também é uma forma de proteção."
  },
  Tecelã: {
    title: "A Tecelã",
    description: "Sua força reside na conexão, na paciência e na habilidade de unir fios invisíveis em propósitos coletivos. Você cria redes de significado.",
    traits: ["Intuição", "Comunidade", "Integração", "Paciência"],
    advice: "Sua jornada agora é reconhecer o padrão sagrado que você já está tecendo."
  },
  Visionária: {
    title: "A Visionária",
    description: "Sua força reside no futuro, na expansão e na capacidade de antecipar horizontes que outros ainda não veem. Você é a guia do novo.",
    traits: ["Clarividência", "Inovação", "Liderança", "Foco no Futuro"],
    advice: "Sua jornada agora é trazer a luz do futuro para o presente prático."
  }
};

function ResultPage() {
  const [archetype, setArchetype] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('casa_oracula_archetype');
    if (!saved) {
      navigate({ to: '/quiz' });
    } else {
      setArchetype(saved);
    }
  }, [navigate]);

  if (!archetype || !ARCHETYPES[archetype as keyof typeof ARCHETYPES]) {
    return null;
  }

  const data = ARCHETYPES[archetype as keyof typeof ARCHETYPES];

  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 py-12 text-center selection:bg-wine/10 selection:text-wine">
      <div className="max-w-2xl space-y-10 animate-in fade-in zoom-in duration-700">
        <div className="space-y-4">
          <span className="text-gold tracking-widest uppercase text-xs">Seu Arquétipo Revelado</span>
          <h1 className="text-wine text-5xl md:text-6xl font-serif italic">
            {data.title}
          </h1>
        </div>

        <div className="p-8 md:p-12 border border-gold/30 bg-white/40 rounded-sm relative shadow-xl shadow-wine/5">
          <div className="space-y-6">
            <p className="text-wine/90 text-lg md:text-xl leading-relaxed font-light">
              {data.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {data.traits.map(trait => (
                <span key={trait} className="px-4 py-1 border border-wine/10 rounded-full text-xs text-wine/60 uppercase tracking-tighter">
                  {trait}
                </span>
              ))}
            </div>

            <div className="pt-6 border-t border-wine/5">
              <p className="text-forest text-sm italic italic">
                "{data.advice}"
              </p>
            </div>
          </div>
          
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold/40" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold/40" />
        </div>

        <div className="space-y-4 pt-4">
          <Link
            to="/travessia/$day"
            params={{ day: '1' }}
            className="inline-block px-10 py-4 bg-forest text-bone font-serif text-xl rounded-sm transition-all duration-300 hover:bg-forest/90 hover:scale-[1.02] shadow-lg shadow-forest/10"
          >
            Começar Travessia Zero
          </Link>
          <p className="text-wine/60 text-sm">
            Seu primeiro passo é o áudio do <strong>Dia 1: O Chamado</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
