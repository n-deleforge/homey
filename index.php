<?php
    $_VERSION = "1.930";
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HOMEY</title>
    <style id="styleVariables"></style>
    <link rel="stylesheet" href="assets/css/main.css?v=<?php echo $_VERSION; ?>">
    <link rel="icon" href="assets/images/favicon.ico">
</head>

<body>
    <div id="container">

        <!-- START -->
        <div id="start">
            <h1 id="startTitle"></h1>
                <p id="startP1"></p>
                <p id="startP2"></p>
                    <button class="button buttonSpecial" id="startApp"></button>
                    
                <p id="startP3"></p>
                <form class="formContainer">
                    <div class="formLine">
                        <input class="buttonSpecial" type="file" id="importData" accept="application/JSON">
                    </div>

                    <div class="listButtonCenter">
                        <button type="submit" class="button buttonSpecial" id="importConfirm" onclick="return false"></button> 
                     </div>
                </form>
        </div>
        <!-- START -->

        <!-- APP -->
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
                <h1 class="listSettingsTitle" id="styleTitle"></h1>
                <form class="formContainer">
                    <div class="formLine">
                        <textarea id="styleContent" spellcheck="false"></textarea>
                    </div>

                    <div class="formButton">
                        <button type="submit" class="buttonLine" id="styleConfirm" onclick="return false"></button>
                        <button class="buttonLine" id="styleReset" onclick="return false"></button>
                    </div>
                </form>
                <!-- // COLORS -->

                <!-- BUTTONS -->
                <h1 class="listSettingsTitle" id="setupTitle"></h1>
                    <button class="button" id="exportData"></button>
                    <button class="button" id="logout"></button>
                <!-- // BUTTONS -->
                
                <div id="blankSettings"></div>
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
        <!-- // APP -->

    </div>

    <script src="../../libraries/littleJS.min.js?v=<?php echo $_VERSION; ?>"></script>
    <script src="assets/js/core.min.js?v=<?php echo $_VERSION; ?>"></script>
    <script src="assets/js/main.min.js?v=<?php echo $_VERSION; ?>"></script>
</body>
</html>