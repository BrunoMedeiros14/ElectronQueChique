const { app, BrowserWindow } = require('electron')

let mainWindow
let loadingScreen

app.on('ready', () => {
    createLoadingScreen();
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('src/view/login.html');

    mainWindow.once('ready-to-show', () => {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.close();
            }
            mainWindow.show();
        }, 1000);
    });
});

function createLoadingScreen() {
    loadingScreen = new BrowserWindow(
        Object.assign({
            width: 1024,
            height: 768,
            frame: false,
            transparent: true
        })
    );
    loadingScreen.setResizable(false);
    loadingScreen.loadFile('src/view/loading.html');
}