import { createFileRoute, useNavigate, Link, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Play, Pause, ChevronRight, ChevronLeft, Lock } from 'lucide-react';

export const Route = createFileRoute('/travessia/$day')({
  component: TravessiaPage,
});

function TravessiaPage() {
  const { day } = Route.useParams();
  const dayNum = parseInt(day);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [module, setModule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  // Gating logic for Day 4+ (Placeholder for Sprint 2)
  useEffect(() => {
    if (dayNum > 3) {
      // For now, just show the gate. In Sprint 2 this will redirect to Auth.
    }
  }, [dayNum]);

  useEffect(() => {
    async function fetchModule() {
      setLoading(true);
      const { data, error } = await supabase
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
        // Note: audio_path is used to generate a signed URL in a real production environment.
        // For MVP Sprint 1, we assume a public bucket or local testing path if applicable.
        // If we want to test audio, we'd normally use supabase.storage.from(...).createSignedUrl()
        // but since we are in public bonding, we can use a placeholder for the URL if needed.
        setAudioUrl(`https://placeholder-audio.com/${data.audio_path}`); 
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
    return <div className="min-h-screen bg-bone flex items-center justify-center text-wine italic">Aguarde...</div>;
  }

  // Day 4+ Gate UI
  if (dayNum > 3) {
    return (
      <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in">
          <div className="w-16 h-16 bg-wine/5 rounded-full flex items-center justify-center mx-auto">
            <Lock className="text-wine w-6 h-6" />
          </div>
          <div className="space-y-4">
            <h1 className="text-wine text-3xl font-serif">O Portal se fechou</h1>
            <p className="text-wine/70 leading-relaxed font-light">
              A partir do Dia 4, sua jornada exige um compromisso maior. 
              Crie seu acesso para continuar tecendo sua história.
            </p>
          </div>
          <div className="pt-6">
            <button className="px-10 py-4 bg-wine text-bone font-serif text-lg rounded-sm opacity-50 cursor-not-allowed">
              Criar Acesso (Sprint 2)
            </button>
          </div>
          <Link to="/" className="block text-wine/40 text-sm hover:text-wine transition-colors underline">
            Voltar ao Início
          </Link>
        </div>
      </div>
    );
  }

  if (!module) return <div className="min-h-screen bg-bone flex items-center justify-center text-wine">Módulo não encontrado.</div>;

  return (
    <div className="min-h-screen bg-bone flex flex-col items-center justify-center px-6 py-12 selection:bg-wine/10 selection:text-wine">
      <div className="max-w-xl w-full space-y-12 animate-in fade-in slide-in-from-bottom-4">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center text-gold uppercase tracking-[0.2em] text-[10px] font-bold">
          <Link 
            to="/travessia/$day" 
            params={{ day: (dayNum - 1).toString() }}
            disabled={dayNum === 1}
            className={`flex items-center gap-1 ${dayNum === 1 ? 'opacity-0' : 'hover:text-wine transition-colors'}`}
          >
            <ChevronLeft size={14} /> Anterior
          </Link>
          <span>Travessia Zero — Dia {day}</span>
          <Link 
            to="/travessia/$day" 
            params={{ day: (dayNum + 1).toString() }}
            disabled={dayNum === 3}
            className={`flex items-center gap-1 ${dayNum === 8 ? 'opacity-0' : 'hover:text-wine transition-colors'}`}
          >
            {dayNum === 3 ? 'Bloqueado' : 'Próximo'} <ChevronRight size={14} />
          </Link>
        </div>

        {/* Content Area */}
        <div className="text-center space-y-6">
          <h1 className="text-wine text-4xl md:text-5xl font-serif italic">
            {module.title}
          </h1>
          <div className="w-12 h-px bg-gold mx-auto opacity-40" />
        </div>

        {/* Player Component */}
        <div className="bg-white/40 p-10 border border-wine/5 rounded-sm shadow-xl shadow-wine/5 flex flex-col items-center gap-10">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-24 h-24 rounded-full bg-wine flex items-center justify-center text-bone shadow-2xl shadow-wine/30 transition-transform active:scale-95 hover:scale-105"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="w-full space-y-2">
            <div className="h-1 bg-wine/10 rounded-full w-full overflow-hidden">
              <div className="h-full bg-gold w-1/3 transition-all duration-300" />
            </div>
            <div className="flex justify-between text-[10px] text-wine/40 font-mono tracking-widest uppercase">
              <span>03:45</span>
              <span>12:00</span>
            </div>
          </div>
        </div>

        {/* Reflection Prompt */}
        {module.reflection_prompt && (
          <div className="text-center space-y-4 px-4 py-8 border-t border-wine/5">
            <span className="text-gold text-[10px] uppercase tracking-widest font-bold">Reflexão Simbólica</span>
            <p className="text-wine/80 font-light italic text-lg leading-relaxed">
              "{module.reflection_prompt}"
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
