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
	$file="dbcontents"; 
 
	    //Create Database connection
	$db = mysqli_connect($dbhost,$dbuser,$dbpwd,$dbname);

	if (!$db) {
	        die('Could not connect to db: ' . mysqli_error());
	}

	$boxBounds=$_GET['boxBounds']; 
	list($lng0,$lat0,$lng1,$lat1)=preg_split("/,/",$boxBounds); 
	     
	//Replace * in the query with the column names.
	$query="select * from geo_data where lat is not null and lat>'$lat0' and lat<'$lat1' and lng>'$lng0' and lng<'$lng1' ";
//		echo "!$query|";
	$result = mysqli_query($db, $query); 
	    //Create an array
	$csv_output = ""; 
	while ($row = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
	        $csv_output .= $row['lat'].",";
	        $csv_output .= $row['lng'].",";
	        $csv_output .= $row['message']."\n";
	         
	        //push the values in the array
	}
	     
	    //Close the database connection
	mysqli_close($db);
	$filename = $file."_".date("Y-m-d_H-i",time());
	header("Content-type: application/vnd.ms-excel; ");	
	header("Content-disposition: attachment;" );
	header( "Content-disposition: filename=".$filename.".csv");
	echo "\xEF\xBB\xBF"; //UTF-8 BOM
	echo $csv_output;
	exit;	  
?>
