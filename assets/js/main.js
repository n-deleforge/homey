// =================================================
// =================================================
// ============ INITIALISATION

// At first start
if (settings.core.start == false) {
    get("#start").style.display = "flex";
    createMenu("start");
    createButtons("start");
}
// When the app is already loaded
else {
    displayTheme("auto");
    displayApp();
    displayWeatherInfo();
    checkVersion();
    createMenu();
    createButtons();
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
    if (settings.weather.api != "" && settings.weather.town != "") {
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

        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            let data = JSON.parse(this.responseText);
            let timestamp = new Date();
            let logo;

            if (timestamp.getHours() < 7 || timestamp.getHours() > 19) 
                logo = "🌙";
            
            else {
                switch (data.weather[0].main) {
                    case 'Clear': logo = "☀";
                    case 'Clouds': logo = "⛅";
                    case 'Drizzle': logo = "🌨";
                    case 'Rain': logo = "🌧";
                    case 'Snow': logo = "🌨";
                    case 'Thunderstorm': logo = "🌩";
                    case 'Atmosphere': logo = "🌪";
                    case 'Fog': logo = "🌫";
                }
            }

            get('#displayWeather').innerHTML = logo + " " + Math.round(data.main.temp) + " <sup>°c</sup>";
        }
        else 
            get('#displayWeather').innerHTML = "❗";
    };

    req.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + settings.weather.town + '&appid=' + settings.weather.api + '&lang=' + display.misc.weatherLanguage + '&units=metric', true)
    req.send(null);
}

// =================================================
// =================================================
// ============ THEMING

// ===> Switch the app theme
function switchTheme() {
    if (settings.profile.theme == "dark") {
        displayTheme("misc", "light");
        settings.profile.theme = "light";    
    }
    else if (settings.profile.theme == "light") {
        displayTheme("misc", "dark");
        settings.profile.theme = "dark";
    }

    updateJSON();
}

// ===> Change the CSS file
function displayTheme(mode, theme) {
    if (mode == "auto")
        displayTheme("misc", settings.profile.theme);

    else {
        if (theme == "dark")
            get("#theme").href = "assets/css/theme-dark.min.css";
        if (theme == "light")
            get("#theme").href = "assets/css/theme-light.min.css";
    }
}

// =================================================
// =================================================
// ============ MENU & BUTTONS EVENTS

// ===> Create events for the menus
function createMenu(mode) {
    if (mode == "start") {
        // Import menu
        get("#displayImportMenu").addEventListener("click", function () {
            openWindow("importMenu");
            get("#closeImportMenu").addEventListener("click", closeWindow);

            get("#importMenuConfirm").addEventListener("click", function () {
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
                else {
                    get("#importMenuCheck").innerHTML = display.misc.errorImport;
                    get("#importMenuCheck").style.color = "red";
                }
            })
        });
    }

    else {
        // Profile menu
        get("#displayProfilMenu").addEventListener("click", function () {
            openWindow("profilMenu");
            get("#newName").value = settings.profile.name;

            get("#profilMenuConfirm").addEventListener("click", function () {
                if (get("#newName").checkValidity() && get("#newName").value != "") {
                    get("#profilMenuCheck").style.color = "white";
                    settings.profile.name = get("#newName").value;
                    updateJSON();
                    closeWindow();
                } 
                else
                    get("#profilMenuCheck").style.color = "red";
            });

            get("#closeProfileMenu").addEventListener("click", function () {
                    get("#profilMenuCheck").style.color = "white";
                    closeWindow();
            });
        });

        // Weather menu
        get("#displayWeatherMenu").addEventListener("click", function () {
            openWindow("weatherMenu");
            if (settings.weather.api != "") get('#weatherMenuAPIValue').value = settings.weather.api;
            if (settings.weather.town != "") get('#weatherMenuTownValue').value = settings.weather.town;

            get("#weatherMenuConfirm").addEventListener("click", function () {
                if (get('#weatherMenuAPIValue').value != "" && get('#weatherMenuTownValue').value != "") {
                        settings.weather.api = get('#weatherMenuAPIValue').value;
                        settings.weather.town = get('#weatherMenuTownValue').value;
                        get("#weatherMenuCheck").style.color = "white";
                        displayWeatherInfo();
                        closeWindow();
                    } 
                    else 
                        get("#weatherMenuCheck").style.color = "red";
            });

            get("#closeWeatherMenu").addEventListener("click", function () {
                get("#weatherMenuCheck").style.color = "white";
                updateJSON();
                displayWeatherInfo();
                closeWindow();
            });
        
        });  

        // Logout menu
        get("#displayLogoutMenu").addEventListener("click", function () {
            openWindow("logoutMenu");
            get("#closeLogoutMenu").addEventListener("click", closeWindow);

            get("#logoutMenuConfirm").addEventListener("click", function () {
                storage("rem", "HOMEY-settings");
                location.reload();
            });
        });
    }
}

// ===> Create events for the buttons
function createButtons(mode) {
    if (mode == "start") {
        // Button : start the app
        get("#startApp").addEventListener("click", function () {
            settings.core.start = true;
            updateJSON();
            location.reload();
        })      
    }

    else {
        // Button : open settings menu
        get("#displaySettings").addEventListener("click", function () {
            closeWindow();

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

        // Button : export data
        get("#exportData").addEventListener("click", function () {
            download(JSON.stringify(settings), "homey.json");
        });

        // Button : theme switch
        get("#switchTheme").addEventListener("click", switchTheme);        
    }
}

// =================================================
// =================================================
// ============ ASIDE FUNCTIONS

// ===> Update the localStorage
function updateJSON() {
    storage("set", "HOMEY-settings", JSON.stringify(settings))
}

// Check the version of the app
function checkVersion() {
    if (settings.core.version != version) {
        settings.core.version = version;
        updateJSON();
    }    
}

// ===> Open one popup
function openWindow(window) {
    get("#containerPopup").style.display = "flex";
    get("#" + window).style.display = "block";
}

// ===> Close every popup
function closeWindow() {
    get("#containerPopup").style.display = "none";

    for (let i = 0; i < get("#containerPopup").children.length; i++) 
        get("#containerPopup").children[i].style.display = "none";
}