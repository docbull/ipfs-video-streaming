//import { download } from './ipfs.js';

var player,firstLoad = true;
        
function init() {
    console.log("ABC");
    //download();

    player = dashjs.MediaPlayer().create();
    player.updateSettings({ 'debug': { 'logLevel': dashjs.Debug.LOG_LEVEL_NONE }});
}

function showEvent(e) {
    log("Event received: " + e.type);
    for (var name in e)
    {
        if (typeof e[name] != 'object') {
            log("    " + name + ": " + e[name]);
        }
    }
    for (name in e)
    {
        if (typeof e[name] == 'object' )
        {
            log("    " + name + ":");
            for (name2 in e[name])
            {
                log("        " + name2 + ": " + JSON.stringify(e[name][name2]));
            }
        }
    }
}
        
function log(msg) {
    msg = msg.length > 90 ? msg.substring(0, 90) + "..." : msg; 
    var tracePanel = document.getElementById("trace");
    tracePanel.innerHTML += msg + "\n";
    tracePanel.scrollTop = tracePanel.scrollHeight;
    console.log(msg);
}
        
function setListener(eventName) {
    player.on(dashjs.MediaPlayer.events[eventName],showEvent);
    var element = document.createElement("input");
    element.type = "button";
    element.className = "btn btn-danger";
    element.id = eventName;
    element.value = "Remove " + eventName;
    element.onclick = function() {
        player.off(dashjs.MediaPlayer.events[eventName],showEvent);
        document.getElementById("eventHolder").removeChild(element);
    };
    document.getElementById("eventHolder").appendChild(element);
}
        
function load(button) {
    var url = "data/Elephants/dash.mpd";
        
    if (!firstLoad)
    {
        player.attachSource(url);
    }
    else
    {
        firstLoad = false;
        button.value = "RELOAD PLAYER";
        player.initialize(document.querySelector("video"), url, true);
    }
    document.getElementById("trace").innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
    init();
});