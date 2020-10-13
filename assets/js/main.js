// ========================================
// ==================================== INIT
// ========================================

const version = 1.2; // the actual version of the app
let favDisplayed = []; // will contain all the favs currently displayed to avoid the multilplication

// ===> Create the settings data or parse them if it already exists
if (storage("get", "HOMEY-settings")) settings = JSON.parse(storage("get", "HOMEY-settings"))
else {
    settings = {
        'core' : {'start' : false,'menu' : false, 'version' : 1.0},
        'profile' : {'activated' : '','name' : ''},
        'favorite' : {'activated' : '','editMode' : '','content' : []},
        'weather' : {'activated' : '','api' : '','town' : ''}
    }
    storage("set", "HOMEY-settings", JSON.stringify(settings));
}

// ===> Same things for the apps
if (storage("get", "HOMEY-apps")) apps = JSON.parse(storage("get", "HOMEY-apps"))
else {
    apps = {
        'note' : {'activated' : '','content' : ''}
    }
    storage("set", "HOMEY-apps", JSON.stringify(apps));
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
        'initMenuLabel' : "Prénom",
        'initMenuCheck' : "Ton prénom doit être composé entre 2 à 15 caractères.",
        'confirmInitMenu' : "Confirmer",
        'closeInitMenu' : "Annuler"
    },
    'importMenu' : {
        'importMenuTitle' : "Importation",
        'importMenuLabel' : "",
        'importMenuCheck' : "Le fichier de sauvegarde s'appellement normalement \"homey.json\".",
        'importMenuConfirm' : "Confirmer",
        'closeImportMenu' : "Annuler"
    },
    'logoutMenu' : {
        'logoutMenuTitle' : "Déconnexion",
        'logoutMenuText' : "Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",
        'logoutMenuConfirm' : "Confirmer",
        'closeLogoutMenu' : "Annuler"
    },
    'profileMenu' : {
        'profilMenuTitle' : "Profil",
        'profilMenuActivate' : "Afficher le prénom",
        'profilMenuLabel' : "Prénom",
        'profilMenuCheck' : "Ton prénom doit être composé entre 2 à 15 caractères.",
        'profilMenuConfirm' : "Appliquer et fermer"
    },
    'weatherMenu' : {
        'weatherMenuTitle' : "Météo",
        'weatherMenuActivate' : "Activer la météo",
        'weatherMenuAPILabel' : "API OpenWeather",
        'weatherMenuTownLebel' : "Ville",
        'weatherMenuCheck' : "Les deux champs sont nécessaires.",
        'weatherMenuConfirm' : "Appliquer et fermer"
    },
    'exportMenu' : {
        'exportMenuTitle' : "Exportation",
        'exportMenuContent' : "Vous pouvez exporter les données de l'application afin d'avoir les même paramètres sur un autre appareil. Attention, ce fichier contient des données privées !",
        'exportMenuConfirm' : "Exporter",
        'closeExportMenu' : "Fermer"
    },
    'appsMenu' : {
        'appsMenuTitle' : "Mes applications",
        'appsMenuContent' : "Vous pouvez activer ou désactiver les applications.",
        'appsMenuLabelNotes' : "Notes",
        'closeAppsMenu' : "Appliquer et fermer"
    },
    'favMenu' : {
        'favMenuTitle' : "Gestion des favoris",
        'favMenuLabel' : "Activer les favoris",
        'favMenuEditLabel' : "Mode édition",
        'closeFavMenu' : "Appliquer et fermer"
    },
    'favMenuAdd' : {
        'favMenuAddTitle' : "Ajouter un favori",
        'favMenuAddLabelName' : "Nom",
        'favMenuAddLabelURL' : "Adresse",
        'favMenuAddCheck' : "Les deux champs sont nécessaires et doivent respecter un format correct.",
        'favMenuAddConfirm' : "Ajouter",
        'closeFavAddMenu' : "Annuler"
    },
    'misc' : {
        'footerContent' : "Disponible sur <a href=\"https://github.com/n-deleforge/homey\">GitHub</a> (v " + version + ") - Hébergé sur  <a href=\"https://nicolas-deleforge.fr\">nd</a>",
        'noteTitle' : "Mes notes",
        'favTitle' : "Favoris <span class=\"favEdit\">(mode édition)</span>"
    },
    'dynamic' : { // is not concerned by the function of displaying content
        'footerName' : "Connecté en tant que",
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
        'initMenuLabel' : "Name",
        'initMenuCheck' : "Your name must be composed between 2 to 15 characters.",
        'confirmInitMenu' : "Confirm",
        'closeInitMenu' : "Cancel"
    },
    'importMenu' : {
        'importMenuTitle' : "Import",
        'importMenuLabel' : "",
        'importMenuCheck' : "The file is normally called \"homey.json\".",
        'importMenuConfirm' : "Confirm",
        'closeImportMenu' : "Cancel"
    },
    'logoutMenu' : {
        'logoutMenuTitle' : "Deconnection",
        'logoutMenuText' : "This action will delete all the data of the application.",
        'logoutMenuConfirm' : "Confirm",
        'closeLogoutMenu' : "Cancel"
    },
    'profileMenu' : {
        'profilMenuTitle' : "Profile",
        'profilMenuActivate' : "Display the name",
        'profilMenuLabel' : "Name",
        'profilMenuCheck' : "Your name must be composed between 2 to 15 characters.",
        'profilMenuConfirm' : "Confirm and close"
    },
    'weatherMenu' : {
        'weatherMenuTitle' : "Weather",
        'weatherMenuActivate' : "Activate the weather",
        'weatherMenuAPILabel' : "API OpenWeather",
        'weatherMenuTownLebel' : "Town",
        'weatherMenuCheck' : "The two fields are required.",
        'weatherMenuConfirm' : "Confirm and close"
    },
    'exportMenu' : {
        'exportMenuTitle' : "Export your data",
        'exportMenuContent' : "You can export the data of the application to import it on anoter device and keep your settings.Be careful, this file contains private data!",
        'exportMenuConfirm' : "Export",
        'closeExportMenu' : "Cancel"
    },
    'appsMenu' : {
        'appsMenuTitle' : "My applications",
        'appsMenuContent' : "You can activate or desactive apps here.",
        'appsMenuLabelNotes' : "Notes",
        'closeAppsMenu' : "Confirm and close"
    },
    'favMenu' : {
        'favMenuTitle' : "Favorite management",
        'favMenuLabel' : "Activate favorite",
        'favMenuEditLabel' : "Edit mode",
        'closeFavMenu' : "Confirm and close"
    },
    'favMenuAdd' : {
        'favMenuAddTitle' : "Add a favorite",
        'favMenuAddLabelName' : "Name",
        'favMenuAddLabelURL' : "Adress",
        'favMenuAddCheck' : "The two fields are required and must respect the correct format.",
        'favMenuAddConfirm' : "Add",
        'closeFavAddMenu' : "Cancel"
    },
    'misc' : {
        'footerContent' : "Available on <a href=\"https://github.com/n-deleforge/homey\">GitHub</a> (v " + version + ") - Hosted on <a href=\"https://nicolas-deleforge.fr\">nd</a>",
        'noteTitle' : "My notes",
        'favTitle' : "Favoris <span class=\"favEdit\">(edit mode)</span>"
    },
    'dynamic' : { // is not concerned by the function of displaying content
        'footerName' : "Connected as",
        'dateLanguage' : "en-EN",
        'weatherLanguage' : "EN",
        'errorImport' : "The file is incorrect. Try again."
    }
};

