// =================================================
// =================================================
// ============ CORE VARIABLES

let SETTINGS;
const _VERSION = "1.9.5";
const _GITHUB = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const _HOME = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">ForgeCode</a>";
const _MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const _FRENCH = {
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
    'cssTitle': "🎨 Couleurs",
    'cssConfirm': "Appliquer",
    'cssReset': "Réinitialiser",
    'importTitle': "💾 Restauration",
    'importText': "Si vous importez un fichier de configuration, vos données actuelles seront effacées et l'application sera redémarrée.",
    'importConfirm': "Importer",
    'exportData': "📲",
    'logout': "🚫",
    'footer': "Disponible sur " + _GITHUB + " (v " + _VERSION + ") ©  " + _HOME,
    'dateLanguage': "fr-FR",
    'weatherLanguage': "FR",
    'welcomeDay': "Bonjour",
    'welcomeNight': "Bonsoir",
    'popupTitle' : "Attention !",
    'popupAccept' : "Confirmer",
    'popupCancel' : "Annuler",
    'popupLogout' : "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
    'popupBackup' : "Cette action va enregistrer un fichier 'homey.json' sur votre appareil, qui contient toutes vos données.",
    'popupResetCSS' : "Cette action va réinitialiser le CSS initial de l'application",
    'popupBackground' : "Cette action va supprimer votre fond d'écran personnalisé.",
};
const _ENGLISH = {
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
    'cssTitle': "🎨 Colors",
    'cssConfirm': "Confirm",
    'cssReset': "Reset",
    'importTitle': "💾 Restoration",
    'importText': "If you import a config file, your actual data will be deleted and the app is gonna be reset.",
    'importConfirm': "Import",
    'exportData': "📲",
    'logout': "🚫",
    'footer': "Available on " + _GITHUB + " (v " + _VERSION + ") © " + _HOME,
    'dateLanguage': "en-EN",
    'weatherLanguage': "EN",
    'welcomeDay': "Good morning",
    'welcomeNight': "Good evening",
    'popupTitle' : "Warning !",
    'popupAccept' : "Confirm",
    'popupCancel' : "Cancel",
    'popupLogout' : "This action will delete all the data of the application.",
    'popupBackup' : "This action is gonna save a file 'homey.json' on your device, which contain all your data.",
    'popupResetCSS' : "This action will reset the initial CSS of the application.",
    'popupBackground' :  "This action will delete your custom wallpaper.",
};
const _CSS = `/* main css */
--bodyBg: #262931;
--bodyText: white;

/* ======== */

/* widgets style */
--timeText: lightcoral;
--dateText: white;
--weatherText: white;
--welcomeText: white;
--nameText: white;

/* ======== */

/* settings style */
--settingsText: white;
--settingsBackground: black;
--settingsTitleBorder: lightcoral;

/* ======== */

/* footer style */
--footerText: white;
--footerLink: lightcoral;

/* ======== */

/*  buttons style */
--buttonText: black;
--buttonTextHover: white;
--buttonBg: white;
--buttonBgHover: lightcoral;

/* ======== */

/* input style */
--labelText: white;
--inputText: black;
--inputBorder: black;
--inputFileText: white;
--inputFileBorder: white;

/* ======== */

/* uncategorized */
--transparency: rgba(0,0,0,0.5);
--errorText: red;`;


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
            'displayName': false,
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