// =================================================
// =================================================
// ============ MAIN

/**
 * Initialize the application
 **/

SETTINGS.core.start == false ? firstStart() : loadApp();

/**
 * Only called at the first start, checking data importation
 **/

function firstStart() {
    get("#start").style.display = "flex";
    get("#importData").value = "";
    createMenu("start");
}

/**
 * Called when the application is loaded from local storage (display everything)
 **/

function loadApp() {
    get("#start").style.display = "none";
    get("#app").style.display = "flex";

    displayBasic();
    setInterval(displayBasic, 1000);
    displayTheme("auto");
    displayWeatherInfo();
    checkVersion();
    createMenu();
}

/**
 * Create all the events for the buttons and the menu
 * @param {string} mode "start" for the first launch ortherwise "load"
 **/

function createMenu(mode) {
    if (mode == "start") {
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
            } 
            else get("#importData").style.color = getVariableCSS("errorText");
        })
    }

    else {
        // Button : open settings menu
        get("#displaySettings").addEventListener("click", () => {
            get("#blankPage").style.display = "flex";
            get("#displaySettings").style.display = "none";
            get('#listSettings').style.animation = "fadeInRight";
            get('#listSettings').style.animationDuration = "0.5s";
            get("#listSettings").style.display = "flex";
        })

        // Button : close settings menu
        get("#closeSettings").addEventListener("click", closeMenu)

        // Same function for the void aside the menu
        get("#blankPage").addEventListener("click", closeMenu)

        // Fill the data
        get("#newName").value = SETTINGS.profile.name;
        get('#weatherAPIValue').value = SETTINGS.weather.api;
        get('#weatherTownValue').value = SETTINGS.weather.town;

        // Button : change name
        get("#profileConfirm").addEventListener("click", () => {
            if (get("#newName").checkValidity() && get("#newName").value != "") {
                get("#profileLabel").style.color = getVariableCSS("labelText");
                SETTINGS.profile.name = get("#newName").value;
                saveSettings();
            } 
            else get("#profileLabel").style.color = getVariableCSS("errorText");
        });

        // Button : change weather
        get("#weatherConfirm").addEventListener("click", () => {
            if (get('#weatherAPIValue').value != "" && get('#weatherTownValue').value != "") {
                get("#weatherAPILabel").style.color = getVariableCSS("labelText");
                get("#weatherTownLabel").style.color = getVariableCSS("labelText");
                SETTINGS.weather.api = get('#weatherAPIValue').value;
                SETTINGS.weather.town = get('#weatherTownValue').value;
                saveSettings();
                displayWeatherInfo();
            }
            else {
                get("#weatherAPILabel").style.color = getVariableCSS("errorText");
                get("#weatherTownLabel").style.color = getVariableCSS("errorText");
            }
        });

        // Button : export data
        get("#exportData").addEventListener("click", () => {
            if (confirm(_CONTENT.backupText))
                download(JSON.stringify(SETTINGS), "homey.json");
        });

        // Button : theme switch
        get("#switchTheme").addEventListener("click", switchTheme);

        // Button : logout
        get("#logout").addEventListener("click", () => {
            if (confirm(_CONTENT.logoutText)) {
                storage("rem", "HOMEY-settings");
                location.reload();
            }
        });
    }
}

/**
 * Close the menu and reset the labels colors
 **/

function closeMenu() {
    get("#displaySettings").style.display = "block";
    get("#listSettings").style.display = "none";
    get("#blankPage").style.display = "none";

    get("#profileLabel").style.color = getVariableCSS("labelText");
    get("#weatherAPILabel").style.color = getVariableCSS("labelText");
    get("#weatherTownLabel").style.color = getVariableCSS("labelText");
}

// =================================================
// =================================================
// ============ TIME, DATE AND WEATHER

/**
 * Display time, date (+ interval) and name
 **/

function displayBasic() {
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
                    default : logo = "❓";
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
    switch(SETTINGS.profile.theme) {
        case "classic" : // Classic to original
            displayTheme("load", "original");
            SETTINGS.profile.theme = "original";
            saveSettings();
            break;

        case "original" : // Original to classic
            displayTheme("load", "classic");
            SETTINGS.profile.theme = "classic";
            saveSettings();
            break;
    }
}

/**
 * Change the CSS file
 * @param {string} mode auto (checking savinf data) or manual
 * @param {string} theme name of the theme called (only with "manual" mode)
 **/

function displayTheme(mode, theme = null) {
    if (mode == "auto") displayTheme("load", SETTINGS.profile.theme);
    else
        switch(theme) {
            case "classic" : // Classic theme
                get("#theme").href = "assets/css/theme-classic.min.css"; 
                break;

            case "original" : // Orignla theme
                get("#theme").href = "assets/css/theme-original.min.css";
                break;
        }
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
    if (SETTINGS.core.version != _VERSION) {
        SETTINGS.core.version = _VERSION;
        saveSettings();
    }    
}