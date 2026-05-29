import { app, BrowserWindow, ipcMain, shell, screen } from 'electron'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const isDev = !app.isPackaged

// Disable GPU acceleration for WSL
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  
  const x = Math.floor((width - 1200) / 2)
  const y = Math.floor((height - 800) / 2)

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    x: Math.max(x, 100),
    y: Math.max(y, 100),
    minWidth: 800,
    minHeight: 600,
    show: false,
    alwaysOnTop: true,
    title: 'Hermes UI',
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  // Open external links in browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
    mainWindow?.setAlwaysOnTop(true, 'screen-saver')
  })
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// IPC handlers for settings
ipcMain.handle('get-settings', () => {
  return {}
})

ipcMain.handle('open-external', (_, url: string) => {
  shell.openExternal(url)
})
