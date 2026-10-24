import React from 'react';
import {Composition, staticFile} from 'remotion';
import {Video, Timeline} from './Video';

export const Root: React.FC = () => (
  <Composition
    id="Video"
    component={Video}
    width={1080}
    height={1920}
    fps={30}
    durationInFrames={30}
    defaultProps={{timeline: null as Timeline | null}}
    calculateMetadata={async () => {
      const timeline: Timeline = await (await fetch(staticFile('build/timeline.json'))).json();
      return {
        width: timeline.width,
        height: timeline.height,
        fps: timeline.fps,
        durationInFrames: Math.ceil(timeline.total * timeline.fps),
        props: {timeline},
      };
    }}
  />
);
