# Homey

> Version 1.8 :memo:  
> A personal start page for your browser with date and weather.

## How to use it ?

You can try the app : https://nicolas-deleforge.fr/apps/homey/  
Or download it : https://github.com/n-deleforge/homey/archive/main.zip  
Or clone the git : ```git clone https://github.com/n-deleforge/homey.git```

## Note for self-host

If you download or clone the project to host it yourself, then you'll need [**Little JS**](https://github.com/n-deleforge/littleJS) at the line 118 of `index.html`.

# Changelog

- 1.9 : Big changes. Now it's possible to edit CSS in live witthout modify CSS files. It is also possible to hdie some elements as the date, the weather or the welcome message.
- 1.8 : "Original" theme removed for a "Custom" theme which is the same as the "Classic" theme but can be modified easily at your conveniance. Also add a function to display your own wallpaper which is saved as base64 data.
- 1.7.1 : A few changes into the display (hour back in the center), light theme retired, "original" theme added with an image as a background (I don't remember where I found it, sorry)
- 1.7 : New display of the app with the username, new menu, no popup anymore, lighter and cleaner
- 1.6 : Internal applications system removed, better readability in JS with new functions and also much lighter, CSS variables added, new theme system with only CSS variables, CSS cleaning
- 1.5 : Big JS rewriting, noteapp removed, less JS, less CSS, new favicon, checkVersion function added, new menu display with categories, dark and light themes
- 1.4 : Some rewriting and fix in the open weather API request causing overload
- 1.3 : Code cleaning and more comments in the JS code
- 1.2 : English translation added, content of the app stored in array to switch easily between languages
- 1.1 : Initial release
