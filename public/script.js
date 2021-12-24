// Crée un websocket
var socket = io();

// Préparer quelques variables
var checked = []
var installed = []
var installedA = []
var allCli = ["twitterminal","ecochat","hibercli","ip-info","rickdetect","hastecli","speedtest","crypterm"]

// Quand la page a fini de charger
window.onload = function(){
	// Enlever les commande déjà installées
	fetch('/alreadyInstalled').then(res => res.json()).then(list => {
		list.forEach(name => {
			document.getElementsByName(name)[0].disabled = true
			document.getElementsByName(`${name}P`)[0].insertAdjacentHTML('afterend', `<span id="${name}S" onclick="howUninstall()" class="bg-gray-600 hover:bg-gray-700 rounded-full px-2 font-bold text-sm leading-loose cursor-pointer">Déjà installé</span>`);

			allCli = allCli.filter(e => e !== name)
		})
	})

	// Quand une erreur est reçu par le websocket
	socket.on('error', error => {
		// Afficher un message
		document.getElementById("explication").innerHTML = error;
		document.getElementById("explication").classList.add("text-red-400")
		document.getElementById("explication").classList.remove("text-gray-400")
		document.getElementById("explication").classList.remove("text-green-400")

		// Ajouter à la console l'erreur
		console.log(error)

		// Si l'erreur est qu'aucun CLI n'est séléctionner
		if(error === "Vous devez sélectionner un ou plusieurs CLI à installer"){
			document.getElementById("installCLI").classList.remove("loading");

			allCli.forEach(name => {
				document.getElementsByName(name)[0].disabled = false
			})
		}

		// Repouvoir fermer la fenêtre (car sinon il va faire froid)
		document.getElementById("closeApp").classList.remove("hidden")
	});

	// Progression de l'installation (websocket)
	socket.on('installProgress', message => {
		// Afficher un message
		document.getElementById("explication").innerHTML = message;
		document.getElementById("explication").classList.remove("text-red-400")
		document.getElementById("explication").classList.remove("text-green-400")
		document.getElementById("explication").classList.add("text-gray-400")
	});

	// Installation terminé (websocket)
	socket.on('installProgressFinished', message => {
		// Afficher un message
		document.getElementById("explication").innerHTML = message.split("~~")[0];
		document.getElementById("explication").classList.remove("text-red-400")
		document.getElementById("explication").classList.remove("text-gray-400")
		document.getElementById("explication").classList.add("text-green-400")

		// Modifier la checkbox
		document.getElementsByName(`${message.split("~~")[1]}P`)[0].insertAdjacentHTML('afterend', `<span class="bg-gray-600 hover:bg-gray-700 rounded-full px-2 font-bold text-sm leading-loose cursor-pointer">Installation terminée</span>`);
		document.getElementsByName(message.split("~~")[1])[0].checked = false;
		document.getElementsByName(message.split("~~")[1])[0].disabled = true;

		// Ajouter à la liste des CLI installés
		installed.push(message.split("~~")[1])
		installedA.push(message.split("~~")[1])

		// Si il y a autant d'installé que de cocher, le téléchargement des CLI est terminé !
		if(installed.length === checked.length){
			// Modifier un message
			document.getElementById("installCLI").classList.remove("loading");
			document.getElementById("explication").innerHTML = "Installation terminée !";
			document.getElementById("explication").classList.add("text-green-400")
			document.getElementById("explication").classList.remove("text-gray-400")
			document.getElementById("explication").classList.remove("text-red-400")

			// Repouvoir fermer la fenêtre (trop de courant d'air sinon)
			document.getElementById("closeApp").classList.remove("hidden")

			// Réactiver les checkbox de CLI non installées
			allCli.forEach(name => {
				if(!installedA.includes(name)){
					document.getElementsByName(name)[0].disabled = false
				}
			})

			// Vider la liste des CLI installées
			installed = []
			checked = []
		}
	});
}


