/***

BLIH (c) Giovambattista Vieri 2015,2016

All rights reserved

https://github.com/gvieri/BLIH/

configuration.js

This file contains configuration data.

License: see github pages

*/


	$(document).ready(function() {
		var poi;
		var boxBounds;
		var initLat;
		var initLng; 
		var initZoom; 
		var marker; 
		var myMarkers=[]; 
		var myControl;
		var splahDialog; 
		var circle=null;


		initLat= localStorage.getItem("initLat");
		initLng= localStorage.getItem("initLng");
		initZoom=localStorage.getItem("initZoom");
		if((initLat==null) && (initLng==null)) { 
			initLat=initLatConfVal;
			initLng=initLngConfVal;
		}
	
		L.Control.myControl = L.Control.extend({
                                options: {
                                        position: 'bottomleft',
                                        saveText: 'SA',
                                        saveTitle: 'save all marker',
                                        resetText: 'RST',
                                        resetTitle: 'reset, delete marker',
                                        centerOnGPSText: 'CG',
                                        centerOnGPSTitle: 'center on gps position',
                                        helpText: 'H',
                                        helpTitle: 'Help'
                                },
                                onAdd: function (map) {
                                        this._map= map; 
                                        var controlName = 'gin-control-zoom',
                                        container = L.DomUtil.create('div', controlName + ' leaflet-bar'),
                                        options = this.options;

                                        this._centerOnGPSButton = this._createButton(options.centerOnGPSText, options.centerOnGPSTitle,
                                                controlName + '-home', container, this._centerOnGPS);
                                        this._saveButton = this._createButton(options.saveText, options.saveTitle, controlName + '-home', container, this._save);
                                        this._resetButton = this._createButton(options.resetText, options.resetTitle, controlName + '-home', container, this._resetAll);
                                        this._helpButton = this._createButton(options.helpText, options.helpTitle, controlName + '-home', container, this._help);
                                        
                                        

                                        this._updateDisabled();
                                        map.on('zoomend zoomlevelschange', this._updateDisabled, this);

                                        return container;
                                    },
				   onRemove: function (map) {
                                        map.off('zoomend zoomlevelschange', this._updateDisabled, this);
                                    },

                                _centerOnGPS: function (e) { 
                                        this._map.locate({setView: true, maxZoom: 16, enableHighAccuracy: true});
                                        
                                    },
/*
                                _centerOnMarker: function (e) { 

                                    },
*/

                                _save: function (e) { 

                                        
                                    },
                                _resetAll: function (e) { 

                                    },
                                _help: function (e) { 

                                    },

                                _createButton: function (html, title, className, container, fn) {
                                        var link = L.DomUtil.create('a', className, container);
                                        link.innerHTML = html;
                                        link.href = '#';
                                        link.title = title;

                                        L.DomEvent.on(link, 'mousedown dblclick', L.DomEvent.stopPropagation)
                                            .on(link, 'click', L.DomEvent.stop)
                                            .on(link, 'click', fn, this)
                                            .on(link, 'click', this._refocusOnMap, this);

                                        return link;
                                    },


                                _updateDisabled: function () {
                                        var map = this._map,
                                        className = 'leaflet-disabled';

                                }       
                        });



		
		if (initZoom==null) { initZoom = 13 } 
		var mappa= L.map('mappetta').setView([initLat,initLng],13);
		L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
			attribution: attributionCopyConfVal +
                                                attributionLicenseConfVal +
                                                attributionThirdVal,
			maxZoom: maxZoomConfVal 
		}).addTo(mappa);

		var poppup = L.popup(); 
		
		function onMapClick(e) {
			bootbox.prompt( {
				title: "Please, insert marker's name",
				value: "Marker",
				latlng: e.latlng,
				callback: function(result) {
					if (result === null) {
					} else {
						
						if (consoleLoggingFlag )  { console.log("e = " ,this.latlng); } 
						marker=L.marker( this.latlng).on('click',onClickMarker);
						marker.on('mouseover',onMouseOverMarker);
						marker.on('mouseout',onMouseOutMarker);
						marker.messaggio=result;
						marker.bindPopup("<P>"+result+"<P>");
						marker.addTo(mappa);
						var m; 
						m=new myMarker(this.latlng,result);
						if (consoleLoggingFlag )  { console.log("m",m); } 
						myMarkers.push(m);
						marker.mymarker=m; 
						localStorage.setItem("myMarkers", JSON.stringify(myMarkers));
						if (consoleLoggingFlag )  { console.log(JSON.stringify(myMarkers)); }
					}
				}
			});
		}


		mappa.on('click', onMapClick);
		mappa.on('dblclick', onMapClick);
		boxBounds=mappa.getBounds().toBBoxString()	
		caricaMappa();
		function caricaMappa() {

			myMarkers=JSON.parse(localStorage.getItem('myMarkers'));
			if(myMarkers!=null) {
				for(var i = myMarkers.length - 1; i >= 0; i--) {
					var m; 
					m=myMarkers[i];
					marker=L.marker( m.latlng).on('click',onClickMarker);
					marker.on('mouseover',onMouseOverMarker);
					marker.on('mouseout',onMouseOutMarker);
					marker.messaggio=m.message;
					marker.bindPopup("<P>"+marker.messaggio+"<P>");
					marker.addTo(mappa);
					marker.mymarker=m; 
				}
			} else myMarkers=[];
			

		}
		function prendiPosECarica() { 
			boxBounds=mappa.getBounds().toBBoxString();
			caricaMappa();
		}

		function onClickMarker(e) {
			var IdToRemove;
			mappa.removeLayer(e.target);
			if (consoleLoggingFlag )  { console.log("marker: called onClickMarker"); } 
			IdToRemove = e.target.mymarker.Id;
			if (consoleLoggingFlag )  { 
				console.log("markerid="+IdToRemove);  
				console.log(JSON.stringify(myMarkers));
			}
			/// scansiona l'array di marcatori per trovare l'id... 
			for(var i = myMarkers.length - 1; i >= 0; i--) {
			    if(myMarkers[i].Id == IdToRemove) {
			       if (consoleLoggingFlag )  { console.log("bingo"); } 
			       myMarkers.splice(i, 1);
			    }
			}
			if (consoleLoggingFlag )  { console.log(JSON.stringify(myMarkers)); } 
			localStorage.setItem("myMarkers", JSON.stringify(myMarkers));
			delete(e.target.mymarker);

		}
		function onMouseOverMarker(e) {
			if (consoleLoggingFlag )  {
				console.log("marker: called onMouseOverMarker");
				console.log("marker",this.messaggio);
				console.log("e = ",e) ;
			} 
			e.target.openPopup();
		}
		function onMouseOutMarker(e) {
			if (consoleLoggingFlag )  {
				console.log("marker: called onMouseOutMarker");
				console.log("marker",this.messaggio);
			}
			e.target.closePopup();
		}


		function saveOnServer(e) {
//			var data= JSON.stringify(myMarkers);
			if (consoleLoggingFlag )  {
				console.log("marker: called saveOnServer");
				console.log("e = ",e) ;
			}
			$.ajax
			    ({
				type: "GET",
				dataType : 'json',
				async: false,
				url: './save_json.php',
				data: "data="+JSON.stringify(myMarkers),
				success: function () {alert("Thanks!"); },
				failure: function() {alert("Error!");}
			    });
			// i will assume that everything is ok 
			
			if (consoleLoggingFlag )  { console.log("marker len=", myMarkers.length); }
/*
			for(var i = 0 ; i< myMarkers.length ;  i++) {
				console.log("going to remove", myMarkers[i]);
				mappa.removeLayer(myMarkers[i].markerRef);
				delete(myMarkers[i]);
			}
*/
			myMarkers=[];

			localStorage.setItem("myMarkers", JSON.stringify(myMarkers));
			window.location.reload();
		}


		function help (e) {
var dia= bootbox.dialog({
title: "BLIH - &copy 2015 Giovambattista Vieri",
message: "<ul><h2>List of available commands</h2><li>CG center map on GPS and, draw a circle related with the position on the map</li>"
+" <li>AG add marker to map. The marker il added to the position present on the map</li>"
+" <li>RST reset delete both position and marker</li>"
+" <li>CM center map on marker </li>"
+"<li>H help</li> </ul>"
+"<BR>When you want to put a marker on the map, you have to select a point. After that a window will appear asking for the marker content.<BR>"
+"The marker will be placed on the map. If you want to delete it, the procedure is simple: just point and click. If you to read the content: just point it. "
+"<br>RST is usefull if you need to delete the marker. ",
buttons: {
main: {
label: "Close",
size: 'large',
className: "btn-primary",
callback: function() {
}
}
}
}); 
return(dia);
                        }
		function resetAll(e) { 
			if(marker!=null) { 
				mappa.removeLayer(marker);
			}
			if(circle!=null) { 
				mappa.removeLayer(circle);
			}
			delete marker; 
			margerMsg="deleted";
			markerPos="deleted";
			saveMap();
		}
		function onLocationFound(e) {
			var radius = Math.floor(e.accuracy / 2);
			if (circle!=null) {
				mappa.removeLayer(circle);
			} 
			circle=L.circle(e.latlng, radius).addTo(mappa);
			poppup
				.setLatLng(e.latlng)
				.setContent("You are here <p>in about" + radius + " meters from this point")
				.openOn(mappa);
			lastCenterPosition= e.latlng;
			
			setTimeout(function(){ popupDown(); }, 6000);

                                
		}
		function onLocationError(e) {
			alert(e.message);
		}



		mappa.on('locationfound', onLocationFound);
		mappa.on('locationerror', onLocationError);


		mappa.on('moveend', prendiPosECarica);
		mappa.on('zoomend', prendiPosECarica);
		mappa.on('zoomlevelchange', prendiPosECarica);
		mappa.on('resize', prendiPosECarica);

		myControl= new L.Control.myControl(); 
		myControl._save= function (e) { saveOnServer(e) ; } ;
		myControl._centerOnMarker= function (e) { centerOnMarker(e) ; } ;
		myControl._resetAll= function (e) { resetAll(e) ; } ;
		myControl._help= function (e) { help(e) ; } ;
		myControl.addTo(mappa);


		splashDialog=help();
		setTimeout(function(){ splashDialog.modal('hide') }, 6000);
	  });

