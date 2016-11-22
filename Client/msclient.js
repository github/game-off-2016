var minesweeper = new ms(100, 15);
<<<<<<< HEAD
var text = "";
numOfFields = 0;
drawMap();

function drawMap() {
    text += "<table>";
    for (var y = 0; y < minesweeper.size; y++) {
        text += "<tr>";
        for (var x = 0; x < minesweeper.size; x++) {
            text += '<td data-x ="' + x + '" data-y="' + y + '"></td>';
            numOfFields++;
        }
        text += "</tr>";
    }
    text += "</table";
    document.getElementById("game").innerHTML = text;
    for (var b = 0; b < minesweeper.size * minesweeper.size; b++) {
        document.getElementsByTagName("td")[b].style.backgroundImage =
            "url('bilder/default.png')";
    }
    for (var i = 0; i < numOfFields; i++) {
        var knapper = document.querySelectorAll("td");
        knapper[i].addEventListener("click", send);
        knapper[i].style.backgroundImage = "url('bilder/default.png')";
=======
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
            tdEl.setAttribute("data-x",""+x);
            tdEl.setAttribute("data-y",""+y);
            tdEl.addEventListener("click",send);
            trEl.appendChild(tdEl);
            msmap[y].push(tdEl);
        }
        tableEl.appendChild(trEl);
>>>>>>> 696ab09b2410b906455f2bc484306ebe2f47ddb0
    }
    document.getElementById("game").appendChild(tableEl);

}
<<<<<<< HEAD

function send(e) {
    xCoord = Number(e.target.getAttribute("data-x"));
    yCoord = Number(e.target.getAttribute("data-y"));

    updateMap(minesweeper.clickBox({
        x: xCoord,
        y: yCoord
    })); //flyttes til connection.onmessage eller hva det nå enn heter
=======
function send(e){
    var xCoord = Number(e.target.getAttribute("data-x"));
    var yCoord = Number(e.target.getAttribute("data-y"));

    var result = minesweeper.clickBoxVerbose({x:xCoord, y:yCoord})
    console.log("updating map...");
    updateMap(result);//flyttes til connection.onmessage eller hva det nå enn heter
    console.log("Map udated.");
>>>>>>> 696ab09b2410b906455f2bc484306ebe2f47ddb0
}

function updateMap(theResultOfClickBox) {
<<<<<<< HEAD
    if (theResultOfClickBox.hit == true) {
        theGameHasEnded();
    } else {
        for (var i = 0; i < theResultOfClickBox.act.length; i++) {
            xCoord = theResultOfClickBox.act[i].x;
            yCoord = theResultOfClickBox.act[i].y;
            var tmptr = document.getElementsByTagName("tr");
            for (var j = 0; j < tmptr.length; j += 1) {
                if (tmptr[j].getAttribute("data-y") == yCoord) {
                    var tmptd = tmptr[j].getElementsByTagName("td");
                    for (var k = 0; k < minesweeper.size; k++) {
                        if (tmptd[k].getAttribute("data-x") == xCoord) {

                            var styleText = "";
                            var t = theResultOfClickBox.act[i].numOfAdj;
                            tmptd[j].style.backgroundImage = "url('bilder/'" +
                                t + ".png')";
                        }
                    }
                    break;
                }
            }
        }
=======
    if(theResultOfClickBox.hit===true){
        theGameHasEnded();
        return;
    }
    for (var i=0; i<theResultOfClickBox.act.length;i++) {
        var x = theResultOfClickBox.act[i].x;
        var y = theResultOfClickBox.act[i].y;
        var t = theResultOfClickBox.act[i].numOfAdj;
        msmap[y][x].style.backgroundImage="url('bilder/"+t+".png')";
>>>>>>> 696ab09b2410b906455f2bc484306ebe2f47ddb0
    }
}

function theGameHasEnded() {
    console.log("ya lost");
}
