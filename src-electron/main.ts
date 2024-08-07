import { app, BrowserWindow } from 'electron'
import path from 'path'
import { serviceCaixa } from './service/service-caixa'
import { serviceCliente } from './service/service-cliente'
import { serviceConta } from './service/service-conta'
import { serviceEstoque } from './service/service-estoque'
import { servicoRelatorio } from './service/service-relatorio'
import { serviceVenda } from './service/service-venda'

if (require('electron-squirrel-startup')) {
  app.quit()
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, 'assets', 'images', 'icon.ico'),
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    title: 'Que chique Gerenciador de estoque',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  })

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL)
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`))
  }

  //mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
})

app.on('ready', serviceCaixa)
app.on('ready', serviceVenda)
app.on('ready', serviceConta)
app.on('ready', serviceCliente)
app.on('ready', serviceEstoque)
app.on('ready', servicoRelatorio)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
