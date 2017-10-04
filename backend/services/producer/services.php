<?php

$producer = [
  'tables' => [
    'DocumentTypes' => realpath(__DIR__.'/DocumentTypes.php'),
    'Zones' => realpath(__DIR__.'/Zones.php'),
    'Ranches' => realpath(__DIR__.'/Ranches.php'),
    'Producers' => realpath(__DIR__.'/Producers.php'),
    'Documents' => realpath(__DIR__.'/Documents.php'),
    'ProducersDocuments' => realpath(__DIR__.'/ProducersDocuments.php')
  ],
  'services' => [
    'GET' => [
      'list-documents' => realpath(__DIR__.'/list-documents.php'),
      'list-zones' => realpath(__DIR__.'/list-zones.php')
    ],
    'POST' => [
      'list-ranches-of-zone' => 
        realpath(__DIR__.'/list-ranches-of-zone.php'),
      'list-producers-of-ranch' =>
        realpath(__DIR__.'/list-producers-of-ranch.php'),
      'capture-default' => realpath(__DIR__.'/capture-default.php')
    ]
  ]
];

?>