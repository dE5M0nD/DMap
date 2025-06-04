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
      targetSize: 150,
      showLabels: true
    });

   map.addLayer(graticule);

const searchResultSource = new ol.source.Vector();
const searchResultLayer = new ol.layer.Vector({
  source: searchResultSource,
  style: function (feature) {
    return new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        fill: new ol.style.Fill({ color: 'red' }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
      }),
      text: new ol.style.Text({
        text: feature.get('label') || '',
        offsetY: -15,
        font: 'bold 12px sans-serif',
        fill: new ol.style.Fill({ color: '#000' }),
        stroke: new ol.style.Stroke({ color: '#fff', width: 3 })
      })
    });
  }
});
map.addLayer(searchResultLayer);



const searchableLayers = [];
//  JSON configuration to add dynamic layers to the map

function createCharIcon(char, fontSize = 16, color = 'black') {
  const canvas = document.createElement('canvas');
  const size = fontSize * 2;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(char, size / 2, size / 2);

  return new ol.style.Icon({
    imgSize: [size, size],
    src: canvas.toDataURL()
  });
}


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
          const label = feature.get(layer.label) || '';
          const fclass = feature.get('fclass') || '';
          // Extract coordinates
          const coordinates = feature.getGeometry().getCoordinates();
          const transformedCoords = ol.proj.transform(coordinates, 'EPSG:3857' , 'EPSG:4326');
          const x = transformedCoords[0];
          const y = transformedCoords[1];

          // Default styles
          let fillColor = layer.fill;
          let strokeColor = layer.stroke;
          let icoN = "";
          let icoNSize = 16;

          // Check if the layer has a `rep` object and match fclass
          if (layer.rep) {
            const matchingRep = layer.rep.find(repItem => repItem.var === fclass);
            if (matchingRep) {
              fillColor = matchingRep.fill || fillColor;
              strokeColor = matchingRep.stroke || strokeColor;
              icoN = matchingRep.icon;
              icoNSize = matchingRep.iconSize;
            }
          }


        // Then in your style:
        if (layer.type === 'point') {
          return new ol.style.Style({
            image: createCharIcon(icoN, icoNSize, fillColor),
            text: new ol.style.Text({
              text: label,
              offsetY: -10,
              font: '10px sans-serif',
              fill: new ol.style.Fill({ color: '#000' }),
              stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
            })
          });
        }


          /*if (layer.type === 'point') {

            return new ol.style.Style({
              image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({ color: fillColor }),
                stroke: new ol.style.Stroke({ color: strokeColor, width: 1 })
              }),
              text: new ol.style.Text({
                text: label,
                offsetY: -10,
                font: '10px sans-serif',
                fill: new ol.style.Fill({ color: '#000' }),
                stroke: new ol.style.Stroke({ color: '#fff', width: 2 })
              })
            }); 
          } */

          if (layer.type === 'MultiLineString') {
            return new ol.style.Style({
              stroke: new ol.style.Stroke({ color: strokeColor, width: 1 }),
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
            return new ol.style.Style({
              fill: new ol.style.Fill({ color: fillColor }),
              stroke: new ol.style.Stroke({ color: strokeColor, width: 1 }),
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
      const searchableProps = layer.properties || [layer.label];
      searchableLayers.push({ layer: vectorLayer, properties: searchableProps });

      // Optional toggle
      $('body').on('click', '#' + layer.id, function () {
        const layerExists = map.getLayers().getArray().includes(vectorLayer);
        if (this.checked && !layerExists) {
          map.addLayer(vectorLayer);
        } else if (!this.checked && layerExists) {
          map.removeLayer(vectorLayer);
        }
      });

      // Wait until source is loaded, then populate suggestions
      vectorSource.once('change', () => {
        if (vectorSource.getState() === 'ready') {
          populateSuggestions();
        }
      });

    });
  })
  .catch(error => console.error('Layer loading error:', error));



document.getElementById('searchBox').addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    event.preventDefault(); // Optional: prevent form submission if inside a form
    searchFeatures();
  }
});


function populateSuggestions() {
  const datalist = document.getElementById('featureSuggestions');
  datalist.innerHTML = '';
  const uniqueValues = new Set();

  searchableLayers.forEach(({ layer, properties }) => {
    layer.getSource().getFeatures().forEach(feature => {
      properties.forEach(prop => {
        const value = feature.get(prop);
        if (value && !uniqueValues.has(value)) {
          uniqueValues.add(value);
          const option = document.createElement('option');
          option.value = value;
          datalist.appendChild(option);
        }
      });
    });
  });
}



function searchFeatures() {
  const query = document.getElementById('searchBox').value.toLowerCase();
  let found = false;
  searchResultSource.clear(); // Remove old marker

  searchableLayers.forEach(({ layer, properties }) => {
    layer.getSource().getFeatures().forEach(feature => {
      feature.setStyle(null); // Reset

      // Check all specified properties
      const match = properties.some(prop => {
        const value = feature.get(prop);
        return value && String(value).toLowerCase() === query;
      });

      if (match) {
        found = true;

        const extent = feature.getGeometry().getExtent();
        const center = ol.extent.getCenter(extent);

        // Highlight feature
        feature.setStyle(new ol.style.Style({
          stroke: new ol.style.Stroke({ color: 'blue', width: 3 }),
          fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.1)' })
        }));

        // Add marker
        const marker = new ol.Feature({
          geometry: new ol.geom.Point(center),
          label: properties.map(p => feature.get(p)).filter(Boolean).join(" | ")
        });
        searchResultSource.addFeature(marker);

        // Zoom (with max zoom)
        map.getView().fit(extent, {
          duration: 1000,
          padding: [50, 50, 50, 50],
          maxZoom: 16
        });
      }
    });
  });

  if (!found) alert('Feature not found.');
}


