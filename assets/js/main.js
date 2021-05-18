// =================================================
// =================================================
// ============ MAIN

/**
 * Initialize the application
 **/

if (SETTINGS.core.start == false) {
    displayTheme();
    createMenuAtStart();
    get("#start").style.display = "flex";
    get("#importData").value = "";
} else {
    checkVersion();
    displayTheme();
    createMenuAtLoad();
    managingSubMenu();
    displayWeatherInfo();
    checkDisplayName();
    checkDisplayDate();
    displayApp();
    setInterval(displayApp, 1000);
    get("#start").style.display = "none";
    get("#app").style.display = "flex";
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
        const acceptedExtensions = ["json"];
        const input = get("#importData");

        if (input.files && input.files[0]) {
            const fileExtension = input.files[0].name.split('.').pop().toLowerCase();
            const fileAcceptable  = acceptedExtensions.indexOf(fileExtension) > -1;

            if (fileAcceptable) {
            const reader = new FileReader();
            reader.readAsText(input.files[0]);
                reader.onload = (e) => {
                    let importData = e.target.result;
                    SETTINGS = JSON.parse(importData);

                    saveSettings();
                    location.reload();
                }
            } else input.style.color = getVariableCSS("errorText");
        } else input.style.color = getVariableCSS("errorText");
    });
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
    get('#styleContent').value =  SETTINGS.style.css;
    if (SETTINGS.profile.displayName) get("#preferenceName").checked = true;
    if (SETTINGS.profile.displayDate) get("#preferenceDate").checked = true;
    if (SETTINGS.profile.displayWeather) get("#preferenceWeather").checked = true;

    // Button : profile
    get("#profileConfirm").addEventListener("click", changeProfile);

    // Button : weather
    get("#weatherConfirm").addEventListener("click", changeWeather);

    // Buttons : background
    get("#backgroundConfirm").addEventListener("click", changeBackground);
    get("#backgroundDelete").addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _CONTENT.popupBackground;

        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", deleteBackground);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", deleteBackground);
    });

    // Buttons : preferences
    get("#preferenceName").addEventListener("click", checkDisplayName);
    get("#preferenceDate").addEventListener("click", checkDisplayDate);
    get("#preferenceWeather").addEventListener("click", checkDisplayWeather);

    // Buttons : style
    get("#styleConfirm").addEventListener("click", changeStyle);
    get("#styleReset").addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _CONTENT.popupResetStyle;
    
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", resetStyle);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    
        get("#popupAccept").addEventListener("click", resetStyle);
    });

    // Button : backup
    get("#exportData").addEventListener("click", () =>  {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _CONTENT.popupBackup;
    
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", exportData);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    
        get("#popupAccept").addEventListener("click", exportData);
    });

    // Button : logout
    get("#logout").addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _CONTENT.popupLogout;
    
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", logout);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    
        get("#popupAccept").addEventListener("click", logout);
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
    get("#backgroundLabel").style.color = getVariableCSS("labelText");
}

/**
 * Managing the menu and the submenus
 **/

