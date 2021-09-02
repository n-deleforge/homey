// =================================================
// ============ MAIN

checkVersion();
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

    // Fill the existing data
    get("#newName").value = settings.profile.name;
    get('#weatherAPIValue').value = settings.weather.api;
    get('#weatherTownValue').value = settings.weather.town;

    // Button : profile + weather
    get("#profileConfirm").addEventListener("click", changeProfile);
    get("#weatherConfirm").addEventListener("click", changeWeather);

    // Buttons : background
    get("#backgroundConfirm").addEventListener("click", modifyBackground);
    get("#backgroundDelete").addEventListener("click", () => {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _content.popupBackground;

        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", resetBackground);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });

        get("#popupAccept").addEventListener("click", resetBackground);
    });

    // Buttons : preferences
    if (settings.profile.displayName == true) get("#preferenceName").checked = true;
    if (settings.profile.displayDate == true) get("#preferenceDate").checked = true;
    if (settings.profile.displayWeather == true) get("#preferenceWeather").checked = true;
    get("#preferenceName").addEventListener("click", () => { checkPreference("name") });
    get("#preferenceDate").addEventListener("click", () => { checkPreference("date") });
    get("#preferenceWeather").addEventListener("click", () => { checkPreference("weather") });

    // Buttons : theming
    get("#themeConfirm").addEventListener("click", modifyTheme);

    // Button : import and export
    get("#importData").style.color = getVariableCSS("labelText");
    get("#importConfirm").addEventListener("click", importData);
    get("#exportData").addEventListener("click", () =>  {
        get("#blankPopup").style.display = "block";
        get("#popup").style.display = "flex";
        get("#popupText").innerHTML = _content.popupBackup;
    
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
        get("#popupText").innerHTML = _content.popupLogout;
    
        get("#popupCancel").addEventListener("click", () => {
            get("#popupAccept").removeEventListener("click", logout);
            get("#blankPopup").style.display = "none";
            get("#popup").style.display = "none";
        });
    
        get("#popupAccept").addEventListener("click", logout);
    });
}

/**
 * Close the menu
 **/

function closeMenu() {
    // Hide all submenu at closing
    for (let i = 0; i < get(".listSettingsTitle").length; i++) get(".listSettingsTitle")[i].nextElementSibling.style.display = "none";

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

    // First, hide the button to delete background if there is no background
    if (settings.style.background == "") get("#backgroundDelete").style.display = "none";

    // And then, hide all submenus
    for (let i = 0; i < subMenuList.length; i++) {
        get(".listSettingsTitle")[i].nextElementSibling.style.display = "none";

        // Add an event on all submenu titles
        subMenuList[i].addEventListener("click", () => {
            resetMenu();

            // Opening
            if (subMenuList[i].nextElementSibling.style.display == "none") {
                // If one submenu is opened, close all the submenus
                if (subMenuOpened) for (let j = 0; j < subMenuList.length; j++) subMenuList[j].nextElementSibling.style.display = "none";
                
                // And open the one which is choosen (expect for the backup menu which is a flex)
                if (i == subMenuList.length -1) subMenuList[i].nextElementSibling.style.display = "flex";
                else subMenuList[i].nextElementSibling.style.display = "block";
                subMenuOpened = true;
            } 
            
            // Closing
            else subMenuList[i].nextElementSibling.style.display = "none";
        });
    }
}

/**
 * Reset the color of the labels / borders
 **/

function resetMenu() {
    get("#profileLabel").style.color = getVariableCSS("labelText");
    get("#weatherAPILabel").style.color = getVariableCSS("labelText");
    get("#weatherTownLabel").style.color = getVariableCSS("labelText");
    get("#backgroundLabel").style.color = getVariableCSS("labelText");
    get("#importLabel").style.color = getVariableCSS("labelText");
}

// =================================================
// ============ TIME, DATE AND WEATHER

/**
 * Display time, date (+ interval) and name
 **/

function displayApp() {
    // Time and date
    const timestamp = new Date();
    let date = timestamp.toLocaleString(_content.dateLanguage, { weekday: "long", month: "long", day: "numeric" }); 
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    if (hours < 10) hours = '0' + hours;  if (minutes < 10) minutes = '0' + minutes;

    // Welcome
    const welcome1 = timestamp.getHours() < 7 || timestamp.getHours() > 19 ? _content.welcomeNight : _content.welcomeDay;
    const welcome2 = settings.profile.name != "" ? ' <span id="displayName">' + settings.profile.name + '</span>' : "";

    get("#displayTime").innerHTML = hours + ":" + minutes;
    get("#displayDate").innerHTML = ucFirst(date.split(" ")[0]) + " " + date.split(" ")[1] + " " + ucFirst(date.split(" ")[2]);
    get("#displayWelcome").innerHTML = welcome1 + welcome2;
}

