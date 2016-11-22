var minesweeper = new ms(100, 15);
var text = "";
numOfFields=0;
var fieldIcons = ["Bilder/0.png","Bilder/1.png","Bilder/2.png","Bilder/3.png","Bilder/4.png","Bilder/5.png","Bilder/6.png","Bilder/7.png","Bilder/8.png","Bilder/flagged.png","Bilder/default.png"];
drawMap();
function drawMap(){
	text += "<table>";
    for (var y=0; y<minesweeper.size; y++){
		text += "<tr>";
		for (var x=0; x<minesweeper.size; x++){
			text += '<td data-x ="'+x+'" data-y="'+y+'"></td>';
            numOfFields++;
		}
		text += "</tr>";
	}
	text += "</table";
	document.getElementById("game").innerHTML = text;
    for (var b = 0; b < minesweeper.size*minesweeper.size; b++) {
        document.getElementsByTagName("td")[b].style.backgroundImage = "url('Bilder/default.png')";
    }
    for (var i =0;i<numOfFields;i++){
        var knapper = document.querySelectorAll("td");
        knapper[i].addEventListener("click", send);
    }

}
function send(e){
    xCoord = Number(e.target.getAttribute("data-x"));
    yCoord = Number(e.target.getAttribute("data-y"));

    updateMap(minesweeper.clickBox({x:xCoord, y:yCoord}));//flyttes til connection.onmessage eller hva det nå enn heter
}
function updateMap(theResultOfClickBox) {
    if(theResultOfClickBox.hit==true){
        theGameHasEnded();

    }else {
        for (var i = 0; i < theResultOfClickBox.act.length; i++) {
            xCoord = theResultOfClickBox.act[i].x;
            yCoord = theResultOfClickBox.act[i].y;
            for (var j = 0; j < minesweeper.size*minesweeper.size; j++) {
                if (document.getElementsByTagName("td")[j].getAttribute("data-y")==yCoord&&document.getElementsByTagName("td")[j].getAttribute("data-x")==xCoord){
                    var styleText = "";
                    var t =theResultOfClickBox.act[i].numOfAdj;
                    switch (t) {
                        case 0:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/0.png')";
                            break;
                        case 1:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/1.png')";
                            break;
                        case 2:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/2.png')";
                            break;
                        case 3:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/3.png')";
                            break;
                        case 4:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/4.png')";
                            break;
                        case 5:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/5.png')";
                            break;
                        case 6:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/6.png')";
                            break;
                        case 7:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/7.png')";
                            break;
                        case 8:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/8.png')";
                            break;
                        default:
                            document.getElementsByTagName("td")[j].style.backgroundImage = "url('Bilder/default.png')";
                    }

                    j=minesweeper.size*minesweeper.size;


                }
            }
        }
    }
}
function theGameHasEnded(){
    console.log("ya lost");
}
