import {Composition} from 'remotion';
import {MainVideo} from './MainVideo';
import {video} from './styles';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MainVideo"
    component={MainVideo}
    durationInFrames={video.fps * 10}
    fps={video.fps}
    width={video.width}
    height={video.height}
  />
);
