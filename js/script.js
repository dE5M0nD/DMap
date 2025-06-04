
// gets the x and y coordinates on pointer move
map.on('pointermove', function(evt) {
    var coords = evt.coordinate;  
    var lon = coords[0].toFixed(6);
    var lat = coords[1].toFixed(6);
    var sourceProjection = 'EPSG:3857'; // Change this based on your coordinate system
    var destinationProjection = 'EPSG:4326'; // WGS 84 (Latitude/Longitude)
    var lonLat = ol.proj.transform([lon, lat], sourceProjection, destinationProjection);
    $(".xcord").text(lonLat[0]);
    $(".ycord").text(lonLat[1]);
});




// handling zoom in and out buttons
const view = map.getView();
const view_min = map_.getView();
const minZoom = view.getMinZoom();
const maxZoom = view.getMaxZoom();

document.querySelector('.zoomin').addEventListener('click', function() {
      view.setZoom(view.getZoom() + 1);
      view_min.setZoom(view_min.getZoom() + 1);
      updateSliderPosition();
  });

document.querySelector('.zoomout').addEventListener('click', function() {
      view.setZoom(view.getZoom() - 1);
      view_min.setZoom(view_min.getZoom() - 1);
      updateSliderPosition();
  });




// Slider functionality to handle the zoom in and out on slide
    const slider = document.getElementById('zslider');
    const handle = document.getElementById('zoomdragbtn');
   
   const sliderHeight = slider.offsetHeight;
    const handleHeight = handle.offsetHeight;
    
    // Update slider position based on current zoom
    function updateSliderPosition() {
      const currentZoom = view.getZoom();
      const zoomRange = maxZoom - minZoom;
      const availableHeight = sliderHeight - handleHeight;
      // Position handle from bottom (0 = minZoom, maxHeight = maxZoom)
      const position = ((currentZoom - minZoom) / zoomRange) * availableHeight;
      handle.style.bottom = `${position}px`;
      handle.style.top = 'auto';
    }
    
    // Initialize slider position
    updateSliderPosition();
    
    // Make slider handle draggable
    let isDragging = false;
    let startY, startBottom;
    
    handle.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.clientY;
      startBottom = parseInt(handle.style.bottom) || 0;
      e.preventDefault();
      handle.style.transition = 'none'; // Disable smooth transition during drag
    });
    
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      
      const deltaY = startY - e.clientY; // Positive when moving up
      let newBottom = startBottom + deltaY;
      const availableHeight = sliderHeight - handleHeight;
      
      // Constrain position within slider bounds
      newBottom = Math.max(0, Math.min(availableHeight, newBottom));
      
      // Calculate zoom level (bottom position correlates with zoom level)
      const zoomRange = maxZoom - minZoom;
      const zoomLevel = minZoom + (newBottom / availableHeight) * zoomRange;
      
      // Set zoom level
      view.setZoom(zoomLevel);
      view_min.setZoom(zoomLevel);

      // Update handle position
      handle.style.bottom = `${newBottom}px`;
    });
    
    document.addEventListener('mouseup', () => {
      isDragging = false;
      handle.style.transition = 'bottom 0.2s ease'; // Re-enable smooth transition
    });
    
    // Update slider when zoom changes from other interactions
    map.on('moveend', () => {
      if (!isDragging) { // Only update if not actively dragging
        updateSliderPosition();
      }
    });


 // show and hide tool tip on the toolbar
    $('.tool_tip').hover(
    function() {
      $(this).find('.tooltiptext').stop().fadeIn(200);
    },
    function() {
      $(this).find('.tooltiptext').stop().fadeOut(200);
    }
  );


// toolbar buttons functionalities
  
   document.getElementById('panRightBtn').addEventListener('click', () => {
   	   const view = map.getView();
	    const currentCenter = ol.proj.toLonLat(view.getCenter());
	    const newCenter = ol.proj.fromLonLat([currentCenter[0] + 0.5, currentCenter[1]]);
	    view.animate({ center: newCenter });
  });

  document.getElementById('panLeftBtn').addEventListener('click', () => {
        const view = map.getView();
	    const currentCenter = ol.proj.toLonLat(view.getCenter());
	    const newCenter = ol.proj.fromLonLat([currentCenter[0] - 0.5, currentCenter[1]]);
	    view.animate({ center: newCenter });
  });


  document.getElementById('panTopBtn').addEventListener('click', () => {

  	const view = map.getView();
    const currentCenter = ol.proj.toLonLat(view.getCenter());
    const newCenter = ol.proj.fromLonLat([currentCenter[0], currentCenter[1] + 0.5]);
    view.animate({ center: newCenter });

  });

  document.getElementById('panDownBtn').addEventListener('click', () => {

  	const view = map.getView();
    const currentCenter = ol.proj.toLonLat(view.getCenter());
    const newCenter = ol.proj.fromLonLat([currentCenter[0], currentCenter[1] - 0.5]);
    view.animate({ center: newCenter });

  });


  document.getElementById('attr_tableBtn').addEventListener('click', function() {
  const div = document.getElementById('mydiv');
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
});


 document.getElementById('printBtn').addEventListener('click', function() {
  const div = document.getElementById('printDialog');
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('mydivClose').addEventListener('click', function() {
  const div = document.getElementById('mydiv');
  div.style.display =  'none';
});


document.getElementById('printDialogClose').addEventListener('click', function() {
  const div = document.getElementById('printDialog');
  div.style.display =  'none';
});


const sectionCount = $('#attr_ > *').length;
const allIndexes = Array.from({ length: sectionCount }, (_, i) => i);

//$('#attr_').collapsible({contentOpen: allIndexes, accordion: false});
//$('#attr_').collapsible({contentOpen:0});
$('#attr_').collapsible();

 /*document.getElementById('bgSwitchBtn').addEventListener('click', function() {
  const div = document.getElementById('bgtitle');
  div.style.display = div.style.display === 'none' ? 'block' : 'none';
}); */


document.getElementById('gridBtn').addEventListener('click', () => {
  const layers = map.getLayers().getArray();
  const layerExists = layers.includes(graticule);

  if (!layerExists) {
    map.addLayer(graticule);
  } else {
    map.removeLayer(graticule);
  }
});

    document.getElementById('refreshBtn').addEventListener('click', () => {
     location.reload();
      const view = map.getView();
      const currentCenter = view.getCenter();
       map.getView().animate({ zoom: 11, center: [currentCenter[0], currentCenter[1]] });
  });




// pop up to show attributes  on layers click

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay_ = new ol.Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});
map.addOverlay(overlay_);

