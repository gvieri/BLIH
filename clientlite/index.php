<?php
/*
Author Giovambattista Vieri 
(C) 2015 all rights reserved
LICENSE AFFERO GPL 


*/

require_once($_SERVER['DOCUMENT_ROOT']."/lib/client.conf.php"); 

$lat 	= trim($_REQUEST['latidude']); 
$long 	= trim($_REQUEST['longitude']); 
$alt 	= trim($_REQUEST['altitude']); 

$msg 	= trim($_REQUEST['datamessage']); 


if (is_numeric($alt) != TRUE)  { 
	$alt=0;  // default value for altitude 
} 
$message="Every thing is ok..."; 

if(!(preg_match("/(-?\d+\.\d+)/",$lat) &&  preg_match("/(-?\d+\.\d+)/",$long)))  { 
	/// problem on lat or long ..
	$message="Latitude and longitude must be in numerical formats, dd.dddddd . Example: 41.9361258";

} else { 
	if ((($lat>180.0) || ($lat < -180.0) || ($long>90.0) ||($long < -90.0))) { 
		$message="Latitude or longitude or both, are out of range"; 

/// now verify the correctness of latitude and longitude
	} else { 
		try { 
			$mysqli = new mysqli($dbhost, $dbuser , $dbpass, $dbname);
			if (mysqli_connect_errno()) {
			    $message=sprintf("Connect failed: %s\n", mysqli_connect_error());
			}
// prepare insertion query 
			$stmt=$mysqli->prepare("insert into geo_data (lat, lng, alt, message) values (?, ?, ?,? )" ); 
			if (!$stmt) {
			    $message=sprintf('errno: %d, error: %s', $mysqli->errno, $mysqli->error);
			}	
			if(!$stmt->bind_param("ddds", $lat ,$long , $alt , $msg)) {
				 $message= "Binding parameters failed: (" . $stmt->errno . ") " . $stmt->error;
			}
// insert query 
			$stmt->execute();
			$stmt->close(); 
			$mysqli->close();
		} catch (Exception $e){ 
// manage error
			$message="Exception caught";

		} 
	}

}
$message="<center>$message</center>";
$message.="<br><center>Please click <a href=\"./index.html\">here</a>.</center>"; 
echo "<html>\n<head>\n<link rel=\"stylesheet\" href=\"./style.css\" type=\"text/css\">\n</head><body>"
."<center><h2>Message</h2></center>\n<div id=\"messagediv\">$message</div>\n</body></html>";

?>
