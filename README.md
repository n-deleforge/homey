![Header](/docs/header.png)

<div align="center">

[![GitHub license](https://img.shields.io/github/license/n-deleforge/homey?style=for-the-badge)](https://github.com/n-deleforge/homey/blob/main/LICENCE)
![GitHub last commit](https://img.shields.io/github/last-commit/n-deleforge/homey?style=for-the-badge)
[![GitHub forks](https://img.shields.io/github/forks/n-deleforge/homey?style=for-the-badge)](https://github.com/n-deleforge/homey/network)
[![GitHub stars](https://img.shields.io/github/stars/n-deleforge/homey?style=for-the-badge)](https://github.com/n-deleforge/homey/stargazers)
[![Paypal](https://img.shields.io/badge/DONATE-PAYPAL.ME-lightgrey?style=for-the-badge)](https://www.paypal.com/paypalme/nicolasdeleforge)

</div>

# Overview

![Overview](/docs/overview.gif)

# Features

- Display the hour, the date and the weather (needs OpenWeather API Key).
- Display your favorite background and change the colors of the application.
- Preferences and settings can be saved and restored.

# Quick start

You can try the application directly in your browser [here](https://nicolas-deleforge.fr/homey/).  

If you want to selfhost **Homey** :
- Clone the repository.
- Download [littleJS](https://github.com/n-deleforge/littleJS) and include it in the `assets/js` folder.
- Edit `index.html` and replace the line 154 with `<script src="assets/littleJS.min.js"></script>`.

# Changelog

- 1.9.93 : New popup design, language switchable in the menu, error managing fixes.
- 1.9.91 : I decided to keep non-modifiable colors for the menu and the popup to keep visibility and accessibility for now. Only the app is modifiable.
- 1.9.9 : Again, I decided to cancel the CSS files thing. It would work great but it's completely not nice to work like that but I didn't want a complete CSS part in the app so I made a mix of everything and I added the possibility to change 4 main colors directly in the app. It works great and it's much easier. Also in the future, maybe I'll add more colors to change.
- 1.9 : Big changes. Now it's possible to edit CSS in live witthout modify CSS files. It is also possible to hide some elements as the date, the weather or the welcome message.
- 1.8 : "Original" theme removed for a "Custom" theme which is the same as the "Classic" theme but can be modified easily at your conveniance. Also add a function to display your own wallpaper which is saved as base64 data.
- 1.7 : New display of the app with the username, new menu, no popup anymore, lighter and cleaner.
- 1.6 : Internal applications system removed, better readability in JS with new functions and also much lighter, CSS variables added, new theme system with only CSS variables, CSS cleaning.
- 1.5 : Big JS rewriting, less JS, less CSS, new favicon, checkVersion function added, new menu display with categories.
- 1.4 : Some rewriting and fix in the open weather API request causing overload.
- 1.2 : English translation added, content of the app stored in array to switch easily between languages.
- 1.1 : Initial release.
