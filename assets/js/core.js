// General variables
let settings;
const version = 1.6;
const GithubLink = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const ndLink = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">nd</a>";
const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// ===> Correct the bug with viewport on mobile
if (mobile) get("#container").style.minHeight = window.innerHeight + 'px';

// ===> Create the settings data or parse them if it already exists
if (storage("get", "HOMEY-settings")) settings = JSON.parse(storage("get", "HOMEY-settings"))
else {
    settings = {
        'core' : {'start' : false, 'version' : version},
        'profile' : {'name' : '', 'theme' : 'dark'},
        'weather' : {'api' : '','town' : ''}
    }

    storage("set", "HOMEY-settings", JSON.stringify(settings));
}

// ===> French translation
const FR = {
    'start' : {
        'startTitle' : "Bienvenue sur Homey !",
        'startP1' : "En utilisant Homey, tu confirmes avoir pris connaissance que des données seront stockées sur ton appareil. Cependant, aucune donnée n'est partagée avec un tiers.",
        'startP2' : "Si c'est ta première visite alors tu peux démarrer l'application.",
        'startP3' : "Mais si tu as déjà utilisé l'application, tu peux importer tes paramètres.",
        'startApp' : "Démarrer",
        'displayImportMenu' : "Importation"
    },
    'importMenu' : {
        'importMenuTitle' : "Importation",
        'importMenuLabel' : "Sauvegarde",
        'importMenuCheck' : "Le fichier de sauvegarde s'appellement normalement \"homey.json\".",
        'importMenuConfirm' : "Confirmer",
        'closeImportMenu' : "Annuler"
    },
    'listSettings' : {
        'settingsTitle' : "Paramètres",
        'setupTitle' : "Configuration",
        'displayProfilMenu' : "🙂 Profil",
        'displayWeatherMenu' : "⛅ Météo",
        'switchTheme' : "🌈 Changer de thème",
        'exportData' : "📲 Faire une sauvegarde",
        'displayLogoutMenu' : "🚫 Déconnexion",
        'footer' : "Disponible sur " + GithubLink + " (v " + version + ") - Hébergé sur  " + ndLink,
    },
    'logoutMenu' : {
        'logoutMenuTitle' : "Déconnexion",
        'logoutMenuText' : "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
        'logoutMenuConfirm' : "Confirmer",
        'closeLogoutMenu' : "Annuler"
    },
    'profileMenu' : {
        'profilMenuTitle' : "Profil",
        'profilMenuLabel' : "Prénom ou surnom",
        'profilMenuCheck' : "Ton prénom doit être composé entre 2 à 15 caractères.",
        'profilMenuConfirm' : "Appliquer",
        'closeProfileMenu' : "Annuler"
    },
    'weatherMenu' : {
        'weatherMenuTitle' : "Météo",
        'weatherMenuAPILabel' : "Clé API",
        'weatherMenuTownLebel' : "Ville",
        'weatherMenuCheck' : "Les deux champs sont nécessaires. OpenWeather fournit une clé API gratuitement.",
        'weatherMenuConfirm' : "Appliquer",
        'closeWeatherMenu' : "Annuler"
    },
    'misc' : {
        'dateLanguage' : "fr-FR",
        'weatherLanguage' : "FR",
        'errorImport' : "Le fichier est incorrect. Réessayer."
    }
};

// ===> English translation
const EN = {
    'start' : {
        'startTitle' : "Welcome to Homey !",
        'startP1' : "By using Homey, you confirm that you are aware that data will be stored on your device. However, no data is shared with a third party.",
        'startP2' : "If it's your first visit then you start the application.",
        'startP3' : "But if you already have used the application, you can import your settings.",
        'startApp' : "Start",
        'displayImportMenu' : "Import"
    },
    'importMenu' : {
        'importMenuTitle' : "Import",
        'importMenuLabel' : "Filesave",
        'importMenuCheck' : "The file is normally called \"homey.json\".",
        'importMenuConfirm' : "Confirm",
        'closeImportMenu' : "Cancel"
    },
    'listSettings' : {
        'settingsTitle' : "Settings",
        'setupTitle' : "Configuration",
        'displayProfilMenu' : "🙂 Profile",
        'displayWeatherMenu' : "⛅ Weather",
        'switchTheme' : "🌈 Switch theme",
        'exportData' : "📲 Make a backup",
        'displayLogoutMenu' : "🚫 Logout",
        'footer' : "Available on " + GithubLink + " (v " + version + ") - Hosted on " + ndLink,
    },
    'logoutMenu' : {
        'logoutMenuTitle' : "Deconnection",
        'logoutMenuText' : "This action will delete all the data of the application.",
        'logoutMenuConfirm' : "Confirm",
        'closeLogoutMenu' : "Cancel"
    },
    'profileMenu' : {
        'profilMenuTitle' : "Profile",
        'profilMenuLabel' : "Name or nickname",
        'profilMenuCheck' : "Your name must be composed between 2 to 15 characters.",
        'profilMenuConfirm' : "Confirm",
        'closeProfileMenu' : "Cancel"
    },
    'weatherMenu' : {
        'weatherMenuTitle' : "Weather",
        'weatherMenuAPILabel' : "API OpenWeather",
        'weatherMenuTownLebel' : "Town",
        'weatherMenuCheck' : "The two fields are required.",
        'weatherMenuConfirm' : "Confirm",
        'closeWeatherMenu' : "Cancel"
    },
    'misc' : {
        'dateLanguage' : "en-EN",
        'weatherLanguage' : "EN",
        'errorImport' : "The file is incorrect. Try again."
    }
};

// ===> Determine the language of the app
if (navigator.language == "fr" || navigator.language == "fr-FR") {
    display = FR;
    get("#htmlTag").lang = "fr";
}
else {
    display = EN;
    get("#htmlTag").lang = "en";
} 

// ===> Automatically fill all ID fields
for(let i = 0; i < Object.keys(display).length - 1; i++) {
    let allData = display[Object.keys(display)[i]];
        let idName = Object.keys(allData);
        let values = Object.values(allData);

        for (let j = 0; j < idName.length; j++) 
            get("#" + idName[j]).innerHTML = values[j];
}
