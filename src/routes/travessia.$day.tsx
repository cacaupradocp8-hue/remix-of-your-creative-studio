import React, { useEffect, useState } from 'react';
import { createFileRoute, useNavigate, useLocation } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause } from 'lucide-react';
import { Eyebrow } from '@/components/casa/Eyebrow';
import { SectionOpener } from '@/components/casa/SectionOpener';
import { QuietLink } from '@/components/casa/QuietLink';
import { Rule } from '@/components/casa/Rule';
import { ProgressDot } from '@/components/casa/ProgressDot';
import { RomanNumeral } from '@/components/casa/RomanNumeral';

export const Route = createFileRoute('/travessia/$day')({
  component: TravessiaPage,
});

function TravessiaPage() {
  const { day } = Route.useParams();
  const dayNum = parseInt(day);
  const navigate = useNavigate();
  
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(30); // Placeholder for audio progress

  useEffect(() => {
    async function fetchModule() {
      setLoading(true);
      const { data } = await supabase
        .from('route_modules')
        .select(`
          *,
          routes!inner(slug)
        `)
        .eq('routes.slug', 'travessia-zero')
        .eq('order_index', dayNum)
        .single();

      if (data) {
        setModule(data);
      }
      setLoading(false);
    }

    if (dayNum <= 3) {
      fetchModule();
    } else {
      setLoading(false);
    }
  }, [dayNum]);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <span className="caption italic text-ink-3 animate-pulse">Aguarde...</span>
      </div>
    );
  }

  // Day 4+ Gate UI
  if (dayNum > 3) {
    return (
      <div className="fixed inset-0 bg-ink text-paper z-50 flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-[1120px] space-y-16 animate-in fade-in zoom-in duration-1000">
          <SectionOpener 
            inverted
            eyebrow="Travessia · Limiar"
            title="Algumas travessias pedem permanência."
            lead="A próxima porta abre quando há compromisso com a escuta."
            className="items-center"
          />
          <div className="pt-12">
            <QuietLink to="/" className="text-paper/40 hover:text-paper">
              Retornar ao início.
            </QuietLink>
          </div>
        </div>
      </div>
    );
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center space-y-8">
        <SectionOpener 
          eyebrow="Erro"
          title="Este território ainda não se revelou."
          className="items-center text-center"
        />
        <QuietLink to="/">Retornar</QuietLink>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper selection:bg-oxblood/10 selection:text-oxblood flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-[1120px] w-full flex flex-col items-center space-y-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Navigation Header */}
        <div className="w-full flex justify-between items-center max-w-[680px]">
          <QuietLink 
            onClick={() => navigate({ to: '/travessia/$day', params: { day: (dayNum - 1).toString() } })}
            disabled={dayNum === 1}
            className="flex items-center gap-2"
          >
            Retornar
          </QuietLink>
          
          <div className="flex items-center gap-4">
            <Eyebrow className="hidden md:flex">Travessia Zero</Eyebrow>
            <div className="w-8 md:w-16">
              <ProgressDot current={dayNum} total={8} />
            </div>
            <RomanNumeral value={dayNum} />
          </div>

          <QuietLink 
            onClick={() => navigate({ to: '/travessia/$day', params: { day: (dayNum + 1).toString() } })}
            className="flex items-center gap-2"
          >
            Seguir
          </QuietLink>
        </div>

        {/* Content Area */}
        <div className="text-center space-y-8 max-w-[680px]">
          <SectionOpener 
            eyebrow={`Dia ${dayNum}`}
            title={module.title}
            className="items-center"
          />
        </div>

        {/* Circular Ritual Player */}
        <div className="relative flex flex-col items-center gap-12">
          <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center group">
            {/* Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-rule"
              />
              <circle
                cx="50%"
                cy="50%"
                r="48%"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="100 100"
                strokeDashoffset={100 - progress}
                className="text-leaf transition-all duration-500"
                style={{ strokeDasharray: '301.6', strokeDashoffset: (301.6 * (100 - progress)) / 100 }}
              />
            </svg>

            {/* Play Button */}
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-ink flex items-center justify-center text-paper transition-all duration-500 hover:bg-oxblood active:scale-95 z-10"
            >
              {isPlaying ? (
                <Pause size={32} fill="currentColor" />
              ) : (
                <Play size={32} fill="currentColor" className="ml-2" />
              )}
            </button>
          </div>

          <div className="flex flex-col items-center gap-2 text-[10px] caption text-ink-3 tabular-nums tracking-widest">
            <span>03:45 / 12:00</span>
          </div>
        </div>

        {/* Reflection Prompt */}
        {module.reflection_prompt && (
          <div className="max-w-[560px] text-center space-y-8 pt-24 border-t border-rule">
            <div className="w-1.5 h-1.5 rounded-full bg-leaf mx-auto" />
            <div className="space-y-4">
              <Eyebrow className="justify-center">Reflexão Simbólica</Eyebrow>
              <p className="serif-lead italic text-ink-2">
                "{module.reflection_prompt}"
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
