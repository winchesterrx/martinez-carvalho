import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../service_account.json'),
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
});
const drive = google.drive({ version: 'v3', auth });

async function listAll(folderId, prefix = '') {
  const res = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: 'files(id, name, mimeType)',
  });

  for (const f of res.data.files) {
    if (f.mimeType === 'application/vnd.google-apps.folder') {
      console.log(`\n📂 PASTA: ${prefix}${f.name.toUpperCase()}`);
      await listAll(f.id, prefix + '  ');
    } else if (f.mimeType.startsWith('video/') || f.mimeType.startsWith('audio/')) {
      console.log(`${prefix}  - ${f.name}`);
    }
  }
}

console.log("=== LISTA DE VÍDEOS NA CLEUSA IA ===");
listAll('1o0gOVuhQfH5coXXP6jwEIcMBglgy43CN').then(() => {
    // console.log("\nFim da lista.");
    // process.exit();
});
