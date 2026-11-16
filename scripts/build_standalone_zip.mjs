import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { build } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const stageDir = path.join(rootDir, 'dist-standalone-project');
const offlineOutDir = path.join(stageDir, 'play-offline');
const downloadsDir = path.join(rootDir, 'public', 'downloads');
const zipOutputPath = path.join(downloadsDir, 'Fish_Feeder_Fullscreen.zip');

function collectStandaloneSources(entryFile) {
  const visited = new Set();
  const queue = [entryFile];

  const resolveLocalImport = (currFile, spec) => {
    if (!spec.startsWith('.')) return null;
    const base = path.normalize(path.join(path.dirname(currFile), spec));
    const candidates = ['', '.ts', '.tsx', '.css', '.png', '.jpg', '.svg', '/index.ts', '/index.tsx'];
    for (const ext of candidates) {
      const candidate = base + ext;
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return candidate;
      }
    }
    throw new Error(`Missing import ${spec} referenced from ${currFile}`);
  };

  while (queue.length > 0) {
    const file = queue.shift();
    if (visited.has(file)) continue;
    visited.add(file);

    if (!/\.(ts|tsx|css)$/i.test(file)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const regex = /(?:import|from)\s+['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const resolved = resolveLocalImport(file, match[1]);
      if (resolved && !visited.has(resolved)) {
        queue.push(resolved);
      }
    }
  }

  return Array.from(visited).sort();
}

