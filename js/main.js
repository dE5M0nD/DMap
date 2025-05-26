 // Base layers
    const baseLayers = {
      osm: new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: false,
        title: 'OpenStreetMap'
      }),
      bing: new ol.layer.Tile({
        source: new ol.source.BingMaps({
          key: 'Your-Bing-Maps-API-Key-Here', // Optional for Bing
          imagerySet: 'Road'
        }),
        visible: true,
        title: 'Bing Maps'
      })
    };


   // add main map

   var map = new ol.Map({
            target: 'map',
            layers: [
                baseLayers.osm,
                baseLayers.bing
            ],
            view: new ol.View({
              center: ol.proj.fromLonLat([-6.5310 , 8.7355]),
              zoom: 11
            })
        });


// Switch function
    function switchBaseLayer(base) {
      Object.keys(baseLayers).forEach(key => {
        baseLayers[key].setVisible(key === base);
      });
    }
 // add small side map
       var map_ = new ol.Map({
            target: 'main-map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([-6.5310 , 8.7355]),
                zoom: 8
            })
        });


  // Add Graticule to main map
    const graticule = new ol.layer.Graticule({
      strokeStyle: new ol.style.Stroke({
        color: 'rgba(103, 103, 103, 0.8)',
        width: 1,
      }),
      targetSize: 180,
      showLabels: true
    });

   // map.addLayer(graticule);




//  JSON configuration to add dynamic layers to the map
fetch('layers.php')
  .then(response => response.json())
  .then(data => {
 
    data.gLayer.forEach(layer => {
      const vectorSource = new ol.source.Vector({
        url: layer.url,
        format: new ol.format.GeoJSON()
      });

      const vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: function(feature) {
          const label = feature.get(layer.property) || '';
          const fclass = feature.get('fclass') || '';

          if (layer.type === 'point') {
            return new ol.style.Style({
              image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({ color: layer.fill }),
                stroke: new ol.style.Stroke({ color: layer.stroke, width: 1 })
              }),
              text: new ol.style.Text({
                text: label,
                offsetY: -10,
                font: '10px sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
              })
            });
          }

          if (layer.type === 'MultiLineString') {
            let color = layer.stroke;
            let width = 1;
            if (fclass === 'primary') {
              color = '#FF0000';
              width = 2;
            }
            return new ol.style.Style({
              stroke: new ol.style.Stroke({ color, width }),
              text: new ol.style.Text({
                text: label,
                placement: 'line',
                font: '12px sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
              })
            });
          }

          if (layer.type === 'MultiPolygon') {
            let fillColor = layer.fill;
            if (fclass === 'residential') fillColor = 'rgba(129, 179, 76, 0.2)';
            if (fclass === 'farmland') fillColor = '#B34C4D';
            return new ol.style.Style({
              fill: new ol.style.Fill({ color: fillColor }),
              stroke: new ol.style.Stroke({ color: layer.stroke, width: 1 }),
              text: new ol.style.Text({
                text: label,
                font: '12px sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
              })
            });
          }

          return null;
        }
      });

      map.addLayer(vectorLayer);

      // Optional toggle
      $('body').on('click', '#' + layer.id, function () {
        const layerExists = map.getLayers().getArray().includes(vectorLayer);
        if (this.checked && !layerExists) {
          map.addLayer(vectorLayer);
        } else if (!this.checked && layerExists) {
          map.removeLayer(vectorLayer);
        }
      });
    });
  })
  .catch(error => console.error('Layer loading error:', error));


