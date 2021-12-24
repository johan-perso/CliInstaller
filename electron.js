// Importer electron
const { app, BrowserWindow } = require('electron')

// Fonction pour crée la fenêtre d'application
function createWindow(){
	// Crée la fenêtre
	const mainWindow = new BrowserWindow({
		width: 410,
		height: 490,
		center: true,
		resizable: false,
		// resizable: true,
		minimizable: false,
		maximizable: false,
		fullscreenable: false,
		title: 'CliInstaller',
		autoHideMenuBar: true,
		backgroundColor: "#293241",
		darkTheme: true,
		titleBarStyle: 'hidden'
	})

	// Charger l'URL du serveur web (géré par server.js)
	mainWindow.loadURL('http://127.0.0.1:3000')
}

// Crée la fenêtre quand Electron est prêt
app.whenReady().then(() => {
	createWindow()

	app.on('activate', function (){
		if(BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

// Arrêter le processus quand l'application est fermer, sauf sur macOS.
app.on('window-all-closed', function (){
	if(process.platform !== 'darwin') app.quit()
})
