var minesweeper = new ms('ws://pablodons.tk:9501', {
    open:function(e){

    },
    close:function(e){

    },
    command:function(e,cmd,data){
        var cmds = {
            getMap:function(req){
                drawMap(req);
            },
            clickBox:updateMap,
            flag:function(req){
                // Nothing yet
            }
        };
        console.log("command "+cmd+" called");
        cmds[cmd](data);
    },
});
var msmap = [];
function drawMap(getMapResult) {
    var gameEl = document.getElementById("game");
    var tableEl = document.querySelector("#game table");
    if (tableEl===null) {
        tableEl = document.createElement("table");
    }
    tableEl.textContent = "";
    for (var y = 0; y < getMapResult.length; y++) {
        var trEl = document.createElement("tr");
        tableEl.appendChild(trEl);
        msmap.push([]);
        for (var x = 0; x < getMapResult[y].length; x++) {
            var tdEl = document.createElement("td");
            trEl.appendChild(tdEl);

            msmap[y].push(tdEl);
            tdEl.className = "game-item";
            if (getMapResult[y][x].sel) {
                tdEl.style['background-image'] = "url('bilder/"+getMapResult[y][x].numOfAdj+".png')";
            } else {
                tdEl.style["background-image"] = "url('bilder/default.png')";
                tdEl.addEventListener("click", send);
            }
            tdEl.setAttribute("data-x", "" + x);
            tdEl.setAttribute("data-y", "" + y);
        }
    }
    gameEl.appendChild(tableEl);
    return msmap;
}



function send(e) {
    var xCoord = Number(e.target.getAttribute("data-x"));
    var yCoord = Number(e.target.getAttribute("data-y"));

    minesweeper.send("clickBox",{
        x: xCoord,
        y: yCoord,
    });
}

function updateMap(theResultOfClickBox) {
    if (theResultOfClickBox.hit === true) {
        theGameHasEnded();
        return;
    }
    for (var i = 0; i < theResultOfClickBox.act.length; i++) {
        selectBox(theResultOfClickBox.act[i]);
    }
}

function selectBox(act) {
    var x = act.x;
    var y = act.y;
    var t = act.numOfAdj;
    msmap[y][x].style["background-image"] = "url('bilder/" + t + ".png')";
    msmap[y][x].removeEventListener("click", send);
}

function theGameHasEnded() {
    console.log("ya lost");
}
