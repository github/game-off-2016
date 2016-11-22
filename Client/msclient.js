var minesweeper = new ms(100, 15);
var msmap = [];
//numOfFields=minesweeper.size*minesweeper.size; //unused
//var fieldIcons = ["Bilder/0.png","Bilder/1.png","Bilder/2.png","Bilder/3.png","Bilder/4.png","Bilder/5.png","Bilder/6.png","Bilder/7.png","Bilder/8.png","Bilder/flagged.png","Bilder/default.png"];
drawMap();
function drawMap(){
    var tableEl = document.createElement("table");
    for (var y=0; y<minesweeper.size; y++){
        var trEl = document.createElement("tr");
        msmap.push([]);
        for (var x=0; x<minesweeper.size; x++){
            var tdEl = document.createElement("td");
            tdEl.className="game-item";
            tdEl.style["background-image"] = "url('bilder/default.png')";
            tdEl.addEventListener("click",send);
            trEl.appendChild(tdEl);
            msmap[y].push(tdEl);
        }
        tableEl.appendChild(trEl);
    }
    document.getElementById("game").appendChild(tableEl);

}
function send(e){
    var Coords = e.target.id.replace(/^(ms)/,"").split("_");

    console.log("updating map...");
    updateMap(minesweeper.clickBox({x:Number(Coords[0]), y:Number(Coords[1])}));//flyttes til connection.onmessage eller hva det nå enn heter
    console.log("done.");
}
function updateMap(theResultOfClickBox) {
    if(theResultOfClickBox.hit===true){
        theGameHasEnded();
        return;
    }
    for (var i=0; i<theResultOfClickBox.act.length;i++) {
        var x = theResultOfClickBox.act[i].x;
        var y = theResultOfClickBox.act[i].y;
        var t = theResultOfClickBox.act[i].numOfAdj;
        msmap[y][x].style.backgroundImage="url('bilder/"+t+".png')";
    }
}
function theGameHasEnded(){
    console.log("ya lost");
}
