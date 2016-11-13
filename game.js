(function (){

	var canvas
	var context
	var upcoming_words = []
	var current_word 
	var current_letter = 0
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
	}
	
	function draw(){
		context.clearRect(0,0,width,height)
		context.fillStyle = "#555555"
		context.textAlign = "center"
		context.font = "112px Arial"
		context.fillText(current_word,width/2,height/2)
	}
	
	function controls(event){
		keycode = event.keyCode
		letter = String.fromCharCode(keycode)
		if (letter.toLowerCase() == current_word.substring(current_letter,current_letter+1)){
			current_letter += 1
		}
	}
	
	function nextWord(){
		upcoming_words.splice(0,1)
		upcoming_words.push(words[getRandomNumber(0,67724)].toLowerCase())
		current_word = upcoming_words[0]
		current_letter = 0
	}
	
    function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min+1)) + min;
    }
	

})(); 
