const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const {
  mergePatron, getAllPatrons, 
  deletePatron, addVisitToPatron
} = require('./server/services/patron-db.service');

let mainWindow

async function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})
  mainWindow.loadFile('dist/pantry-patrons-app/index.html')
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

const getAll = () => {
  getAllPatrons((docs) => {
    if(mainWindow){
      mainWindow.webContents.send('patrons:retrieved', docs)
    }
  });
}

ipcMain.on('save', (ev, patron) => {
  mergePatron(patron, (err, doc) => {
    if(err) throw err
    else getAll()
  });
});

ipcMain.on('get:all', (ev) => {
  getAll();
});

ipcMain.on('delete', (ev, _id) => {
  deletePatron(_id, (err, num) => {
    if(err) throw err
    else getAll()
  });
});

ipcMain.on('visit', (ev, {patron, signature}) => {
  addVisitToPatron(patron, signature, (err, num) => {
    if(err) throw err
    else getAll();
  });
});

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

app.on('browser-window-created',function(e,window) {
  // window.setMenu(null);
});