// ===> Will determine the language of the app
if(navigator.language == "fr") {
    display = FR;
    tag = "fr";
}
else {
    display = EN;
    tag = "en";
} 

// =====================> FIRST : display content
// ========================================
get("#htmlTag").lang = tag;
for(let i = 0; i < Object.keys(display).length - 1; i++) {
    let allData = display[Object.keys(display)[i]];
    let idName = Object.keys(allData);
    let values = Object.values(allData);
    for (let j = 0; j < idName.length; j++) get("#" + idName[j]).innerHTML = values[j];
}

// ========================================
// ================================== START
// ========================================

// ======================> START : init or import
// ========================================
if (settings.core.start == false) {
    get("#start").style.display = "flex";
    for(let i = 0; i < get("~input").length; i ++) get("~input")[i].value = "";
    for(let i = 0; i < get("~textarea").length; i ++) get("~textarea")[i].value = "";
}
else {
    displayApp();
    displayFavs();
}

// ==================> START : initialization menu
// ========================================
get("#displayInitMenu").addEventListener("click", function() {
    get("#containerPopup").style.display = "flex";
    get("#initMenu").style.display = "block";

    get("#closeInitMenu").addEventListener("click", closeWindow);
    get("#confirmInitMenu").addEventListener("click", function() {
        if (get("#name").checkValidity() && get("#name").value != "") {
            settings.core.start = true;
            settings.profile.activated = true; 
            settings.profile.name = get("#name").value;
            updateJSON();
            displayApp();
            displayFavs();
            closeWindow();
        }
        else get("#initMenuCheck").style.color = "red";
    })
})

