function settlement_layer(apipath,map){
 	var settlement;
    //  settlement layers
     $.post( apipath + "mapbase_.php",
              {
                layer_type:  'settlement',
              }, (data) => {
               var j = JSON.parse(data);
               settlement = L.geoJSON(JSON.parse(j), {
              style: function (feature) {
                  switch (feature.properties.phase_name) {
                    case 'settlement': return {color: "#B34C4D", fillColor: "#fff",fillOpacity: 1, weight: 1};
                  default: return {color: "#0000ff", weight: 0.5};
                }

              },
               pointToLayer: function (feature, latlng) {
                    // Customize the marker appearance here
                    return L.circleMarker(latlng, { radius: 6, color: 'blue' });
                },
              onEachFeature: function(feature, layer) {                 
                var geometry = feature.geometry.type; 
                switch (geometry) {
                  case 'Point':
                    const centerPoint = feature.geometry.coordinates;
                    var x = centerPoint[1];
                    var y = centerPoint[0];
                    if(feature.properties.name ==null || feature.properties.name ==""){
	                      const customIcon = new L.DivIcon({
	                      className: 'custom-marker', // Apply CSS styling if needed
	                      html: '<div class="marker-label" style="font-size: 10px !important;display:none">' +
	                       '</div>',
	                      iconSize: [100, 100], // Set the size of your icon
	                      iconAnchor: [50, 50], // Adjust the anchor point
                    });
	                    // Create a marker using the custom icon
	                    var marker = new L.Marker([x, y], { icon: customIcon });
	                    // Add the marker to your map
	                    map.addLayer(marker);
                    }else{
                    const customIcon = new L.DivIcon({
                      className: 'custom-marker', // Apply CSS styling if needed
                      html: '<div class="marker-label" style="font-size: 10px !important;display:block">'+ 
                         feature.properties.name + '<br/>' +
                       '</div>',
                      iconSize: [100, 100], // Set the size of your icon
                      iconAnchor: [50, 50], // Adjust the anchor point
                    });

                    // Create a marker using the custom icon
                    var marker = new L.Marker([x, y], { icon: customIcon });
                    // Add the marker to your map
                    map.addLayer(marker);
                  }
                  default:
                }
                
              }
            }).addTo(map);
          }
        );
       $('.marker-label').css("display","block");

        $("#settlement").change(function() {
				if(this.checked && !map.hasLayer(settlement)) {
					map.addLayer(settlement);
					 let zoomLevel = map.getZoom();
					// if(zoomLevel > 17){
						 $('.marker-label').css("display","block");
					 //}	
				} else if(!this.checked && map.hasLayer(settlement)) {
					$('.marker-label').css("display","none");
					map.removeLayer(settlement);
				}
			});
 }



function roads_layer(apipath,map){
	    var roads;
		// mine roads layers
		 $.post( apipath + "mapbase_.php",
              {
                layer_type:  'road_network',
              }, (data) => {
				          var j = JSON.parse(data);
                  roads = L.geoJSON(JSON.parse(j), {
							style: function (feature) {
								  switch (feature.properties.fclass) {
									case 'secondary': return {color: "#CBCBCB", fillColor: "#CBCBCB", weight: 1};
									case 'unclassified': return {color: "#CBCBCB", fillColor: "#CBCBCB", weight: 1};
									case 'residential': return {color: "#CBCBCB", fillColor: "#CBCBCB", weight: 1};
									case 'tertiary': return {color: "#CBCBCB", fillColor: "#CBCBCB", weight: 1};
									case 'track': return {color: "#CBCBCB", fillColor: "#CBCBCB", weight: 1};
									case 'path': return {color: "#CBCBCB", fillColor: "#CBCBCB", weight: 1};
									default: return {color: "#0000ff", weight: 0.5};
								}

							},
							onEachFeature: function(feature, layer) {									
								var geometry = feature.geometry.type; 
								switch (geometry) {
									case 'MultiPolygon':
									default:
								}
								
							}
						}).addTo(map);
          }
        );
		
  $("#roads").change(function() {
		if(this.checked && !map.hasLayer(roads)) {
			map.addLayer(roads);
		} else if(!this.checked && map.hasLayer(roads)) {
			map.removeLayer(roads);
		}
	});
}