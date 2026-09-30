"""Mede os WAVs da locução e atualiza src/google/timing.json.

Coloca os ficheiros em public/audio/voice/ com estes nomes (um por parágrafo do script):
    cold.wav   act1.wav   act2.wav
Opcional: public/audio/music.mp3 (música de fundo, volume baixo).

Uso: npm run measure                                   (WAVs por parágrafo em public/audio/voice/)
     npm run measure -- --timecodes timecodes_google.json --master voiceover_google.wav
         (saída do tts_google.py: um master + tempos por chunk; ids cold→cold, a1→act1, a2→act2)
"""
import argparse
import json
import os
import shutil
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


IDS = {'cold': 'cold', 'a1': 'act1', 'a2': 'act2'}


def from_timecodes(tc_path, master_path):
    data = json.load(open(TIMING))
    tc = json.load(open(tc_path))
    chunks = {c['id']: c for c in tc['chunks']}

    # REGRA CRÍTICA: nunca confiar só nas durações reportadas pelo TTS — medir o master diretamente.
    real = duration(master_path)
    last_end = max(c['t'] + c['dur'] for c in chunks.values())
    reported = tc.get('total_seconds')
    print(f"master real: {real:.2f}s · fim do último chunk no JSON: {last_end:.2f}s"
          + (f" · total reportado: {reported:.2f}s" if reported else ''))
    if last_end > real + 0.5:
        raise SystemExit(f'ERRO: o JSON diz que os chunks acabam em {last_end:.1f}s mas o master só tem {real:.1f}s. '
                         'O JSON não corresponde a este WAV — não vou sincronizar com tempos falsos.')
    if reported and abs(reported - real) > 0.5:
        print(f'AVISO: total reportado ({reported:.1f}s) difere do master ({real:.1f}s) em mais de 0,5 s.')
    os.makedirs(os.path.join(ROOT, 'public/audio'), exist_ok=True)
    shutil.copy(master_path, os.path.join(ROOT, 'public/audio/voiceover_google.wav'))
    data['master'] = 'audio/voiceover_google.wav'
    prev = None
    for src_id, our_id in IDS.items():
        p = next(x for x in data['paragraphs'] if x['id'] == our_id)
        c = chunks[src_id]
        p['file'] = None
        p['sec'] = round(c['dur'], 3)
        if prev is not None:
            data['gapSec'] = round(c['t'] - (prev['t'] + prev['dur']), 3)
        prev = c
    data['measured'] = True
    json.dump(data, open(TIMING, 'w'), indent=2, ensure_ascii=False)
    open(TIMING, 'a').write('\n')
    t = 0.0
    print(f"master copiado · gap {data['gapSec']}s\nCapítulos (para a descrição do YouTube):")
    for p in data['paragraphs']:
        print(f"  {fmt(t)} {p['label']}  ({p['sec']:.1f}s)")
        t += p['sec'] + data['gapSec']


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--timecodes')
    ap.add_argument('--master')
    a = ap.parse_args()
    if a.timecodes and a.master:
        return from_timecodes(a.timecodes, a.master)
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
