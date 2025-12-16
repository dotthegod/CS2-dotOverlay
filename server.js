const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

function createOverlayServer(options = {}) {
    const host = options.host || '127.0.0.1';
    const port = Number(options.port || 3000);
    const log = typeof options.log === 'function' ? options.log : console.log;
    const error = typeof options.error === 'function' ? options.error : console.error;

    // Detect if running in a packaged environment (pkg)
    const isPkg = typeof process.pkg !== 'undefined';
    const defaultExternalDir = isPkg ? path.dirname(process.execPath) : __dirname;
    const externalDir = options.externalDir || defaultExternalDir;

    // Allow overriding the kills directory via env var (GUI) or explicit option
    const killsPath = options.killsPath || process.env.KILLS_PATH;

    const server = http.createServer((req, res) => {
        if (req.method === 'POST') {
            let body = '';

            // 1. Receive the chunks of data from CS2
            req.on('data', chunk => {
                body += chunk.toString();
            });

            // 2. Process the full message
            req.on('end', () => {
                try {
                    const data = JSON.parse(body);

                    // Emit the game state to all connected clients (browsers)
                    io.emit('gameState', data);
                } catch (e) {
                    error('Error parsing JSON:', e);
                }

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end('OK');
            });
        } else if (req.method === 'GET') {
            // Serve the index.html file
            if (req.url === '/') {
                fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
                    if (err) {
                        res.writeHead(500);
                        res.end('Error loading index.html');
                        return;
                    }
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.end(data);
                });
            } else if (req.url.startsWith('/kill_asset')) {
                // Dynamic asset loading based on kill count
                // Expects: /kill_asset?kind=image|audio&kills=N
                const urlParts = req.url.split('?');
                const query = new URLSearchParams(urlParts[1]);
                const kind = query.get('kind');
                const kills = query.get('kills');

                if (!kind || !kills) {
                    res.writeHead(400);
                    res.end('Missing parameters');
                    return;
                }

                const killsDir = killsPath || path.join(externalDir, 'kills');

                // Check if directory exists
                if (!fs.existsSync(killsDir)) {
                    error('Kills directory not found:', killsDir);
                    res.writeHead(404);
                    res.end('Kills directory not found');
                    return;
                }

                fs.readdir(killsDir, (err, files) => {
                    if (err) {
                        error('Error reading kills directory:', err);
                        res.writeHead(500);
                        res.end('Server error');
                        return;
                    }

                    // Logic: 1 kill -> "kill", >1 kills -> "kills"
                    const suffix = (parseInt(kills) === 1) ? 'kill' : 'kills';

                    let matchingFile;
                    if (kind === 'image') {
                        const searchSuffix = `_${kills}_${suffix}.png`;
                        matchingFile = files.find(f => f.endsWith(searchSuffix));
                    } else if (kind === 'audio') {
                        const searchSuffix = `_${kills}_${suffix}_audio.mp3`;
                        matchingFile = files.find(f => f.endsWith(searchSuffix));
                    }

                    if (matchingFile) {
                        const filePath = path.join(killsDir, matchingFile);
                        log(`[Asset Match] Request: kills=${kills}, kind=${kind} -> Serving: ${matchingFile}`);

                        const ext = path.extname(filePath).toLowerCase();
                        const mimeTypes = {
                            '.png': 'image/png',
                            '.mp3': 'audio/mpeg',
                        };
                        const contentType = mimeTypes[ext] || 'application/octet-stream';

                        fs.readFile(filePath, (err, data) => {
                            if (err) {
                                res.writeHead(500);
                                res.end('Error reading file');
                                return;
                            }
                            res.writeHead(200, {'Content-Type': contentType});
                            res.end(data);
                        });
                    } else {
                        log(`[Asset Missing] No file found for kills=${kills}, kind=${kind}`);
                        res.writeHead(404);
                        res.end('File not found');
                    }
                });
            } else {
                res.writeHead(404);
                res.end('Not found');
            }
        }
    });

    const io = new Server(server, {
        transports: ['websocket'],
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', () => {
        log('A user connected to the overlay');
    });

    server.listen(port, host, () => {
        log(`Listening for CS2 data on port ${port}...`);
        log(`Open http://localhost:${port} in your browser to see the overlay.`);
    });

    return {
        server,
        io,
        close: () => {
            try { io.close(); } catch { /* ignore */ }
            try { server.close(); } catch { /* ignore */ }
        }
    };
}

if (require.main === module) {
    createOverlayServer();
}

module.exports = {
    createOverlayServer,
};