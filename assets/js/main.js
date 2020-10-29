// =================================================
// =================================================
// ============ INIT

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
    'etc' : { // is not concerned by the function of displaying content
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
    'etc' : { // is not concerned by the function of displaying content
        'footerName' : "Connected as",
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
    displayFavs();
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
            displayFavs();
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
                let importData = (atob(e.target.result));
                // Cut the imported data into 2 JSON objects, one for the settings and one for the apps
                settings = JSON.parse(importData.split('&&&')[0]);
                apps = JSON.parse(importData.split('&&&')[1]);
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
// ============ APPS

// ===> Button - settings menu
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

// ===> Button - note app
get("#displayNote").addEventListener("click", function() {
    // If there is saved content, then display it into the note
    if (apps.note.content != "") get('#note').value = apps.note.content;

    // Add a listener into the textarea and save the content for any change
    get('#note').addEventListener("change", function() { 
        apps.note.content = get("#note").value; 
        updateJSON();
    });

    if (get('#noteContainer').style.visibility == "hidden") {
        changeDisplay("app"); // App mode
        get('#noteContainer').style.visibility = "visible";
        get('#note').focus(); // Focus on the textarea
    } 
    else {
        changeDisplay("normal"); // Normal  mode
        get('#noteContainer').style.visibility = "hidden";
    } 
});

// ===> Apps menu
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

// ===> Favs menu
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

// ===> AddFav menu
get("#addFavAction").addEventListener("click", function() {
    openWindow("favMenuAdd");
    get("#closeFavAddMenu").addEventListener("click", closeWindow);

    get("#favMenuAddConfirm").addEventListener("click", function() {
        // Check if the regex for fav name / link and if it's not empty
        if (get("#nameFav").checkValidity() && get("#nameFav").value != "" && get("#urlFav").checkValidity() && get("#urlFav").value != "") {
            let fav = get("#nameFav").value + "::" + get("#urlFav").value;
            settings.favorite.content.push(fav); // Add it in the local array

            // Reset the data
            get("#nameFav").value = ""; 
            get("#urlFav").value = "https://";

            // Update the display
            updateJSON();
            closeWindow();
            displayFavs();
        }
        else get("#favMenuAddCheck").style.color = "red";
    })
});

// ===> Logout menu
get("#displayLogoutMenu").addEventListener("click", function() {
    openWindow("logoutMenu");
    get("#closeLogoutMenu").addEventListener("click", closeWindow);

    get("#logoutMenuConfirm").addEventListener("click", function() {
        storage("rem", "HOMEY-settings");
        storage("rem", "HOMEY-apps");
        location.reload(); 
    });
});

// ===> Export menu
get("#displayExportMenu").addEventListener("click", function() {
    openWindow("exportMenu");
    get("#closeExportMenu").addEventListener("click", closeWindow);

    get("#exportMenuConfirm").addEventListener("click", function() {
        // Stringify the two JSON objects and transform it with base64
        download(btoa(JSON.stringify(settings) + "&&&" + JSON.stringify(apps)), "homey.json");
        closeWindow();
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

    get('#activateName').addEventListener("change", function() {
        if (get('#activateName').checked == true) settings.profile.activated = true
        else settings.profile.activated = false;
        updateJSON();
        displayApp();
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
// ============ ASIDE FUNCTIONS

// ===> Update the localStorage
function updateJSON() {
    storage("set", "HOMEY-settings", JSON.stringify(settings))
    storage("set", "HOMEY-apps", JSON.stringify(apps))
}

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

// ===> Modify the display
function changeDisplay(mode) {
    if (mode == "app") {
        // In app mode, time and date goes to the top with a smaller size
        get("#time").style.justifyContent = "flex-start";
        get("#time").style.fontSize = "1em";
        get("#time").style.flexGrow = "0";
        get("#containerApps"). style.display = "flex";
        get("#containerApps"). style.flexGrow = "1";
    }
    else {
    // In normal mode, time and date goes to the center of the page
        get("#time").style.justifyContent = "center";
        get("#time").style.fontSize = "2em";
        get("#time").style.flexGrow = "1";
        get("#containerApps"). style.display = "none";
        get("#containerApps"). style.flexGrow = "0";
    }
}

// ===> Display the favs
function displayFavs() {
    if (settings.favorite.content.length != 0) { // If there are favs in the array
        for (let i = 0; i < settings.favorite.content.length; i++) { // Loop all the favs
            if (favDisplayed.indexOf(settings.favorite.content[i]) == -1) { // Check if the fav is already displayed thanks to the global array "favDisplayed"

                // Creation of the fav
                let fav = document.createElement("a");
                    fav.target = "_blank";
                    fav.innerHTML = settings.favorite.content[i].split("::")[0]; // The name of the fav
                    fav.href = settings.favorite.content[i].split("::")[1]; // The link of the fav
                    get("#listFavs").lastElementChild.before(fav); // Add the a element just created at the end of the list of favs
                    favDisplayed.push(settings.favorite.content[i]); // Add the fav to the global array

                // Creation of the cross to delete the fav
                let deleteFav = document.createElement("span");
                    deleteFav.classList.add("favEdit");
                    if (get('#editMode').checked == false) deleteFav.style.display = "none";
                    deleteFav.style.fontSize = "0.8em";
                    deleteFav.innerHTML = "x";
                    fav.before(deleteFav); // Add the cross before the fav element

                // Add listener to the cross to delete the fav
                deleteFav.addEventListener("click", function () {
                    let value = this.nextElementSibling.innerHTML + "::" + this.nextElementSibling.href.slice(0, -1); // Create the value of the fav (ex : name::link)
                    let nbToDelete = favDisplayed.indexOf(value); // Search for the index of the fav
                    favDisplayed.splice(nbToDelete, 1); // Delete the value of the global array
                    settings.favorite.content.splice(nbToDelete, 1); // Delete the value in the local data
                    updateJSON(); // Update the list favs
                    this.nextElementSibling.remove(); // Delete the fav
                    this.remove(); // Delete the cross of the fav
                });
            }
        }
    }
}

// ===> Display the application
function displayApp() {
    // Main action
    document.title = "HOMEY - " + settings.profile.name; // Change the name of the app
    displayTime(); setInterval(displayTime, 60000); // Update the hour and the date every 60 secondes
    get("#start").style.display = "none";
    get("#app").style.display = "flex";

    // Display of the name
    if (settings.profile.activated == true) {
        get('#activateName').checked = true;
        get("#displayName").innerHTML = display.etc.footerName + " <strong>" + settings.profile.name + "</strong>";
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

    // Display of the weather menu
    if (settings.weather.api != "") get('#weatherMenuAPIValue').value = settings.weather.api;
    if (settings.weather.town != "") get('#weatherMenuTownValue').value = settings.weather.town;

    // Display of the weather app
    if (settings.weather.activated == true) {
        get('#activateWeather').checked = true;
        get('#weatherMenuAPI').style.display = "block";
        get('#weatherMenuTown').style.display = "block";
        get('#weatherMenuCheck').style.display = "block";
    }
    else {
        get('#activateWeather').checked = false;
        get('#weatherMenuAPI').style.display = "none";
        get('#weatherMenuTown').style.display = "none";
        get('#weatherMenuCheck').style.display = "none";
    }

    // Display of apps menu
    if (apps.note.activated == true) {
        get('#activateNote').checked = true;
        get("#displayNote").style.display = "block";
    }
    else {
        get('#activateNote').checked = false;
        get("#displayNote").style.display = "none";
    }

    // Display of the favs
    if (settings.favorite.activated == true) {
        get('#activateFav').checked = true;
        get("#listFavs").style.display = "flex";
        get('#editMenu').style.display = "block";
    }
    else {
        get('#activateFav').checked = false;
        get("#listFavs").style.display = "none";
        get('#editMode').checked = false;
        get('#editMenu').style.display = "none";
    }

    // Display of the edit mode for favs
    if (settings.favorite.editMode == true) {
        get('#editMode').checked = true;
        for (let i = 0; i < get('.favEdit').length; i++) get('.favEdit')[i].style.display = "inline";
    }
    else {
        get('#editMode').checked = false;
        for (let i = 0; i < get('.favEdit').length; i++) get('.favEdit')[i].style.display = "none";
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

// ===> Display the weather with refresh
function displayWeatherInfo() {
    if (settings.weather.activated == true && settings.weather.api != "" && settings.weather.town != "") {
        requestWeather()
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
        }

        // If there is an error
        else get('#displayWeather').innerHTML = "❗"; 
    };

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + settings.weather.town + '&appid=' + settings.weather.api + '&lang=' + display.etc.weatherLanguage +'&units=metric', true)
    req.send(null);
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