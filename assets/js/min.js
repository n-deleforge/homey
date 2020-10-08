const version="1.1";storage("get","HOMEY-settings")?settings=JSON.parse(storage("get","HOMEY-settings")):(settings={core:{start:!1,menu:!1,version:1},profile:{activated:"",name:""},favorite:{activated:"",editMode:"",content:[]},weather:{activated:"",api:"",town:""}},storage("set","HOMEY-settings",JSON.stringify(settings))),storage("get","HOMEY-apps")?apps=JSON.parse(storage("get","HOMEY-apps")):(apps={note:{activated:"",content:""}},storage("set","HOMEY-apps",JSON.stringify(apps)));const FR={start:{startTitle:"Bienvenue sur Homey !",startP1:"Si c'est ta première visite alors il faut configurer l'appli. Cela ne prendra que quelques secondes.",startP2:"Par contre, si tu as déjà utilisé l'application, tu peux importer tes données.",displayInitMenu:"Configuration",displayImportMenu:"Importation"},initMenu:{initMenuTitle:"Initialisation",initMenuLabel:"Prénom",initMenuCheck:"Ton prénom doit être composé entre 2 à 15 caractères.",confirmInitMenu:"Confirmer",closeInitMenu:"Annuler"},importMenu:{importMenuTitle:"Importation",importMenuLabel:"",importMenuCheck:'Le fichier de sauvegarde s\'appellement normalement "homey.json".',importMenuConfirm:"Confirmer",closeImportMenu:"Annuler"},logoutMenu:{logoutMenuTitle:"Déconnexion",logoutMenuText:"Cette action va entrainer la suppression de toutes les données et la réinitialisation de l'application.",logoutMenuConfirm:"Confirmer",closeLogoutMenu:"Annuler"},profileMenu:{profilMenuTitle:"Profil",profilMenuActivate:"Afficher le prénom",profilMenuLabel:"Prénom",profilMenuCheck:"Ton prénom doit être composé entre 2 à 15 caractères.",profilMenuConfirm:"Appliquer et fermer"},weatherMenu:{weatherMenuTitle:"Météo",weatherMenuActivate:"Activer la météo",weatherMenuAPILabel:"API OpenWeather",weatherMenuTownLebel:"Ville",weatherMenuCheck:"Les deux champs sont nécessaires.",weatherMenuConfirm:"Appliquer et fermer"},exportMenu:{exportMenuTitle:"Exportation",exportMenuContent:"Vous pouvez exporter les données de l'application afin d'avoir les même paramètres sur un autre appareil. Attention, ce fichier contient des données privées !",exportMenuConfirm:"Exporter",closeExportMenu:"Fermer"},appsMenu:{appsMenuTitle:"Mes applications",appsMenuContent:"Vous pouvez activer ou désactiver les applications.",appsMenuLabelNotes:"Notes",closeAppsMenu:"Appliquer et fermer"},favMenu:{favMenuTitle:"Gestion des favoris",favMenuLabel:"Activer les favoris",favMenuEditLabel:"Mode édition",closeFavMenu:"Appliquer et fermer"},favMenuAdd:{favMenuAddTitle:"Ajouter un favori",favMenuAddLabelName:"Nom",favMenuAddLabelURL:"Adresse",favMenuAddCheck:"Les deux champs sont nécessaires et doivent respecter un format correct.",favMenuAddConfirm:"Ajouter",closeFavAddMenu:"Annuler"},updateMenu:{updateMenuTitle:"Mise à jour 1.1",updateMenuText:"L'application a été mise à jour le 23 septembre 2020.<br />&#10145  Peu de nouveautés côté utilisateur.<br />&#10145 Le code de l'application a été largement modifié et simplifié.",closeUpdateMenu:"Fermer"},misc:{footerContent:'Bientôt disponible sur GitHub (v 1.1) - Hébergé sur  <a href="https://nicolas-deleforge.fr">nd</a>',noteTitle:"Mes notes",favTitle:'Favoris <span class="favEdit">(mode édition)</span>'},dynamic:{footerName:"Connecté en tant que",dateLanguage:"fr-FR",weatherLanguage:"FR"}},EN={start:{startTitle:"Welcome to Homey !",startP1:"If it's your first visit then you need to configure the application. It will only take a few seconds.",startP2:"However, if you already have used the application, you can import your data.",displayInitMenu:"Configure",displayImportMenu:"Import"},initMenu:{initMenuTitle:"Start",initMenuLabel:"Name",initMenuCheck:"Your name must be composed between 2 to 15 characters.",confirmInitMenu:"Confirm",closeInitMenu:"Cancel"},importMenu:{importMenuTitle:"Import",importMenuLabel:"",importMenuCheck:'The file is normally called "homey.json".',importMenuConfirm:"Confirm",closeImportMenu:"Cancel"},logoutMenu:{logoutMenuTitle:"Deconnection",logoutMenuText:"This action will delete all the data of the application.",logoutMenuConfirm:"Confirm",closeLogoutMenu:"Cancel"},profileMenu:{profilMenuTitle:"Profile",profilMenuActivate:"Display the name",profilMenuLabel:"Name",profilMenuCheck:"Your name must be composed between 2 to 15 characters.",profilMenuConfirm:"Confirm and close"},weatherMenu:{weatherMenuTitle:"Weather",weatherMenuActivate:"Activate the weather",weatherMenuAPILabel:"API OpenWeather",weatherMenuTownLebel:"Town",weatherMenuCheck:"The two fields are required.",weatherMenuConfirm:"Confirm and close"},exportMenu:{exportMenuTitle:"Export your data",exportMenuContent:"You can export the data of the application to import it on anoter device and keep your settings.Be careful, this file contains private data!",exportMenuConfirm:"Export",closeExportMenu:"Cancel"},appsMenu:{appsMenuTitle:"My applications",appsMenuContent:"You can activate or desactive apps here.",appsMenuLabelNotes:"Notes",closeAppsMenu:"Confirm and close"},favMenu:{favMenuTitle:"Favorite management",favMenuLabel:"Activate favorite",favMenuEditLabel:"Edit mode",closeFavMenu:"Confirm and close"},favMenuAdd:{favMenuAddTitle:"Add a favorite",favMenuAddLabelName:"Name",favMenuAddLabelURL:"Adress",favMenuAddCheck:"The two fields are required and must respect the correct format.",favMenuAddConfirm:"Add",closeFavAddMenu:"Cancel"},misc:{footerContent:'Soon available on GitHub (v 1.1) - Hosted on <a href="https://nicolas-deleforge.fr">nd</a>',noteTitle:"My notes",favTitle:'Favoris <span class="favEdit">(edit mode)</span>'},dynamic:{footerName:"Connected as",dateLanguage:"en-EN",weatherLanguage:"EN"}},language=FR;let favDisplayed=[];for(let e=0;e<Object.keys(language).length-1;e++){let t=language[Object.keys(language)[e]],n=Object.keys(t),a=Object.values(t);for(let e=0;e<n.length;e++)get("#"+n[e]).innerHTML=a[e]}if(1==settings.core.start&&"1.1"!=settings.core.version&&(openWindow("updateMenu"),get("#closeUpdateMenu").addEventListener("click",closeWindow),settings.core.version="1.1",updateJSON()),0==settings.core.start){get("#start").style.display="flex";for(let e=0;e<get("~input").length;e++)get("~input")[e].value="";for(let e=0;e<get("~textarea").length;e++)get("~textarea")[e].value=""}else displayApp(),displayFavs();function updateJSON(){storage("set","HOMEY-settings",JSON.stringify(settings)),storage("set","HOMEY-apps",JSON.stringify(apps))}function shortcutKeyboard(e){switch(e.key){case"N":case"n":1==settings.profile.activated?settings.profile.activated=!1:settings.profile.activated=!0,updateJSON(),displayApp();break;case"S":case"s":1==settings.core.menu?settings.core.menu=!1:settings.core.menu=!0,updateJSON(),displayApp();break;case"F":case"f":1==settings.favorite.activated?settings.favorite.activated=!1:settings.favorite.activated=!0,updateJSON(),displayApp();break;case"E":case"e":1==settings.favorite.editMode?settings.favorite.editMode=!1:settings.favorite.editMode=!0,updateJSON(),displayApp();break;case"W":case"w":1==settings.weather.activated?settings.weather.activated=!1:settings.weather.activated=!0,updateJSON(),displayApp()}}function openWindow(e){document.removeEventListener("keydown",shortcutKeyboard),get("#containerPopup").style.display="flex",get("#"+e).style.display="block"}function closeWindow(){get("#containerPopup").style.display="none";for(let e=0;e<get("#containerPopup").children.length;e++)get("#containerPopup").children[e].style.display="none";1==settings.core.start&&document.addEventListener("keydown",shortcutKeyboard)}function changeDisplay(e){"app"==e?(document.removeEventListener("keydown",shortcutKeyboard),get("#time").style.justifyContent="flex-start",get("#time").style.fontSize="1em",get("#time").style.flexGrow="0",get("#containerApps").style.display="flex",get("#containerApps").style.flexGrow="1"):(document.addEventListener("keydown",shortcutKeyboard),get("#time").style.justifyContent="center",get("#time").style.fontSize="2em",get("#time").style.flexGrow="1",get("#containerApps").style.display="none",get("#containerApps").style.flexGrow="0")}function displayFavs(){if(0!=settings.favorite.content.length)for(let e=0;e<settings.favorite.content.length;e++)if(-1==favDisplayed.indexOf(settings.favorite.content[e])){let t=document.createElement("a");t.target="_blank",t.innerHTML=settings.favorite.content[e].split("::")[0],t.href=settings.favorite.content[e].split("::")[1],get("#listFavs").lastElementChild.before(t),favDisplayed.push(settings.favorite.content[e]);let n=document.createElement("span");n.classList.add("favEdit"),0==get("#editMode").checked&&(n.style.display="none"),n.style.fontSize="0.8em",n.innerHTML="x",t.before(n),n.addEventListener("click",function(){let e=this.nextElementSibling.innerHTML+"::"+this.nextElementSibling.href.slice(0,-1),t=favDisplayed.indexOf(e);favDisplayed.splice(t,1),settings.favorite.content.splice(t,1),updateJSON(),this.nextElementSibling.remove(),this.remove()})}}function displayApp(){if(document.title="HOMEY - "+settings.profile.name,displayTime(),setInterval(displayTime,1e4),document.addEventListener("keydown",shortcutKeyboard),get("#start").style.display="none",get("#app").style.display="flex",1==settings.profile.activated?(get("#activateName").checked=!0,get("#displayName").innerHTML=language.dynamic.footerName+" <strong>"+settings.profile.name+"</strong>"):(get("#activateName").checked=!1,get("#displayName").innerHTML=""),1==settings.core.menu?(get("#listSettings").style.display="flex",get("#displaySettings").innerHTML="➖"):(get("#listSettings").style.display="none",get("#displaySettings").innerHTML="🔧"),""!=settings.weather.api&&(get("#weatherMenuAPIValue").value=settings.weather.api),""!=settings.weather.town&&(get("#weatherMenuTownValue").value=settings.weather.town),1==settings.weather.activated?(get("#activateWeather").checked=!0,get("#weatherMenuAPI").style.display="block",get("#weatherMenuTown").style.display="block",get("#weatherMenuCheck").style.display="block",displayWeatherInfo()):(get("#activateWeather").checked=!1,get("#weatherMenuAPI").style.display="none",get("#weatherMenuTown").style.display="none",get("#weatherMenuCheck").style.display="none",displayWeatherInfo()),1==apps.note.activated?(get("#activateNote").checked=!0,get("#displayNote").style.display="block"):(get("#activateNote").checked=!1,get("#displayNote").style.display="none"),1==settings.favorite.activated?(get("#activateFav").checked=!0,get("#listFavs").style.display="flex",get("#editMenu").style.display="block"):(get("#activateFav").checked=!1,get("#listFavs").style.display="none",get("#editMode").checked=!1,get("#editMenu").style.display="none"),1==settings.favorite.editMode){get("#editMode").checked=!0;for(let e=0;e<get(".favEdit").length;e++)get(".favEdit")[e].style.display="inline"}else{get("#editMode").checked=!1;for(let e=0;e<get(".favEdit").length;e++)get(".favEdit")[e].style.display="none"}get("#noteContainer").style.visibility="hidden",""!=apps.note.content&&(get("#note").value=apps.note.content),get("#note").addEventListener("change",function(){apps.note.content=get("#note").value,updateJSON()})}function displayTime(){let e=new Date,t=e.toLocaleString(language.dynamic.dateLanguage,{weekday:"long",month:"long",day:"numeric"}),n=e.getHours(),a=e.getMinutes();n<10&&(n="0"+n),a<10&&(a="0"+a),get("#displayTime").innerHTML=n+":"+a,get("#displayDate").innerHTML=t}function displayWeatherInfo(){1==settings.weather.activated&&""!=settings.weather.api&&""!=settings.weather.town?(requestWeather(),setInterval(requestWeather,18e5)):get("#displayWeather").innerHTML=""}function requestWeather(){const e=new XMLHttpRequest;e.onreadystatechange=function(){if(this.readyState===XMLHttpRequest.DONE)if(200===this.status){switch(data=JSON.parse(this.responseText),data.weather[0].main){case"Thunderstorm":var e="🌩";case"Drizzle":e="🌨";case"Rain":e="🌧";case"Snow":e="🌨";case"Atmosphere":e="🌪";case"Clear":e="☀";case"Clouds":e="⛅"}get("#displayWeather").innerHTML=e+" "+Math.round(data.main.temp)+" <sup>°c</sup>"}else get("#displayWeather").innerHTML="Erreur"},e.open("GET","https://api.openweathermap.org/data/2.5/weather?q="+settings.weather.town+"&appid="+settings.weather.api+"&lang="+language.misc.weatherLanguage+"&units=metric",!0),e.send(null)}function get(e){return-1!=e.search("#")&&null!=document.getElementById(e.split("#")[1])?document.getElementById(e.split("#")[1]):-1!=e.search("~")&&null!=document.querySelectorAll(e.split("~")[1])?document.querySelectorAll(e.split("~")[1]):-1!=e.search("\\.")&&0!=document.querySelectorAll(e).length?document.querySelectorAll(e):void 0}function storage(e,t,n){return"get"==e?localStorage.getItem(t):"set"==e?localStorage.setItem(t,n):"rem"==e?localStorage.removeItem(t):void 0}function ucFirst(e){return e.charAt(0).toUpperCase()+e.slice(1)}function download(e,t){let n=new Blob([e],{type:"text/plain"}),a=document.createElement("a");a.download=t,a.href=window.URL.createObjectURL(n),a.click()}get("#displayInitMenu").addEventListener("click",function(){get("#containerPopup").style.display="flex",get("#initMenu").style.display="block",get("#closeInitMenu").addEventListener("click",closeWindow),get("#confirmInitMenu").addEventListener("click",function(){get("#name").checkValidity()&&""!=get("#name").value?(settings.core.start=!0,settings.profile.activated=!0,settings.profile.name=get("#name").value,updateJSON(),displayApp(),displayFavs(),closeWindow()):get("#initMenuCheck").style.color="red"})}),get("#displayImportMenu").addEventListener("click",function(){get("#containerPopup").style.display="flex",get("#importMenu").style.display="block",get("#closeImportMenu").addEventListener("click",closeWindow),get("#importMenuConfirm").addEventListener("click",function(){if(0!=get("#importData").files.length){let e=new FileReader;e.readAsText(get("#importData").files[0]),e.onload=function(e){let t=atob(e.target.result);settings=JSON.parse(t.split("&&&")[0]),apps=JSON.parse(t.split("&&&")[1]),updateJSON(),location.reload()}}else get("#importMenuCheck").innerHTML="Le fichier est incorrect ou inexistant. Réessayer.",get("#importMenuCheck").style.color="red"})}),get("#displaySettings").addEventListener("click",function(){"none"==get("#listSettings").style.display?(get("#listSettings").style.animation="bounceIn",get("#listSettings").style.animationDuration="0.5s",settings.core.menu=!0,updateJSON(),displayApp()):(get("#listSettings").style.animation="bounceOut",get("#listSettings").style.animationDuration="0.5s",settings.core.menu=!1,updateJSON(),setTimeout(function(){displayApp()},500))}),get("#displayAppsMenu").addEventListener("click",function(){openWindow("appsMenu"),get("#closeAppsMenu").addEventListener("click",closeWindow),get("#activateNote").addEventListener("click",function(){1==get("#activateNote").checked?apps.note.activated=!0:apps.note.activated=!1,updateJSON(),displayApp()})}),get("#displayNote").addEventListener("click",function(){"hidden"==get("#noteContainer").style.visibility?(changeDisplay("app"),get("#noteContainer").style.visibility="visible",get("#note").focus()):(changeDisplay("normal"),get("#noteContainer").style.visibility="hidden")}),get("#displayFavMenu").addEventListener("click",function(){openWindow("favMenu"),get("#closeFavMenu").addEventListener("click",closeWindow),get("#activateFav").addEventListener("change",function(){1==get("#activateFav").checked?settings.favorite.activated=!0:settings.favorite.activated=!1,updateJSON(),displayApp()}),get("#editMode").addEventListener("change",function(){1==get("#editMode").checked?settings.favorite.editMode=!0:settings.favorite.editMode=!1,updateJSON(),displayApp()})}),get("#addFavAction").addEventListener("click",function(){openWindow("favMenuAdd"),get("#closeFavAddMenu").addEventListener("click",closeWindow),get("#favMenuAddConfirm").addEventListener("click",function(){if(get("#nameFav").checkValidity()&&""!=get("#nameFav").value&&get("#urlFav").checkValidity()&&""!=get("#urlFav").value){let e=get("#nameFav").value+"::"+get("#urlFav").value;settings.favorite.content.push(e),get("#nameFav").value="",get("#urlFav").value="https://",updateJSON(),closeWindow(),displayFavs()}else get("#favMenuAddCheck").style.color="red"})}),get("#displayLogoutMenu").addEventListener("click",function(){openWindow("logoutMenu"),get("#closeLogoutMenu").addEventListener("click",closeWindow),get("#logoutMenuConfirm").addEventListener("click",function(){localStorage.clear(),location.reload()})}),get("#displayExportMenu").addEventListener("click",function(){openWindow("exportMenu"),get("#closeExportMenu").addEventListener("click",closeWindow),get("#exportMenuConfirm").addEventListener("click",function(){download(btoa(JSON.stringify(settings)+"&&&"+JSON.stringify(apps)),"homey.json"),closeWindow()})}),get("#displayProfilMenu").addEventListener("click",function(){openWindow("profilMenu"),get("#newName").value=settings.profile.name,get("#profilMenuConfirm").addEventListener("click",function(){get("#newName").checkValidity()&&""!=get("#newName").value?(get("#profilMenuCheck").style.color="white",settings.profile.name=get("#newName").value,updateJSON(),displayApp(),closeWindow()):get("#profilMenuCheck").style.color="red"}),get("#activateName").addEventListener("change",function(){1==get("#activateName").checked?settings.profile.activated=!0:settings.profile.activated=!1,updateJSON(),displayApp()})}),get("#displayWeatherMenu").addEventListener("click",function(){openWindow("weatherMenu"),get("#weatherMenuAPIValue").addEventListener("input",function(){settings.weather.api=get("#weatherMenuAPIValue").value,updateJSON()}),get("#weatherMenuTownValue").addEventListener("input",function(){settings.weather.town=get("#weatherMenuTownValue").value,updateJSON()}),get("#weatherMenuConfirm").addEventListener("click",function(){1==settings.weather.activated?""!=settings.weather.api&&""!=settings.weather.town?(get("#weatherMenuCheck").style.color="white",displayWeatherInfo(),closeWindow()):get("#weatherMenuCheck").style.color="red":(settings.weather.activated=!1,updateJSON(),displayWeatherInfo(),closeWindow())}),get("#activateWeather").addEventListener("change",function(){1==get("#activateWeather").checked?settings.weather.activated=!0:settings.weather.activated=!1,updateJSON(),displayApp()})});