// Close popup when 'X' is clicked
closer.onclick = function () {
  overlay_.setPosition(undefined);
  closer.blur(); // remove focus
  return false; // prevent default anchor behavior
};

// Handle map click to show popup
map.on('singleclick', function (evt) {
  const feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
    return feature;
  });

  if (feature) {
    const props = feature.getProperties();
    delete props.geometry;

    let html = `<b>Feature Info:</b><br>`;
    for (const key in props) {
      html += `<strong>${key}:</strong> ${props[key]}<br>`;
    }

    content.innerHTML = html;
    overlay_.setPosition(evt.coordinate);
  } else {
    overlay_.setPosition(undefined);
  }
});



// makes the attribute table draggable


dragElement(document.getElementById("mydiv"));

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
   
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}


document.addEventListener("DOMContentLoaded", function () {
    const dialog = document.getElementById("printDialog");
    const titleBar = dialog.querySelector(".printDialogTitle");

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    titleBar.style.cursor = "move"; // Optional: make it clear that it's draggable

    titleBar.addEventListener("mousedown", function (e) {
        isDragging = true;
        offsetX = e.clientX - dialog.offsetLeft;
        offsetY = e.clientY - dialog.offsetTop;
        document.body.style.userSelect = "none"; // Prevent text selection
    });

    document.addEventListener("mousemove", function (e) {
        if (isDragging) {
            dialog.style.position = "absolute";
            dialog.style.left = (e.clientX - offsetX) + "px";
            dialog.style.top = (e.clientY - offsetY) + "px";
        }
    });

    document.addEventListener("mouseup", function () {
        isDragging = false;
        document.body.style.userSelect = ""; // Restore text selection
    });
});

  function handleFindClick(lat, lon) {
      var latitude= lat;
      var longitude = lon
     flyToLocation(latitude, longitude, 14);
   }
let pulsingLayer = null; // Store the current pulsing layer

function addPulsingHighlight(lon, lat) {
    // Remove the previous pulsing layer if it exists
    if (pulsingLayer) {
        map.removeLayer(pulsingLayer);
    }

    var feature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.fromLonLat([lon, lat]))
    });

    var style = new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.5)' }),
            stroke: new ol.style.Stroke({ color: 'red', width: 2 })
        })
    });

    feature.setStyle(style);

    pulsingLayer = new ol.layer.Vector({ // Store the new layer
        source: new ol.source.Vector({
            features: [feature]
        })
    });

    map.addLayer(pulsingLayer);

    // Animate pulsing effect by changing radius
    let pulseRadius = 10;
    let growing = true;

    function animatePulse() {
        if (growing) {
            pulseRadius += 1;
            if (pulseRadius >= 20) growing = false;
        } else {
            pulseRadius -= 1;
            if (pulseRadius <= 10) growing = true;
        }

        feature.setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: pulseRadius,
                fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.5)' }),
                stroke: new ol.style.Stroke({ color: 'red', width: 2 })
            })
        }));

        setTimeout(animatePulse, 200);
    }

    animatePulse();
}

// Call function after flying to location
function flyToLocation(lon, lat, zoomLevel) {
    var view = map.getView();
    var destination = ol.proj.fromLonLat([lon, lat]);

    view.animate({
        center: destination,
        zoom: zoomLevel,
        duration: 2000
    });

    setTimeout(() => addPulsingHighlight(lon, lat), 2000);
}


$(".printpage").on("click",function(){
    var title = $("#printtitle").val();
    var papersize = $("#papersize").val();
    var orientation = $("#orientation").val();
    var url = 'printpage.php?title='+title+"&psize="+papersize+"&o="+orientation;
    window.open(url, '_blank');
    console.log(orientation);
})