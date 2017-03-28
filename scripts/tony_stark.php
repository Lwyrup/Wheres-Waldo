<?php

$file = '../data/locations.csv';
$f = fopen($file, 'r');
$text = fread($f, filesize($file));
fclose($f);

$locationOfWaldo = str_getcsv($text);
echo checkCoords($locationOfWaldo);

// Checks if the user clicked waldo
//
// $loW --Location of waldo, from csv <array
// 
// returns a message weather they found or not as string

function checkCoords($loW){
	if (withinRange($loW, 'x') && withinRange($loW, 'y')){
		return "√ WALDO FOUND!";
	}
	else{
		return respondWrong();
	};
};

// Checks if the users axis is within range of the actual axis
//
// $loW  --Waldos location <array
// $xORy --Either 'x' or 'y' axis <string
//
//	Example
//
//		$_POST = {"xpos": "150", "ypos": "0"};
//
//		withinRange([250, 120],"x");
//			=> true
//
// returns boolean true or false

function withinRange($loW, $xORy){
	$axis = isItXorY($xORy);
	if ($_POST[$xORy."pos"] > $loW[$axis] - 10 && $_POST[$xORy."pos"] < $loW[$axis] + 10){
		return true;
	}
	else{
		return false;
	};
};

// Determines if it's an x or a y
//
// $xy --'x' or 'y' <string
//
//	Example
//
//		itItXorY('y');
//			=> 1
//
// returns a integer either 1 or 0

function isItXorY($xy){
	if ($xy == "x"){
		return 0;
	}
	else if ($xy == "y"){
		return 1;
	};
};

// Selects a random snarky comment from the array
//
//	Example
//
//		respondWrong();
//			=> "So close"
//
// Returns that snarky comment as a string

function respondWrong(){
	$snarks = ["So close","Warmer...","Colder...","Are you blind?","That's not Waldo.","Show me Waldo!",
	"Survey says...","This is not the Waldo you're looking for.","Your Waldo is in another castle.",
	"If Waldo were a snake..."];
	return $snarks[rand(0, 9)];
};

?>

