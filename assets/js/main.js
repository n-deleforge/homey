// =================================================
// =================================================
// ============ INIT

const version = 1.5; // the actual version of the app
const GithubLink = "<a href=\"https://github.com/n-deleforge/homey\" target=\"_blank\">GitHub</a>";
const ndLink = "<a href=\"https://nicolas-deleforge.fr\" target=\"_blank\">nd</a>";

// ===> Correct the bug with viewport on mobile
if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) get("#container").style.minHeight = window.outerHeight + 'px';

// ===> Create the settings data or parse them if it already exists
if (storage("get", "HOMEY-settings")) settings = JSON.parse(storage("get", "HOMEY-settings"))
else {
    settings = {
        'core' : {'start' : false, 'version' : 1.2},
        'profile' : {'name' : '', 'theme' : 'dark'},
        'weather' : {'activated' : '','api' : '','town' : ''},
        'note' : {'activated' : false, 'content' : ''}
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
        'displayAppsMenu' : "🧩 Applications",
        'switchTheme' : "🌈 Changer de thème",
        'exportData' : "📲 Exportation des données",
        'displayLogoutMenu' : "🚫 Déconnexion"
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
    'appsMenu' : {
        'appsMenuTitle' : "Applications",
        'appsMenuContent' : "Vous pouvez activer ou désactiver les applications.",
        'appsMenuLabelNotes' : "Notes",
        'closeAppsMenu' : "Appliquer et fermer"
    },
    'misc' : {
        'footer' : "Disponible sur " + GithubLink + " (v " + version + ") - Hébergé sur  " + ndLink
    },
    'etc' : { // is not concerned by the function of displaying content
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
        'displayAppsMenu' : "🧩 Applications",
        'switchTheme' : "🌈 Switch theme",
        'exportData' : "📲 Export data",
        'displayLogoutMenu' : "🚫 Logout"
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
    'appsMenu' : {
        'appsMenuTitle' : "Applications",
        'appsMenuContent' : "You can activate or desactive apps here.",
        'appsMenuLabelNotes' : "Notes",
        'closeAppsMenu' : "Confirm and close"
    },
    'misc' : {
        'footer' : "Available on " + GithubLink + " (v " + version + ") - Hosted on " + ndLink,
        'noteTitle' : "My notes"
    },
    'etc' : { // is not concerned by the function of displaying content
        'dateLanguage' : "en-EN",
        'weatherLanguage' : "EN",
        'errorImport' : "The file is incorrect. Try again."
    }
};

// ===> Will determine the language of the app
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
    for (let j = 0; j < idName.length; j++) get("#" + idName[j]).innerHTML = values[j];
}

// =================================================
// =================================================
// ============ START

// ===> Check if the app can be displayed or not
if (settings.core.start == false) {
    get("#start").style.display = "flex";
    for(let i = 0; i < get("~input").length; i ++) get("~input")[i].value = "";
    for(let i = 0; i < get("~textarea").length; i ++) get("~textarea")[i].value = "";
}
else {
    displayApp();
    displayWeatherInfo();
}

// ===> Initialization menu
get("#displayInitMenu").addEventListener("click", function() {
    openWindow("initMenu");
    get("#closeInitMenu").addEventListener("click", closeWindow);

    get("#confirmInitMenu").addEventListener("click", function() {
        if (get("#name").checkValidity() && get("#name").value != "") {
            // Check of the regex and if it's correct, update of the object
            settings.core.start = true;
            settings.profile.activated = true; 
            settings.profile.name = get("#name").value;
            updateJSON();
            displayApp();
            displayWeatherInfo();
            closeWindow();
        }
        else get("#initMenuCheck").style.color = "red";
    })
})

// ===> Import menu
get("#displayImportMenu").addEventListener("click", function() {
    openWindow("importMenu");
    get("#closeImportMenu").addEventListener("click", closeWindow);

    get("#importMenuConfirm").addEventListener("click", function() {
        if (get("#importData").files.length != 0) {
            // Check if the file input is not empty
            let reader = new FileReader();
            reader.readAsText(get("#importData").files[0]);
            reader.onload = function (e) {
                // Get the data of the save
                let importData = (atob(e.target.result));
                settings = JSON.parse(importData);

                // Then upload it locally and reload the app
                updateJSON();
                location.reload();
            }
        }
        else {
            get("#importMenuCheck").innerHTML =  display.etc.errorImport;
            get("#importMenuCheck").style.color =  "red";
        }
    })
})

// =================================================
// =================================================
// ============ BUTTONS

// ===> Button - open settings menu
get("#displaySettings").addEventListener("click", function() {
    closeWindow();
    displayNoteApp("forceClose");
    get("#displaySettings").style.display = "none";
    get('#listSettings').style.animation = "fadeInRight";
    get('#listSettings').style.animationDuration = "0.5s";
    get("#listSettings").style.display = "flex";
}) 

// ===> Button - close settings menu
get("#closeSettings").addEventListener("click", function() {
    get("#displaySettings").style.display = "block";
    get("#listSettings").style.display = "none";
})

// ===> Button - note app
get("#displayNote").addEventListener("click", displayNoteApp);

// ===> Button - export data
get("#exportData").addEventListener("click", function() {
    download(btoa(JSON.stringify(settings)), "homey.json");
});

// ===> Button - theme switch
get("#switchTheme").addEventListener("click", switchTheme);

// =================================================
// =================================================
// ============ APPS

// ===> Apps menu
get("#displayAppsMenu").addEventListener("click", function() {
    openWindow("appsMenu");
    get("#closeAppsMenu").addEventListener("click", closeWindow);

    get("#activateNote").addEventListener("click", function() {
        if (get('#activateNote').checked == true) settings.note.activated = true
        else settings.note.activated = false;
        updateJSON();
        displayApp();
     });

     get("#activateTheme").addEventListener("click", function() {
        if (get('#activateTheme').checked == true) settings.theme.activated = true
        else settings.theme.activated = false;
        updateJSON();
        displayApp();
     });
})

// ===> Logout menu
get("#displayLogoutMenu").addEventListener("click", function() {
    openWindow("logoutMenu");
    get("#closeLogoutMenu").addEventListener("click", closeWindow);

    get("#logoutMenuConfirm").addEventListener("click", function() {
        storage("rem", "HOMEY-settings");
        location.reload(); 
    });
});

// ===> Profile menu
get("#displayProfilMenu").addEventListener("click", function() {
    openWindow("profilMenu");
    get("#newName").value = settings.profile.name;

    get("#profilMenuConfirm").addEventListener("click", function() {
        // Check the regex for the name
        if (get("#newName").checkValidity() && get("#newName").value != "") {
            get("#profilMenuCheck").style.color = "white";
            settings.profile.name = get("#newName").value;

            updateJSON();
            displayApp();
            closeWindow();
        }
        else get("#profilMenuCheck").style.color = "red";
    })
});

// ===> Weather menu
get("#displayWeatherMenu").addEventListener("click", function() {
    openWindow("weatherMenu");

    get('#weatherMenuAPIValue').addEventListener("input", function() { 
        settings.weather.api = get('#weatherMenuAPIValue').value;
        updateJSON();
    })

    get('#weatherMenuTownValue').addEventListener("input", function() { 
        settings.weather.town = get('#weatherMenuTownValue').value;
        updateJSON();
    })

    get("#weatherMenuConfirm").addEventListener("click", function() {
        if (settings.weather.activated == true) {
            // Check if the inputs are not empty before the try to request the weather
            if (settings.weather.api != "" && settings.weather.town != "") {
                get("#weatherMenuCheck").style.color = "white";
                displayWeatherInfo();
                closeWindow();  
            }
            else get("#weatherMenuCheck").style.color = "red";
        }
        else {
            settings.weather.activated = false;
            updateJSON();
            displayWeatherInfo();
            closeWindow();
        } 
    });

    get('#activateWeather').addEventListener("change", function() {
        if (get('#activateWeather').checked == true) settings.weather.activated = true
        else settings.weather.activated = false;
        updateJSON();
        displayApp();
    })
});

// =================================================
// =================================================
// ============ MAIN FUNCTIONS

// ===> Display the application
function displayApp() {
    // Main action
    document.title = "HOMEY - " + settings.profile.name; // Change the name of the app
    displayTime(); setInterval(displayTime, 60000); // Update the hour and the date every 60 secondes
    get("#start").style.display = "none";
    get("#app").style.display = "flex";

    // Display of the theme
    if (settings.profile.theme == "dark") displayTheme("dark");
    else if (settings.profile.theme == "light") displayTheme("light");

    // Display of the weather menu
    if (settings.weather.api != "") get('#weatherMenuAPIValue').value = settings.weather.api;
    if (settings.weather.town != "") get('#weatherMenuTownValue').value = settings.weather.town;

    // Display of the weather app
    if (settings.weather.activated == true) {
        get('#activateWeather').checked = true;
        get('#weatherMenuAPI').style.display = "flex";
        get('#weatherMenuTown').style.display = "flex";
        get('#weatherMenuCheck').style.display = "block";
    }
    else {
        get('#activateWeather').checked = false;
        get('#weatherMenuAPI').style.display = "none";
        get('#weatherMenuTown').style.display = "none";
        get('#weatherMenuCheck').style.display = "none";
    }

    // Display of apps menu
    // => Notes
    if (settings.note.activated == true) {
        get('#activateNote').checked = true;
        get("#displayNote").style.display = "block";
    }
    else {
        get('#activateNote').checked = false;
        get("#displayNote").style.display = "none";
    }

    //  Display of the note app
    get('#noteContainer').style.visibility = "hidden";
}

// ===> Display the hour and date
function displayTime() {
    let timestamp = new Date(); // Create a datetime object
    let date = timestamp.toLocaleString(display.etc.dateLanguage, {weekday: "long", month: "long", day: "numeric"}); // Settings for the date
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes(); 
    if (hours < 10) hours = '0' + hours; // Always two digits for hour
    if (minutes < 10) minutes = '0' + minutes; // Always two digits for minutes
    get("#displayTime").innerHTML = hours + ":" + minutes;
    get("#displayDate").innerHTML = date;
}

// =================================================
// =================================================
// ============ WEATHER

// ===> Display the weather with refresh
function displayWeatherInfo() {
    if (settings.weather.activated == true && settings.weather.api != "" && settings.weather.town != "") {
        requestWeather();
        setInterval(requestWeather, 1800000); // Request the weather every 30 minutes
    }
    else get('#displayWeather').innerHTML = "";
}

// ===> Request to OpenWeather
function requestWeather() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {

        // If the request is correct and valid
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) { 
                let data = JSON.parse(this.responseText);
                console.log("Weather requested")
                let timestamp = new Date();
                let logo;

                if (timestamp.getHours() < 7 || timestamp.getHours() > 19) logo = "🌙";
                else {
                    switch(data.weather[0].main) {
                        case 'Thunderstorm' : logo = "🌩";
                        case 'Drizzle' : logo = "🌨";
                        case 'Rain' : logo = "🌧";
                        case 'Snow' : logo = "🌨";
                        case 'Atmosphere' : logo = "🌪";
                        case 'Clear' : logo = "☀";
                        case 'Clouds' : logo = "⛅";
                    }
                }

                get('#displayWeather').innerHTML = logo + " " + Math.round(data.main.temp) + " <sup>°c</sup>";
            }  
        }

        // If there is an error
        else get('#displayWeather').innerHTML = "❗"; 
    };

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + settings.weather.town + '&appid=' + settings.weather.api + '&lang=' + display.etc.weatherLanguage +'&units=metric', true)
    req.send(null);
}

