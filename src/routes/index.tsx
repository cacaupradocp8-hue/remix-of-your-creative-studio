import { createFileRoute } from '@tanstack/react-router';
import { SectionOpener } from '@/components/casa/SectionOpener';
import { EditorialButton } from '@/components/casa/EditorialButton';
import { Rule } from '@/components/casa/Rule';
import { QuietLink } from '@/components/casa/QuietLink';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="min-h-screen bg-paper selection:bg-oxblood/10 selection:text-oxblood">
      {/* 1. Hero Movement */}
      <section className="min-h-[85vh] flex flex-col md:flex-row border-b border-rule">
        <div className="flex-1 flex flex-col justify-center px-6 md:px-24 py-24 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <SectionOpener 
            eyebrow="Casa Orácula"
            title="Bem-vinda à Casa Orácula."
            lead="Algumas mulheres acumulam conhecimento. Aqui, desenvolvem linguagem."
          />
          <EditorialButton to="/quiz" className="w-fit">
            Iniciar Travessia
          </EditorialButton>
        </div>
        <div className="hidden md:flex w-1/3 border-l border-rule relative items-end justify-center pb-24">
          <Rule vertical className="h-48" />
          <div className="absolute bottom-24 -left-1 w-2 h-2 rounded-full bg-leaf" />
        </div>
      </section>

      {/* 2. What this is Movement */}
      <section className="px-6 md:px-24 py-32 md:py-48 max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
          <SectionOpener 
            eyebrow="O Ecossistema"
            title="Um território de leitura simbólica."
          />
          <div className="space-y-8 text-ink-2 body">
            <p>
              A Casa Orácula não é um curso, nem uma mentoria convencional. É um ateliê de cartografia da alma, desenhado para mulheres que buscam refinar a própria percepção.
            </p>
            <p>
              Aqui, a psique não é algo a ser corrigido, mas um texto a ser lido. Através de arquétipos e travessias sonoras, você aprende a nomear o invisível e a dar forma ao seu próprio destino.
            </p>
          </div>
        </div>
      </section>

      <Rule className="max-w-[1120px] mx-auto" />

      {/* 3. Method Preview Movement */}
      <section className="px-6 md:px-24 py-32 md:py-48 max-w-[1120px] mx-auto space-y-24">
        <SectionOpener 
          eyebrow="A Metodologia"
          title="Os Três Movimentos."
        />
        
        <div className="space-y-0">
          {[
            { id: "Porta", desc: "O limiar da escuta. Onde o rastro se torna caminho." },
            { id: "Torre", desc: "A perspectiva do alto. A visão que organiza o caos." },
            { id: "Labirinto", desc: "A profundidade da travessia. O centro onde a voz amadurece." }
          ].map((item, i) => (
            <div key={item.id} className="group py-12 border-b border-rule first:border-t flex flex-col md:flex-row md:items-baseline justify-between gap-4">
              <div className="flex items-baseline gap-6">
                <span className="caption text-ink-3">0{i + 1}</span>
                <h3 className="text-3xl md:text-4xl text-ink group-hover:italic transition-all duration-500">
                  {item.id}
                </h3>
              </div>
              <p className="caption text-ink-3 md:text-right max-w-sm">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Clube Preview Movement */}
      <section className="px-6 md:px-24 py-32 md:py-48 bg-paper-2">
        <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <SectionOpener 
            eyebrow="O Clube Oracular"
            title="Mulheres que correm com os lobos."
            lead="Uma travessia guiada pela obra de Clarissa Pinkola Estés, tecendo os fios da mulher selvagem em nossa vida prática."
          />
          <div className="md:pl-24">
            <QuietLink to="/" className="text-sm">
              Saber mais sobre a filiação
            </QuietLink>
          </div>
        </div>
      </section>

      {/* 5. Closing Invitation Movement (Inverse) */}
      <section className="px-6 md:px-24 py-48 bg-ink text-paper text-center space-y-12">
        <SectionOpener 
          inverted
          eyebrow="O Convite"
          title="Antes de continuar… desacelera."
          className="items-center"
        />
        <div className="flex flex-col items-center gap-8 pt-8">
          <EditorialButton to="/quiz" variant="inverse">
            Iniciar Travessia
          </EditorialButton>
          <QuietLink to="/quiz" className="text-paper/40 hover:text-paper">
            Sete perguntas. Uma escuta.
          </QuietLink>
        </div>
      </section>
    </div>
  );
}
