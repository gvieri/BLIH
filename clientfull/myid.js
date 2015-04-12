/**
 *  myid a really simple way to obtain random id 
 *  
 *  @author  Vieri Giovambattista
 *  @version 0,0
 *  @license AGPL 
 *  
 */


function myId() { } 

// 

myId.generate= function () { 
	var num = Math.random()*1001; 
	var hexString = num.toString(16);

	var d = new Date();
	var n = d.toString(); 
	return( hexString+n) ;

}	
	













