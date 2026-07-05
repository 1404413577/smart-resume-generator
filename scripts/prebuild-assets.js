import { execFileSync } from 'node:child_process'

const runScript = (scriptPath) => {
  execFileSync(process.execPath, [scriptPath], { stdio: 'inherit' })
}

runScript('scripts/generate-sitemap.js')
runScript('scripts/generate-icons.js')