function managingSubMenu() {
    let subMenuOpened = false;
    const subMenuList = get(".listSettingsTitle");

    // First, hide the button to delete background if there is no background
    if (SETTINGS.style.background == "") get("#backgroundDelete").style.display = "none";

    // And then, hide all submenus
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
 * Check weather settings and call the requestWeather function (+ interval)
 **/

function displayWeatherInfo() {
    if (SETTINGS.profile.displayWeather && SETTINGS.weather.api != "" && SETTINGS.weather.town != "") {
        requestWeather();
        setInterval(requestWeather, 1800000); // Every 30 minutes
        get('#displayWeather').style.display = "block";
    } else {
        get('#displayWeather').innerHTML = "";
        get('#displayWeather').style.display = "none";
    }
}

/**
 * API request to OpenWeather and display the data
 **/

function requestWeather() {
    const request = new Request('https://api.openweathermap.org/data/2.5/weather?q=' + SETTINGS.weather.town + '&appid=' + SETTINGS.weather.api + '&lang=' + _CONTENT.weatherLanguage + '&units=metric');

    fetch(request)
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

/**
 * Display or hide the welcome message
 **/

 function checkDisplayName() {
    SETTINGS.profile.displayName = (get("#preferenceName").checked == true) ? true : false;
    get("#displayWelcome").style.display = (SETTINGS.profile.displayName) ? "block" : "none";
    saveSettings();
}

/**
 * Display or hide the date
 **/

 function checkDisplayDate() {
    SETTINGS.profile.displayDate = (get("#preferenceDate").checked == true) ? true : false;
    get("#displayDate").style.display = (SETTINGS.profile.displayDate) ? "block" : "none";
    saveSettings();
}

/**
 * Display or hide the weather
 **/

 function checkDisplayWeather() {
    SETTINGS.profile.displayWeather = (get("#preferenceWeather").checked == true) ? true : false;
    displayWeatherInfo();
    saveSettings();
}

// =================================================
// =================================================
// ============ THEMING

/**
 * Display the custom background / css
 **/

function displayTheme() {
    get("#styleVariables").innerHTML = ":root {" + SETTINGS.style.css + "}";

    if (SETTINGS.style.background != "") 
        get("#app").style.backgroundImage = "url(" + SETTINGS.style.background.replace(/(\r\n|\n|\r)/gm, "") + ")";
}

/**
 * Read the picture as base64 and save it
 **/

function changeBackground() {
    const acceptedExtensions = ["jpg", "jpeg", "png"];
    const input = get("#backgroundValue");

    if (input.files && input.files[0]) {
        const fileExtension = input.files[0].name.split('.').pop().toLowerCase();
        const fileAcceptable = acceptedExtensions.indexOf(fileExtension) > -1;

        if (fileAcceptable) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
            reader.onload = (e) => {
                let importData = e.target.result;
                SETTINGS.style.background = importData;
                input.value = null
                saveSettings();
                location.reload();
            }
        } else get("#backgroundLabel").style.color = getVariableCSS("errorText");   
    } else get("#backgroundLabel").style.color = getVariableCSS("errorText");
}

/**
 * Delete the background saved in base64
 **/

function deleteBackground() {
    SETTINGS.style.background = "";
    saveSettings();
    location.reload();
}

/**
 * Modify the CSS variables with a custom theme
 **/

function changeStyle() {
    if (get("#styleContent").value != "") {
        SETTINGS.style.css = get("#styleContent").value;
        saveSettings();
        displayTheme();
    }
}

/**
 * Delete the custom CSS and replace it with the original CSS
 **/

function resetStyle() {
    get("#styleContent").value = _CSS;
    changeStyle();
    get("#blankPopup").style.display = "none";
    get("#popup").style.display = "none";
}

// =================================================
// =================================================
// ============ UNCATEGORIZED

/**
 * Save settings of the application into local storage
 **/

function saveSettings() {
    setStorage("HOMEY-settings", JSON.stringify(SETTINGS))
}

/**
 * Create a file with localstorage data
 **/

function exportData() {
    download(JSON.stringify(SETTINGS), "homey.json"); 
}

/**
 * Delete all the data and restart the app
 **/

function logout() {
    remStorage("HOMEY-settings");
    location.reload();
}

/**
 * Check and update the version of the application
 **/

function checkVersion() {
    if (!SETTINGS.style.background) SETTINGS.style.background = "";
    if (!SETTINGS.style.css) SETTINGS.style.css = _CSS;
    if (!SETTINGS.profile.displayName) SETTINGS.profile.displayName = true;
    if (!SETTINGS.profile.displayDate) SETTINGS.profile.displayDate = true;
    if (!SETTINGS.profile.displayWeather) SETTINGS.profile.displayWeather = true;
    if (SETTINGS.core.version != _VERSION) SETTINGS.core.version = _VERSION;
    saveSettings();
}