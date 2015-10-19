<?php
/**
 *
 *  @Author:  Vieri Giovambattista
 *  @Version: 0,0
 *  @License: AGPL
 *  @Contact: 
 *
 */


	require_once("./db_conf.php"); 
	$stringData = $_GET["data"];
	$db = mysqli_connect($dbhost,$dbuser,$dbpwd,$dbname);
            if (!$db) {
                die('Could not connect to db: ' . mysql_error());
            }

	$json = json_decode($stringData,true);
	foreach ($json as $obj )  {
		$lat=$obj['latlng']['lat']; 
		$lng=$obj['latlng']['lng']; 
		$message=$obj['message'];
		$insert = "insert into geo_data (lat,lng, message) values ('$lat','$lng','$message')";
		if (mysqli_query($db,$insert))  {
				// ok
		} else { 
				// nok
		}
		
		
	}
	mysqli_close($db);
?>
