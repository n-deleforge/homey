// =================================================
// =================================================
// ============ CORE VARIABLES

let SETTINGS;
const _VERSION = 1.8;
const _GITHUB = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const _HOME = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">nd</a>";
const _MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const _FRENCH = {
    'startTitle': "Bienvenue sur Homey !",
    'startP1': "En utilisant Homey, tu confirmes avoir pris connaissance que des données seront stockées sur ton appareil. Cependant, aucune donnée n'est partagée avec un tiers.",
    'startP2': "Si c'est ta première visite alors tu peux démarrer l'application.",
    'startP3': "Mais si tu as déjà utilisé l'application, tu peux importer tes paramètres.",
    'startApp': "Démarrer",
    'importConfirm': "Importer",
    'profileTitle': "🙂 Profil",
    'profileLabel': "Prénom",
    'profileConfirm': "Appliquer",
    'weatherTitle': "⛅ Météo",
    'weatherAPILabel': "Clé API",
    'weatherTownLabel': "Ville",
    'weatherConfirm': "Appliquer",
    'backgroundTitle': "🖼️ Fond d'écran",
    'backgroundLabel': "Image (JPG, PNG)",
    'backgroundConfirm': "Appliquer",
    'backgroundDelete': "Supprimer",
    'preferenceTitle' : "⭐ Préférences",
    'preferenceNameLabel' : "Afficher message et prénom",
    'preferenceDateLabel' : "Afficher la date complète",
    'setupTitle': "🔧 Paramètres",
    'switchTheme': "🌈 Thème classique",
    'customTheme': "🌈 Thème personnalisé",
    'exportData': "📲 Faire une sauvegarde",
    'logout': "🚫 Déconnexion",
    'footer': "Disponible sur " + _GITHUB + " (v " + _VERSION + ") - Hébergé sur  " + _HOME,
    'dateLanguage': "fr-FR",
    'weatherLanguage': "FR",
    'errorImport': "Le fichier est incorrect. Réessayer.",
    'logoutText': "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
    'backupText': "Cette action va enregistrer un fichier 'homey.json' sur votre appareil, qui contient toutes vos données.",
    'backgroundText' : "Cette action va supprimer votre fond d'écran personnalisé.",
    'welcomeDay': "Bonjour",
    'welcomeNight': "Bonsoir"
};
const _ENGLISH = {
    'startTitle': "Welcome to Homey !",
    'startP1': "By using Homey, you confirm that you are aware that data will be stored on your device. However, no data is shared with a third party.",
    'startP2': "If it's your first visit then you start the application.",
    'startP3': "But if you already have used the application, you can import your settings.",
    'startApp': "Start",
    'importConfirm': "Confirm",
    'profileTitle': "🙂 Profile",
    'profileLabel': "Name",
    'profileConfirm': "Confirm",
    'weatherTitle': "⛅ Weather",
    'weatherAPILabel': "API OpenWeather",
    'weatherTownLabel': "Town",
    'weatherConfirm': "Confirm",
    'backgroundTitle': "🖼️ Wallpaper",
    'backgroundLabel': "Picture (JPG, PNG)",
    'backgroundConfirm': "Confirm",
    'backgroundDelete': "Delete",
    'preferenceTitle' : "⭐ Preferences",
    'preferenceNameLabel' : "Display message and name",
    'preferenceDateLabel' : "Display the complete date",
    'setupTitle': "🔧 Settings",
    'switchTheme': "🌈 Classic theme",
    'customTheme': "🌈 Custom theme",
    'exportData': "📲 Make a backup",
    'logout': "🚫 Logout",
    'footer': "Available on " + _GITHUB + " (v " + _VERSION + ") - Hosted on " + _HOME,
    'dateLanguage': "en-EN",
    'weatherLanguage': "EN",
    'errorImport': "The file is incorrect. Try again.",
    'logoutText': "This action will delete all the data of the application.",
    'backupText': "This action is gonna save a file 'homey.json' on your device, which contain all your data.",
    'backgroundText' : "This action will delete your custom wallpaper.",
    'welcomeDay': "Good morning",
    'welcomeNight': "Good evening"
};

// =================================================
// =================================================
// ============ CORE INITIALISATION

// Correct the bug with viewport on mobile
if (_MOBILE) get("#container").style.minHeight = window.innerHeight + 'px';

// Create the settings data or parse them if it already exists
if (!storage("get", "HOMEY-settings")) {
    SETTINGS = {
        'core': {
            'start': false,
            'version': _VERSION
        },
        'profile': {
            'name': '',
            'displayName': true,
            'displayDate': true,
        },
        'weather': {
            'api': '',
            'town': '',
        },
        'style' : {
            'theme' : 'classic',
            'background': ''
        }
    }
    storage("set", "HOMEY-settings", JSON.stringify(SETTINGS));
}
else SETTINGS = JSON.parse(storage("get", "HOMEY-settings"));

// Determine the language of the application
const _CONTENT = (navigator.language == "fr" || navigator.language == "fr-FR") ? _FRENCH : _ENGLISH;
let names = Object.keys(_CONTENT);
let values = Object.values(_CONTENT);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) get("#" + names[i]).innerHTML = values[i];
}