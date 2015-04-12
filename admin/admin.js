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
			initLat=41.954;
			initLng=12.547;
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
//                                        this._saveButton = this._createButton(options.saveText, options.saveTitle, controlName + '-home', container, this._save);
//                                        this._resetButton = this._createButton(options.resetText, options.resetTitle, controlName + '-home', container, this._resetAll);
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
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                                                '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                                                '',
			maxZoom: 18
		}).addTo(mappa);

		var poppup = L.popup(); 
		boxBounds=mappa.getBounds().toBBoxString()	
		caricaMappa();
		function caricaMappa() {

                        var myurl="dump_table_box.php?boxBounds="+boxBounds;
//                      console.log(myurl);
                        $.getJSON(myurl, function(data) {
                              poi = data;
                              console.log("===============================");
                                        var iiii=0;
                                data.forEach(function(entry) { 
//                                      console.log(entry) ;
                                        L.marker([entry.lat,entry.lng]).addTo(mappa).bindPopup("message: "+entry.message);
                                        iiii++;
                                });
                              console.log("iiii=",iiii);
                            });



		}
		function prendiPosECarica() { 
			boxBounds=mappa.getBounds().toBBoxString();
			caricaMappa();
		}

		function onClickMarker(e) {
			var IdToRemove;
			mappa.removeLayer(e.target);
			console.log("marker: called onClickMarker");
			IdToRemove = e.target.mymarker.Id;
			console.log("markerid="+IdToRemove);
			
			console.log(JSON.stringify(myMarkers));
			/// scansiona l'array di marcatori per trovare l'id... 
			for(var i = myMarkers.length - 1; i >= 0; i--) {
			    if(myMarkers[i].Id == IdToRemove) {
			       console.log("bingo");
			       myMarkers.splice(i, 1);
			    }
			}
			console.log(JSON.stringify(myMarkers));
			localStorage.setItem("myMarkers", JSON.stringify(myMarkers));
			delete(e.target.mymarker);

		}
		function onMouseOverMarker(e) {
//			console.log("marker: called onMouseOverMarker");
//			console.log("marker",this.messaggio);
//			console.log("e = ",e) ;
			e.target.openPopup();
		}
		function onMouseOutMarker(e) {
//			console.log("marker: called onMouseOutMarker");
//			console.log("marker",this.messaggio);
			e.target.closePopup();
		}


		function saveOnServer(e) {
//			var data= JSON.stringify(myMarkers);
			console.log("marker: called saveOnServer");
			console.log("e = ",e) ;
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

		}


		function help (e) {
			var dia= bootbox.dialog({
			title: "BLIH - &copy 2015 Giovambattista Vieri",
			message: "<ul><h2>List of available commands</h2><li>CG center map on GPS and, draw a circle related with the position on the map</li>"
			+"<li>H help</li> </ul>"
			+"<BR>Please feel free to brose the map freely<BR>",
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

