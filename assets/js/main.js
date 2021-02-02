// =================================================
// =================================================
// ============ MAIN

// ===> Check if the app is already started
SETTINGS.core.start == false ? firstStart() : loadApp();

// ===> Display the first start
function firstStart() {
    get("#start").style.display = "flex";
    get("#importData").value = "";
    createMenu("start");
}

// ===> Display the loaded app
function loadApp() {
    get("#start").style.display = "none";
    get("#app").style.display = "flex";

    displayBasic();
    setInterval(displayBasic, 1000); // Update the hour and the date every second
    displayTheme("auto");
    displayWeatherInfo();
    checkVersion();
    createMenu();
}

// ===> Create events for the menu
function createMenu(mode) {
    if (mode == "start") {
        // Button : start the app
        get("#startApp").addEventListener("click", function () {
            SETTINGS.core.start = true;
            updateJSON();
            location.reload();
        }) 

        // Button : import settings
        get("#importConfirm").addEventListener("click", function () {
            if (get("#importData").files.length != 0) {
                let reader = new FileReader();
                reader.readAsText(get("#importData").files[0]);
                reader.onload = function (e) {
                    let importData = e.target.result;
                    settings = JSON.parse(importData);

                    updateJSON();
                    location.reload();
                }
            } 
            else get("#importData").style.color = getVariableCSS("--errorText");
        })
    }

    else {
        // Button : open settings menu
        get("#displaySettings").addEventListener("click", function () {
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
        get("#profilConfirm").addEventListener("click", function () {
            if (get("#newName").checkValidity() && get("#newName").value != "") {
                get("#profilLabel").style.color = getVariableCSS("--popupTextColor");
                SETTINGS.profile.name = get("#newName").value;
                updateJSON();
            } 
            else get("#profilLabel").style.color = getVariableCSS("--errorText");
        });

        // Button : change weather
        get("#weatherConfirm").addEventListener("click", function () {
            if (get('#weatherAPIValue').value != "" && get('#weatherTownValue').value != "") {
                get("#weatherAPILabel").style.color = getVariableCSS("--popupTextColor");
                get("#weatherTownLabel").style.color = getVariableCSS("--popupTextColor");
                SETTINGS.weather.api = get('#weatherAPIValue').value;
                SETTINGS.weather.town = get('#weatherTownValue').value;
                updateJSON();
                displayWeatherInfo();
            }
            else {
                get("#weatherAPILabel").style.color = getVariableCSS("--errorText");
                get("#weatherTownLabel").style.color = getVariableCSS("--errorText");
            }
        });

        // Button : export data
        get("#exportData").addEventListener("click", function() {
            if (confirm(__CONTENT.misc.backupText))
                backupSettings();
        });

        // Button : theme switch
        get("#switchTheme").addEventListener("click", switchTheme);

        // Button : logout
        get("#logout").addEventListener("click", function () {
            if (confirm(__CONTENT.misc.logoutText)) {
                storage("rem", "HOMEY-settings");
                location.reload();
            }
        });
    }
}

// ===> Call for closing the menu
function closeMenu() {
    get("#displaySettings").style.display = "block";
    get("#listSettings").style.display = "none";
    get("#blankPage").style.display = "none";

    get("#profilLabel").style.color = getVariableCSS("--labelText");
    get("#weatherAPILabel").style.color = getVariableCSS("--labelText");
    get("#weatherTownLabel").style.color = getVariableCSS("--labelText");
}

// =================================================
// =================================================
// ============ DATE AND WEATHER FUNCTIONS

// ===> Display the basic informations
function displayBasic() {
    // Hour and date
    let timestamp = new Date();
    let date = timestamp.toLocaleString(_CONTENT.misc.dateLanguage, { weekday: "long", month: "long", day: "numeric" }); 
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    if (hours < 10) hours = '0' + hours;  if (minutes < 10) minutes = '0' + minutes;

    // Welcome
    let welcome1 = timestamp.getHours() < 7 || timestamp.getHours() > 19 ? _CONTENT.misc.welcomeNight : _CONTENT.misc.welcomeDay;
    let welcome2 = SETTINGS.profile.name != "" ? ' <span id="displayName">' + SETTINGS.profile.name + '</span>' : "";

    get("#displayTime").innerHTML = hours + ":" + minutes;
    get("#displayDate").innerHTML = date;
    get("#displayWelcome").innerHTML = welcome1 + welcome2;
}

// ===> Display the weather with refresh
function displayWeatherInfo() {
    if (SETTINGS.weather.api != "" && SETTINGS.weather.town != "") {
        requestWeather();
        setInterval(requestWeather, 1800000); // Request the weather every 30 minutes
        get('#displayWeather').style.display = "block";
    } 
    else {
        get('#displayWeather').innerHTML = "";
        get('#displayWeather').style.display = "none";
    }
}

// ===> Request to OpenWeather
function requestWeather() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {

        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let data = JSON.parse(this.responseText); let timestamp = new Date(); let logo;

            if (timestamp.getHours() < 7 || timestamp.getHours() > 19) logo = "🌙";
            else {
                switch (data.weather[0].main) {
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

            get('#displayWeather').innerHTML = logo + " " + Math.round(data.main.temp) + " <sup>°c</sup>";
        }
        else get('#displayWeather').innerHTML = "❗";
    };

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + SETTINGS.weather.town + '&appid=' + SETTINGS.weather.api + '&lang=' + _CONTENT.misc.weatherLanguage + '&units=metric', true)
    req.send(null);
}

// =================================================
// =================================================
// ============ THEMING

// ===> Switch the app theme
function switchTheme() {
    switch(SETTINGS.profile.theme) {
        case "dark" : // Dark theme to light theme
            displayTheme("load", "light");
            SETTINGS.profile.theme = "light";
            updateJSON();
            break;

        case "light" : // Light theme to dark theme
            displayTheme("load", "dark");
            SETTINGS.profile.theme = "dark";
            updateJSON();
            break;
    }
}

// ===> Change the CSS file
function displayTheme(mode, theme) {
    if (mode == "auto") displayTheme("load", SETTINGS.profile.theme);
    else
        switch(theme) {
            case "dark" : // Dark theme
                get("#theme").href = "assets/css/theme-dark.min.css"; 
                break;

            case "light" : // Light theme
                get("#theme").href = "assets/css/theme-light.min.css";
                break;
        }
}

// =================================================
// =================================================
// ============ ASIDE FUNCTIONS

// ===> Update the localStorage
function updateJSON() {
    storage("set", "HOMEY-settings", JSON.stringify(SETTINGS))
}

// ===> Download settings written in a JSON file
function backupSettings() {
    download(JSON.stringify(SETTINGS), "homey.json");
}

// Check the version of the app
function checkVersion() {
    if (SETTINGS.core.version != _VERSION) {
        SETTINGS.core.version = _VERSION;
        updateJSON();
    }    
}