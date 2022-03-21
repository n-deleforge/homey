// =================================================
// ============ CORE VARIABLES

const VERSION = "1.9.93";
const GITHUB = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const FOOTER = "V. " + VERSION + " | © 2020-22 | " + GITHUB;
let _settings;

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
    'footer': FOOTER,
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
    'footer': FOOTER,
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
    'color1' : "#FFFFFF",
    'color2' : "#F08080",
    'color3' : "#262931"
}

// =================================================
// ============ CORE INITIALISATION

// Create the settings data or parse them if it already exists
if (!getStorage("HOMEY-settings")) {
    _settings = {
        'core': {
            'version': VERSION,
            'language' : "EN",
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
    setStorage("HOMEY-settings", JSON.stringify(_settings));
}
else {
    _settings = JSON.parse(getStorage("HOMEY-settings"));
}

// Setup content according language
const CONTENT = (_settings.core.language == "FR") ? FRENCH : ENGLISH;
Object.keys(CONTENT).forEach(key => {
    if (get("#" + key)) {
        get("#" + key).innerHTML = CONTENT[key];
    }
});

// Able to switch between French and English
if (get("#switchLanguage")) {
    get("#switchLanguage").addEventListener("click", () => {
        _settings.core.language = (_settings.core.language == "FR") ? "EN" : "FR";
        saveSettings();
        location.reload();
    });
}