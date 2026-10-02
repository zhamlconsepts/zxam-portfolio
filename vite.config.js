import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';

function syncMusicPlugin() {
  const rootDir = process.cwd();
  const musicDir = path.resolve(rootDir, 'music');
  const publicMusicDir = path.resolve(rootDir, 'public/music');
  const manifestPath = path.resolve(rootDir, 'src/utils/musicTracks.json');

  function updateTracks() {
    if (!fs.existsSync(publicMusicDir)) {
      fs.mkdirSync(publicMusicDir, { recursive: true });
    }

    const files = new Set();
    if (fs.existsSync(musicDir)) {
      try {
        fs.readdirSync(musicDir).forEach((f) => files.add(f));
      } catch (e) {}
    }
    if (fs.existsSync(publicMusicDir)) {
      try {
        fs.readdirSync(publicMusicDir).forEach((f) => files.add(f));
      } catch (e) {}
    }

    const audioExts = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac'];
    const trackFiles = Array.from(files).filter((f) => {
      const ext = path.extname(f).toLowerCase();
      return audioExts.includes(ext) && !f.startsWith('.');
    });

    // Auto-sync files from music to public/music if missing
    trackFiles.forEach((f) => {
      const srcFile = path.join(musicDir, f);
      const destFile = path.join(publicMusicDir, f);
      if (fs.existsSync(srcFile) && !fs.existsSync(destFile)) {
        try {
          fs.copyFileSync(srcFile, destFile);
        } catch (e) {}
      }
    });

    const tracks = trackFiles.map((filename, index) => {
      const ext = path.extname(filename);
      let baseName = path.basename(filename, ext);

      // Clean metadata
      baseName = baseName
        .replace(/[\(\[\{]?(?:Official\s*(?:Music\s*)?Video|Lyrics|lyric\s*video|Remastered|Topic|Audio|HD|4K)[\)\]\}]?/gi, '')
        .replace(/#[\w-]+/g, '')
        .replace(/_/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      let artist = 'Various Artists';
      let title = baseName;

      if (baseName.includes(' - ')) {
        const parts = baseName.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      const url = `/music/${encodeURIComponent(filename)}`;

      return {
        id: `track-${index + 1}`,
        filename,
        title: title || baseName || `Track ${index + 1}`,
        artist: artist || 'Jamshid Portfolio',
        url
      };
    });

    try {
      const dir = path.dirname(manifestPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(manifestPath, JSON.stringify(tracks, null, 2), 'utf-8');
    } catch (e) {}

    return tracks;
  }

  return {
    name: 'sync-music-plugin',
    buildStart() {
      updateTracks();
    },
    configureServer(server) {
      updateTracks();

      if (fs.existsSync(musicDir)) {
        server.watcher.add(musicDir);
      }
      server.watcher.add(publicMusicDir);

      server.watcher.on('all', (event, filePath) => {
        if (filePath.includes('music') && /\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(filePath)) {
          updateTracks();
          server.ws.send({
            type: 'custom',
            event: 'music-updated',
            data: { timestamp: Date.now() }
          });
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    syncMusicPlugin()
  ],
});
