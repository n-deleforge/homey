// =================================================
// ============ CORE VARIABLES

let settings;
const _version = "1.9.9";
const _github = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const _home = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">ND</a>";
const _mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

const _french = {
    'profileTitle': "🙂 Profil",
    'profileLabel': "Prénom",
    'profileConfirm': "🔻 Appliquer",
    'weatherTitle': "⛅ Météo",
    'weatherAPILabel': "Clé API",
    'weatherTownLabel': "Ville",
    'weatherConfirm': "🔻 Appliquer",
    'backgroundTitle': "🖼️ Fond d'écran",
    'backgroundLabel': "Image (JPG, PNG)",
    'backgroundConfirm': "🔻 Appliquer",
    'backgroundDelete': "❌ Supprimer",
    'preferenceTitle' : "⭐ Préférences",
    'preferenceNameLabel' : "Afficher le message",
    'preferenceDateLabel' : "Afficher la date",
    'preferenceWeatherLabel' : "Afficher la météo",
    'preferenceBackgroundLabel' : "Assombir le fond d'écran",
    'themeTitle': "🎨 Couleurs",
    'color1Label' : "Couleur du texte",
    'color2Label' : "Couleur d'accent",
    'color3Label' : "Fond du menu",
    'color4Label' : "Fond de l'application",
    'themeConfirm': "🔻 Appliquer",
    'themeReset': "❌ Réinitialiser",
    'importTitle': "💾 Restauration",
    'importLabel' : "Fichier de sauvegarde",
    'importConfirm': "🔺 Importer",
    'otherSettingsTitle' : "🔩 Autres",
    'exportData': "📲 Sauvegarde",
    'logout': "🚫 Déconnexion",
    'footer': "Disponible sur " + _github + " (v " + _version + ") ©  " + _home,
    'dateLanguage': "fr-FR",
    'weatherLanguage': "FR",
    'welcomeDay': "Bonjour",
    'welcomeNight': "Bonsoir",
    'popupTitle' : "Attention !",
    'popupAccept' : "Confirmer",
    'popupCancel' : "Annuler",
    'popupLogout' : "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
    'popupBackup' : "Cette action va enregistrer un fichier 'homey.json' sur votre appareil, qui contient toutes vos données.",
    'popupResetTheme' : "Cette action va réinitialiser les couleurs initial de l'application",
    'popupBackground' : "Cette action va supprimer votre fond d'écran personnalisé.",
};

const _english = {
    'profileTitle': "🙂 Profile",
    'profileLabel': "Name",
    'profileConfirm': "🔻 Confirm",
    'weatherTitle': "⛅ Weather",
    'weatherAPILabel': "API OpenWeather",
    'weatherTownLabel': "Town",
    'weatherConfirm': "🔻 Confirm",
    'backgroundTitle': "🖼️ Wallpaper",
    'backgroundLabel': "Picture (JPG, PNG)",
    'backgroundConfirm': "🔻 Confirm",
    'backgroundDelete': "❌ Delete",
    'preferenceTitle' : "⭐ Preferences",
    'preferenceNameLabel' : "Display the message",
    'preferenceDateLabel' : "Display the date",
    'preferenceWeatherLabel' : "Display the weather",
    'preferenceBackgroundLabel' : "Darken the wallpaper",
    'themeTitle': "🎨 Colors",
    'color1Label' : "Text color",
    'color2Label' : "Accent color",
    'color3Label' : "Menu color",
    'color4Label' : "Application color",
    'themeConfirm': "🔻 Confirm",
    'themeReset': "❌ Reset",
    'importTitle': "💾 Restoration",
    'importLabel' : "Save file",
    'importConfirm': "🔺 Import",
    'otherSettingsTitle' : "🔩 Others",
    'exportData': "📲 Save",
    'logout': "🚫 Logout",
    'footer': "Available on " + _github + " (v " + _version + ") © " + _home,
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

// =================================================
// ============ CORE INITIALISATION

// Correct the bug with viewport on mobile
if (_mobile) get("#container").style.minHeight = window.innerHeight + 'px';

// Create the settings data or parse them if it already exists
if (!getStorage("HOMEY-settings")) {
    settings = {
        'core': {
            'start': false,
            'version': _version,
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
            'background': '',
            'darkenBackground' : false,
            'color1' : "#FFFFFF",
            'color2' : "#F08080",
            'color3' : "#000000",
            'color4' : "#262931"
        }
    }
    setStorage("HOMEY-settings", JSON.stringify(settings));
}
else settings = JSON.parse(getStorage("HOMEY-settings"));

// Determine the language of the application
const _content = (navigator.language == "fr" || navigator.language == "fr-FR") ? _french : _english;
let names = Object.keys(_content); let values = Object.values(_content);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) get("#" + names[i]).innerHTML = values[i];
}