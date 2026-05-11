import { createFileRoute, useNavigate, Outlet, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RomanNumeral } from '@/components/casa/RomanNumeral';
import { ProgressDot } from '@/components/casa/ProgressDot';
import { Rule } from '@/components/casa/Rule';
import { Eyebrow } from '@/components/casa/Eyebrow';

export const Route = createFileRoute('/quiz')({
  component: QuizPage,
});

const ARCHETYPES = [
  "Rastreadora",
  "Guardiã",
  "Tecelã",
  "Curadora",
  "Alquimista",
  "Anciã",
  "Iniciadora"
];

const saveQuizResultLocal = async (data: { email?: string; archetype: string; answers: any }) => {
  const { error } = await supabase
    .from('quiz_results')
    .insert({
      email: data.email,
      archetype: data.archetype,
      answers: data.answers,
    });
  if (error) throw error;
  return { success: true };
};

const QUESTIONS = [
  {
    id: 1,
    text: "No silêncio que precede o dia, para onde sua atenção se inclina?",
    options: [
      { text: "Para o rastro deixado pelo sonho, buscando o que ainda não tem nome.", score: { Rastreadora: 3, Anciã: 1 } },
      { text: "Para o limite das paredes, garantindo que o fogo interno permaneça protegido.", score: { Guardiã: 3, Curadora: 1 } },
      { text: "Para o desejo de tecer o novo, unindo os fios da intenção e do gesto.", score: { Tecelã: 3, Iniciadora: 1 } },
      { text: "Para a urgência da transformação, pronta para atravessar a forja da forma.", score: { Alquimista: 3, Iniciadora: 1 } },
    ]
  },
  {
    id: 2,
    text: "Ao caminhar por um território desconhecido, o que seus olhos buscam?",
    options: [
      { text: "A porta que se abre para o invisível.", score: { Iniciadora: 3, Rastreadora: 1 } },
      { text: "A torre que permite ver a ordem oculta no caos.", score: { Curadora: 3, Guardiã: 1 } },
      { text: "O padrão que une as pedras, as plantas e o vento.", score: { Tecelã: 3, Anciã: 1 } },
      { text: "A substância que aguarda para ser transmutada.", score: { Alquimista: 3, Curadora: 1 } },
    ]
  },
  {
    id: 3,
    text: "Qual destas ferramentas sua mão reconhece primeiro?",
    options: [
      { text: "A bússola: que lê o rastro e aponta o Norte.", score: { Rastreadora: 3 } },
      { text: "A chave: que abre o que está selado.", score: { Iniciadora: 3 } },
      { text: "O tear: que integra o tempo e a paciência.", score: { Tecelã: 3 } },
      { text: "O cadinho: que sustenta o calor da mudança.", score: { Alquimista: 3 } },
    ]
  },
  {
    id: 4,
    text: "O que, em você, mais teme a estagnação?",
    options: [
      { text: "A sede de novos horizontes e inícios.", score: { Iniciadora: 3 } },
      { text: "A necessidade de ver o padrão completo da vida.", score: { Anciã: 3 } },
      { text: "O desejo de separar o joio do trigo, o essencial do supérfluo.", score: { Curadora: 3 } },
      { text: "O compromisso com a proteção do que é perene.", score: { Guardiã: 3 } },
    ]
  },
  {
    id: 5,
    text: "Sua força manifesta-se com mais clareza quando...",
    options: [
      { text: "Você sustenta o limite e protege o centro.", score: { Guardiã: 3 } },
      { text: "Você edita o ruído e nomeia o que importa.", score: { Curadora: 3 } },
      { text: "Você habita o silêncio do tempo longo.", score: { Anciã: 3 } },
      { text: "Você segue o rastro do mistério.", score: { Rastreadora: 3 } },
    ]
  },
  {
    id: 6,
    text: "Em um grupo, qual o seu lugar espontâneo?",
    options: [
      { text: "A que guarda a tradição e a segurança.", score: { Guardiã: 3, Anciã: 1 } },
      { text: "A que une as pessoas e os propósitos.", score: { Tecelã: 3, Iniciadora: 1 } },
      { text: "A que transforma o conflito em síntese.", score: { Alquimista: 3, Curadora: 1 } },
      { text: "A que aponta o que ninguém mais percebeu.", score: { Rastreadora: 3, Curadora: 1 } },
    ]
  },
  {
    id: 7,
    text: "Ao final da travessia, o que você devolve ao mundo?",
    options: [
      { text: "O silêncio de quem compreendeu o ciclo.", score: { Anciã: 3 } },
      { text: "A forma limpa de quem transmutou a dor.", score: { Alquimista: 3 } },
      { text: "O caminho aberto para as que virão.", score: { Iniciadora: 3 } },
      { text: "A rede firme de quem soube tecer a vida.", score: { Tecelã: 3 } },
    ]
  }
];

function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({
    Rastreadora: 0,
    Guardiã: 0,
    Tecelã: 0,
    Curadora: 0,
    Alquimista: 0,
    Anciã: 0,
    Iniciadora: 0
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = async (option: any) => {
    const newScores = { ...scores };
    Object.keys(option.score).forEach(role => {
      newScores[role] += option.score[role];
    });
    
    setScores(newScores);
    const newAnswers = [...answers, option.text];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate final archetype
      const archetype = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      try {
        await saveQuizResultLocal({ email: undefined, archetype, answers: newAnswers });
        sessionStorage.setItem('casa_oracula_archetype', archetype);
        navigate({ to: '/quiz/resultado' });
      } catch (err) {
        console.error("Error saving quiz result:", err);
        sessionStorage.setItem('casa_oracula_archetype', archetype);
        navigate({ to: '/quiz/resultado' });
      }
    }
  };

  const isResultPage = location.pathname.includes('resultado');

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center selection:bg-oxblood/10 selection:text-oxblood">
      <Outlet />
      
      {!isResultPage && (
        <div className="w-full max-w-[1120px] px-6 py-12 flex flex-col md:flex-row gap-16 md:gap-32 items-start md:items-center min-h-[80vh]">
          {/* Left Column: Roman Numeral & Question */}
          <div className="flex-1 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700" key={`q-${step}`}>
            <div className="flex justify-between items-center md:block space-y-4">
              <div className="flex items-center gap-6">
                <RomanNumeral value={step + 1} />
                <div className="md:hidden flex-1">
                  <ProgressDot current={step + 1} total={QUESTIONS.length} />
                </div>
              </div>
              <div className="hidden md:block w-32">
                <ProgressDot current={step + 1} total={QUESTIONS.length} />
              </div>
            </div>

            <div className="space-y-4">
              {step === 0 && (
                <Eyebrow className="animate-in fade-in duration-1000">Sete perguntas. Uma escuta.</Eyebrow>
              )}
              <h1 className="display-lg italic text-ink">
                {QUESTIONS[step].text}
              </h1>
            </div>
          </div>

          {/* Right Column: Answers */}
          <div className="w-full md:w-[480px] space-y-0 animate-in fade-in slide-in-from-right-4 duration-700" key={`a-${step}`}>
            {QUESTIONS[step].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                className="group w-full text-left py-10 border-b border-rule first:border-t transition-all duration-300 relative flex items-center gap-6"
              >
                <div className="w-0 h-px bg-leaf absolute bottom-[-1px] left-0 group-hover:w-full transition-all duration-500" />
                <span className="body text-ink-2 group-hover:text-ink transition-colors duration-300 pr-4">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
