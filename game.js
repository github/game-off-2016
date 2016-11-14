(function (){

	var canvas
	var context
	var upcoming_words = []
	var current_word 
	var current_letter = 0
	var typed_word = ""
    var timer = 1000
	document.addEventListener('DOMContentLoaded', init, false);
  
    function init(){
		canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
		if (window.innerWidth-18< 1200){
			canvas.width = 1200;
		}
		else if (window.innerWidth-18 > 2200){
			canvas.width = 2200
		}
		else{
			canvas.width = window.innerWidth - 18;
		}
		if (window.innerHeight-18< 800){
			canvas.height = 800;
		}
		else if (window.innerHeight-18 > 1200){
			canvas.height = 1200
		}
		else{
			canvas.height = window.innerHeight - 18;
		}
        width = canvas.width;
        height = canvas.height;
		for (var i = 0; i < 10; i += 1){
			upcoming_words.push(words[getRandomNumber(0,67724)].toLowerCase())
		}
		current_word = upcoming_words[0]
		window.setInterval(main,33);
		window.addEventListener("keydown",controls,false);
    }
	
	function main(){
		if (current_letter === current_word.length){
			nextWord()
		}
		draw()
        timer--;
	}
	
	function draw(){
        context.beginPath();
        context.fillStyle= "#555555";
		context.clearRect(0,0,width,height);
        context.closePath();
        
        context.beginPath();
        context.fillStyle = "red";
        context.fillRect(10,10,timer,40);
        context.closePath();
        
        context.beginPath();
        context.fillStyle= "#555555";
		context.font = "40px Arial";
		context.fillText(current_word,50,height - 70);
		for (var i = 1; i < 10; i += 1){
			context.fillText(upcoming_words[i],50,height - 20 - (50*(i+1)));
        context.closePath();
		}
		context.fillStyle = "#ffffff";
		context.fillText(typed_word,50,height - 70);
        
	}
	
	function controls(event){
		keycode = event.keyCode
		letter = String.fromCharCode(keycode).toLowerCase()
		if (letter == current_word.substring(current_letter,current_letter+1)){
			current_letter += 1
			typed_word += letter
			timer += 20;
        }
        else{aoe
            timer -= 20;
		}
	}
	
	function nextWord(){
		upcoming_words.splice(0,1)
		upcoming_words.push(words[getRandomNumber(0,67724)].toLowerCase())
		current_word = upcoming_words[0]
		current_letter = 0
		typed_word = ""
	}
	
    function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min+1)) + min;
    }
	

})(); 
