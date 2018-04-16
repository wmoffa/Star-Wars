

$(document).ready(function() {

// initial variables for global use
var defenderID = "";
var opponentID = "";
var newGame = true;
var openImgpos = 0;
var enemyImgpos = 0;
var opponentFound = false;
var attackPause = false;
var opponentCount = 0;

var characterInfo = [{
					name: "Obi-Wan-Kanobe",
					attackPower: 0,
					attacks: 1,
					counterPower: 12,
					healthPoints: 120,
					image: "obi.png",
					status: "open",
					id: 0
					}, {
					name: "Luke Skywalker",
					attackPower: 0,
					attacks: 1,
					counterPower: 0,
					healthPoints: 0,
					image: "luke.png",
					status: "enemy",
					id: 1
					}, {
					name: "Darth Sidious",
					attackPower: 0,
					attacks: 1,
					counterPower: 0,
					healthPoints: 0,
					image: "sidious.png",
					status: "open",
					id: 2
					},{
					name: "Darth Maul",
					attackPower: 0,
					attacks: 1,
					counterPower: 0,
					healthPoints: 0,
					image: "maul.png",
					status: "open",
					id: 3
					}]
	initGame()

	updatePanels()


		// the following is for the selectiom of the defender
        $(' .panelGroup').bind('click', function() {		
        	defenderID = $(this).children().find('img').attr("data-playerid");

			$('.panelGroup').hide();
			$('.attackButton').hide();

			// only used at the very start of the game
			if(newGame) {
				newGame = false;
				if(characterInfo[defenderID].status != 'open') return
				for(x=0; x < characterInfo.length; x++) {
					characterInfo[x].status = 'enemy'
				}
				characterInfo[defenderID].status = "defender";
				updatePanels();
	        	$('.panelAttention').empty()
        		$('.panelAttention').append('<h3>Please select your opponent</h4>');
        		$('.gameMessage').empty();
			}
		})

		// the following is for the selection of the opponent
        $(' .enemyGroup').bind('click', function() {
        	$('.panelAttention').empty();
        	$('.panelAttention').append('<h3>Opponents</h3>');
        	$('.gameMessage').empty();
        	attackPause = false;	
        	opponentID = $(this).children().find('img').attr("data-playerid");
        	opponentFound = false;

			if(characterInfo[opponentID].status != 'enemy') return

			for(x=0; x < characterInfo.length; x++) {
				opponentFound = true;
			}

			if(opponentFound) {
				characterInfo[opponentID].status = "opponent";
				$('.enemyGroup').empty();
				$('.attackButton').show();
				attackPause = false;
				updatePanels();
			}
		})

        // used to restart the game
        $('.resetButton').bind('click', function() {
        	initGame();
        	updatePanels();
        })


        // function when attack button is pressed
		$('.attackButton').bind('click', function() {

			// the following will disable the attack button when not in use
			if(attackPause) return

			//update opponents numbers
		    attackValue = (characterInfo[defenderID].attackPower * characterInfo[defenderID].attacks)
		    characterInfo[opponentID].healthPoints -= attackValue;
		    characterInfo[defenderID].attacks += 1;
		    characterInfo[defenderID].healthPoints -= characterInfo[opponentID].counterPower;
		    updatePanels();

		    // the opponent has no more health points - defender winds
		    if(characterInfo[opponentID].healthPoints <= 0) {
		    	attackPause = false;
		    	$('.gameMessage').empty();
		    	if(opponentCount == 0) {
		    		$('.gameMessage').append("<h3>You Sucessfully Defended The Empire</h3>");
		    		endGame()
		    	} else {
		    		$('.gameMessage').append("<h4>You Have Defeated Your Opponent "+characterInfo[opponentID].name+" <br> Select a new opponent</h4>");
		    		nextOpponent();
		    	}
		    }

		    // defender has no more health points - the game is over
		    if(characterInfo[defenderID].healthPoints <= 0) {
		    	$('.gameMessage').empty();
		    	$('.gameMessage').append("<h3>You're defender, "+characterInfo[defenderID].name+" has been defeated - Game Over</h3>");
		    	endGame();
		    }
		})

		// set up initial values at thre stgar of the new game
		function initGame() {
			for(x=0; x < characterInfo.length; x++) {
				characterInfo[x].status = 'open';
				characterInfo[x].attacks = 1;
				characterInfo[x].attackPower = randomNumberFromRange(5,10);
				characterInfo[x].counterPower = randomNumberFromRange(8,15);
				characterInfo[x].healthPoints = randomNumberFromRange(120,150);
			}

			$('.attackButton').hide();
			$('.resetButton').hide();
			$('.panelGroup').show();
			$('.gameMessage').empty();
			
			newGame = true;
			opponentFound = false;
			opponentCount = 3;
			
		}

		// use to display picture panels
		function updatePanels() {

		 	$('.panelGroup').empty();
		 	$('.enemyGroup').empty();
		 	$('.panelOpponent0').empty();
		 	$('.panelDefender0').empty();

		    openImgpos = 0;
		    enemyImgpos = 0;
		    opponentFound = false;
		    opponentCount = 0;

		 	//initial blank divs		 
			for(x=0; x < characterInfo.length; x++) {
		        //based on status. what panel do they belong
				switch(characterInfo[x].status) {
					case 'open':
						buildGroup("Open",x,openImgpos)
						openImgpos += 1;		
						break;
					case 'enemy':
						buildGroup("Enemy",x, enemyImgpos)
						enemyImgpos += 1;
						opponentFound = true;
						opponentCount += 1
						break;
				    case 'defender':
				    	buildGroup("Defender",x,0)
						break;
					case 'opponent':
						buildGroup("Opponent",x,0)
						break;				   
				}
			}
		} 

		// function is called in the init function to determine player HP, AP, CP
		function randomNumberFromRange(min,max) {
    		return Math.floor(Math.random()*(max-min+1)+min);    		
		}

		// this function will place the players in the correct folder based on their status
		function buildGroup(type,playerNo,imgPos) {
			    htmlText = "";
			    htmlText  = "<dl>";
			    htmlText += "<dd>"+characterInfo[playerNo].name+"</dd>";
			    htmlText += "<dd> <img src='assets/images/"+characterInfo[playerNo].image+"' data-playerID = '" + x +"'></dd>"
			    htmlText += "<dd>"+characterInfo[playerNo].healthPoints+"</dd>";
			    htmlText += "</dl>"
			    panel = ".panel"+type+imgPos
				$(panel).append(htmlText);
                imagePanel = $("<img>");
                imagePanel.attr("data-playerid",playerNo);
                $(panel).append(imagePanel);
		}  

		// the following will kill of the current opponent so that they will not be selecyted again
		function nextOpponent() {
			characterInfo[opponentID].status = 'dead';
			attackPause = true;
			updatePanels();

		}

		// display the rest button to start a new game
		function endGame() {
			$('.resetButton').show()
		}

	})
