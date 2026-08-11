const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '../frontend/dist');
const publicDest = path.join(__dirname, '../public');
const distDest = path.join(__dirname, '../dist');

if (fs.existsSync(src)) {
  fs.mkdirSync(publicDest, { recursive: true });
  fs.mkdirSync(distDest, { recursive: true });
  fs.cpSync(src, publicDest, { recursive: true });
  fs.cpSync(src, distDest, { recursive: true });
  console.log('Successfully copied frontend/dist to root public/ and dist/');
} else {
  console.warn('frontend/dist not found to copy');
}
