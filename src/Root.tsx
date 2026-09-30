import {Composition} from 'remotion';
import {MainVideo} from './MainVideo';
import {GoogleVideo, GG_TOTAL} from './GoogleVideo';
import {video} from './styles';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="GoogleVideo"
    component={GoogleVideo}
    durationInFrames={GG_TOTAL}
    fps={video.fps}
    width={video.width}
    height={video.height}
  />
  <Composition
    id="MainVideo"
    component={MainVideo}
    durationInFrames={video.fps * 10}
    fps={video.fps}
    width={video.width}
    height={video.height}
  />
  </>
);