// ======================> START : import menu
// ========================================
get("#displayImportMenu").addEventListener("click", function() {
    get("#containerPopup").style.display = "flex";
    get("#importMenu").style.display = "block";

    get("#closeImportMenu").addEventListener("click", closeWindow);
    get("#importMenuConfirm").addEventListener("click", function() {
        if (get("#importData").files.length != 0) {
            let reader = new FileReader();
            reader.readAsText(get("#importData").files[0]);
            reader.onload = function (e) {
                let importData = (atob(e.target.result));
                settings = JSON.parse(importData.split('&&&')[0]);
                apps = JSON.parse(importData.split('&&&')[1]);
                updateJSON();
                location.reload();
            }
        }
        else {
            get("#importMenuCheck").innerHTML =  display.dynamic.errorImport;
            get("#importMenuCheck").style.color =  "red";
        }
    })
})

// ========================================
// ==================================== APP
// ========================================

// =======================> APP : settings menu
// ========================================
get("#displaySettings").addEventListener("click", function() {
    if (get('#listSettings').style.display == "none") {
        get('#listSettings').style.animation = "bounceIn";
        get('#listSettings').style.animationDuration = "0.5s"; 
        settings.core.menu = true;
        updateJSON();
        displayApp();
    }
    else {
        get('#listSettings').style.animation = "bounceOut";
        get('#listSettings').style.animationDuration = "0.5s";
        settings.core.menu = false;
        updateJSON();
        setTimeout(function(){ displayApp(); }, 500);
    }
})
// ========================================

// =========================> APP : apps menu
// ========================================
get("#displayAppsMenu").addEventListener("click", function() {
    openWindow("appsMenu");
    get("#closeAppsMenu").addEventListener("click", closeWindow);
    get("#activateNote").addEventListener("click", function() {
        if (get('#activateNote').checked == true) apps.note.activated = true
        else apps.note.activated = false;
        updateJSON();
        displayApp();
     });
})
// ========================================

// ==============================> APP : note
// ========================================
get("#displayNote").addEventListener("click", function() {
    if (get('#noteContainer').style.visibility == "hidden") {
        changeDisplay("app");
        get('#noteContainer').style.visibility = "visible";
        get('#note').focus();
    }
    else {
        changeDisplay("normal");
        get('#noteContainer').style.visibility = "hidden";
    } 
});
// ========================================

// =============================> APP : favoris
// ========================================
get("#displayFavMenu").addEventListener("click", function() {
    openWindow("favMenu");
    get("#closeFavMenu").addEventListener("click", closeWindow);
    get('#activateFav').addEventListener("change", function() {
        if (get('#activateFav').checked == true) settings.favorite.activated = true
        else settings.favorite.activated = false;
        updateJSON();
        displayApp();
    });

    get('#editMode').addEventListener("change", function() {
        if (get('#editMode').checked == true) settings.favorite.editMode = true
        else settings.favorite.editMode = false;
        updateJSON();
        displayApp();
    });
});

