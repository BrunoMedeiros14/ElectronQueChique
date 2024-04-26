import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { buscarClientePorId, buscarTodosClientes, criarCliente, editarCliente, removerCliente } from './repository/RepositorioCliente';
import { BuscarClientePorId, BuscarTodosClientes, CriarCliente, EditarCliente, RemoverCliente } from './shared/Api';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true, // ('default' | 'hidden' | 'hiddenInset' | 'customButtonsOnHover');
    title: 'Que chique Gerenciador de estoque',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

app.whenReady().then(() => {


  ipcMain.on('ping', () => console.log('pong'))

  ipcMain.handle("criarCliente", (_, ...args: Parameters<CriarCliente>) => criarCliente(...args))
  ipcMain.handle("removerCliente", (_, ...args: Parameters<RemoverCliente>) => removerCliente(...args))
  ipcMain.handle("editarCliente", (_, ...args: Parameters<EditarCliente>) => editarCliente(...args))
  ipcMain.handle("buscarClientePorId", (_, ...args: Parameters<BuscarClientePorId>) => buscarClientePorId(...args))
  ipcMain.handle("buscarTodosClientes", (_, ...args: Parameters<BuscarTodosClientes>) => buscarTodosClientes(...args))
  createWindow();

});

// criarCliente({dataNascimento: new Date(), email: "aa", endereco: "a", nome: "a", telefone: "a"})
// app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
