import {Composition} from 'remotion';
import {CHASE_FRAMES, ChaseDemo} from './chase/ChaseDemo';
import {G2_FRAMES, GoogleV2} from './google2/GoogleV2';
import {GA_FRAMES, GApple} from './gapple/GApple';
import {AS_IDS, AShort, ashortFrames} from './gapple/AShorts';
import {WhatIfTest} from './whatif/WhatIfTest';
import {IfAvatar, IfBanner} from './whatif/Brand';
import {GThumb} from './google2/Thumb';
import {FShort, GShort, KShort, KS_IDS, fshortFrames, kshortFrames, shortFrames} from './google2/Shorts';
import {MainVideo} from './MainVideo';
import {GoogleVideo, GG_TOTAL} from './GoogleVideo';
import {video} from './styles';
import {FeudalPreview, FEUDAL_PREVIEW_FRAMES} from './feudal/Preview';
import {FeudalVideo, FEUDAL_FRAMES} from './feudal/FeudalVideo';
import {Thumb} from './feudal/Thumb';
import {StyleRecreate, STYLE_FRAMES} from './feudal/StyleRecreate';
import {StyleV2, STYLEV2_FRAMES} from './feudal/StyleV2';

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
  {(['S1', 'S2', 'S3'] as const).map((k) => <Composition key={k} id={`GShort${k}`} component={GShort} defaultProps={{id: k}} durationInFrames={shortFrames(k)} fps={30} width={1080} height={1920} />)}
  {KS_IDS.map((k) => <Composition key={k} id={`KShort${k}`} component={KShort} defaultProps={{id: k}} durationInFrames={kshortFrames(k)} fps={30} width={1080} height={1920} />)}
  {(['F1', 'F2', 'F3'] as const).map((k) => <Composition key={k} id={`FShort${k}`} component={FShort} defaultProps={{id: k}} durationInFrames={fshortFrames(k)} fps={30} width={1080} height={1920} />)}
  <Composition id="GoogleThumbA" component={GThumb} defaultProps={{variant: 'A' as const}} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="GoogleThumbB" component={GThumb} defaultProps={{variant: 'B' as const}} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="GoogleThumbANoText" component={GThumb} defaultProps={{variant: 'A' as const, text: false}} durationInFrames={1} fps={30} width={1920} height={1080} />
  <Composition id="GoogleThumbBNoText" component={GThumb} defaultProps={{variant: 'B' as const, text: false}} durationInFrames={1} fps={30} width={1920} height={1080} />
  {AS_IDS.map((k) => <Composition key={k} id={`AShort${k}`} component={AShort} defaultProps={{id: k}} durationInFrames={ashortFrames(k)} fps={30} width={1080} height={1920} />)}
  <Composition id="IfAvatar" component={IfAvatar} durationInFrames={1} fps={30} width={800} height={800} />
  <Composition id="IfBanner" component={IfBanner} durationInFrames={1} fps={30} width={2560} height={1440} />
  <Composition id="WhatIfTest" component={WhatIfTest} durationInFrames={150} fps={30} width={1920} height={1080} />
  <Composition id="GApple" component={GApple} durationInFrames={GA_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="GoogleV2" component={GoogleV2} durationInFrames={G2_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="ChaseDemo" component={ChaseDemo} durationInFrames={CHASE_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="FeudalVideo" component={FeudalVideo} durationInFrames={FEUDAL_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="StyleRecreate" component={StyleRecreate} durationInFrames={STYLE_FRAMES} fps={30} width={1920} height={1080} />
  <Composition id="StyleV2" component={StyleV2} durationInFrames={STYLEV2_FRAMES} fps={30} width={1920} height={1080} />
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
