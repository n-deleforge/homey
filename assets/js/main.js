// =================================================
// =================================================
// ============ MAIN

/**
 * Initialize the application
 **/

if (SETTINGS.core.start == false) {
    get("#start").style.display = "flex";
    get("#importData").value = "";
    createMenuAtStart();
} else {
    checkVersion();
    get("#start").style.display = "none";
    get("#app").style.display = "flex";
    displayApp();
    setInterval(displayApp, 1000);
    displayTheme("auto");
    displayWeatherInfo();
    createMenuAtLoad();
    managingSubMenu();
}

/**
 * Create all the events for the buttons at the start of the app
 **/

function createMenuAtStart() {
    // Button : start the app
    get("#startApp").addEventListener("click", () => {
        SETTINGS.core.start = true;
        saveSettings();
        location.reload();
    })

    // Button : import settings
    get("#importConfirm").addEventListener("click", () => {
        if (get("#importData").files.length != 0) {
            let reader = new FileReader();
            reader.readAsText(get("#importData").files[0]);
            reader.onload = (e) => {
                let importData = e.target.result;
                SETTINGS = JSON.parse(importData);

                saveSettings();
                location.reload();
            }
        } else get("#importData").style.color = getVariableCSS("errorText");
    })
}

/**
 * Create all the events for the buttons and the menu when the app is loaded
 **/

function createMenuAtLoad() {
    // Button : open settings menu
    get("#displaySettings").addEventListener("click", () => {
        get("#blankPage").style.display = "flex";
        get("#displaySettings").style.display = "none";
        get('#listSettings').style.animation = "fadeInRight";
        get('#listSettings').style.animationDuration = "0.5s";
        get("#listSettings").style.display = "flex";
    })

    // Button : close settings menu
    get("#closeSettings").addEventListener("click", closeMenu);
    get("#blankPage").addEventListener("click", closeMenu);

    // Fill the data
    get("#newName").value = SETTINGS.profile.name;
    get('#weatherAPIValue').value = SETTINGS.weather.api;
    get('#weatherTownValue').value = SETTINGS.weather.town;

    // Button : change name
    get("#profileConfirm").addEventListener("click", changeProfile);

    // Button : change weather
    get("#weatherConfirm").addEventListener("click", changeWeather);

    // Button : change background
    get("#backgroundConfirm").addEventListener("click", changeBackground);

    // Button : theme switch
    get("#switchTheme").addEventListener("click", switchTheme);

    // Button : export data
    get("#exportData").addEventListener("click", () => {
        if (confirm(_CONTENT.backupText)) download(JSON.stringify(SETTINGS), "homey.json");
    });

    // Button : logout
    get("#logout").addEventListener("click", () => {
        if (confirm(_CONTENT.logoutText)) {
            storage("rem", "HOMEY-settings");
            location.reload();
        }
    });
}

/**
 * Close the menu (called by the cross or the app)
 **/

function closeMenu() {
    // Hide all submenu at closing
    for (let i = 0; i < get(".listSettingsTitle").length - 1; i++) get(".listSettingsTitle")[i].nextElementSibling.style.display = "none";

    // Hide the menu
    get("#displaySettings").style.display = "block";
    get("#listSettings").style.display = "none";
    get("#blankPage").style.display = "none";

    // Reset the label color
    get("#profileLabel").style.color = getVariableCSS("labelText");
    get("#weatherAPILabel").style.color = getVariableCSS("labelText");
    get("#weatherTownLabel").style.color = getVariableCSS("labelText");
}

/**
 * Managin the menu and the submenus
 **/

function managingSubMenu() {
    let subMenuOpened = false;
    const subMenuList = get(".listSettingsTitle");

    // At first, hide all submenus
    for (let i = 0; i < subMenuList.length - 1; i++) {
        get(".listSettingsTitle")[i].nextElementSibling.style.display = "none";

        // Add an event on all submenu titles
        subMenuList[i].addEventListener("click", () => {
            // Opening
            if (subMenuList[i].nextElementSibling.style.display == "none") {
                // If one submenu is opened, close all the submenus
                if (subMenuOpened) for (let j = 0; j < subMenuList.length - 1; j++) subMenuList[j].nextElementSibling.style.display = "none";
                
                // And open the one which is choosen
                subMenuList[i].nextElementSibling.style.display = "block";
                subMenuOpened = true;
            } 
            
            // Closing
            else subMenuList[i].nextElementSibling.style.display = "none";
        });
    }
}

// =================================================
// =================================================
// ============ TIME, DATE AND WEATHER

/**
 * Display time, date (+ interval) and name
 **/

function displayApp() {
    // Hour and date
    let timestamp = new Date();
    let date = timestamp.toLocaleString(_CONTENT.dateLanguage, { weekday: "long", month: "long", day: "numeric" }); 
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    if (hours < 10) hours = '0' + hours;  if (minutes < 10) minutes = '0' + minutes;

    // Welcome
    let welcome1 = timestamp.getHours() < 7 || timestamp.getHours() > 19 ? _CONTENT.welcomeNight : _CONTENT.welcomeDay;
    let welcome2 = SETTINGS.profile.name != "" ? ' <span id="displayName">' + SETTINGS.profile.name + '</span>' : "";

    get("#displayTime").innerHTML = hours + ":" + minutes;
    get("#displayDate").innerHTML = date;
    get("#displayWelcome").innerHTML = welcome1 + welcome2;
}

