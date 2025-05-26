<?php
$jsonData = '{
  "treeControl": {
    "title": "Map Themes",
    "expandTitle": "Expand the entire tree below",
    "collapseTitle": "Collapse the entire tree below",
    "expandIcon": "treeview/images/minus.gif",
    "collapseIcon": "treeview/images/plus.gif"
  },
  "categories": [
    {
      "name": "Global View",
      "expanded": true,
      "layers": [
        {
          "id": "rivers",
          "name": "Rivers",
          "icon": "rivers.svg",
          "color": null,
          "checked": false,
          "grouping": [
            {
              "id": "rivers",
              "name": "Rivers",
              "icon": "rivers.svg",
              "color": null,
              "checked": false
            },
            {
              "id": "rivers",
              "name": "Rivers",
              "icon": "rivers.svg",
              "color": null,
              "checked": false
            }
          ]
        },
        {
          "id": "rivers",
          "name": "Rivers",
          "icon": "rivers.svg",
          "color": null,
          "checked": false
        },
        {
          "id": "roads",
          "name": "Roads",
          "icon": "roads.svg",
          "color": null,
          "checked": true
        },
        {
          "id": "haul_road",
          "name": "Haul Road",
          "icon": "haul_road.svg",
          "color": null,
          "checked": false
        },
        {
          "id": "pit",
          "name": "Pit",
          "icon": "pit.svg",
          "color": null,
          "checked": false
        },
        {
          "id": "infra",
          "name": "Infrastructure",
          "icon": "infra.svg",
          "color": null,
          "checked": false
        },
        {
          "id": "settlement",
          "name": "Settlement",
          "icon": null,
          "color": null,
          "checked": true
        },
        {
          "id": "airstrip",
          "name": "Airstrip",
          "icon": null,
          "color": null,
          "checked": false
        },
        {
          "id": "blast_zones",
          "name": "Blast Zones",
          "icon": null,
          "color": null,
          "checked": false
        },
        {
          "id": "landuse",
          "name": "Land Use",
          "icon": null,
          "color": null,
          "checked": true
        },
        {
          "id": "pipeline",
          "name": "Pipeline",
          "icon": null,
          "color": null,
          "checked": false
        }
      ]
    },
    {
      "name": "Kone Project",
      "expanded": false,
      "layers": [
        {
          "id": null,
          "name": "Pits",
          "icon": null,
          "color": "grey"
        },
        {
          "id": null,
          "name": "Camp area",
          "icon": null,
          "color": "green"
        },
        {
          "id": null,
          "name": "WSF",
          "icon": null,
          "color": "green"
        },
        {
          "id": null,
          "name": "TSF",
          "icon": null,
          "color": "green"
        },
        {
          "id": null,
          "name": "Access roads",
          "icon": null,
          "color": "#CBCBCB"
        },
        {
          "id": null,
          "name": "Plant",
          "icon": null,
          "color": "green"
        },
        {
          "id": null,
          "name": "Stockpile",
          "icon": null,
          "color": "green"
        },
        {
          "id": null,
          "name": "Contractor laydown",
          "icon": null,
          "color": "green"
        }
      ]
    }
  ]
}
';

$data = json_decode($jsonData, true);

function generateTreeControl($treeControl) {
    return '
    <div id="treecontrol">
        <a title="'.$treeControl['expandTitle'].'" href="#">
            <img src="'.$treeControl['expandIcon'].'" /> 
            <span>'.$treeControl['title'].'</span>
        </a>
    </div>';
}

function generateLayerItem($layer) {
    $html = '<li>';
    
    if (isset($layer['checked'])) {
        $checked = $layer['checked'] ? 'checked="checked"' : '';
        $html .= '<input type="checkbox" id="'.$layer['id'].'" '.$checked.'>';
    }

    if (!empty($layer['icon'])) {
        $html .= '<img src="img/'.$layer['icon'].'" style="width:20px !important;height:7px !important;display: inline-block;">';
    } elseif (!empty($layer['color'])) {
        $html .= '<div style="display:inline-block;width:50px; height:10px;background:'.$layer['color'].';margin-right:5px"></div>';
    }

    $html .= $layer['name'];

    // Handle nested grouping if present
    if (!empty($layer['grouping']) && is_array($layer['grouping'])) {
        $html .= '<ul>';
        foreach ($layer['grouping'] as $subLayer) {
            $html .= generateLayerItem($subLayer);
        }
        $html .= '</ul>';
    }

    $html .= '</li>';
    return $html;
}

function generateCategory($category) {
    $html = '<li>
        <span class="layer_name">
            <input type="checkbox" id="" '.($category['expanded'] ? 'checked' : '').'>
            '.$category['name'].'
        </span>
        <ul>';
    
    foreach ($category['layers'] as $layer) {
        $html .= generateLayerItem($layer);
    }
    
    $html .= '</ul></li>';
    return $html;
}

function generateTreeView($data) {
    $html = generateTreeControl($data['treeControl']);
    $html .= '<ul id="black" class="treeview-black">';
    
    foreach ($data['categories'] as $category) {
        $html .= generateCategory($category);
    }
    
    $html .= '</ul>';
    return $html;
}

echo generateTreeView($data);
?>
