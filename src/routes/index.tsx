import { createFileRoute } from '@tanstack/react-router';
import { SectionOpener } from '@/components/casa/SectionOpener';
import { EditorialButton } from '@/components/casa/EditorialButton';
import { Rule } from '@/components/casa/Rule';
import { QuietLink } from '@/components/casa/QuietLink';
import casaOraculaLogo from '@/assets/casa-oracula-logo.png';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  const domains = [
    {
      name: "Sala de Visita",
      description: "Onde o diálogo começa. Encontros abertos e recepção de novas viajantes.",
      status: "disponível",
      cta: "Entrar na Sala",
      to: "/"
    },
    {
      name: "Experiência Gratuita",
      description: "O portal de entrada. Sete perguntas e uma leitura arquetípica imediata.",
      status: "disponível",
      cta: "Iniciar Quiz",
      to: "/quiz"
    },
    {
      name: "Clube Oracular",
      description: "Filiação mensal. Travessia guiada por obras fundamentais da psique feminina.",
      status: "disponível",
      cta: "Saber Mais",
      to: "/"
    },
    {
      name: "Formação Orácula",
      description: "O caminho técnico. Desenvolvimento de linguagem simbólica para profissionais.",
      status: "área profissional",
      cta: "Lista de Espera",
      to: "/"
    },
    {
      name: "Jardim da Heroína",
      description: "Espaço de cultivo pessoal. Práticas meditativas e ritos de passagem.",
      status: "em breve",
      cta: "Aguardar florescer",
      to: "/"
    },
    {
      name: "Casa das Máquinas",
      description: "O suporte invisível. Configurações, suporte e engrenagens da sua conta.",
      status: "em breve",
      cta: "Acessar Painel",
      to: "/"
    },
    {
      name: "Atlas Orácula",
      description: "A cartografia completa. O repositório de todos os símbolos e arquétipos.",
      status: "em breve",
      cta: "Consultar Mapas",
      to: "/"
    }
  ];

  return (
    <div className="min-h-screen bg-paper selection:bg-oxblood/10 selection:text-oxblood">
      {/* 1. Hero */}
      <section className="min-h-[85vh] flex flex-col md:flex-row border-b border-rule">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-24 py-24 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <img
            src={casaOraculaLogo}
            alt="Casa Orácula"
            className="w-64 md:w-80 h-auto -ml-4 md:-ml-6 select-none"
            draggable={false}
          />
          <SectionOpener 
            eyebrow="Casa Orácula"
            title="Um ecossistema simbólico-clínico para travessia, formação e prática profissional."
            lead="Não acumulamos conhecimento. Desenvolvemos linguagem."
          />
          <div className="flex flex-col sm:flex-row gap-6 pt-4">
            <EditorialButton to="/quiz" className="w-full sm:w-fit">
              Começar Experiência Gratuita
            </EditorialButton>
            <EditorialButton to="/" variant="inverse" className="w-full sm:w-fit pointer-events-none opacity-50">
              Entrar na Casa
            </EditorialButton>
          </div>
        </div>
        <div className="hidden md:flex w-1/3 border-l border-rule relative items-end justify-center pb-24">
          <Rule vertical className="h-48" />
          <div className="absolute bottom-24 -left-1 w-2 h-2 rounded-full bg-leaf" />
        </div>
      </section>

      {/* 2. A Casa organiza a travessia */}
      <section className="px-6 md:px-24 py-32 md:py-48 max-w-[1120px] mx-auto space-y-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <SectionOpener 
            eyebrow="Arquitectura de Escuta"
            title="A Casa organiza a travessia."
          />
          <div className="space-y-8 text-ink-2 body">
            <p>
              Nossa estrutura não é um catálogo aleatório, mas um sistema vivo para quem deseja ir além da superfície teórica.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-y-16 gap-x-8">
          {[
            { label: "conhecer", desc: "Identificar o ponto de partida simbólico." },
            { label: "atravessar", desc: "Viver o processo de transformação sonora." },
            { label: "aprender", desc: "Mergulhar nas águas da psique profunda." },
            { label: "praticar", desc: "Exercitar a percepção no cotidiano." },
            { label: "atender", desc: "Desenvolver presença clínica e escuta." },
            { label: "formular", desc: "Dar forma à própria voz profissional." }
          ].map((item) => (
            <div key={item.label} className="space-y-3">
              <h4 className="text-xl md:text-2xl text-ink lowercase italic">{item.label}</h4>
              <p className="caption text-ink-3">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Rule className="max-w-[1120px] mx-auto" />

      {/* 3. Cards dos domínios */}
      <section className="px-6 md:px-24 py-32 md:py-48 max-w-[1240px] mx-auto">
        <div className="mb-24">
          <SectionOpener 
            eyebrow="Os Domínios"
            title="Explore o Ecossistema."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domains.map((domain) => (
            <div 
              key={domain.name} 
              className={`p-8 border border-rule flex flex-col justify-between space-y-12 transition-all duration-500 hover:bg-paper-2 ${domain.status === 'em breve' ? 'opacity-60 grayscale' : ''}`}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <span className="caption uppercase tracking-widest text-[10px] text-oxblood border border-oxblood/20 px-2 py-0.5">
                    {domain.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl text-ink italic">{domain.name}</h3>
                  <p className="caption text-ink-3 line-height-relaxed">{domain.description}</p>
                </div>
              </div>
              
              <QuietLink 
                to={domain.to} 
                className={`text-sm ${domain.status === 'em breve' ? 'pointer-events-none text-ink-4' : ''}`}
              >
                {domain.cta}
              </QuietLink>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Como começar */}
      <section className="px-6 md:px-24 py-32 md:py-48 bg-paper-2">
        <div className="max-w-[1120px] mx-auto space-y-24">
          <SectionOpener 
            eyebrow="O Fluxo"
            title="Como começar sua jornada."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              "Entrar pela experiência gratuita",
              "Fazer o quiz arquetípico",
              "Receber a primeira leitura",
              "Iniciar uma travessia guiada",
              "Continuar no Clube ou na Formação"
            ].map((step, i) => (
              <div key={i} className="space-y-4">
                <span className="text-4xl text-leaf/30 font-serif italic">{i + 1}</span>
                <p className="caption text-ink-2">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Secção final */}
      <section className="px-6 md:px-24 py-48 bg-ink text-paper text-center space-y-12">
        <div className="max-w-3xl mx-auto space-y-16">
          <p className="text-2xl md:text-3xl font-serif italic leading-relaxed opacity-90">
            "A Casa Orácula não é uma coleção de ferramentas. É uma arquitectura de travessia, formação e formulação simbólica."
          </p>
          <div className="flex flex-col items-center gap-8 pt-8">
            <EditorialButton to="/quiz" variant="inverse">
              Começar Experiência Gratuita
            </EditorialButton>
            <QuietLink to="/quiz" className="text-paper/40 hover:text-paper">
              Sua jornada começa no invisível.
            </QuietLink>
          </div>
        </div>
      </section>
    </div>
  );
}
