import {Composition} from 'remotion';
import {MainVideo} from './MainVideo';
import {GoogleVideo, GG_TOTAL} from './GoogleVideo';
import {video} from './styles';
import {FeudalPreview, FEUDAL_PREVIEW_FRAMES} from './feudal/Preview';
import {FeudalVideo, FEUDAL_FRAMES} from './feudal/FeudalVideo';
import {Thumb} from './feudal/Thumb';

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
  <Composition id="FeudalVideo" component={FeudalVideo} durationInFrames={FEUDAL_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="FeudalThumbA" component={Thumb} defaultProps={{variant: 'A' as const}} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="FeudalThumbB" component={Thumb} defaultProps={{variant: 'B' as const}} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="FeudalPreview" component={FeudalPreview} durationInFrames={FEUDAL_PREVIEW_FRAMES} fps={30} width={1920} height={1080} />
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
