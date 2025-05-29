<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8" />
    <title>Thematic Map</title>
    <link rel="icon" type="image/x-icon" href="https://openlayers.org/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.css' >
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.1.2/css/bootstrap.min.css'>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="treeview/jquery.treeview.css" />
    <link rel="stylesheet" href="treeview/collapsible.css" />
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>

    <script src="treeview/jquery.cookie.js"></script>
    <script src="treeview/jquery.treeview.js"></script>
    <script type="text/javascript" src="treeview/demo.js"></script>
    <script type="text/javascript" src="treeview/jquery.collapsible.js"></script>
     <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/ol@v10.5.0/ol.css">
    <script src="https://cdn.jsdelivr.net/npm/ol@v10.5.0/dist/ol.js"></script>
    <link rel="stylesheet" href="css/style.css" >
</head>
<body>
      <div id="topbar"> 
         <a class="active item" href="/"  style="background: #c0d06a !important"  ><img src="img/paceware.png"  style="max-width:100px !important;background: #085d08 !important" ></a>
        <div class="ui mini icon input">
          <input type="text" placeholder="Search mini..."   list="featureSuggestions"  id="searchBox"  class="_keyword_search"  style="width: 120px !important;height: 20px !important;font-size: 10px !important">
          <i class="dropdown icon"></i>
        </div>
      
        <datalist id="featureSuggestions"></datalist>
      <button onclick="searchFeatures()">Search</button>

        <ul  class="barlinks">
          <li>
              <a class="active item" href="/"  >
                <i class="user circle icon"></i>
                  John Doe
              </a>
          </li>
          <li>
              <a class="item  logout_btn"><img src="img/pbutton.png"  style="width:15px !important;" /></a>
           </li>
        </ul>
      </div>
    

       <div class="main-frame">
         <div id="map"></div>

         <div class="legend-frame">

        <div id="popup" class="ol-popup">
            <a href="#" id="popup-closer" class="ol-popup-closer"></a>
            <div id="popup-content"></div>
        </div>

      <div class="toolbar">
 
     <div class="toolbar-menu">
               <!-- <div><img src="js/treeview/images/home_off.gif"  ></div> -->
                <div id="panTopBtn"  class="tool_tip"><i  class="fa fa-arrow-up"  style="font-size:18px;padding: 4px;cursor: pointer;" aria-hidden="true"></i>  <span class="tooltiptext">Pan up </span></div>
                <div id="panLeftBtn" class="tool_tip"><img src="img/back_off.gif"  ><span class="tooltiptext">Pan left</span></div>
                <div id="panRightBtn" class="tool_tip"><img src="img/fwd_off.gif"  ><span class="tooltiptext">Pan right</span></div>
                <div id="panDownBtn" class="tool_tip"><i class="fa fa-arrow-down"  style="font-size:18px;padding: 4px;"  aria-hidden="true"></i><span class="tooltiptext">Pan Down</span></div>
               <!-- <div><img src="treeview/images/zoomselected_off.gif"  ></div>
                <div><img src="treeview/images/pan_off.gif"  ></div> -->
                <div><img src="treeview/images/identify_off.gif"  ></div>
                <div id="attr_tableBtn" class="tool_tip"><img src="img/select_off.gif"  ><span class="tooltiptext">Attributes table</span></div>
                <div><img src="img/auto_identify_off.gif"  ></div>
                <div><img src="img/measure_off.gif"  ></div>
                <div><img src="img/transparency_off.gif"  ></div>
               <!-- <div  id="bgSwitchBtn"  class="tool_tip"><img src="img/Switch.gif"   > <span class="tooltiptext">Switch Background </span>
                </div> -->
                <div  id="gridBtn" class="tool_tip"><img src="img/grid.svg"   ><span class="tooltiptext">Hide/Show Grid </span></div>
                 <div id="printBtn"  class="tool_tip"><i  class="fa fa-print" style="font-size:18px;padding: 4px;"></i><span class="tooltiptext">Print Map </span></div>
                 <div id="refreshBtn"  class="tool_tip"><i  class="fa fa-refresh" style="font-size:18px;padding: 4px;"></i><span class="tooltiptext">Refresh Map </span></div>
               <div></div>


                 <span id="bgtitle">
                    <button onclick="switchBaseLayer('bing')"><img src="img/bing.png"  width="50"></button>
                    <button onclick="switchBaseLayer('osm')"><img src="img/openstreet.png"  width="50"></button>
                  </span>

            </div>


        <div id="mydiv" style="display: block;">
          <div id="mydivheader">Layer Attributes  <span  id="mydivClose"><i class="fa fa-window-close" aria-hidden="true"></i></span></div>
          <div id="attr_table">
             <?php include 'attribute.php'; ?>
          </div>
        </div>

      <div  id="zoomCtrl" class="zoomCtrl sliderAreaOut slider-area-out">

            <div id="sliderTool">

                <div id="slider-top"  class="zoomin">
                  <img src="treeview/images/zoomplus.gif"  alt title="Zoom in"  >
               </div>

                 <div id="zslider">
                  <div style="height:150px;width:16px;background-color:#000000;font-size:0px;">
                    <div style="position:relative;left:1px;top:0px;height:150px;width:14px;background-color:#666666;font-size:0px;">
                      <div style="position:absolute;left:6px;top:0px;height:145px;width:2px;background-color:#666666;font-size:0px;">
                       </div>

                       <div id ="zoomdragbtn"  style="position: absolute; left: -4px;  height: 16px; width: 22px; font-size: 0px;cursor: ns-resize;" >
                            <div style="border-top:1px solid #ffffff;border-left:1px solid #ffffff;border-right:1px solid #000000;border-bottom:1px solid #000000;">
                            <div  style="height:14px;width:20px;font-size:0px;background-color:#999999;cursor:move;">
                              <span style="width:100%;text-align:center;">
                              <img src="treeview/images/slider_updown.gif" style="display:block;margin:auto;" alt="">
                             </span>
                           </div>
                         </div>
                       </div>

                     </div>
                    </div>
                   </div>

                <div id="slider-bottom" class="zoomout">
                    <img src="treeview/images/zoomminus.gif"  alt title="Zoom out"  >
                 </div>

             </div>

         

          </div>
      
      

        <div class="legend">

        <div id="menu-container" >
         
          <?php include 'treeview.php'; ?>
           
        </div>

          <div id="main-map" ></div>
          
        </div>

        </div>
                      
       </div>
    </div>

     <script type="text/javascript" src="js/main.js"></script>
     <script type="text/javascript" src="js/script.js" >  </script>

    <div class="navgreen">

  <div id="cordbar"> 
    <span style="margin-left:5px;margin-right:10px;">X:</span> <span class="xcord" style="display: inline-block;
   ;padding-top:2px;padding-bottom:2px;padding-right:5px"></span>
    <span style="margin-left:5px;margin-right:10px;">Y:</span> <span class="ycord" style="display: inline-block;
    padding-top:2px;padding-bottom:2px;padding-right:5px"></span>
  </div>

    <span style="color: #fff;font-size:14px;margin:0 auto">All right reserved paceware  &#169; <?php echo $currentYear = date('Y'); ?> </span>
</div>
      <script  src="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.5.0/semantic.min.js"></script>

</body>
</html>
