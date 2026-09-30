import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {colors, fonts} from './styles';

export const MainVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: fonts.heading,
      }}
    >
      <h1 style={{color: colors.white, fontSize: 120, margin: 0, opacity}}>
        Título do <span style={{color: colors.red}}>Vídeo</span>
      </h1>
    </AbsoluteFill>
  );
};