get("#addFavAction").addEventListener("click", function() {
    openWindow("favMenuAdd");
    get("#closeFavAddMenu").addEventListener("click", closeWindow);
    get("#favMenuAddConfirm").addEventListener("click", function() {
        if (get("#nameFav").checkValidity() && get("#nameFav").value != "" && get("#urlFav").checkValidity() && get("#urlFav").value != "") {
            let fav = get("#nameFav").value + "::" + get("#urlFav").value;
            settings.favorite.content.push(fav);

            get("#nameFav").value = "";
            get("#urlFav").value = "https://";
            updateJSON();
            closeWindow();
            displayFavs();
        }
        else get("#favMenuAddCheck").style.color = "red";
    })
});
// ========================================

// =============================> APP : logout
// ========================================
get("#displayLogoutMenu").addEventListener("click", function() {
    openWindow("logoutMenu");
    get("#closeLogoutMenu").addEventListener("click", closeWindow);
    get("#logoutMenuConfirm").addEventListener("click", function() {
        localStorage.clear();
        location.reload(); 
    });
});
// ========================================

// =============================> APP : export
// ========================================
get("#displayExportMenu").addEventListener("click", function() {
    openWindow("exportMenu");
    get("#closeExportMenu").addEventListener("click", closeWindow);
    get("#exportMenuConfirm").addEventListener("click", function() {
        download(btoa(JSON.stringify(settings) + "&&&" + JSON.stringify(apps)), "homey.json");
        closeWindow();
    });
});
// ========================================

// =============================> APP : profile
// ========================================
get("#displayProfilMenu").addEventListener("click", function() {
    openWindow("profilMenu");
    get("#newName").value = settings.profile.name;
    get("#profilMenuConfirm").addEventListener("click", function() {
        if (get("#newName").checkValidity() && get("#newName").value != "") {
            get("#profilMenuCheck").style.color = "white";
            settings.profile.name = get("#newName").value;
            updateJSON();
            displayApp();
            closeWindow();
        }
        else get("#profilMenuCheck").style.color = "red";
    })
    get('#activateName').addEventListener("change", function() {
        if (get('#activateName').checked == true) settings.profile.activated = true
        else settings.profile.activated = false;
        updateJSON();
        displayApp();
    })
});
// ========================================

// ===========================> APP : weather
// ========================================
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
// ========================================

// ========================================
// ============================= FUNCTIONS
// ========================================

// ====================> Update the localStorage
// ========================================
function updateJSON() {
    storage("set", "HOMEY-settings", JSON.stringify(settings))
    storage("set", "HOMEY-apps", JSON.stringify(apps))
}
// ========================================

// =================> Keyboard shortcuts options
// ========================================
function shortcutKeyboard(event) {
    switch(event.key) {
        case "N":
        case "n":
            if (settings.profile.activated == true) settings.profile.activated = false
            else settings.profile.activated = true;
            updateJSON();
            displayApp();
            break;

        case "S":
        case "s":
            if (settings.core.menu == true) settings.core.menu = false
            else settings.core.menu = true;
            updateJSON();
            displayApp();
            break;

        case "F":
        case "f":
            if (settings.favorite.activated == true) settings.favorite.activated = false
            else settings.favorite.activated = true;
            updateJSON();
            displayApp();
            break;

        case "E":
        case "e":
            if (settings.favorite.editMode == true) settings.favorite.editMode = false
            else settings.favorite.editMode = true;
            updateJSON();
            displayApp();
            break;

        case "W":
        case "w":
            if (settings.weather.activated == true) settings.weather.activated = false
            else settings.weather.activated = true;
            updateJSON();
            displayApp();
            break;
    }
}
// ========================================

// =========================> Open one popup
// ========================================
function openWindow(idWindow) {
    document.removeEventListener('keydown', shortcutKeyboard);
    get("#containerPopup").style.display = "flex";
    get("#" + idWindow).style.display = "block";
}
// ========================================

// ========================> Close every popup
// ========================================
function closeWindow() {
    get("#containerPopup").style.display = "none";
    for(let i = 0; i < get("#containerPopup").children.length; i ++) get("#containerPopup").children[i].style.display = "none";
    if (settings.core.start == true) document.addEventListener('keydown', shortcutKeyboard);
}
// ========================================

