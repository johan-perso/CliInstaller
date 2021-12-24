#!/usr/bin/env node


// Importer express.js et crée une app
const express = require('express');
const app = express();

// Importer quelques modules
const fs = require('fs');
const path = require('path');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const child_process = require('child_process');
const commandExistsSync = require('command-exists').sync;
const chalk = require('chalk');

// Routes - pages web
app.get('/', async (req, res) => {
	res.send(fs.readFileSync(path.join(__dirname, 'public', 'index.html')).toString().replace(/{version}/g, require('./package.json').version));
})
app.get('/alreadyInstalled', async (req, res) => {
	var alreadyInstalled = []

	// Vérifier via leur commande
	if(commandExistsSync('twitterminal')) alreadyInstalled.push('twitterminal');
	if(commandExistsSync('ecochat')) alreadyInstalled.push('ecochat');
	if(commandExistsSync('hibercli')) alreadyInstalled.push('hibercli');
	if(commandExistsSync('ip-info')) alreadyInstalled.push('ip-info');
	if(commandExistsSync('rickdetect')) alreadyInstalled.push('rickdetect');
	if(commandExistsSync('haste-create')) alreadyInstalled.push('hastecli');
	if(commandExistsSync('speedtest')) alreadyInstalled.push('speedtest');
	if(commandExistsSync('crypterm')) alreadyInstalled.push('crypterm');

	// Retourner une réponse
	res.send(alreadyInstalled)
})
app.get('/style.css', async (req, res) => {
	res.set('Content-Type', 'text/plain').send(fs.readFileSync(path.join(__dirname, 'public', 'style.css')).toString())
})
app.get('/font_inter.css', async (req, res) => {
	res.set('Content-Type', 'text/plain').send(fs.readFileSync(path.join(__dirname, 'public', 'font_inter.css')).toString())
})
app.get('/script.js', async (req, res) => {
	res.set('Content-Type', 'text/plain').send(fs.readFileSync(path.join(__dirname, 'public', 'script.js')).toString().replace(/{pwd}/g, path.join(__dirname,'InstalledCLI').replace(/\\/g, '/')))
})
app.get('/konami.js', async (req, res) => {
	res.set('Content-Type', 'text/plain').send(fs.readFileSync(path.join(__dirname, 'public', 'konami.js')).toString())
})
app.get('*', async (req, res) => {
	res.send(fs.readFileSync(path.join(__dirname, 'public', '404.html')).toString())
})