// =================================================
// =================================================
// ============ APPS DISPLAY

// ===> Modify the display
function changeDisplay(mode) {
    if (mode == "app") {
        // In app mode, time and date goes to the top with a smaller size
        get("#time").style.justifyContent = "flex-start";
        get("#time").style.fontSize = "1em";
        get("#time").style.flexGrow = "0";
        get("#containerApps"). style.display = "flex";
        get("#containerApps"). style.flexGrow = "1";

        // If on mobile and weather activated, hide it for the noteapp
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && settings.weather.activated == true) get("#displayWeather").style.display = "none";
    }
    else {
        // In normal mode, time and date goes to the center of the page
        get("#time").style.justifyContent = "center";
        get("#time").style.fontSize = "2em";
        get("#time").style.flexGrow = "1";
        get("#containerApps"). style.display = "none";
        get("#containerApps"). style.flexGrow = "0";

        // If on mobile and weather activated, hide it for the noteapp
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) && settings.weather.activated == true) get("#displayWeather").style.display = "block";
    }
}

// ===> Display or hide the app note
function displayNoteApp(mode) {
    // If there is saved content, then display it into the note
    if (settings.note.content != "") get('#note').value = settings.note.content;

    // Add a listener into the textarea and save the content for any change
    get('#note').addEventListener("change", function() { 
        settings.note.content = get("#note").value; 
        updateJSON();
    });

    // Normal behaviour or force close the app
    if (mode == "forceClose") {
        changeDisplay("normal"); // Normal  mode
        get('#noteContainer').style.visibility = "hidden";
    }
    else {
        if (get('#noteContainer').style.visibility == "hidden") {
            changeDisplay("app"); // App mode
            get('#noteContainer').style.visibility = "visible";
            get('#note').focus(); // Focus on the textarea
        } 
        else {
            changeDisplay("normal"); // Normal  mode
            get('#noteContainer').style.visibility = "hidden";
        }   
    }
}

