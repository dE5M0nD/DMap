<?php
header('Content-Type: application/json');

$data = [
  "gLayer" => [
    [
      "id" => "roads",
      "name" => "roads",
      "url" => "data2.geojson",
      "type" => "MultiLineString",
      "label" => "name",
      "properties" => ["id", "name"],
      "fill" => "rgba(0, 0, 255, 0.2)",
      "stroke" => "#CBCBCB"
    ],
    [
      "id" => "settlement",
      "name" => "settlement",
      "url" => "data.geojson",
      "type" => "point",
      "label" => "name",
      "properties" => ["id", "name"],
      "fill" => "rgba(0, 0, 255, 0.2)",
      "stroke" => "blue",
      "rep"  => [  
                    [  
                      "var" => "hamlet",
                      "fill" => "#8B4513",
                      "stroke" => "",
                      "icon" =>"▣",
                      "iconSize" => "26"
                    ],
                   [ 
                      "var" => "village",
                      "fill" => "#D2B48C",
                      "stroke" =>"",
                      "icon" =>"◉",
                      "iconSize" => "16"
                   ]
              ]
    ],
    [
      "id" => "landuse",
      "name" => "landuse",
      "url" => "data5.geojson",
      "type" => "MultiPolygon",
      "label" => "name",
      "properties" => ["id", "name"],
      "fill" => "rgba(129, 179, 76, 0.1)",
      "stroke" => "rgba(129, 179, 76, 0.1)"
    ]
  ]
];

echo json_encode($data);
