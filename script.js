var main = function() {
    var getLinesFromFile = function(filename) {
	/// <returns type="array"> Array of lines from a file. </returns>
	var sentences = [];
	console.log('hereherher');
	$.get(filename, function(txt){
	    var lines = txt.responseText.split("\n");
	    for (var i = 0, len = lines.length; i < len; i++) {
		sentences.push(lines[i]);
		alert(lines[i]);
	    }
	}); 
	return sentences;
    }

    var pickRandomFromArray = function(array) {
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	}
	return array[getRandomInt(0, array.length)];
    }

    function GameResultPopup(){

	this.lostGameMessage = pickRandomFromArray(getLinesFromFile('./words/lostMessages'));
	
	this.render = function(result){
	    var winW = window.innerWidth;
	    var winH = window.innerHeight;
	    var $overlay = $('#overlay');
	    var $dialogbox = $('#dialogbox');

	    $overlay.show();

	    $overlay.css("height", String(winH) + "px");
	    $dialogbox.css("left" , String((winW/2) - (550 * .5)) + "px");
	    $dialogbox.css("top", "100px");
	    $dialogbox.animate({ top: 220}, 300);
	    $dialogbox.show()
	    
	    if (result) {
		$('#dialogboxHeader').html("Acknowledge This Message");
		$('#dialogboxBody').html("You have won");
		$('#dialogboxFooter').html('<div class="buttons">I want to play again!</div>');
		$('#dialogboxFooter').append('<div class="buttons">Gonna share this victory!</div>');
	    }
	    else {
		$('#dialogboxHeader').html("Game summary");
		$('#dialogboxBody').html(this.lostGameMessage);
		$('#dialogboxFooter').html('<div class="buttons">Play again!</div>');
	    }
	}
	this.accept = function(){
	    $('#dialogbox').hide();
	    $('#overlay').hide();
	    resetGame();
	}
    }

    var popup = new GameResultPopup() 
    var level = 1;
    var score = 0;

    //for( i=0; i < cubeNumber; i++){
    //	$('.blocks').append('<div class="rect"></div>');
   // }
    
    var beginGame = function(){

    }    

    var resetGame = function() {
	score = 0;
	$('.square').animate({ backgroundColor: '#E80000' }, 200);
    }

    $('.blocks').append('<div class="square"></div>');

    $('body').on('click', '.square', function() {
	$(this).animate({ backgroundColor: '#EEE' }, 200);
	var random = Math.random();
	if (random > 0.9){
	    $(this).animate({ backgroundColor: 'green' }, 200);
	    setTimeout(function () {
		popup.render(true);
	    }, 400)
	}
	else {
	    $(this).animate({ backgroundColor: 'black' }, 200);
	    setTimeout(function () {
		popup.render(false);
	    }, 400);
	}
    });
    $('body').on('click', '.buttons', function() {
	popup.accept();
    });

};

$(document).ready(main);