// =================================================
// =================================================
// ============ THEME

// ===> Switch the app theme
function switchTheme() {
    switch(settings.profile.theme) {
        case "dark" :
            displayTheme("light");
            settings.profile.theme = "light";
            updateJSON();
            break;

        case "light" :
            displayTheme("dark");
            settings.profile.theme = "dark";
            updateJSON();
            break;
    }
}

// ===> Change the CSS file
function displayTheme(theme) {
    if (theme == "dark") get("#theme").href = "assets/css/theme-dark.min.css";
    if (theme == "light") get("#theme").href = "assets/css/theme-light.min.css";
}

// =================================================
// =================================================
// ============ ASIDE FUNCTIONS

// ===> Update the localStorage
function updateJSON() {
    storage("set", "HOMEY-settings", JSON.stringify(settings))
}

// =================================================
// =================================================
// ============ POPUP

// ===> Open one popup
function openWindow(idWindow) {
    get("#containerPopup").style.display = "flex";
    get("#" + idWindow).style.display = "block";
}

// ===> Close every popup
function closeWindow() {
    get("#containerPopup").style.display = "none";
    for(let i = 0; i < get("#containerPopup").children.length; i ++) get("#containerPopup").children[i].style.display = "none"; // Put style disply none on every children
}

// =================================================
// =================================================
// ============ GENERIC

// ===> Easy selector
function get(n) {
    if (n.search("#") == 0 && n.split("#")[1] != null && document.querySelector(n) != null) return document.querySelector(n);
    if (n.search(".") == 0 && n.split(".")[1] != null && document.querySelectorAll(n) != null) return document.querySelectorAll(n);
    if (n.search("~") == 0 && n.split("~")[1] != null && document.querySelectorAll(n.split("~")[1]) != null) return document.querySelectorAll(n.split("~")[1])[0];
}

// ===> Simplier usage of the local storage
function storage(a, n, v) {
    if (a == "get") return localStorage.getItem(n);
    if (a == "set") return localStorage.setItem(n, v);
    if (a == "rem") return localStorage.removeItem(n);
}

// ===> First-letter majuscule
function ucFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ===> Create a download
function download(c, n) {
    let file = new Blob([c], { type: 'text/plain' });
    let dl = document.createElement('a');
    dl.download = n;
    dl.href = window.URL.createObjectURL(file);
    dl.click();
}