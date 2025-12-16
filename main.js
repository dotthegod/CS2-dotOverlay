const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { createOverlayServer } = require('./server');

let mainWindow;
let serverHandle = null;
let selectedKillsPath = '';

app.setName('dotOverlay');

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        },
        autoHideMenuBar: true
    });

    mainWindow.loadFile('gui/index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        stopServer();
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});

// IPC Handlers
ipcMain.on('start-server', (event, killsPath) => {
    if (serverHandle) {
        event.reply('server-status', 'Server is already running.');
        return;
    }

    selectedKillsPath = killsPath || '';
    const externalDir = app.isPackaged ? path.dirname(process.execPath) : __dirname;

    try {
        serverHandle = createOverlayServer({
            killsPath: selectedKillsPath || undefined,
            externalDir,
            log: (...args) => {
                const msg = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
                if (mainWindow) mainWindow.webContents.send('console-log', msg + "\n");
            },
            error: (...args) => {
                const msg = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
                if (mainWindow) mainWindow.webContents.send('console-error', msg + "\n");
            },
        });

        event.reply('server-status', 'Server started on port 3000...');
    } catch (e) {
        serverHandle = null;
        event.reply('server-status', `Failed to start server: ${e && e.message ? e.message : String(e)}`);
        event.reply('server-stopped');
    }
});

ipcMain.on('stop-server', (event) => {
    stopServer();
    event.reply('server-status', 'Server stopped by user.');
    event.reply('server-stopped');
});

ipcMain.on('select-folder', async (event) => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    });
    if (!result.canceled && result.filePaths.length > 0) {
        event.reply('folder-selected', result.filePaths[0]);
    }
});

function stopServer() {
    if (serverHandle) {
        try {
            serverHandle.close();
        } catch {
            // ignore
        }
        serverHandle = null;
    }
}