// Quand une connexion au websocket est obtenu
currentlyInstallingCount = 0;
isConnected = false;
io.on('connection', (socket) => {
	// Dire qu'un socket est connecté
	isConnected = true;
	console.log(chalk.yellow('Socket connecté') + ' (ID : ' + chalk.cyan(socket.id) + ')');

	// Message - Ouvrir une page web dans le navigateur par défaut
	socket.on('openWebPage', (msg) => {
		console.log(`Ouverture de ${msg} dans votre navigateur par défaut`);
		require('open')(msg)
	});

	// Message - Installer un CLI
	socket.on('installCLI', (list) => {
		// Si aucun élément dans la liste n'est présent
		if(!list[0]) return socket.emit('error','Vous devez sélectionner un ou plusieurs CLI à installer')

		// Dire que l'installation va commencer
		socket.emit('installProgress', `Installation de ${list.map(name => name.replace("twitterminal","Twitterminal").replace("ecochat","Ecochat").replace("hibercli","HiberCLI").replace("ip-info","IP-Info").replace("rickdetect","Rickdetect").replace("hastecli","HasteCLI").replace("speedtest","SpeedtestCLI").replace("crypterm","Crypterm")).join(", ")} en cours...`)

		// A chaque élément de la liste
		list.forEach((name,i) => { setTimeout(() => {
			// Modifier une variable
			currentlyInstallingCount = list.length;

			// Installer le CLI
			if(name === "twitterminal"){
				console.log(chalk.blue("Installation de Twitterminal via npm..."))
				child_process.exec(`${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm i -g twitterminal`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation de Twitterminal terminée~~twitterminal`) && console.log(chalk.green("Installation de Twitterminal terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation de Twitterminal : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation de Twitterminal : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "ecochat"){
				console.log(chalk.blue("Installation d'Ecochat via npm..."))
				child_process.exec(`${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm i -g ecochat-term`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation d'Ecochat terminée~~ecochat`) && console.log(chalk.green("Installation d'Ecochat terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation d'Ecochat : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation d'Ecochat : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "hibercli"){
				console.log(chalk.blue("Installation d'HiberCLI via npm..."))
				child_process.exec(`${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm i -g hibercli`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation d'HiberCLI terminée~~hibercli`) && console.log(chalk.green("Installation d'HiberCLI terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation d'HiberCLI : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation d'HiberCLI : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "ip-info"){
				console.log(chalk.blue("Installation d'IP-Info via npm..."))
				child_process.exec(`${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm i -g @johanstickman/ip-info`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation d'IP-Info terminée~~ip-info`) && console.log(chalk.green("Installation d'IP-Info terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation d'IP-Info : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation d'IP-Info : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "rickdetect"){
				console.log(chalk.blue(`Installation de Rickdetect via Git dans ${path.join(__dirname, 'InstalledCLI', 'Rickdetect')}...`))
				child_process.exec(`${(!fs.existsSync(path.join(__dirname, 'InstalledCLI')) ? 'mkdir InstalledCLI && ' : '')}cd InstalledCLI && git clone https://github.com/johan-perso/rickdetect && cd rickdetect && npm install && ${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm link`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation de Rickdetect terminée~~rickdetect`) && console.log(chalk.green("Installation de Rickdetect terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation de Rickdetect : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation de Rickdetect : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "hastecli"){
				console.log(chalk.blue(`Installation d'HasteCLI via Git dans ${path.join(__dirname, 'InstalledCLI', 'haste')}...`))
				child_process.exec(`${(!fs.existsSync(path.join(__dirname, 'InstalledCLI')) ? 'mkdir InstalledCLI && ' : '')}cd InstalledCLI && git clone https://github.com/johan-perso/hastecli haste && cd haste && npm install && ${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm link`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation d'HasteCLI terminée~~hastecli`) && console.log(chalk.green("Installation d'HasteCLI terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation d'HasteCLI : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation d'HasteCLI : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "speedtest"){
				console.log(chalk.blue(`Installation de SpeedtestCLI via Git dans ${path.join(__dirname, 'InstalledCLI', 'speedtest')}...`))
				child_process.exec(`${(!fs.existsSync(path.join(__dirname, 'InstalledCLI')) ? 'mkdir InstalledCLI && ' : '')}cd InstalledCLI && git clone https://github.com/johan-perso/speedtest && cd speedtest && npm install && ${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm link`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation de SpeedtestCLI terminée~~speedtest`) && console.log(chalk.green("Installation de SpeedtestCLI terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation de SpeedtestCLI : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation de SpeedtestCLI : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
			if(name === "crypterm"){
				console.log(chalk.blue(`Installation de Crypterm via Git dans ${path.join(__dirname, 'InstalledCLI', 'crypterm')}...`))
				child_process.exec(`${(!fs.existsSync(path.join(__dirname, 'InstalledCLI')) ? 'mkdir InstalledCLI && ' : '')}cd InstalledCLI && git clone https://github.com/johan-perso/crypterm && cd crypterm && npm install && ${((require('os').platform() !== "win32") ? 'sudo ' : ' ')}npm link`, (err, stdout, stderr) => {
					socket.emit('installProgressFinished', `Installation de Crypterm terminée~~crypterm`) && console.log(chalk.green("Installation de Crypterm terminée"))
					if(err) socket.emit('error', err) && console.log(chalk.red("Erreur lors de l'installation de Crypterm : "), err)
					if(stderr && !stderr?.toString()?.includes("Cloning into")) socket.emit('error', stderr) && console.log(chalk.red("Erreur lors de l'installation de Crypterm : "), stderr)
					currentlyInstallingCount--
					if(stderr?.toString()?.includes("permission denied")) socket.emit('error',"Veuillez relancer ce script avec sudo/des droits d'administrateurs.")
				})
			}
		}, i * 3000); })
	});

	// Arrêter le serveur web lorsque la connexion est perdu (exemple, quand l'application est fermé)
	socket.on('disconnect', () => {
		// Fonction pour arrêter le serveur en respectant certaines conditions
		async function closeServer(){
			if(isConnected === true) return;

			if(currentlyInstallingCount === 0) server.close()
			if(currentlyInstallingCount === 0) process.exit()
			if(currentlyInstallingCount === 0) console.log("Arrêt du serveur web.")
			if(currentlyInstallingCount !== 0){
				console.log(chalk.red(`${currentlyInstallingCount.toString().replace(1,"Une").replace(2,"Deux").replace(3,"Trois").replace(4,"Quatre").replace(5,"Cinq")} installation est en cours... arrêt de CliInstaller reporté à +6 secondes`))
				setTimeout(closeServer, 6000)
			}
		}

		// Dire que la connexion est perdu
		console.log(chalk.yellow('Connexion au socket perdu...'))
		isConnected = false;

		// Arrêter le serveur
		setTimeout(() => { if(isConnected === false) console.log(chalk.red("Arrêt de CliInstaller dans 2 secondes...")) }, 1500)
		setTimeout(closeServer, 3000)
	});
});

// Démarrer le serveur web
const serv = server.listen(process.env.PORT || 3000, () => {
	// Avertissement quand on utilise pas Windows
	if(require('os').platform() !== "win32") console.log(chalk.red.bold(`AVERTISSEMENT : `) + chalk.red(`Votre OS (${chalk.blue(require('os').platform())}) n'est pas entièrement supporté par CliInstaller.`))

	// Dire que le serveur est démarrer
	console.log(`Serveur web démarré sur le port ${serv.address().port}`);

	// Vérifier si git/npm est installé
	if(!commandExistsSync('git')){
		console.log(chalk.red("Git n'est pas installé sur cet appareil, cette commande est nécessaire pour installer certains CLI."))
		server.close()
		return process.exit()
	}
	if(!commandExistsSync('npm')){
		console.log(chalk.red("NPM n'est pas installé sur cet appareil, cette commande est nécessaire pour installer certains CLI."))
		server.close()
		return process.exit()
	}

	// Faire une commande pour démarrer la partie electron
	console.log("Ouverture de l'application...")
	child_process.exec(`node ${path.join(__dirname, 'node_modules', 'electron','cli.js')} ${path.join(__dirname,'electron.js')}`, (err, stdout, stderr) => {
		if(stderr) return console.log(chalk.red("Erreur lors du lancement de l'application : ") + stderr + chalk.red("Tenter d'installer electron (") + chalk.cyan("npm i electron") + chalk.red(") et de relancer. Vous pouvez également aller sur http://localhost:3000 via votre navigateur."))
		if(err) return console.log(chalk.red("Erreur lors du lancement de l'application : ") + err + chalk.red("Tenter d'installer electron (") + chalk.cyan("npm i electron") + chalk.red(") et de relancer. Vous pouvez également aller sur http://localhost:3000 via votre navigateur."))
	});
});
*/
