(function (){

	var canvas
	var context
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
    }
	
	function main(){
		
	}
	
	function draw(){
		
	}
	
    function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min+1)) + min;
    }
	

})(); 