// ==================> Modify the display for apps
// ========================================
function changeDisplay(mode) {
    if (mode == "app") {
        document.removeEventListener('keydown', shortcutKeyboard);
        get("#time").style.justifyContent = "flex-start";
        get("#time").style.fontSize = "1em";
        get("#time").style.flexGrow = "0";
        get("#containerApps"). style.display = "flex";
        get("#containerApps"). style.flexGrow = "1";
    }
    else {
        document.addEventListener('keydown', shortcutKeyboard);
        get("#time").style.justifyContent = "center";
        get("#time").style.fontSize = "2em";
        get("#time").style.flexGrow = "1";
        get("#containerApps"). style.display = "none";
        get("#containerApps"). style.flexGrow = "0";
    }
}
// ========================================

// ==========================> Display the favs
// ========================================
function displayFavs() {
    if (settings.favorite.content.length != 0) {
        for (let i = 0; i < settings.favorite.content.length; i++) {
            if (favDisplayed.indexOf(settings.favorite.content[i]) == -1) {
                let fav = document.createElement("a");
                    fav.target = "_blank";
                    fav.innerHTML = settings.favorite.content[i].split("::")[0];
                    fav.href = settings.favorite.content[i].split("::")[1];
                    get("#listFavs").lastElementChild.before(fav);
                    favDisplayed.push(settings.favorite.content[i]);

                let deleteFav = document.createElement("span");
                    deleteFav.classList.add("favEdit");
                    if (get('#editMode').checked == false) deleteFav.style.display = "none";
                    deleteFav.style.fontSize = "0.8em";
                    deleteFav.innerHTML = "x";
                    fav.before(deleteFav);

                deleteFav.addEventListener("click", function () {
                    let value = this.nextElementSibling.innerHTML + "::" + this.nextElementSibling.href.slice(0, -1);
                    let nbToDelete = favDisplayed.indexOf(value);
                    favDisplayed.splice(nbToDelete, 1);
                    settings.favorite.content.splice(nbToDelete, 1);
                    updateJSON();
                    this.nextElementSibling.remove();
                    this.remove();
                });
            }
        }
    }
}
// ========================================

// =====================> Display the application
// ========================================
function displayApp() {
    // Main action
    document.title = "HOMEY - " + settings.profile.name;
    displayTime(); setInterval(displayTime, 10000); // 10 secondes
    document.addEventListener('keydown', shortcutKeyboard);
    get("#start").style.display = "none";
    get("#app").style.display = "flex";

    // Display of the name
    if (settings.profile.activated == true) {
        get('#activateName').checked = true;
        get("#displayName").innerHTML = display.dynamic.footerName + " <strong>" + settings.profile.name + "</strong>";
    }
    else {
        get('#activateName').checked = false;
        get("#displayName").innerHTML = "";
    } 

    // Display of the settings
    if (settings.core.menu == true) {
        get('#listSettings').style.display = "flex";
        get('#displaySettings').innerHTML = "➖";
    }
    else {
        get('#listSettings').style.display = "none";
        get('#displaySettings').innerHTML = "🔧";
    }

    // Display of the weather
    if (settings.weather.api != "") get('#weatherMenuAPIValue').value = settings.weather.api;
    if (settings.weather.town != "") get('#weatherMenuTownValue').value = settings.weather.town;

    if (settings.weather.activated == true) {
        get('#activateWeather').checked = true;
        get('#weatherMenuAPI').style.display = "block";
        get('#weatherMenuTown').style.display = "block";
        get('#weatherMenuCheck').style.display = "block";
        displayWeatherInfo();
    }
    else {
        get('#activateWeather').checked = false;
        get('#weatherMenuAPI').style.display = "none";
        get('#weatherMenuTown').style.display = "none";
        get('#weatherMenuCheck').style.display = "none";
        displayWeatherInfo();
    }

    // Display of apps
    if (apps.note.activated == true) {
        get('#activateNote').checked = true;
        get("#displayNote").style.display = "block";
    }
    else {
        get('#activateNote').checked = false;
        get("#displayNote").style.display = "none";
    }

    // Favs -- display the favs
    if (settings.favorite.activated == true) {
        get('#activateFav').checked = true;
        get("#listFavs").style.display = "flex";
        get('#editMenu').style.display = "block";
    }
    else {
        get('#activateFav').checked = false;
        get("#listFavs").style.display = "none";
        // settings.favorite.editMode = false;
        // updateJSON();
        get('#editMode').checked = false;
        get('#editMenu').style.display = "none";
    }

    // Favs -- edit mode for the favs
    if (settings.favorite.editMode == true) {
        get('#editMode').checked = true;
        for (let i = 0; i < get('.favEdit').length; i++) get('.favEdit')[i].style.display = "inline";
    }
    else {
        get('#editMode').checked = false;
        for (let i = 0; i < get('.favEdit').length; i++) get('.favEdit')[i].style.display = "none";
    }

    // Apps - note
    get('#noteContainer').style.visibility = "hidden";
    if (apps.note.content != "") get('#note').value = apps.note.content;
    get('#note').addEventListener("change", function() { 
        apps.note.content = get("#note").value; 
        updateJSON();
    });
}
// ========================================

