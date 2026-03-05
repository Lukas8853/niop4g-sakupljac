const { app, BrowserWindow } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        //fullscreen: true,
        width: 800,
        height: 800,
    })
    win.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow()
})