// Fonction pour installer les CLI
async function installCLI(){
	// Obtenir la liste des CLI à installer
	allCli.forEach(name => {
		if(document.getElementsByName(name)[0].checked) checked.push(name);
		document.getElementsByName(name)[0].disabled = true
	})

	// Ajouter un icône de chargement au bouton
	document.getElementById("installCLI").classList.add("loading")

	// Masquer le bouton pour fermer l'app
	document.getElementById("closeApp").classList.add("hidden")

	// Envoyer un message via le websocket pour installer les CLI
	socket.emit('installCLI', checked)
}

// Fonction pour ouvrir une page web
async function openWebPage(url){
	// Envoyer un message via le websocket
	socket.emit('openWebPage', url);
}

// Fonction pour afficher des informations sur la désinstallation
function howUninstall(){
	// Modifier les explications
	document.getElementById("explication").classList.remove("text-green-400")
	document.getElementById("explication").classList.add("text-gray-400")
	document.getElementById("explication").classList.remove("text-red-400")
	document.getElementById("explication").innerHTML = `<b>Désinstaller un CLI :</b><br><ul><li>Twitterminal, Ecochat, HiberCLI, IP-Info :<br><a href="https://text.johanstickman.com/v/112-g396VZV7ZjU5VTaU" target="_blank" class="underline">Guide de désinstallation</a><li><br><li>Rickdetect, Haste<strike>CLI</strike>, Speedtest<strike>CLI</strike>, Crypterm :<br><a onclick="navigator.clipboard.writeText('npm unlink &lt;nom&gt -g && rm {pwd}/&lt;nom&gt -r -Force')" href="javascript:void(0)" class="underline">Copier la commande</a></li></ul>`;
}

// Fonction pour forcer une installation malgré qu'un CLI soit déjà installé
function forceInstall(){
	fetch('/alreadyInstalled').then(res => res.json()).then(list => {
		list.forEach(name => {
			document.getElementsByName(name)[0].disabled = false
			document.getElementById(`${name}S`)?.remove()

			allCli.push(name)
		})

		return console.log("Opération réussie !");
	})
}

// Commande pour avoir le chemin de CliInstaller
function path(){
	return console.log("Chemin utilisé par CliInstaller :\n    {pwd}".replace("InstalledCLI",""));
}

// Commande pour avoir des informations sur CliInstaller
function help(){
	console.log(`Code à 99.9% fait par (https://johanstickman.com) Johan le stickman (Code de CliInstaller, les CLI en eux même)`);
	console.log(`Liste des CLI installable :\n    - Twitterminal (via NPM, "twitterminal")\n    - Ecochat (via NPM, "ecochat-term")\n    - HiberCLI (via NPM, "hibercli")\n    - IP-Info (via NPM, "@johanstickman/ip-info")\n    - Rickdetect (via GitHub, johan-perso/rickdetect)\n    - HasteCLI (via GitHub, johan-perso/hastecli)\n    - SpeedtestCLI (via GitHub, johan-perso/speedtest)\n    - Crypterm (via GitHub, johan-perso/crypterm)`);
	return console.log(`Liste des commandes via les DevTools :\n    - forceInstall() : permet l'installation des CLI déjà installées\n    - path() : affiche le chemin de CliInstaller\n    - help() : affiche des informations sur CliInstaller`);
}

// Un easter egg 🙃
function guiIsBetter(){
	return new Promise((resolve, reject) => {
		setTimeout(() => { console.log("GUI > CLI ??????")}, 500)
		setTimeout(() => { console.log("D'accord, la suppression de votre appareil est en cours...") }, 900)
		setTimeout(() => { console.log("Opération réussie !") }, 5000)
		setTimeout(() => { window.close() }, 6500)
		setTimeout(() => { resolve("roooh, ce n'est qu'une petite boutade :)") }, 6500)
	})
}

// Encore un autre 🙃🙃🙃
new Konami(function() { 
	alert("forceInstall....")
	forceInstall()
});