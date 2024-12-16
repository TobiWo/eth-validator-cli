const { execSync } = require('child_process');

const target = process.argv[2];
const allowedTargets = ['linux-x64', 'win-x64', 'macos-x64', 'linux-arm64', 'win-arm64', 'macos-arm64'];

if (!allowedTargets.includes(target)) {
  console.error(`Error: Invalid target "${target}".`);
  console.error(`Allowed targets are: ${allowedTargets.join(', ')}`);
  process.exit(1);
}

const command = `npx pkg . --targets node22-${target} --out-path ./bin`;

console.log(`Running: ${command}`);
execSync(command, { stdio: 'inherit' });
