// General variables
let settings;
const version = 1.5;
const GithubLink = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const ndLink = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">nd</a>";
const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

// ===> Correct the bug with viewport on mobile
if (mobile) get("#container").style.minHeight = window.innerHeight + 'px';

// ===> Create the settings data or parse them if it already exists
if (storage("get", "HOMEY-settings")) settings = JSON.parse(storage("get", "HOMEY-settings"))
else {
    settings = {
        'core' : {'start' : false, 'version' : 1.2},
        'profile' : {'name' : '', 'theme' : 'dark'},
        'weather' : {'activated' : '','api' : '','town' : ''}
    }

    storage("set", "HOMEY-settings", JSON.stringify(settings));
}

// ===> French translation
const FR = {
    'start' : {
        'startTitle' : "Bienvenue sur Homey !",
        'startP1' : "Avant tout, sache que si tu utilises cette application, certaines de tes données seront stockées sur ton appareil (et UNIQUEMENT sur ton appareil).<br />En utilisant Homey, tu confirmes avoir pris connaissance de ce fait. Aucune donnée n'est partagée avec un tiers.",
        'startP2' : "Si c'est ta première visite alors il faut configurer l'appli. Cela ne prendra que quelques secondes.",
        'startP3' : "Par contre, si tu as déjà utilisé l'application, tu peux importer tes données.",
        'displayInitMenu' : "Configuration",
        'displayImportMenu' : "Importation"
    },
    'initMenu' : {
        'initMenuTitle' : "Initialisation",
        'initMenuLabel' : "Prénom / surnom",
        'initMenuCheck' : "Ton prénom doit être composé entre 2 à 15 caractères.",
        'confirmInitMenu' : "Confirmer",
        'closeInitMenu' : "Annuler"
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
        'displayProfilMenu' : "🙂 Profil",
        'displayWeatherMenu' : "⛅ Météo",
        'switchTheme' : "🌈 Changer de thème",
        'exportData' : "📲 Sauvegarde des paramètres",
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
        'profilMenuLabel' : "Prénom / surnom",
        'profilMenuCheck' : "Ton prénom doit être composé entre 2 à 15 caractères.",
        'profilMenuConfirm' : "Appliquer et fermer"
    },
    'weatherMenu' : {
        'weatherMenuTitle' : "Météo",
        'weatherMenuActivate' : "Activer",
        'weatherMenuAPILabel' : "Clé API",
        'weatherMenuTownLebel' : "Ville",
        'weatherMenuCheck' : "Les deux champs sont nécessaires. OpenWeather fournit une clé API gratuitement.",
        'weatherMenuConfirm' : "Appliquer et fermer"
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
        'startP1' : "Before anything else, you have to know that if you use this application, some of your data will be saved on your device (and ONLY on your device).<br /> In using Homey, your confirm that you understand and agree of that. No data is shared with a third party.",
        'startP2' : "If it's your first visit then you need to configure the application. It will only take a few seconds.",
        'startP3' : "However, if you already have used the application, you can import your data.",
        'displayInitMenu' : "Configure",
        'displayImportMenu' : "Import"
    },
    'initMenu' : {
        'initMenuTitle' : "Start",
        'initMenuLabel' : "Name / nickname",
        'initMenuCheck' : "Your name must be composed between 2 to 15 characters.",
        'confirmInitMenu' : "Confirm",
        'closeInitMenu' : "Cancel"
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
        'displayProfilMenu' : "🙂 Profile",
        'displayWeatherMenu' : "⛅ Weather",
        'switchTheme' : "🌈 Switch theme",
        'exportData' : "📲 Backup settings",
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
        'profilMenuLabel' : "Name / nickname",
        'profilMenuCheck' : "Your name must be composed between 2 to 15 characters.",
        'profilMenuConfirm' : "Confirm and close"
    },
    'weatherMenu' : {
        'weatherMenuTitle' : "Weather",
        'weatherMenuActivate' : "Activate",
        'weatherMenuAPILabel' : "API OpenWeather",
        'weatherMenuTownLebel' : "Town",
        'weatherMenuCheck' : "The two fields are required.",
        'weatherMenuConfirm' : "Confirm and close"
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