async function main() {
  fs.rmSync(stageDir, { recursive: true, force: true });
  fs.mkdirSync(stageDir, { recursive: true });
  fs.mkdirSync(downloadsDir, { recursive: true });

  const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf8'));
  const pickDeps = (source, keys) => {
    const out = {};
    for (const k of keys) {
      if (source && source[k]) out[k] = source[k];
    }
    return out;
  };

  // 1. Standalone package.json
  const standalonePkg = {
    name: 'fish-feeder-fullscreen',
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite --port=3000 --host=0.0.0.0',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'tsc --noEmit',
    },
    dependencies: pickDeps(rootPkg.dependencies, [
      '@supabase/supabase-js',
      '@tailwindcss/vite',
      '@types/canvas-confetti',
      '@types/three',
      '@vitejs/plugin-react',
      'canvas-confetti',
      'lucide-react',
      'react',
      'react-dom',
      'three',
      'vite',
    ]),
    devDependencies: pickDeps(rootPkg.devDependencies, [
      '@types/node',
      '@types/react',
      '@types/react-dom',
      'autoprefixer',
      'tailwindcss',
      'typescript',
    ]),
  };
  fs.writeFileSync(path.join(stageDir, 'package.json'), JSON.stringify(standalonePkg, null, 2) + '\n', 'utf8');

  // 2. Standalone tsconfig.json
  const standaloneTsconfig = {
    compilerOptions: {
      target: 'ES2022',
      experimentalDecorators: true,
      useDefineForClassFields: false,
      module: 'ESNext',
      types: ['vite/client'],
      lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      skipLibCheck: true,
      moduleResolution: 'bundler',
      isolatedModules: true,
      moduleDetection: 'force',
      allowJs: true,
      jsx: 'react-jsx',
      paths: {
        '@/*': ['./*'],
      },
      allowImportingTsExtensions: true,
      noEmit: true,
    },
    exclude: ['dist', 'play-offline'],
  };
  fs.writeFileSync(path.join(stageDir, 'tsconfig.json'), JSON.stringify(standaloneTsconfig, null, 2) + '\n', 'utf8');

  // 3. Standalone vite.config.ts
  const viteConfigContent = `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
});
`;
  fs.writeFileSync(path.join(stageDir, 'vite.config.ts'), viteConfigContent, 'utf8');

  // 4. Standalone index.html (copied cleanly from standalone.html)
  const standaloneHtml = fs.readFileSync(path.join(rootDir, 'standalone.html'), 'utf8');
  fs.writeFileSync(path.join(stageDir, 'index.html'), standaloneHtml, 'utf8');

  // 5. Vercel SPA config + .gitignore
  const vercelJson = {
    framework: 'vite',
    buildCommand: 'vite build',
    outputDirectory: 'dist',
    rewrites: [
      {
        source: '/((?!assets/|audio/).*)',
        destination: '/index.html',
      },
    ],
  };
  fs.writeFileSync(path.join(stageDir, 'vercel.json'), JSON.stringify(vercelJson, null, 2) + '\n', 'utf8');
  fs.writeFileSync(path.join(stageDir, '.gitignore'), 'node_modules\ndist\n.DS_Store\n', 'utf8');

  // 6. Copy traced standalone src/ files
  const entryAbs = path.join(rootDir, 'src', 'standaloneMain.tsx');
  const sourceFiles = collectStandaloneSources(entryAbs);
  for (const absFile of sourceFiles) {
    const rel = path.relative(rootDir, absFile);
    const dest = path.join(stageDir, rel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(absFile, dest);
  }
  console.log(`[standalone-zip] Copied ${sourceFiles.length} standalone source files.`);

  // 7. Copy Fish Feeder audio tracks into public/audio/
  const audioSrcDir = path.join(rootDir, 'public', 'audio');
  const publicAudioDir = path.join(stageDir, 'public', 'audio');
  fs.mkdirSync(publicAudioDir, { recursive: true });
  const requiredTracks = [
    'fish_of_fortune_theme.mp3',
    'golden_vault_theme.mp3',
    'sixty_frames_conveyor.mp3',
  ];
  for (const track of requiredTracks) {
    const src = path.join(audioSrcDir, track);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(publicAudioDir, track));
    }
  }

  // 8. Verify standalone TypeScript check before building play-offline
  const rootNodeModules = path.join(rootDir, 'node_modules');
  const stageNodeModules = path.join(stageDir, 'node_modules');
  fs.symlinkSync(rootNodeModules, stageNodeModules, 'dir');
  try {
    execFileSync(path.join(rootNodeModules, '.bin', 'tsc'), ['--noEmit'], {
      cwd: stageDir,
      stdio: 'inherit',
    });
    console.log('[standalone-zip] Standalone tsc --noEmit passed!');
  } finally {
    fs.unlinkSync(stageNodeModules);
  }

  // 9. Build pre-compiled static offline bundle inside play-offline/
  console.log('[standalone-zip] Building play-offline/ static fullscreen bundle...');
  await build({
    configFile: false,
    mode: 'production',
    root: rootDir,
    base: './',
    publicDir: false,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': rootDir,
      },
    },
    build: {
      outDir: offlineOutDir,
      emptyOutDir: true,
      sourcemap: false,
      assetsInlineLimit: 512000,
      rollupOptions: {
        input: path.join(rootDir, 'standalone.html'),
        output: {
          format: 'iife',
          name: 'FishFeederStandalone',
          inlineDynamicImports: true,
          entryFileNames: 'assets/fish-feeder.js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
        },
      },
    },
  });

  const builtOfflineHtml = path.join(offlineOutDir, 'standalone.html');
  const finalOfflineHtml = path.join(offlineOutDir, 'index.html');
  let html = fs.readFileSync(builtOfflineHtml, 'utf8');
  html = html.replace(/\s+type="module"/g, '');
  html = html.replace(/\s+crossorigin(?:="[^"]*")?/g, '');
  let scriptTag = '<script defer src="./assets/fish-feeder.js"></script>';
  const headScriptMatch = html.match(/<script[^>]*src="([^"]*fish-feeder\.js)"[^>]*><\/script>/i);
  if (headScriptMatch) {
    html = html.replace(headScriptMatch[0], '');
    scriptTag = `<script defer src="${headScriptMatch[1]}"></script>`;
  }
  html = html.replace('</body>', `    ${scriptTag}\n  </body>`);
  fs.writeFileSync(finalOfflineHtml, html, 'utf8');
  fs.rmSync(builtOfflineHtml, { force: true });

  const offlineAudioDir = path.join(offlineOutDir, 'audio');
  fs.mkdirSync(offlineAudioDir, { recursive: true });
  for (const track of requiredTracks) {
    const src = path.join(audioSrcDir, track);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(offlineAudioDir, track));
    }
  }

  // 10. README.md / LEEME.txt
  const readmeContent = `# Fish Feeder - Fullscreen Standalone Edition

Version independiente del juego en pantalla completa (100vw x 100dvh), sin portafolio ni paginas externas.

## Opcion 1: Ejecutar o desplegar como proyecto Vite / Node (con package.json)
1. Descomprime este .zip
2. Instala dependencias:
   npm install
3. Inicia en desarrollo:
   npm run dev
4. O compila para produccion (genera carpeta dist/):
   npm run build

Compatible directo con Vercel, Netlify, GitHub, Cloudflare Pages y AI Studio.

## Opcion 2: Abrir ya compilado (sin npm)
Dentro de la carpeta \`play-offline/\` ya viene compilado \`index.html\` listo para servir en S3 / hosting estatico o probar en navegador.
`;
  fs.writeFileSync(path.join(stageDir, 'README.md'), readmeContent, 'utf8');
  fs.writeFileSync(path.join(stageDir, 'LEEME.txt'), readmeContent, 'utf8');

  // 11. Package staged standalone project into Fish_Feeder_Fullscreen.zip
  const pyScript = `
import os, sys, time, zipfile
src_dir = sys.argv[1]
zip_path = sys.argv[2]
root_folder = 'Fish_Feeder_Fullscreen'
now_dt = time.localtime()[:6]

with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
    for base, dirs, files in os.walk(src_dir):
        dirs.sort()
        for fname in sorted(files):
            full_path = os.path.join(base, fname)
            rel_path = os.path.relpath(full_path, src_dir).replace('\\\\', '/')
            arcname = f"{root_folder}/{rel_path}"
            zi = zipfile.ZipInfo(arcname, date_time=now_dt)
            zi.create_system = 0
            zi.external_attr = 0o644 << 16
            zi.compress_type = zipfile.ZIP_DEFLATED
            with open(full_path, 'rb') as f:
                zf.writestr(zi, f.read())

with zipfile.ZipFile(zip_path, 'r') as zf:
    bad = zf.testzip()
    if bad is not None:
        raise RuntimeError(f"ZIP integrity check failed on {bad}")

print(f"Created & verified {zip_path} ({os.path.getsize(zip_path)} bytes)")
`;

  execFileSync('python3', ['-c', pyScript, stageDir, zipOutputPath], { stdio: 'inherit' });
  fs.rmSync(stageDir, { recursive: true, force: true });
}

main().catch((err) => {
  console.error('[standalone-zip] Build failed:', err);
  fs.rmSync(stageDir, { recursive: true, force: true });
  process.exit(1);
});