/**
 * Check weather settings and call the requestWeather function (+ interval)
 **/

function displayWeatherInfo() {
    if (SETTINGS.weather.api != "" && SETTINGS.weather.town != "") {
        requestWeather();
        setInterval(requestWeather, 1800000); // Every 30 minutes
        get('#displayWeather').style.display = "block";
    } 
    else {
        get('#displayWeather').innerHTML = "";
        get('#displayWeather').style.display = "none";
    }
}

/**
 * Check the name and save it
 **/

function changeProfile() {
    if (get("#newName").checkValidity() && get("#newName").value != "") {
        get("#profileLabel").style.color = getVariableCSS("labelText");
        SETTINGS.profile.name = get("#newName").value;
        saveSettings();
    } else get("#profileLabel").style.color = getVariableCSS("errorText");
}

/**
 * Check the weather and save it
 **/

function changeWeather() {
    if (get('#weatherAPIValue').value != "" && get('#weatherTownValue').value != "") {
        get("#weatherAPILabel").style.color = getVariableCSS("labelText");
        get("#weatherTownLabel").style.color = getVariableCSS("labelText");
        SETTINGS.weather.api = get('#weatherAPIValue').value;
        SETTINGS.weather.town = get('#weatherTownValue').value;
        saveSettings();
        displayWeatherInfo();
    } else {
        get("#weatherAPILabel").style.color = getVariableCSS("errorText");
        get("#weatherTownLabel").style.color = getVariableCSS("errorText");
    }
}

/**
 * API request to OpenWeather and display the data
 **/

function requestWeather() {
    const OPEN_WEATHER = new Request('https://api.openweathermap.org/data/2.5/weather?q=' + SETTINGS.weather.town + '&appid=' + SETTINGS.weather.api + '&lang=' + _CONTENT.weatherLanguage + '&units=metric');

    fetch(OPEN_WEATHER)
        .then((response) => response.json())
        .then((weather) => {
            let timestamp = new Date(); let logo;
            if (timestamp.getHours() < 7 || timestamp.getHours() > 19) logo = "🌙";
            else {
                switch (weather.weather[0].main) {
                    case 'Clear': logo = "☀️"; break;
                    case 'Clouds': logo = "⛅"; break;
                    case 'Drizzle': logo = "🌧️"; break;
                    case 'Rain': logo = "🌧️"; break;
                    case 'Snow': logo = "❄️"; break;
                    case 'Thunderstorm': logo = "🌩️"; break;
                    case 'Atmosphere': logo = "🌩️"; break;
                    case 'Fog': logo = "🌫️"; break;
                    case 'Mist': logo = "🌫️"; break;
                    default : 
                        logo = "❓";
                        console.log(weather.weather[0].main);
                }
            }

        get('#displayWeather').innerHTML = logo + " " + Math.round(weather.main.temp) + " <sup>°c</sup>";
        })
        .catch((error) => {
            console.log(error);
            get('#displayWeather').innerHTML = "❓";
        });
}

// =================================================
// =================================================
// ============ THEMING

/**
 * Switch between application themes
 **/

function switchTheme() {
    if (SETTINGS.style.theme ==  "classic") {
        displayTheme("load", "custom");
        SETTINGS.style.theme = "custom";
    }
    else if (SETTINGS.style.theme == "custom") {
        displayTheme("load", "classic");
        SETTINGS.style.theme = "classic"
    }
    saveSettings();
}

/**
 * Display the custom background and change the CSS file
 * @param {string} mode auto (checking savinf data) or manual
 * @param {string} theme name of the theme called (only with "manual" mode)
 **/

function displayTheme(mode, theme = null) {
    if (SETTINGS.style.background != "") get("#app").style.backgroundImage = "url(" + SETTINGS.style.background.replace(/(\r\n|\n|\r)/gm, "") + ")";

    if (mode == "auto") 
        displayTheme("load", SETTINGS.profile.theme);
    else {
        if (theme == "classic") get("#theme").href = "assets/css/theme-classic.css";
        else if (theme == "custom") get("#theme").href = "assets/css/theme-custom.css";
    }
}

/**
 * Read the picture as base64 and save it
 **/
function changeBackground() {
    if (get("#backgroundValue").files.length != 0) {
        let reader = new FileReader();
        reader.readAsDataURL(get("#backgroundValue").files[0]);
        reader.onload = (e) => {
            let importData = e.target.result;
            SETTINGS.style.background = importData;
            get("#backgroundValue").value = null
            saveSettings();
            location.reload();
        }
    } else get("#backgroundLabel").style.color = getVariableCSS("errorText");
}

// =================================================
// =================================================
// ============ UNCATEGORIZED

/**
 * Save settings of the application into local storage
 **/

function saveSettings() {
    storage("set", "HOMEY-settings", JSON.stringify(SETTINGS))
}

/**
 * Check and update the version of the application
 **/

function checkVersion() {
    if (!SETTINGS.style) {
        storage("rem", "HOMEY-settings");
        location.reload();
    }

    if (SETTINGS.core.version != _VERSION) {
        SETTINGS.core.version = _VERSION;
        saveSettings();
    }    
}