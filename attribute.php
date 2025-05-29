<?php
// Define the data structure
$data = [
    'container' => [
        'id' => 'attr_',
        'class' => 'collapse-container',
        'sections' => [
            [
                'title' => 'Roads',
                'tag' => 'h1',
                'table' => [
                    'class' => 'ui celled table',
                    'headers' => ['ID', 'FCLASS', 'NAME','CODE',''],
                    'rows' => [
                        ['John', 'Approved', 'None', 'F1','@,-6.4847,8.9258'],
                        ['Jamie', 'Approved', 'Requires call', 'F2','@,-0.1276,51.5074'],
                        ['Jill', 'Denied', 'None', 'F3','@,-0.1276,51.5074']
                    ]
                ]
            ],
            [
                'title' => 'Settlement',
                'tag' => 'h2',
                'table' => [
                    'class' => 'ui celled table',
                    'headers' => ['ID', 'FCLASS', 'NAME',''],
                    'rows' => [
                        ['John', 'Approved', 'None','@,9.123,-7.655'],
                        ['Jamie', 'Approved', 'Requires call','@,9.123,-7.655'],
                        ['Jill', 'Denied', 'None','@,9.123,-7.655']
                    ]
                ]
            ],
            [
                'title' => 'Land Use',
                'tag' => 'h2',
                'table' => [
                    'class' => 'ui celled table',
                    'headers' => ['ID', 'FCLASS', 'NAME'],
                    'rows' => [
                        ['John', 'Approved', 'None'],
                        ['Jamie', 'Approved', 'Requires call'],
                        ['Jill', 'Denied', 'None'],
                        ['Additional', 'Row', 'Example']
                    ]
                ]
            ]
        ]
    ]
];


// Function to generate HTML from the array
function generateHtmlFromJson($jsonData) {
    $html = '<div id="' . htmlspecialchars($jsonData['container']['id']) . '" class="' . htmlspecialchars($jsonData['container']['class']) . '">';
    
    foreach ($jsonData['container']['sections'] as $section) {
        $html .= '<' . $section['tag'] . ' style="font-size: 14px;"><span class="arrow-r"></span>' . htmlspecialchars($section['title']) . '</' . $section['tag'] . '>';
        $html .= '<div>';
        $html .= '<table class="' . htmlspecialchars($section['table']['class']) . '">';
        
        // Table header
        $html .= '<thead><tr>';
        foreach ($section['table']['headers'] as $header) {
            $html .= '<th>' . htmlspecialchars($header) . '</th>';
        }
        $html .= '</tr></thead>';
        
        // Table body
        $html .= '<tbody>';
        foreach ($section['table']['rows'] as $row) {
            $html .= '<tr>';
            foreach ($row as $cell) {
                $r = explode(',', $cell);
                if($r[0] =='@' ){
                    $html .= '<td  style="cursor: pointer;"> <span onclick="handleFindClick('.$r[1].','.$r[2].')" >' . '<i class="eye icon"></i>' . '</span></td>'; 
                }else{
                    $html .= '<td>' . htmlspecialchars($cell) . '</td>'; 
                }
               
            }
            $html .= '</tr>';
        }
        $html .= '</tbody>';
        
        $html .= '</table></div>';
    }
    
    $html .= '</div>';
    return $html;
}

// Output the generated HTML
echo generateHtmlFromJson($data);
?>
