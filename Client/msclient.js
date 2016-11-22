var text = "";
numOfFields = 0;

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
    }

}

function send(e) {
    xCoord = Number(e.target.getAttribute("data-x"));
    yCoord = Number(e.target.getAttribute("data-y"));

    updateMap(minesweeper.clickBox({
        x: xCoord,
        y: yCoord
    })); //flyttes til connection.onmessage eller hva det nå enn heter
}

function updateMap(theResultOfClickBox) {
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
    }
}

function theGameHasEnded() {
    console.log("ya lost");
}
