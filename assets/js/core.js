// =================================================
// =================================================
// ============ CORE VARIABLES

let SETTINGS;
const _VERSION = 1.8;
const _GITHUB = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const _HOME = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">NDDev</a>";
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
    'preferenceNameLabel' : "Afficher le message",
    'preferenceDateLabel' : "Afficher la date",
    'preferenceWeatherLabel' : "Afficher la météo",
    'styleTitle': "🎨 Couleurs",
    'styleConfirm': "Appliquer",
    'styleReset': "Réinitialiser",
    'setupTitle': "🔧 Paramètres",
    'exportData': "📲 Faire une sauvegarde",
    'logout': "🚫 Déconnexion",
    'footer': "Disponible sur " + _GITHUB + " (v " + _VERSION + ") ©  " + _HOME,
    'dateLanguage': "fr-FR",
    'weatherLanguage': "FR",
    'errorImport': "Le fichier est incorrect. Réessayer.",
    'welcomeDay': "Bonjour",
    'welcomeNight': "Bonsoir",
    'popupTitle' : "Attention !",
    'popupAccept' : "Confirmer",
    'popupCancel' : "Annuler",
    'popupLogout' : "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
    'popupBackup' : "Cette action va enregistrer un fichier 'homey.json' sur votre appareil, qui contient toutes vos données.",
    'popupResetStyle' : "Cette action va réinitialiser le CSS initial de l'application",
    'popupBackground' : "Cette action va supprimer votre fond d'écran personnalisé.",
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
    'preferenceNameLabel' : "Display the message",
    'preferenceDateLabel' : "Display the date",
    'preferenceWeatherLabel' : "Display the weather",
    'styleTitle': "🎨 Colors",
    'styleConfirm': "Confirm",
    'styleReset': "Reset",
    'setupTitle': "🔧 Settings",
    'exportData': "📲 Make a backup",
    'logout': "🚫 Logout",
    'footer': "Available on " + _GITHUB + " (v " + _VERSION + ") © " + _HOME,
    'dateLanguage': "en-EN",
    'weatherLanguage': "EN",
    'errorImport': "The file is incorrect. Try again.",
    'welcomeDay': "Good morning",
    'welcomeNight': "Good evening",
    'popupTitle' : "Warning !",
    'popupAccept' : "Confirm",
    'popupCancel' : "Cancel",
    'popupLogout' : "This action will delete all the data of the application.",
    'popupBackup' : "This action is gonna save a file 'homey.json' on your device, which contain all your data.",
    'popupResetStyle' : "This action will reset the initial CSS of the application.",
    'popupBackground' :  "This action will delete your custom wallpaper.",
};
const _CSS = `/* MAIN */
/*  ======== */
--bodyBg: #262931;
--bodyText: white;
/*  ======== */

/* APPLICATION */
/*  ======== */
--timeText: lightcoral;
/*  ======== */

/* SETTINGS */
/*  ======== */
--settingsText: white;
--settingsBackground: black;
--settingsTitleBorder: lightcoral;
/*  ======== */

/* FOOTER */
/*  ======== */
--footerText: white;
--footerLink: lightcoral;
/*  ======== */

/*  BUTTONS */
/*  ======== */
--buttonText: black;
--buttonTextHover: white;
--buttonBg: white;
--buttonBgHover: lightcoral;
/*  ======== */

/* INPUT */
/*  ======== */
--labelText: white;
--inputText: black;
/* ^ also affects textarea */
--inputBorder: black;
--inputFileText: white;
--inputFileBorder: white;
/*  ======== */

/* UNCATEGORIZED */
/*  ======== */
--transparency: rgba(0,0,0,0.5);
/* ^ it is used for the app transparency with the menu / popup opened */
--errorText: red;
/*  ======== */`;

// =================================================
// =================================================
// ============ CORE INITIALISATION

// Correct the bug with viewport on mobile
if (_MOBILE) get("#container").style.minHeight = window.innerHeight + 'px';

// Create the settings data or parse them if it already exists
if (!getStorage("HOMEY-settings")) {
    SETTINGS = {
        'core': {
            'start': false,
            'version': _VERSION,
        },
        'profile': {
            'name': '',
            'displayName': true,
            'displayDate': true,
            'displayWeather': false,
        },
        'weather': {
            'api': '',
            'town': '',
        },
        'style' : {
            'css': _CSS,
            'background': '',
        }
    }
    setStorage("HOMEY-settings", JSON.stringify(SETTINGS));
}
else SETTINGS = JSON.parse(getStorage("HOMEY-settings"));

// Determine the language of the application
const _CONTENT = (navigator.language == "fr" || navigator.language == "fr-FR") ? _FRENCH : _ENGLISH;
let names = Object.keys(_CONTENT);
let values = Object.values(_CONTENT);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) get("#" + names[i]).innerHTML = values[i];
}