const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

// MANUAL ENV LOADER (Absolute Path for cPanel)
const envPath = path.join(__dirname, '.env.production');
console.error('DEBUG: Looking for .env at ' + envPath);

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
      process.env[key.trim()] = value;
    }
  });
  console.error('DEBUG: .env.production LOADED SUCCESSFULY from ' + envPath);
} else {
  console.error('DEBUG: .env.production NOT FOUND at ' + envPath);
}

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Pe cPanel, PORT poate fi un socket sau un număr
const port = process.env.PORT || 3000;

console.log(`Starting Next.js in ${process.env.NODE_ENV || 'development'} mode...`);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(port, (err) => {
    if (err) {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
    console.log(`> Ready on port ${port}`);
  });
}).catch((err) => {
  console.error('Error during app preparation:', err);
  process.exit(1);
});

// Capturăm erorile neprevăzute pentru a nu crăpa tot serverul
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
