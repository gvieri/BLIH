<?php
	require_once("./db_conf.php");
 
	    //Create Database connection
	$db = mysqli_connect($dbhost,$dbuser,$dbpwd,$dbname);

	if (!$db) {
	        die('Could not connect to db: ' . mysql_error());
	}

	$boxBounds=$_GET['boxBounds']; 
	list($lng0,$lat0,$lng1,$lat1)=preg_split("/,/",$boxBounds); 
	     
	//Replace * in the query with the column names.
	$query="select * from geo_data where lat is not null and lat>'$lat0' and lat<'$lat1' and lng>'$lng0' and lng<'$lng1' ";
//		echo "!$query|";
	$result = mysql_query($query, $db); 
	     
	    //Create an array
	$json_response = array();
	     
	while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
	        $row_array['message'] = $row['message'];
	        $row_array['lat'] = $row['lat'];
	        $row_array['lng'] = $row['lng'];
	         
	        //push the values in the array
	        array_push($json_response,$row_array);
	}
	echo json_encode($json_response);
	     
	    //Close the database connection
	mysqli_close($db);
	  
?>
