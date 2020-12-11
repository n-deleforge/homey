// =================================================
// =================================================
// ============ INITIALISATION

// At first start
if (settings.core.start == false) {
    get("#start").style.display = "flex";
    for (let i = 0; i < get("~input").length; i++) get("~input")[i].value = "";
    for (let i = 0; i < get("~textarea").length; i++) get("~textarea")[i].value = "";

    // Initialization menu
    get("#displayInitMenu").addEventListener("click", function () {
        openWindow("initMenu");
        get("#closeInitMenu").addEventListener("click", closeWindow);

        get("#confirmInitMenu").addEventListener("click", function () {
            if (get("#name").checkValidity() && get("#name").value != "") {
                settings.core.start = true;
                settings.profile.activated = true;
                settings.profile.name = get("#name").value;

                updateJSON();
                location.reload();
            } 
            else 
                get("#initMenuCheck").style.color = "red";
        })
    })

    // Import menu
    get("#displayImportMenu").addEventListener("click", function () {
        openWindow("importMenu");
        get("#closeImportMenu").addEventListener("click", closeWindow);

        get("#importMenuConfirm").addEventListener("click", function () {
            if (get("#importData").files.length != 0) {
                let reader = new FileReader();
                reader.readAsText(get("#importData").files[0]);
                reader.onload = function (e) {
                    let importData = (atob(e.target.result));
                    settings = JSON.parse(importData);

                    updateJSON();
                    location.reload();
                }
            } 
            else {
                get("#importMenuCheck").innerHTML = display.misc.errorImport;
                get("#importMenuCheck").style.color = "red";
            }
        })
    })
}
// In any other case
else {
    displayApp();
    displayWeatherInfo();

    // Button : open settings menu
    get("#displaySettings").addEventListener("click", function () {
        closeWindow();
        displayNoteApp("forceClose");

        get("#displaySettings").style.display = "none";
        get('#listSettings').style.animation = "fadeInRight";
        get('#listSettings').style.animationDuration = "0.5s";
        get("#listSettings").style.display = "flex";
    })

    // Button : close settings menu
    get("#closeSettings").addEventListener("click", function () {
        get("#displaySettings").style.display = "block";
        get("#listSettings").style.display = "none";
    })

    // Button : note app
    get("#displayNote").addEventListener("click", displayNoteApp);

    // Button : export data
    get("#exportData").addEventListener("click", function () {
        download(btoa(JSON.stringify(settings)), "homey.json");
    });

    // Button : theme switch
    get("#switchTheme").addEventListener("click", switchTheme);

    // Button : apps list
    get("#displayAppsMenu").addEventListener("click", function () {
        openWindow("appsMenu");
        get("#closeAppsMenu").addEventListener("click", closeWindow);

        get("#activateNote").addEventListener("click", function () {
            if (get('#activateNote').checked == true) 
                settings.note.activated = true
            else 
                settings.note.activated = false;
            
            updateJSON();
            displayApp();
        });
    })

    // Logout menu
    get("#displayLogoutMenu").addEventListener("click", function () {
        openWindow("logoutMenu");
        get("#closeLogoutMenu").addEventListener("click", closeWindow);

        get("#logoutMenuConfirm").addEventListener("click", function () {
            storage("rem", "HOMEY-settings");
            location.reload();
        });
    });

    // Profile menu
    get("#displayProfilMenu").addEventListener("click", function () {
        openWindow("profilMenu");
        get("#newName").value = settings.profile.name;

        get("#profilMenuConfirm").addEventListener("click", function () {
            // Check the regex for the name
            if (get("#newName").checkValidity() && get("#newName").value != "") {
                get("#profilMenuCheck").style.color = "white";
                settings.profile.name = get("#newName").value;

                updateJSON();
                displayApp();
                closeWindow();
            } 
            else
                get("#profilMenuCheck").style.color = "red";
        })
    });

    // Weather menu
    get("#displayWeatherMenu").addEventListener("click", function () {
        openWindow("weatherMenu");

        get('#weatherMenuAPIValue').addEventListener("input", function () {
            settings.weather.api = get('#weatherMenuAPIValue').value;
            updateJSON();
        })

        get('#weatherMenuTownValue').addEventListener("input", function () {
            settings.weather.town = get('#weatherMenuTownValue').value;
            updateJSON();
        })

        get("#weatherMenuConfirm").addEventListener("click", function () {
            if (settings.weather.activated == true) {
                if (settings.weather.api != "" && settings.weather.town != "") {
                    get("#weatherMenuCheck").style.color = "white";
                    displayWeatherInfo();
                    closeWindow();
                } 
                else 
                    get("#weatherMenuCheck").style.color = "red";
            }
            else {
                settings.weather.activated = false;
                updateJSON();
                displayWeatherInfo();
                closeWindow();
            }
        });

        get('#activateWeather').addEventListener("change", function () {
            if (get('#activateWeather').checked == true)
                settings.weather.activated = true
            else
                settings.weather.activated = false;

            updateJSON();
            displayApp();
        })
    });
}

// =================================================
// =================================================
// ============ MAIN FUNCTIONS

