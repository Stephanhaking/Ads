export type Lang = 'en' | 'pt'
export type Brand = 'garra' | 'stephanus'

// Every claim here is true of the product design: no invented users, numbers or reviews.
export const COPY = {
  en: {
    hook: ["You said you'd", 'start', 'Monday.'],
    again: 'Again.',
    feed: ['Built to keep', 'you scrolling.'],
    stop: 'Not this one.',
    tagline: ['Say it.', 'Do it.', 'Prove it.'],
    say: { head: 'Say it.', sub: 'Put something real at stake.', note: 'If you slip, 100% goes to a cause you pick. We keep nothing.' },
    do: { head: 'Do it.', sub: 'Weekly challenges. One focus.' },
    prove: { head: 'Prove it.', sub: 'Real work, checked by real people.' },
    values: ['No ads.', 'No infinite feed.', 'We never profit from your failure.'],
    cta: 'Early access soon.',
  },
  pt: {
    hook: ['Você disse que', 'ia começar', 'na segunda.'],
    again: 'De novo.',
    feed: ['Feito para você', 'não parar de rolar.'],
    stop: 'Este não.',
    tagline: ['Diga.', 'Faça.', 'Prove.'],
    say: { head: 'Diga.', sub: 'Coloque algo real em jogo.', note: 'Se falhar, 100% vai para a causa que você escolher. Nós não ficamos com nada.' },
    do: { head: 'Faça.', sub: 'Desafios semanais. Um foco.' },
    prove: { head: 'Prove.', sub: 'Trabalho real, conferido por pessoas reais.' },
    values: ['Sem anúncios.', 'Sem feed infinito.', 'Nunca lucramos com o seu fracasso.'],
    cta: 'Acesso antecipado em breve.',
  },
} as const
