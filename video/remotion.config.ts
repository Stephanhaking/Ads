import { Config } from '@remotion/cli/config'

Config.setVideoImageFormat('jpeg')
// Point REMOTION_BROWSER at a local Chrome Headless Shell to skip Remotion's own download.
Config.setBrowserExecutable(process.env.REMOTION_BROWSER ?? null)
