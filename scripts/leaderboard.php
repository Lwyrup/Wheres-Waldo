<?php

addNewScore();
$responseJSON = convertCSVtoJSON();
$responseJSON[strrpos($responseJSON, ",")] = " ";
echo $responseJSON;

// Adds a new csv row to file
//
// $_POST['name']  --Name of player <is_string
// $_POST['score'] --Score, seconds to find waldo <string

function addNewScore(){
    if (is_numeric($_POST["score"])){
        $newScoreRow = $_POST["name"].",".$_POST["score"]."\n";
        file_put_contents("../data/highscores.csv", $newScoreRow, FILE_APPEND);
    };
};

// Reads CSV and converts to string of JSON
//
// returns concatenated string with formating of JSON 

function convertCSVtoJSON(){
     if (($handle = fopen("../data/highscores.csv", "r")) !== FALSE) {
        $response = "[";
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) { 
            $response = $response . " {";
            for ($i=0; $i < count($data); $i++) {
                if($i == 0){
                    $response = $response . '"name": "'.$data[$i].'",';
                }
                else{ 
                    $response = $response . ' "score": "'.$data[$i].'"';
                }
            }
            $response = $response . "},";
        }
        $response = $response . "]";
        fclose($handle);
    };
    return $response;
}

?>



