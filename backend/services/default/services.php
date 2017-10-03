<?php

$default = [
  'tables' => [
    'DocumentTypes' => realpath(__DIR__.'/DocumentTypes.php'),
    'Zones' => realpath(__DIR__.'/Zones.php'),
    'Ranches' => realpath(__DIR__.'/Ranches.php'),
    'Producers' => realpath(__DIR__.'/Producers.php')
  ],
  'services' => [
    'GET' => [
      'list-documents' => realpath(__DIR__.'/list-documents.php'),
      'list-zones' => realpath(__DIR__.'/list-zones.php'),
      'list-ranches-of-zone/{zone_name}' => 
        realpath(__DIR__.'/list-ranches-of-zone.php'),
      'list-producers-of-ranch/{ranch_name}' =>
        realpath(__DIR__.'/list-producers-of-ranch.php')
    ]
  ]
];

?>