<?php
    $_FILE_VERSIONING = "3034";
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOMEY</title>
    <style id="css">
        :root{--bodyBg:#262931;--bodyText:white;--timeText:lightcoral;--dateText:white;--weatherText:white;--welcomeText:white;--nameText:white;--settingsText:white;--settingsBackground:black;--settingsTitleBorder:lightcoral;--footerText:white;--footerLink:lightcoral;--buttonText:black;--buttonTextHover:white;--buttonBg:white;--buttonBgHover:lightcoral;--labelText:white;--inputText:black;--inputBorder:black;--inputFileText:white;--inputFileBorder:white;--transparency:rgba(0,0,0,0.5);--errorText:red}
    </style>
    <link rel="stylesheet" href="assets/css/main.css?v=<?php echo $_FILE_VERSIONING; ?>">
    <link rel="icon" href="assets/images/favicon.ico">
</head>

<body>
    <div id="container">

        <div id="app">
            <div id="app-wrapper">
                <div class="app-container app-containerLeftTop">
                    <p id="displayWelcome"></p>
                    <p id="displayWeather"></p>
                </div>
                <div class="app-container"></div>
                <div class="app-container"></div>
                <div class="app-container"></div>
                <div class="app-container">
                    <p id="displayTime"></p>
                    <p id="displayDate"></p>
                </div>
                <div class="app-container"></div>
                <div class="app-container"></div>
                <div class="app-container"></div>
                <div class="app-container"></div>
            </div>
            
            <button id="displaySettings">⚙️</button>

            <!-- MENU -->
            <div id="blankPage"></div>
            <div id="listSettings">
                <button id="closeSettings">❌</button>

                <!-- PROFILE -->
                <h1 class="listSettingsTitle" id="profileTitle"></h1>
                    <form class="formContainer">
                        <div class="formLine">
                            <label id="profileLabel" for="newName"></label>
                            <input type="text" id="newName" pattern="([a-zA-ZÀ-Ý -]){2,15}">
                        </div>

                        <div class="formButton">
                            <button type="submit" class="buttonLine" id="profileConfirm" onclick="return false"></button> 
                        </div>
                    </form>
                <!-- // PROFILE -->

                <!-- WEATHER -->
                <h1 class="listSettingsTitle" id="weatherTitle"></h1>
                    <form class="formContainer">
                        <div class="formLine" id="weatherAPI">
                            <label id="weatherAPILabel" for="weatherAPIValue"></label>
                            <input type="text" id="weatherAPIValue">
                        </div>

                        <div class="formLine" id="weatherTown">
                            <label id="weatherTownLabel" for="weatherTownValue"></label>
                            <input type="text" id="weatherTownValue">
                        </div>

                        <div class="formButton">
                            <button type="submit" class="buttonLine" id="weatherConfirm" onclick="return false"></button>
                        </div>
                    </form>
                <!-- // WEATHER -->

                <!-- BACKGROUND -->
                <h1 class="listSettingsTitle" id="backgroundTitle"></h1>
                    <form class="formContainer">
                        <div class="formLine">
                            <label id="backgroundLabel" for="backgroundValue"></label>
                            <input type="file" id="backgroundValue" accept="image/png, image/jpeg">
                        </div>

                        <div class="formButton">
                            <button type="submit" class="buttonLine" id="backgroundConfirm" onclick="return false"></button>
                            <button class="buttonLine" id="backgroundDelete" onclick="return false"></button>
                        </div>
                    </form>
                <!-- // BACKGROUND -->

                <!-- PREFERENCES -->
                <h1 class="listSettingsTitle" id="preferenceTitle"></h1>
                    <div id="preferenceList">
                        <div><input type="checkbox" id="preferenceName"><label id="preferenceNameLabel" for="preferenceName"></label></div>
                        <div><input type="checkbox" id="preferenceDate"><label id="preferenceDateLabel" for="preferenceDate"></label></div>
                        <div><input type="checkbox" id="preferenceWeather"><label id="preferenceWeatherLabel" for="preferenceWeather"></label></div>
                    </div>
                <!-- // PREFERENCES -->

                <!-- COLORS -->
                <h1 class="listSettingsTitle" id="cssTitle"></h1>
                <form class="formContainer">
                    <div class="formLine">
                        <textarea id="cssContent" spellcheck="false"></textarea>
                    </div>

                    <div class="formButton">
                        <button type="submit" class="buttonLine" id="cssConfirm" onclick="return false"></button>
                        <button class="buttonLine" id="cssReset" onclick="return false"></button>
                    </div>
                </form>
                <!-- // COLORS -->

                <!-- BACKUP -->
                <h1 class="listSettingsTitle" id="importTitle"></h1>
                <form class="formContainer formContainerColumn">
                    <p id="importText"></p>
                    <div class="formLine">
                        <input class="buttonSpecial" type="file" id="importData" accept="application/JSON">
                    </div>
                    <div class="listButtonCenter">
                        <button type="submit" class="buttonLine" id="importConfirm" onclick="return false"></button>
                    </div>
                </form>
                <!-- // BACKUP -->
                
                <div id="blankSettings"></div>
                <div class="listButtonCenter">
                    <button class="button" id="exportData"></button>
                    <button class="button" id="logout"></button>
                </div>
                <p id="footer"></p>
            </div>
            <!-- // MENU -->

            <!-- POPUP -->
            <div id="blankPopup"></div>
            <div id="popup">
                <div id="popupContent">
                    <h1 id="popupTitle"></h1>
                        <p id="popupText"></p>
                </div>
                <div class="listButton">
                    <button class="buttonLarge" id="popupAccept"></button>
                    <button class="buttonLarge" id="popupCancel"></button>
                </div>
            </div>
            <!-- // POPUP -->

        </div>
    </div>

    <script src="../../libraries/littleJS.min.js?v=<?php echo $_FILE_VERSIONING; ?>"></script>
    <script src="assets/js/core.js?v=<?php echo $_FILE_VERSIONING; ?>"></script>
    <script src="assets/js/main.js?v=<?php echo $_FILE_VERSIONING; ?>"></script>
</body>
</html>