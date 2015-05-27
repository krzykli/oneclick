var main = function() {
    var getLinesFromFile = function(filename){
	/// <returns type="array"> Array of lines from a file. </returns>
	var sentences = [];
	$.ajax({ 
	    url: filename, 
            async: false,
            type: 'GET',
	    success: function(txt) {
		var lines = txt.split("\n");
		for (var i = 0, len = lines.length; i < len; i++) {
		    if (lines[i]){ 
			sentences.push(lines[i]);		    
		    }
		}
	    }
        });
	return sentences; 
    }

    var pickRandomFromArray = function(array){
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min)) + min;
	}
	return array[getRandomInt(0, array.length)];
    }

    function GameResultPopup(){
	// get the array of game over phrases
	this.gameOverMessages = getLinesFromFile('data/gameOverMessages');
	this.victoryVideos = getLinesFromFile('data/victoryVideos');

	this.render = function(result){
	    var winW = window.innerWidth;
	    var winH = window.innerHeight;
	    var $overlay = $('#overlay');
	    var $dialogbox = $('#dialogbox');

	    $overlay.show();

	    $overlay.css("height", String(winH) + "px");
	    $dialogbox.css("left" , String((winW/2) - (550 * .5)) + "px");
	    $dialogbox.css("top", "100px");
	    $dialogbox.animate({ top: 120}, 200);
	    $dialogbox.show()
	    
	    if (result) {
		$('#dialogboxHeader').html("<h3>Congratulations!</h3>");
		$('#dialogboxHeader').css({"backgroundColor": "#78AB46", "color":"white"})
		$('#dialogboxBody').html("<h4>You have won!</h4>");
		var victoryVideoLink = pickRandomFromArray(this.victoryVideos);
		$('#dialogboxBody').append('<iframe width="450" height="315" src="' + victoryVideoLink + '?rel=0&autoplay=1" frameborder="0" allowfullscreen></iframe>');
		$('#dialogboxFooter').html('<div class="buttons playAgain"><p class="noselect">Play again</p></div>');
		$('#dialogboxFooter').append('<div class="buttons share-button"><p class="noselect">Share this victory!</p></div>');
	    }
	    else {
		var lostGameMessage = pickRandomFromArray(this.gameOverMessages);
		$('#dialogboxHeader').html("<h3>Game Over</h3>");
//		$('#dialogboxHeader').css("backgroundColor", "#ED1C24")
		$('#dialogboxBody').html('<h4>' + lostGameMessage + '</h4>');
		$('#dialogboxFooter').html('<div class="buttons playAgain"><p class="noselect">Play again</p></div>');
	    }
	}
	this.accept = function(){
	    $('#dialogbox').hide();
	    $('#overlay').hide();
	    $('#dialogboxBody').html("");
	    $('#dialogboxHeader').removeAttr('style');
	    resetGame();
	}
    }

    var $square = $('#square');
    var squareColor = '#E80000';
    var squareHoverColor = 'red';
    var squareGameOverColor = 'black';
    var squareWinColor = 'green';

    function SquareObj(){
	// 0 reset, -1 lost, 1 win
	this.state = 0;
	var active = true;

	var squareFadeTime = 200;

	this.deactivate = function () {
	    $square.addClass(".not-active");
	    $('body').off('click', $square);
	    active = false;
	}

	this.activate = function() {
	    $square.removeClass(".not-active");
	    active = true;
	}
	
	this.setState = function(state){
	    switch(state){
	    case -1:
		$square.animate({ backgroundColor: squareGameOverColor }, squareFadeTime);
		break;
	    case 0:
		$square.animate({ backgroundColor: squareColor }, squareFadeTime);
		break;
	    case 1:
		$square.animate({ backgroundColor: squareWinColor }, squareFadeTime);
		break;
	    default:
		console.log('Refresh');
	    }
	}

	this.isActive = function(){
	    return active;
	}
    }

    var popup = new GameResultPopup(); 
    var squareObj = new SquareObj();

    var squareFadeTime = 200;
    var popupDelayTime = 300;
    
    var resetGame = function() {
	squareObj.setState(0);
	squareObj.activate();
    }

    $square.click( function() {
	var random = Math.random();
	// Disable interaction right after the click to avoid multi clicking
	if (!squareObj.isActive()){
	    return;
	}
	squareObj.deactivate();
	
	if (random > 0.9){
	    squareObj.setState(1);
	    setTimeout(function () {
		popup.render(true);
	    }, popupDelayTime)
	}
	else {
	    squareObj.setState(-1);
	    setTimeout(function () {
		popup.render(false);
	    }, popupDelayTime);
	}
    });

    $('body').on('click', '.buttons', function() {
	popup.accept();
    });

    $('body').on('click', '.share-button', function() {
	FB.ui(
	  {
	    method: 'share',
	    href: 'https://developers.facebook.com/docs/',
	  },
	  // callback
	  function(response) {
	    if (response && !response.error_code) {
	      alert('Posting completed.');
	    } else {
	      alert('Error while posting.');
	    }
	  }
	);
    });

    // Dynamic buttons effect
    var buttonFadeTime = 100;
    $('body').on('mouseenter', '.buttons', function() {
	var bgColor = '#78AB46';
	if ($(this).hasClass('share-button')){
	    bgColor = '#3B5998';
	}
	$(this).animate({ backgroundColor: bgColor , borderColor: bgColor}, buttonFadeTime);
    });
    $('body').on('mouseleave', '.buttons', function() {
	$(this).animate({ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'white'}, buttonFadeTime);
    });

    $(document).keyup(function(e) {
	if (e.keyCode == 27) $('.playAgain').click();   // esc
	if (e.keyCode == 13) $('.share-button').click();   // esc
    });
};
// 59,89,152 fb color
$(document).ready(main);