// ===================> Display the hour and date
// ========================================
function displayTime() {
    let timestamp = new Date();
    let date = timestamp.toLocaleString(display.dynamic.dateLanguage, {weekday: "long", month: "long", day: "numeric"});
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes(); 
    if (hours < 10) hours = '0' + hours;
    if (minutes < 10) minutes = '0' + minutes;
    get("#displayTime").innerHTML = hours + ":" + minutes;
    get("#displayDate").innerHTML = date;
}
// ========================================

// ==============> Display the weather with refresh
// ========================================
function displayWeatherInfo() {
    if (settings.weather.activated == true && settings.weather.api != "" && settings.weather.town != "") {
        requestWeather()
        setInterval(requestWeather, 1800000); // 30 minutes
    }
    else get('#displayWeather').innerHTML = "";
}
// ========================================

// ===================> Request to OpenWeather
// ========================================
function requestWeather() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {

        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                data = JSON.parse(this.responseText);
                switch(data.weather[0].main) {
                    case 'Thunderstorm' : var logo = "🌩";
                    case 'Drizzle' : var logo = "🌨";
                    case 'Rain' : var logo = "🌧";
                    case 'Snow' : var logo = "🌨";
                    case 'Atmosphere' : var logo = "🌪";
                    case 'Clear' : var logo = "☀";
                    case 'Clouds' : var logo = "⛅";
                }
                get('#displayWeather').innerHTML = logo + " " + Math.round(data.main.temp) + " <sup>°c</sup>";
            }  
            else get('#displayWeather').innerHTML = "❗";
        }
    };

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + settings.weather.town + '&appid=' + settings.weather.api + '&lang=' + display.dynamic.weatherLanguage +'&units=metric', true)
    req.send(null);
}
// ========================================

// ========================================
// ================================ GENERIC
// ========================================

// =========================> Select an element
// ========================================
function get(n) {
    if (n.search("#") != -1 && document.getElementById(n.split("#")[1]) != null) return document.getElementById(n.split("#")[1]);
    if (n.search("~") != -1 && document.querySelectorAll(n.split('~')[1]) != null) return document.querySelectorAll(n.split('~')[1]);
    if (n.search("\\.") != -1 && document.querySelectorAll(n).length != 0) return document.querySelectorAll(n);
}

// ================> Faster usage of localStorage
// ========================================
function storage(a, n, v) {
    if (a == "get") return localStorage.getItem(n);
    if (a == "set") return localStorage.setItem(n, v);
    if (a == "rem") return localStorage.removeItem(n);
}

// ========================> Add a a majuscule
// ========================================
function ucFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ==============> Download selectionned content
// ========================================
function download(c, n) {
    let file = new Blob([c], { type: 'text/plain' });
    let dl = document.createElement('a');
    dl.download = n;
    dl.href = window.URL.createObjectURL(file);
    dl.click();
}