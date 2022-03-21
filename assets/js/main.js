// =================================================
// ============ MAIN

displayTheme();
createMenu();
managingSubMenu();
checkPreference("all");
displayApp();
setInterval(displayApp, 1000);

// =================================================
// ============ MENU

/**
 * Create all the events for the buttons and the menu when the app is loaded
 **/

function createMenu() {
    // Button : open and close the menu
    get("#closeSettings").addEventListener("click", closeMenu);
    get("#blankPage").addEventListener("click", closeMenu);
    get("#displaySettings").addEventListener("click", () => {
        get("#blankPage").style.display = "flex";
        get("#displaySettings").style.display = "none";
        get('#listSettings').style.animation = "fadeInRight";
        get('#listSettings').style.animationDuration = "0.5s";
        get("#listSettings").style.display = "flex";
    })

    // Profle
    get("#newName").value = _settings.profile.name;
    get("#profileConfirm").addEventListener("click", changeProfile);

    // Weather
    get('#weatherAPIValue').value = _settings.weather.api;
    get('#weatherTownValue').value = _settings.weather.town;
    get("#weatherConfirm").addEventListener("click", changeWeather);

    // Background
    get("#backgroundConfirm").addEventListener("click", modifyBackground);
    get("#backgroundDelete").addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.popupBackground;
        get("#popupAccept").addEventListener("click", resetBackground);
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", resetBackground);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    });

    // Preferences
    if (_settings.profile.displayName == true) {
        get("#preferenceName").checked = true;
    }
    if (_settings.profile.displayDate == true) {
        get("#preferenceDate").checked = true;
    }
    if (_settings.profile.displayWeather == true) {
        get("#preferenceWeather").checked = true;
    }
    if (_settings.style.darkenBackground == true) {
        get("#preferenceBackground").checked = true;
    }
    get("#preferenceName").addEventListener("click", () => { checkPreference("name") });
    get("#preferenceDate").addEventListener("click", () => { checkPreference("date") });
    get("#preferenceWeather").addEventListener("click", () => { checkPreference("weather") });
    get("#preferenceBackground").addEventListener("click", () => { checkPreference("background") });

    // Colors
    get("#color1").value = _settings.style.color1;
    get("#color2").value = _settings.style.color2;
    get("#color3").value = _settings.style.color3;
    get("#colorConfirm").addEventListener("click", modifyTheme);
    get("#colorReset").addEventListener("click", () =>  {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.popupResetColor;
        get("#popupAccept").addEventListener("click", resetTheme);
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", resetTheme);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    });

    // Import and export
    get("#importData").style.color = getVariableCSS("label-text");
    get("#importConfirm").addEventListener("click", importData);
    get("#exportData").addEventListener("click", () =>  {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.popupBackup;
        get("#popupAccept").addEventListener("click", exportData);
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", exportData);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    });

    // Logout
    get("#logout").addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = CONTENT.popupLogout;
        get("#popupAccept").addEventListener("click", logout);
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", logout);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    });
}

/**
 * Close the menu
 **/

function closeMenu() {
    // Hide all submenu at closing
    const allSubMenu = get(".listSettingsTitle");
    allSubMenu.forEach((submenu, index) => {
        get(".listSettingsTitle")[index].nextElementSibling.style.display = "none";
    });

    // Hide the menu
    get("#displaySettings").style.display = "block";
    get("#listSettings").style.display = "none";
    get("#blankPage").style.display = "none";

    resetMenu();
}

/**
 * Managing the menu and the submenus
 **/

function managingSubMenu() {
    let subMenuOpened = false;
    const subMenuList = get(".listSettingsTitle");

    // First, if there is not background, hide all options about it
    if (_settings.style.background == "") {
        get("#backgroundDelete").style.display = "none";
        get("#darkenBackground").style.display = "none";
    } 
    else {
        get("#backgroundColor").style.display = "none";
    }

    // And then, hide all submenus
    subMenuList.forEach((subMenu, index) => {
        get(".listSettingsTitle")[index].nextElementSibling.style.display = "none";

        // Add an event on all submenu titles
        subMenu.addEventListener("click", () => {
            resetMenu();

            // Opening
            if (subMenu.nextElementSibling.style.display == "none") {
                // If one submenu is opened, close all the submenus
                if (subMenuOpened) {
                    subMenuList.forEach(subMenu => {
                        subMenu.nextElementSibling.style.display = "none";
                    })
                }
                
                // And open the one which is choosen (expect for the backup menu which is a flex)
                if (index == subMenuList.length -1) {
                    subMenu.nextElementSibling.style.display = "flex";
                }
                else {
                    subMenu.nextElementSibling.style.display = "block";
                }

                subMenuOpened = true;
            } 
            
            // Closing
            else {
                subMenu.nextElementSibling.style.display = "none";
            }
        });
    });
}

/**
 * Reset the color of the labels / borders
 **/

function resetMenu() {
    get("#profileLabel").style.color = getVariableCSS("label-text");
    get("#weatherAPILabel").style.color = getVariableCSS("label-text");
    get("#weatherTownLabel").style.color = getVariableCSS("label-text");
    get("#backgroundLabel").style.color = getVariableCSS("label-text");
    get("#importLabel").style.color = getVariableCSS("label-text");
}

// =================================================
// ============ TIME, DATE AND WEATHER

/**
 * Display time, date (+ interval) and name
 **/

function displayApp() {
    // Time and date
    const timestamp = new Date();
    let date = timestamp.toLocaleString(CONTENT.dateLanguage, { weekday: "long", month: "long", day: "numeric" }); 
    let hours = timestamp.getHours(), minutes = timestamp.getMinutes();
    if (hours < 10) {
        hours = '0' + hours;
    } 
    if (minutes < 10) {
        minutes = '0' + minutes;
    }

    // Welcome
    const welcome1 = timestamp.getHours() < 7 || timestamp.getHours() > 19 ? CONTENT.welcomeNight : CONTENT.welcomeDay;
    const welcome2 = _settings.profile.name != "" ? ' <span id="displayName">' + _settings.profile.name + '</span>' : "";

    get("#displayTime").innerHTML = hours + ":" + minutes;
    get("#displayDate").innerHTML = ucFirst(date.split(" ")[0]) + " " + date.split(" ")[1] + " " + ucFirst(date.split(" ")[2]);
    get("#displayWelcome").innerHTML = welcome1 + welcome2;
}

/**
 * Check the profile section informations and save it
 **/

 function changeProfile() {
    if (get("#newName").checkValidity() && get("#newName").value != "") {
        get("#profileLabel").style.color = getVariableCSS("label-text");
        _settings.profile.name = get("#newName").value;
        saveSettings();
    } 
    else {
        get("#profileLabel").style.color = getVariableCSS("error-text");
    }
}

/**
 * Check the weather section informations and save it
 **/

function changeWeather() {
    if (get('#weatherAPIValue').value != "" && get('#weatherTownValue').value != "") {
        get("#weatherAPILabel").style.color = getVariableCSS("label-text");
        get("#weatherTownLabel").style.color = getVariableCSS("label-text");
        _settings.weather.api = get('#weatherAPIValue').value;
        _settings.weather.town = get('#weatherTownValue').value;
        saveSettings();
        displayWeather();
    } 
    else {
        get("#weatherAPILabel").style.color = getVariableCSS("error-text");
        get("#weatherTownLabel").style.color = getVariableCSS("error-text");
    }
}

/**
 * Check weather settings and call the requestWeather function (+ interval)
 **/

function displayWeather() {
    if (_settings.profile.displayWeather && _settings.weather.api != "" && _settings.weather.town != "") {
        requestWeather();
        setInterval(requestWeather, 1800000); // Every 30 minutes
        get('#displayWeather').style.display = "block";
    } 
    else {
        get('#displayWeather').style.display = "none";
    }
}

/**
 * API request to OpenWeather and display the data
 **/

async function requestWeather() {
    const request = new Request('https://api.openweathermap.org/data/2.5/weather?q=' + _settings.weather.town + '&appid=' + _settings.weather.api + '&lang=' + CONTENT.weatherLanguage + '&units=metric');

    await fetch(request)
        .then((response) => response.json())

        .then((weather) => {
            let timestamp = new Date(), logo;

            if (timestamp.getHours() < 7 || timestamp.getHours() > 19) {
                logo = "🌙";
            }
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
// ============ THEMING

/**
 * Check the preferences and modify the display
 * @param {string} el element to check
 **/

 function checkPreference(el) {
    switch(el) {
        case "all" :
            checkPreference("name");
            checkPreference("date");
            checkPreference("weather");
            checkPreference("background");
            break;

        case "name" :
            _settings.profile.displayName = (get("#preferenceName").checked == true) ? true : false;
            get("#displayWelcome").style.display = (_settings.profile.displayName) ? "block" : "none";
            break;

        case "date" :
            _settings.profile.displayDate = (get("#preferenceDate").checked == true) ? true : false;
            get("#displayDate").style.display = (_settings.profile.displayDate) ? "block" : "none";
            break;

        case "weather" :
            _settings.profile.displayWeather = (get("#preferenceWeather").checked == true) ? true : false;
            displayWeather();
            break;

        case "background" :
            _settings.style.darkenBackground = (get("#preferenceBackground").checked == true) ? true : false;
            displayTheme();
            break;
    }

    saveSettings();
}

/**
 * Display the custom background / css
 **/

function displayTheme() {
    get("#css").innerHTML = ":root { --color-1 : " + _settings.style.color1 + "; --color-2 : " + _settings.style.color2 + "; --color-3 : " + _settings.style.color3 + "; }";

    if (_settings.style.background != "") {
        const background = "url(" + _settings.style.background.replace(/(\r\n|\n|\r)/gm, "") + ")";
        const linearGradient = "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),"

        if (_settings.style.darkenBackground) {
            get("#app").style.backgroundImage = linearGradient + background;
        }
        else {
            get("#app").style.backgroundImage = background;
        }
    }
}

/**
 * Modify current theme of the app
 **/

function modifyTheme() {
    _settings.style.color1 = get("#color1").value;
    _settings.style.color2 = get("#color2").value;
    _settings.style.color3 = get("#color3").value;
    saveSettings();
    displayTheme();
}

/**
 * Delete the custom user values
 **/

function resetTheme() {
    _settings.style.color1 = DEFAULT_VALUES.color1;
    _settings.style.color2 = DEFAULT_VALUES.color2;
    _settings.style.color3 = DEFAULT_VALUES.color3;
    get("#color1").value = DEFAULT_VALUES.color1;
    get("#color2").value = DEFAULT_VALUES.color2;
    get("#color3").value = DEFAULT_VALUES.color3;
    saveSettings();
    displayTheme();
    get("#blankPopup").style.display = "none";
    get("#popup").style.display = "none";
}

/**
 * Read the picture as base64 and save it
 **/

function modifyBackground() {
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
                _settings.style.background = importData;
                input.value = null
                saveSettings();
                location.reload();
            }
        } else {
            get("#backgroundLabel").style.color = getVariableCSS("error-text");
        }
    } else {
        get("#backgroundLabel").style.color = getVariableCSS("error-text");
    }
}

/**
 * Delete the background saved in base64
 **/

function resetBackground() {
    _settings.style.background = "";
    saveSettings();
    location.reload();
}

// =================================================
// ============ UNCATEGORIZED

/**
 * Save settings of the application into local storage
 **/

function saveSettings() {
    setStorage("HOMEY-settings", JSON.stringify(_settings));
}

/**
 *  Load a file to restore a previous save
 **/

function importData() {
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
                _settings = JSON.parse(importData);

                saveSettings();
                location.reload();
            }
        } else {
            get("#importLabel").style.color = getVariableCSS("error-text");
        }
    } else {
        get("#importLabel").style.color = getVariableCSS("error-text");
    }
}

/**
 * Create a file with localstorage data
 **/

function exportData() {
    download(JSON.stringify(_settings), "homey.json"); 
    get("#popupAccept").removeEventListener("click", exportData);
    get("#blankPopup").style.display = "none";
    get("#popup").style.display = "none";
}

/**
 * Delete all the data and restart the app
 **/

function logout() {
    remStorage("HOMEY-settings");
    location.reload();
}