window.addEventListener("load", function(){

	submit = document.getElementById("playerForm").children[2];
	start = document.getElementById("go");
	picture = document.getElementsByTagName("img")[0];

	submit.addEventListener("click", setPlayersName);
	start.addEventListener("click", startGame);
	picture.addEventListener("click", didTheyFindWaldo);
	picture.addEventListener("click", highlight); 

	// Check if they found waldo
	//
	// e is the event triggered by a click on the picture
	//
	// Passes the users x and y relative to the image as params to the sendRequest function

	function didTheyFindWaldo(e){
		x = e.pageX;
		y = e.pageY;
		params = "xpos=" + (x - e.target.offsetLeft) + "&ypos=" + (y - e.target.offsetTop);
		sendRequest("POST", "scripts/tony_stark.php",params, showResponse);
	};

	// Creates, opens, and sends a request, then does a thing once response is recieved
	//
	// method    --Is the method of request ex(POST/GET) <string
	// phpFile   --The server side script you wish to run <string
	// params    --Information you wish to pass with the request <string 
	// afterLoad --A function you wish to execute after the server responds
	//
	//	Examples
	//
	//		sendRequest("GET","stringCheese.php","",function(e){ console.log(e.target.repsonse) })
	//
	//		sendRequest("POST", "myPhp.php", "color=red&flavor=watermelon", myOwnFunction)

	function sendRequest(method, phpFile, params, afterLoad){
		request = new XMLHttpRequest();
		request.open(method, phpFile, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
		request.send(params);
		request.addEventListener("load", afterLoad);
	};

	// Checks if response text indicates they have found waldo
	// 
	// e is the event 'load' for the'xmlhttprequest' object 

	function showResponse(e){
		document.getElementById("rspnse").innerHTML = e.target.response;
		if (e.target.response.includes("√")){
			endGame();
		}
	};

	// Shows and places the highlighter div where user clicks, then sets timeout for unhighlight
	//
	// e is the 'click' event for the image on the page

	function highlight(e){
		highlighter = document.getElementsByClassName("highlighter")[0]
		highlighter.style.display = "block"
		highlighter.style.top = e.pageY - 26 +"px"
		highlighter.style.left = e.pageX - 26 + "px"
		setTimeout(unhighlight,750);
	};

	// Hides the highligther div 

	function unhighlight(){
		highlighter.style.display = "none"
	};

	// Starts the game by hiding the start modal and starting a timer

	function startGame(){
		document.getElementById("startScreen").style.display = "none";
		startTimer();
	}

	// Ends the game, gets the player time, shows the endscreen, stops timer, and sends a request
	//
	// name --The name entered into the field at start <string
	// timeToFind --Time took to find waldo <string

	function endGame(){
		stopTimer();
		time = getTime();
		params = "name=" + name + "&score=" + time;
		sendRequest("POST","scripts/leaderboard.php",params, generateScoreboard);
		document.getElementById("endModal").style.display = "block";
	};

	// Gets the content of timer and displays in the endscreen
	//
	// Returns the time <string

	function getTime(){
		time = document.getElementById("timer").textContent;
		document.getElementById("yourTime").textContent = time;
		return time;
	};

	// Sets a interval for every 10 milliseconds

	function startTimer(){
		myTimer = setInterval(upTimer, 10);
	};

	// Clears the interval, thus stopping the timer

	function stopTimer(){
		clearInterval(myTimer);
	};

	// Takes the number in the timer and adds 10 milliseconds to it

	function upTimer(){
		newTime = parseFloat(document.getElementById("timer").textContent) + 0.01;
		document.getElementById("timer").textContent = newTime.toFixed(3);
	};

	// Generates the leaderboards dynamicly based of server response
	//
	// e is the event 'load' of a xmlhttprequest object, sent from endGame

	function generateScoreboard(e){
		allScores = parseJ(e.target.response);
		sortByHighest(allScores);
		fillHTML(allScores);
	};

	// Takes a JSON formated string and turns it into an object/array
	//
	// stringJSON --A string formated like JSON <string
	//
	//	Example
	//		
	//		parseJ("[{'name': 'Frank'}, {'name': 'Ryan'}, {'name': 'Steve'}]")
	//			=> [{...},{...},{...}] -<array of objects
	//
	// returns string as a object

	function parseJ(stringJSON){
		return JSON.parse(stringJSON);		
	};

	// Goes through the objects and organizes them from least to greatest score
	//
	// scoreJSON --Array of objects containing 'name' and 'score' keys in the objects
	//
	//	Example
	//
	//		sortByHighest([{ "score": 34 }, { "score": 1 }])
	//			=> [{ "score": 1 },{ "score": 34 }]
	//

	function sortByHighest(scoreJSON){
		scoreJSON.sort(function(a,b){ return a["score"] - b["score"] });
	};

	// Builds a string with html tage for insertion to <tbody>
	//
	// data --JSON data/ array of objects
	//
	//	Example
	//
	//		fillHTML( [{ "name": "Beth" , "score": 1 },{ "name": "Suzy" , "score": 34 }] )
	//			=> "<tr><td>Beth</td><td>1</td></tr><tr><td>Suzy</td><td>34</td></tr>"

	function fillHTML(data){
		stringHTML = '';
		for (i = 0; i < data.length && i < 10; i++){
			stringHTML += "<tr><td>" + data[i]["name"] + "</td><td>" + data[i]["score"] + "</td></tr>";
		};
		document.getElementById("topPlayers").innerHTML = stringHTML;
	}

	// Gets the players name and checks it for validity
	//
	// e is the event for clicking the submit on the start form
	// Valid names must have a-z whether it beupper case or lower
	// After filters out any non a-z characters

	function setPlayersName(e){
		input = e.target.parentElement.children[1].value;
		
		if (input.match(/[a-z]/gi)){
			name = input.replace(/[^a-z]/gi, "");
			e.target.parentElement.style.display="none";
		}
		else{
			alert("Enter a valid name");
		};
	};

});






