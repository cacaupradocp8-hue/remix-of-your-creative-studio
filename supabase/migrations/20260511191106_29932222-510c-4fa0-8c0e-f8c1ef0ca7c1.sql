-- Seed Routes
INSERT INTO public.routes (slug, title, description)
VALUES 
  ('mulheres-lobos', 'Mulheres que Correm com os Lobos', 'Uma jornada profunda pelos arquétipos do feminino selvagem, baseada na obra de Clarissa Pinkola Estés.'),
  ('travessia-zero', 'Travessia Zero', 'Seus primeiros 8 dias na Casa Orácula. Um mergulho inicial para alinhar sua voz e visão.')
ON CONFLICT (slug) DO NOTHING;

-- Seed Modules for Travessia Zero (Days 1-8)
INSERT INTO public.route_modules (route_id, order_index, title, audio_path, reflection_prompt)
VALUES
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 1, 'Dia 1: O Chamado', 'audio/travessia-zero/day1.mp3', 'O que você ouve quando o silêncio se impõe?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 2, 'Dia 2: A Escuta', 'audio/travessia-zero/day2.mp3', 'Quem é a guardiã da sua porta interior?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 3, 'Dia 3: O Vazio', 'audio/travessia-zero/day3.mp3', 'O que resta quando as máscaras caem?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 4, 'Dia 4: O Encontro', 'audio/travessia-zero/day4.mp3', 'Qual sombra você teme abraçar?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 5, 'Dia 5: A Semente', 'audio/travessia-zero/day5.mp3', 'Qual potência está pronta para brotar?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 6, 'Dia 6: O Fogo', 'audio/travessia-zero/day6.mp3', 'O que precisa ser transmutado hoje?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 7, 'Dia 7: A Entrega', 'audio/travessia-zero/day7.mp3', 'Onde termina o esforço e começa a fluidez?'),
  ((SELECT id FROM public.routes WHERE slug = 'travessia-zero'), 8, 'Dia 8: A Integração', 'audio/travessia-zero/day8.mp3', 'Como você levará essa voz para o mundo?')
ON CONFLICT DO NOTHING;

-- Seed Modules for Route 1 (Initial Modules)
INSERT INTO public.route_modules (route_id, order_index, title, audio_path, reflection_prompt)
VALUES
  ((SELECT id FROM public.routes WHERE slug = 'mulheres-lobos'), 1, 'Módulo 1: La Loba', 'audio/mulheres-lobos/module1.mp3', 'Quais ossos você está coletando no deserto da sua psique?'),
  ((SELECT id FROM public.routes WHERE slug = 'mulheres-lobos'), 2, 'Módulo 2: O Barba-Azul', 'audio/mulheres-lobos/module2.mp3', 'Onde você escondeu a chave do quarto proibido?')
ON CONFLICT DO NOTHING;
