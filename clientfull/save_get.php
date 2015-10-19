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
	$db = mysqli_connect($dbhost,$dbuser,$dbpwd,$dbname);
	if (!$db) {
                die('Could not connect to db: ' . mysql_error());
	}

        $lat=$_GET['lat']; 
	$lng=$_GET['lng']; 
	$message=$_GET['message'];
        $insert = "insert into geo_data (lat,lng, message) values ('$lat','$lng','$message')";
	if (mysqli_query($db,$insert))  {
			// ok
	} else { 
			// nok
	}
		
		
}
mysqli_close($db);
?>