// ===> Display the application
function displayApp() {
    document.title = "HOMEY - " + settings.profile.name; // Change the name of the window
    displayTime();
    setInterval(displayTime, 1000); // Update the hour and the date every second
    get("#start").style.display = "none";
    get("#app").style.display = "flex";

    // Display of the theme
    if (settings.profile.theme == "dark") 
        displayTheme("dark");
    else if (settings.profile.theme == "light") 
        displayTheme("light");

    // Display of the weather informations
    if (settings.weather.api != "") 
        get('#weatherMenuAPIValue').value = settings.weather.api;
    if (settings.weather.town != "") 
        get('#weatherMenuTownValue').value = settings.weather.town;

    // Display of the weather app
    if (settings.weather.activated == true) {
        get('#activateWeather').checked = true;
        get('#weatherMenuAPI').style.display = "flex";
        get('#weatherMenuTown').style.display = "flex";
        get('#weatherMenuCheck').style.display = "block";
    } else {
        get('#activateWeather').checked = false;
        get('#weatherMenuAPI').style.display = "none";
        get('#weatherMenuTown').style.display = "none";
        get('#weatherMenuCheck').style.display = "none";
    }

    // Display of the note app
    get('#noteContainer').style.visibility = "hidden";
    if (settings.note.activated == true) {
        get('#activateNote').checked = true;
        get("#displayNote").style.display = "block";
    } else {
        get('#activateNote').checked = false;
        get("#displayNote").style.display = "none";
    } 
}

// ===> Display the hour and date
function displayTime() {
    let timestamp = new Date();
    let date = timestamp.toLocaleString(display.misc.dateLanguage, {
        weekday: "long",
        month: "long",
        day: "numeric"
    }); 
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    if (hours < 10) hours = '0' + hours; 
    if (minutes < 10) minutes = '0' + minutes;

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
    else 
        get('#displayWeather').innerHTML = "";
}

// ===> Request to OpenWeather
function requestWeather() {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {

        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                let data = JSON.parse(this.responseText);
                let timestamp = new Date();
                let logo;

                if (timestamp.getHours() < 7 || timestamp.getHours() > 19) 
                    logo = "🌙";
                else {
                    switch (data.weather[0].main) {
                        case 'Thunderstorm': logo = "🌩";
                        case 'Drizzle': logo = "🌨";
                        case 'Rain': logo = "🌧";
                        case 'Snow': logo = "🌨";
                        case 'Atmosphere': logo = "🌪";
                        case 'Clear': logo = "☀";
                        case 'Clouds': logo = "⛅";
                    }
                }
                get('#displayWeather').innerHTML = logo + " " + Math.round(data.main.temp) + " <sup>°c</sup>";
            }
        }
        else 
            get('#displayWeather').innerHTML = "❗";
    };

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + settings.weather.town + '&appid=' + settings.weather.api + '&lang=' + display.misc.weatherLanguage + '&units=metric', true)
    req.send(null);
}

// =================================================
// =================================================
// ============ APPS DISPLAY

// ===> Modify the display
function changeDisplay(mode) {
    if (mode == "app") {
        get("#time").style.justifyContent = "flex-start";
        get("#time").style.fontSize = "1em";
        get("#time").style.flexGrow = "0";
        get("#containerApps").style.display = "flex";
        get("#containerApps").style.flexGrow = "1";

        if (mobile && settings.weather.activated == true) 
            get("#displayWeather").style.display = "none";
    } 
    
    else {
        get("#time").style.justifyContent = "center";
        get("#time").style.fontSize = "2em";
        get("#time").style.flexGrow = "1";
        get("#containerApps").style.display = "none";
        get("#containerApps").style.flexGrow = "0";

        if (mobile && settings.weather.activated == true) 
            get("#displayWeather").style.display = "block";
    }
}

// ===> Display or hide the app note
function displayNoteApp(mode) {
    // Display and save any content
    if (settings.note.content != "") get('#note').value = settings.note.content;
    get('#note').addEventListener("change", function () {
        settings.note.content = get("#note").value;
        updateJSON();
    });

    // Behaviour of the app
    if (mode == "forceClose") {
        changeDisplay("normal");
        get('#noteContainer').style.visibility = "hidden";
    }
    else {
        if (get('#noteContainer').style.visibility == "hidden") {
            changeDisplay("app"); 
            get('#noteContainer').style.visibility = "visible";
            get('#note').focus(); 
        } 
        else {
            changeDisplay("normal"); 
            get('#noteContainer').style.visibility = "hidden";
        }
    }
}

// =================================================
// =================================================
// ============ THEMING

// ===> Switch the app theme
function switchTheme() {
    switch (settings.profile.theme) {
        case "dark":
            displayTheme("light");
            settings.profile.theme = "light";
            updateJSON();
            break;

        case "light":
            displayTheme("dark");
            settings.profile.theme = "dark";
            updateJSON();
            break;
    }
}

// ===> Change the CSS file
function displayTheme(theme) {
    if (theme == "dark")
        get("#theme").href = "assets/css/theme-dark.min.css";

    if (theme == "light")
        get("#theme").href = "assets/css/theme-light.min.css";
}

// =================================================
// =================================================
// ============ ASIDE FUNCTIONS

// ===> Update the localStorage
function updateJSON() {
    storage("set", "HOMEY-settings", JSON.stringify(settings))
}

// ===> Open one popup
function openWindow(idWindow) {
    get("#containerPopup").style.display = "flex";
    get("#" + idWindow).style.display = "block";
}

// ===> Close every popup
function closeWindow() {
    get("#containerPopup").style.display = "none";

    for (let i = 0; i < get("#containerPopup").children.length; i++) 
        get("#containerPopup").children[i].style.display = "none";
}