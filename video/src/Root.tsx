import React from 'react'
import { Composition } from 'remotion'
import { Ad, type AdProps } from './Ad'
import { DURATION, FPS, H, W } from './theme'

const variants: { id: string; props: AdProps }[] = [
  { id: 'Ad-EN', props: { lang: 'en', brand: 'garra' } },
  { id: 'Ad-PT', props: { lang: 'pt', brand: 'garra' } },
  { id: 'Ad-EN-Stephanus', props: { lang: 'en', brand: 'stephanus' } },
  { id: 'Ad-PT-Stephanus', props: { lang: 'pt', brand: 'stephanus' } },
]

export const Root: React.FC = () => (
  <>
    {variants.map((v) => (
      <Composition
        key={v.id}
        id={v.id}
        component={Ad}
        durationInFrames={DURATION}
        fps={FPS}
        width={W}
        height={H}
        defaultProps={v.props}
      />
    ))}
  </>
)
