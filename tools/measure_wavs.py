"""Mede os WAVs da locução e atualiza src/google/timing.json.

Coloca os ficheiros em public/audio/voice/ com estes nomes (um por parágrafo do script):
    cold.wav   act1.wav   act2.wav
Opcional: public/audio/music.mp3 (música de fundo, volume baixo).

Uso: npm run measure
"""
import json
import os
import wave

ROOT = os.path.join(os.path.dirname(__file__), '..')
TIMING = os.path.join(ROOT, 'src/google/timing.json')
VOICE = os.path.join(ROOT, 'public/audio/voice')
MUSIC = 'audio/music.mp3'


def duration(path):
    with wave.open(path, 'rb') as w:
        return w.getnframes() / w.getframerate()


def fmt(sec):
    return f'{int(sec // 60)}:{int(sec % 60):02d}'


def main():
    data = json.load(open(TIMING))
    found = 0
    for p in data['paragraphs']:
        path = os.path.join(VOICE, f"{p['id']}.wav")
        if os.path.exists(path):
            p['file'] = f"audio/voice/{p['id']}.wav"
            p['sec'] = round(duration(path), 3)
            found += 1
        else:
            p['file'] = None
            p['sec'] = p['estSec']
    data['music'] = MUSIC if os.path.exists(os.path.join(ROOT, 'public', MUSIC)) else None
    data['measured'] = found == len(data['paragraphs'])
    json.dump(data, open(TIMING, 'w'), indent=2, ensure_ascii=False)
    open(TIMING, 'a').write('\n')

    t = 0.0
    print(f"{found}/{len(data['paragraphs'])} WAVs medidos · música: {data['music'] or 'nenhuma'}\n")
    print('Capítulos (para a descrição do YouTube):')
    for p in data['paragraphs']:
        print(f"  {fmt(t)} {p['label']}  ({p['sec']:.1f}s, {'medido' if p['file'] else 'estimado'})")
        t += p['sec'] + data['gapSec']


if __name__ == '__main__':
    main()
