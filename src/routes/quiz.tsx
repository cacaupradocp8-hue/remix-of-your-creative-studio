import { createFileRoute, useNavigate, Outlet, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const Route = createFileRoute('/quiz')({
  component: QuizPage,
});

// Client-side helper for MVP Sprint 1
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
    text: "No silêncio da manhã, para onde seu olhar se volta primeiro?",
    options: [
      { text: "Para o espelho, buscando a harmonia da forma.", score: { Amante: 3, Visionária: 1 } },
      { text: "Para a janela, observando o movimento do mundo.", score: { Visionária: 3, Tecelã: 1 } },
      { text: "Para o lar, organizando o espaço de proteção.", score: { Guardiã: 3, Tecelã: 1 } },
      { text: "Para as mãos, sentindo o desejo de criar algo.", score: { Tecelã: 3, Amante: 1 } },
    ]
  },
  {
    id: 2,
    text: "Qual destes símbolos mais ressoa com sua força atual?",
    options: [
      { text: "O Cálice: receptividade e prazer.", score: { Amante: 3 } },
      { text: "O Escudo: proteção e limite.", score: { Guardiã: 3 } },
      { text: "A Teia: conexão e paciência.", score: { Tecelã: 3 } },
      { text: "A Estrela: guia e futuro.", score: { Visionária: 3 } },
    ]
  },
  {
    id: 3,
    text: "Como você lida com o desconhecido?",
    options: [
      { text: "Com curiosidade estética, buscando a beleza no novo.", score: { Amante: 3 } },
      { text: "Com cautela estratégica, preparando o terreno.", score: { Guardiã: 3 } },
      { text: "Com intuição criativa, tecendo soluções no caminho.", score: { Tecelã: 3 } },
      { text: "Com entusiasmo visionário, antecipando o que virá.", score: { Visionária: 3 } },
    ]
  },
  // Adding 4 more to reach 7 questions for Sprint 1
  {
    id: 4,
    text: "Qual o seu papel em um grupo?",
    options: [
      { text: "A que inspira pelo brilho e prazer.", score: { Amante: 3 } },
      { text: "A que sustenta e traz segurança.", score: { Guardiã: 3 } },
      { text: "A que une as pontas e integra as pessoas.", score: { Tecelã: 3 } },
      { text: "A que aponta o caminho e traz a ideia nova.", score: { Visionária: 3 } },
    ]
  },
  {
    id: 5,
    text: "O que mais te esgota energeticamente?",
    options: [
      { text: "A falta de beleza e harmonia.", score: { Amante: 3 } },
      { text: "A desordem e a falta de segurança.", score: { Guardiã: 3 } },
      { text: "O isolamento e a falta de propósito coletivo.", score: { Tecelã: 3 } },
      { text: "A estagnação e a falta de novos horizontes.", score: { Visionária: 3 } },
    ]
  },
  {
    id: 6,
    text: "Sua criatividade nasce de...",
    options: [
      { text: "Um transbordamento dos sentidos.", score: { Amante: 3 } },
      { text: "Uma necessidade de estruturar o caos.", score: { Guardiã: 3 } },
      { text: "Uma conversa com o invisível e as conexões.", score: { Tecelã: 3 } },
      { text: "Um vislumbre de uma realidade futura.", score: { Visionária: 3 } },
    ]
  },
  {
    id: 7,
    text: "Ao final do dia, o que traz paz?",
    options: [
      { text: "O deleite de um momento só meu.", score: { Amante: 3 } },
      { text: "Saber que todos estão seguros e o lar está em ordem.", score: { Guardiã: 3 } },
      { text: "Sentir que fiz parte de algo maior.", score: { Tecelã: 3 } },
      { text: "Ter clareza sobre o próximo passo do meu destino.", score: { Visionária: 3 } },
    ]
  }
];

function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [scores, setScores] = useState({ Amante: 0, Guardiã: 0, Tecelã: 0, Visionária: 0 });
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = async (option: any) => {
    const newScores = { ...scores };
    Object.keys(option.score).forEach(role => {
      newScores[role as keyof typeof scores] += option.score[role];
    });
    
    setScores(newScores);
    const newAnswers = [...answers, option.text];
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate final archetype
      const archetype = Object.entries(newScores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      // Save results
      try {
        await saveQuizResultLocal({ email: undefined, archetype, answers: newAnswers });
        // Store in session for results page
        sessionStorage.setItem('casa_oracula_archetype', archetype);
        navigate({ to: '/quiz/resultado' });
      } catch (err) {
        console.error("Error saving quiz result:", err);
        // Fallback to navigate even if save fails for MVP speed
        sessionStorage.setItem('casa_oracula_archetype', archetype);
        navigate({ to: '/quiz/resultado' });
      }
    }
  };

  const progress = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 py-12">
      <Outlet />
      
      {/* Quiz UI - Hidden when showing children (results) */}
      <div className="max-w-xl w-full space-y-12 data-[state=hidden]:hidden" data-state={location.pathname.includes('resultado') ? 'hidden' : 'visible'}>
        {/* Progress Bar */}
        <div className="w-full h-1 bg-wine/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gold transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Area */}
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500" key={step}>
          <div className="space-y-4 text-center">
            <span className="text-gold text-xs tracking-widest uppercase">Pergunta {step + 1} de {QUESTIONS.length}</span>
            <h1 className="text-wine text-2xl md:text-3xl font-serif leading-tight">
              {QUESTIONS[step].text}
            </h1>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {QUESTIONS[step].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option)}
                className="w-full text-left p-6 border border-wine/20 rounded-sm bg-bone hover:bg-wine hover:text-bone hover:border-wine transition-all duration-300 text-wine/80 group"
              >
                <span className="font-light leading-relaxed group-hover:text-bone">
                  {option.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
