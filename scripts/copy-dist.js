const fs = require('fs');
const path = require('path');

const srcPublic = path.join(__dirname, '../frontend/public');
const srcDist = path.join(__dirname, '../frontend/dist');
const publicDest = path.join(__dirname, '../public');
const distDest = path.join(__dirname, '../dist');

const src = fs.existsSync(srcPublic) ? srcPublic : srcDist;

if (fs.existsSync(src)) {
  fs.mkdirSync(publicDest, { recursive: true });
  fs.mkdirSync(distDest, { recursive: true });
  fs.cpSync(src, publicDest, { recursive: true });
  fs.cpSync(src, distDest, { recursive: true });
  console.log('Successfully synced built assets to root public/ and dist/');
} else {
  console.warn('No build output folder found to copy');
}