/**
 * Check the profile section informations and save it
 **/

 function changeProfile() {
    if (get("#newName").checkValidity() && get("#newName").value != "") {
        get("#profileLabel").style.color = getVariableCSS("labelText");
        settings.profile.name = get("#newName").value;
        saveSettings();
    } else get("#profileLabel").style.color = getVariableCSS("errorText");
}

/**
 * Check the weather section informations and save it
 **/

function changeWeather() {
    if (get('#weatherAPIValue').value != "" && get('#weatherTownValue').value != "") {
        get("#weatherAPILabel").style.color = getVariableCSS("labelText");
        get("#weatherTownLabel").style.color = getVariableCSS("labelText");
        settings.weather.api = get('#weatherAPIValue').value;
        settings.weather.town = get('#weatherTownValue').value;
        saveSettings();
        displayWeather();
    } else {
        get("#weatherAPILabel").style.color = getVariableCSS("errorText");
        get("#weatherTownLabel").style.color = getVariableCSS("errorText");
    }
}

/**
 * Check weather settings and call the requestWeather function (+ interval)
 **/

function displayWeather() {
    if (settings.profile.displayWeather && settings.weather.api != "" && settings.weather.town != "") {
        requestWeather();
        setInterval(requestWeather, 1800000); // Every 30 minutes
        get('#displayWeather').style.display = "block";
    } else get('#displayWeather').style.display = "none";
}

/**
 * API request to OpenWeather and display the data
 **/

async function requestWeather() {
    const request = new Request('https://api.openweathermap.org/data/2.5/weather?q=' + settings.weather.town + '&appid=' + settings.weather.api + '&lang=' + _content.weatherLanguage + '&units=metric');

    await fetch(request)
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
// ============ THEMING

/**
 * Check the preferences and modify the display
 * @param {string} value all, name, date or weather
 **/

 function checkPreference(value) {
    switch(value) {
        case "all" :
            checkPreference("name");
            checkPreference("date");
            checkPreference("weather");
            break;

        case "name" :
            settings.profile.displayName = (get("#preferenceName").checked == true) ? true : false;
            get("#displayWelcome").style.display = (settings.profile.displayName) ? "block" : "none";
            break;

        case "date" :
            settings.profile.displayDate = (get("#preferenceDate").checked == true) ? true : false;
            get("#displayDate").style.display = (settings.profile.displayDate) ? "block" : "none";
            break;

        case "weather" :
            settings.profile.displayWeather = (get("#preferenceWeather").checked == true) ? true : false;
            displayWeather();
            break;
    }

    saveSettings();
}

/**
 * Display the custom background / css
 **/

function displayTheme() {
    get("#theme").href = "assets/css/" + settings.style.theme + ".css";
    if (settings.style.background != "") get("#app").style.backgroundImage = "url(" + settings.style.background.replace(/(\r\n|\n|\r)/gm, "") + ")";
}

/**
 * Modify current theme of the app
 **/

function modifyTheme() {
    settings.style.theme = get("#themeList").selectedOptions[0].value;
    saveSettings();
    displayTheme();
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
                settings.style.background = importData;
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

function resetBackground() {
    settings.style.background = "";
    saveSettings();
    location.reload();
}

// =================================================
// ============ UNCATEGORIZED

/**
 * Save settings of the application into local storage
 **/

function saveSettings() {
    setStorage("HOMEY-settings", JSON.stringify(settings));
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
                settings = JSON.parse(importData);

                saveSettings();
                location.reload();
            }
        } else get("#importLabel").style.color = getVariableCSS("errorText");
    } else get("#importLabel").style.color = getVariableCSS("errorText");
}

/**
 * Create a file with localstorage data
 **/

function exportData() {
    download(JSON.stringify(settings), "homey.json"); 
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

/**
 * Check and update the version of the application
 **/

function checkVersion() {
    if (settings.core.version != _version)  {
        remStorage("HOMEY-settings");
        location.reload();
    }

    saveSettings();
}