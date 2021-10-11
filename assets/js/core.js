// =================================================
// ============ CORE VARIABLES

const VERSION = "1.9.93";
const GITHUB = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const MOBILE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
let settings;

const FRENCH = {
    'profileTitle': "🙂 Profil",
    'profileLabel': "Prénom",
    'profileConfirm': "🔻 Appliquer",
    'weatherTitle': "⛅ Météo",
    'weatherAPILabel': "Clé API",
    'weatherTownLabel': "Ville",
    'weatherConfirm': "🔻 Appliquer",
    'backgroundTitle': "🖼️ Fond d'écran",
    'backgroundLabel': "Image (*.jpg, *.png)",
    'backgroundConfirm': "🔻 Appliquer",
    'backgroundDelete': "❌ Supprimer",
    'preferenceTitle' : "⭐ Préférences",
    'preferenceNameLabel' : "Afficher le message",
    'preferenceDateLabel' : "Afficher la date",
    'preferenceWeatherLabel' : "Afficher la météo",
    'preferenceBackgroundLabel' : "Assombir le fond d'écran",
    'colorTitle': "🎨 Couleurs",
    'color1Label' : "Couleur principale",
    'color2Label' : "Couleur accentuée",
    'color3Label' : "Fond de l'application",
    'colorConfirm': "🔻 Appliquer",
    'colorReset': "❌ Réinitialiser",
    'positionTitle' : "♻️ Positionnement",
    'importTitle': "💾 Restauration",
    'importLabel' : "Fichier de sauvegarde (*.json)",
    'importConfirm': "🔺 Importer",
    'otherSettingsTitle' : "🛠️ Options",
    'switchLanguage' : "🔄 Changer de langue",
    'exportData': "📲 Sauvegarde",
    'logout': "🚫 Déconnexion",
    'footer': "Disponible sur " + GITHUB + " (v " + VERSION + ") ©  2020",
    'dateLanguage': "fr-FR",
    'weatherLanguage': "FR",
    'welcomeDay': "Bonjour",
    'welcomeNight': "Bonsoir",
    'popupTitle' : "Information importante",
    'popupAccept' : "Confirmer",
    'popupCancel' : "Annuler",
    'popupLogout' : "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
    'popupBackup' : "Cette action va enregistrer un fichier 'homey.json' sur votre appareil, qui contient toutes vos données.",
    'popupResetColor' : "Cette action va réinitialiser les couleurs initial de l'application",
    'popupBackground' : "Cette action va supprimer votre fond d'écran personnalisé.",
};

const ENGLISH = {
    'profileTitle': "🙂 Profile",
    'profileLabel': "Name",
    'profileConfirm': "🔻 Confirm",
    'weatherTitle': "⛅ Weather",
    'weatherAPILabel': "API OpenWeather",
    'weatherTownLabel': "Town",
    'weatherConfirm': "🔻 Confirm",
    'backgroundTitle': "🖼️ Wallpaper",
    'backgroundLabel': "Picture (*.jpg, *.png)",
    'backgroundConfirm': "🔻 Confirm",
    'backgroundDelete': "❌ Delete",
    'preferenceTitle' : "⭐ Preferences",
    'preferenceNameLabel' : "Display the message",
    'preferenceDateLabel' : "Display the date",
    'preferenceWeatherLabel' : "Display the weather",
    'preferenceBackgroundLabel' : "Darken the wallpaper",
    'colorTitle': "🎨 Colors",
    'color1Label' : "Text color",
    'color2Label' : "Accent color",
    'color3Label' : "Application color",
    'colorConfirm': "🔻 Confirm",
    'colorReset': "❌ Reset",
    'positionTitle' : "♻️ Positioning",
    'importTitle': "💾 Restoration",
    'importLabel' : "Save file (*.json)",
    'importConfirm': "🔺 Import",
    'otherSettingsTitle' : "🛠️ Options",
    'switchLanguage' : "🔄 Switch language",
    'exportData': "📲 Save",
    'logout': "🚫 Logout",
    'footer': "Available on " + GITHUB + " (v " + VERSION + ") © 2020",
    'dateLanguage': "en-EN",
    'weatherLanguage': "EN",
    'welcomeDay': "Good morning",
    'welcomeNight': "Good evening",
    'popupTitle' : "Important information",
    'popupAccept' : "Confirm",
    'popupCancel' : "Cancel",
    'popupLogout' : "This action will delete all the data of the application.",
    'popupBackup' : "This action is gonna save a file 'homey.json' on your device, which contain all your data.",
    'popupResetColor' : "This action will reset the initial colors of the application.",
    'popupBackground' :  "This action will delete your custom wallpaper.",
};

const DEFAULT_VALUES = {
    'language' : "EN",
    'color1' : "#FFFFFF",
    'color2' : "#F08080",
    'color3' : "#262931"
}

// =================================================
// ============ CORE INITIALISATION

// Correct the bug with viewport on mobile
if (MOBILE) get("#container").style.minHeight = window.innerHeight + 'px';

// Create the settings data or parse them if it already exists
if (!getStorage("HOMEY-settings")) {
    settings = {
        'core': {
            'version': VERSION,
            'language' : DEFAULT_VALUES.language,
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
            'background': '',
            'darkenBackground' : false,
            'color1' : DEFAULT_VALUES.color1,
            'color2' : DEFAULT_VALUES.color2,
            'color3' : DEFAULT_VALUES.color3,
        }
    }
    setStorage("HOMEY-settings", JSON.stringify(settings));
}
else settings = JSON.parse(getStorage("HOMEY-settings"));

// Determine the language of the application
const CONTENT = (settings.core.language == "FR") ? FRENCH : ENGLISH;
let names = Object.keys(CONTENT); 
let values = Object.values(CONTENT);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) get("#" + names[i]).innerHTML = values[i];
}