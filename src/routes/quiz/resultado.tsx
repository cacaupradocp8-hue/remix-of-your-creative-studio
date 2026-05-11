import { createFileRoute, useNavigate, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { EditorialButton } from '@/components/casa/EditorialButton';
import { Eyebrow } from '@/components/casa/Eyebrow';
import { SectionOpener } from '@/components/casa/SectionOpener';
import { QuietLink } from '@/components/casa/QuietLink';

export const Route = createFileRoute('/quiz/resultado')({
  component: ResultPage,
});

const ARCHETYPES = {
  Rastreadora: {
    title: "A Rastreadora",
    description: "Sua força reside na escuta do invisível. Você é aquela que segue o rastro do que ainda não tem nome, percebendo o mistério onde outros veem apenas silêncio.",
    traits: ["Escuta Atenta", "Percepção do Sutil", "Instinto"],
    advice: "Sua jornada agora é confiar no rastro que sua própria alma desenha."
  },
  Guardiã: {
    title: "A Guardiã",
    description: "Sua força reside na sustentação do limite. Você é a que protege o sagrado, mantém o fogo interno aceso e garante que o essencial permaneça inviolado.",
    traits: ["Sustentação", "Proteção", "Firmeza"],
    advice: "Sua jornada agora é descobrir que o limite é o que permite a expansão."
  },
  Tecelã: {
    title: "A Tecelã",
    description: "Sua força reside na integração do disperso. Você é a que une fios, tempo e pessoas, criando redes de significado onde antes havia apenas fragmentos.",
    traits: ["Conexão", "Integração", "Paciência"],
    advice: "Sua jornada agora é reconhecer o padrão sagrado que você já está tecendo."
  },
  Curadora: {
    title: "A Curadora",
    description: "Sua força reside no discernimento do essencial. Você é aquela que edita o ruído, nomeia o que importa e devolve a saúde através da clareza da forma.",
    traits: ["Discernimento", "Edição", "Linguagem"],
    advice: "Sua jornada agora é nomear a sua própria verdade com precisão."
  },
  Alquimista: {
    title: "A Alquimista",
    description: "Sua força reside na transmutação da matéria emocional. Você é aquela que atravessa o fogo da forma, transformando o chumbo da dor no ouro da consciência.",
    traits: ["Transmutação", "Coragem", "Síntese"],
    advice: "Sua jornada agora é permitir que o fogo finalize a obra em seu coração."
  },
  Anciã: {
    title: "A Anciã",
    description: "Sua força reside no habitar do tempo longo. Você é aquela que devolve a perspectiva e o silêncio, ancorada na sabedoria que só a permanência ensina.",
    traits: ["Sabedoria", "Perspectiva", "Silêncio"],
    advice: "Sua jornada agora é descansar na autoridade do seu próprio tempo."
  },
  Iniciadora: {
    title: "A Iniciadora",
    description: "Sua força reside na abertura dos caminhos. Você é aquela que conduz a primeira travessia, traz o novo e tem a coragem de ser a primeira a cruzar o limiar.",
    traits: ["Abertura", "Coragem", "Visão"],
    advice: "Sua jornada agora é dar o primeiro passo sem precisar ver o fim da estrada."
  }
};

function ResultPage() {
  const [archetype, setArchetype] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('casa_oracula_archetype');
    if (!saved) {
      navigate({ to: '/quiz' });
    } else {
      setArchetype(saved);
      const timer = setTimeout(() => setRevealed(true), 500);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  if (!archetype || !ARCHETYPES[archetype as keyof typeof ARCHETYPES]) {
    return null;
  }

  const data = ARCHETYPES[archetype as keyof typeof ARCHETYPES];

  return (
    <div className="fixed inset-0 bg-ink text-paper z-50 flex flex-col items-center justify-center px-6 overflow-y-auto selection:bg-paper/10 selection:text-paper">
      <div className={`max-w-[1120px] w-full py-24 flex flex-col items-center text-center space-y-16 transition-all duration-1000 ${revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        <div className="space-y-6">
          <Eyebrow className="text-paper/60 justify-center">A voz que te atravessa</Eyebrow>
          <h1 className="display-md italic text-paper">
            {data.title}
          </h1>
        </div>

        <div className="max-w-[680px] space-y-12">
          <p className="serif-lead text-paper/90 italic">
            {data.description}
          </p>

          <div className="flex justify-center items-center gap-4 text-paper/40 italic body">
            {data.traits.map((trait, i) => (
              <React.Fragment key={trait}>
                <span>{trait}</span>
                {i < data.traits.length - 1 && <span className="w-1 h-1 rounded-full bg-leaf/40" />}
              </React.Fragment>
            ))}
          </div>

          <div className="pt-12 border-t border-paper/10">
            <p className="text-leaf text-lg italic italic">
              "{data.advice}"
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8 pt-8">
          <EditorialButton to="/travessia/1" variant="inverse">
            Entrar na Travessia
          </EditorialButton>
          <QuietLink to="/" className="text-paper/40 hover:text-paper">
            Retornar ao início.
          </QuietLink>
        </div>
      </div>
    </div>
  );
}
