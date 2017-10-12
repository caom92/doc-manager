<?php

$area = [
  'tables' => [
    'Zones' => realpath(__DIR__.'/Zones.php'),
    'Ranches' => realpath(__DIR__.'/Ranches.php'),
    'Producers' => realpath(__DIR__.'/Producers.php'),
    'Areas' => realpath(__DIR__.'/Areas.php'),
    'Documents' => realpath(__DIR__.'/Documents.php'),
    'AreasDocuments' => realpath(__DIR__.'/AreasDocuments.php'),
    'DocumentNotes' => realpath(__DIR__.'/DocumentNotes.php')
  ],
  'services' => [
    'GET' => [
      'list-zones' => realpath(__DIR__.'/list-zones.php')
    ],
    'POST' => [
      'list-ranches-of-zone' => 
        realpath(__DIR__.'/list-ranches-of-zone.php'),
      'list-producers-of-ranch' =>
        realpath(__DIR__.'/list-producers-of-ranch.php'),
      'list-areas-of-producer' =>
        realpath(__DIR__.'/list-areas-of-producer.php'),
      'capture-default' => realpath(__DIR__.'/capture-default.php'),
      'search-default' => realpath(__DIR__.'/search-default.php')
    ],
    'DELETE' => [
      'delete-default/{document_id}' => realpath(__DIR__.'/delete-default.php')
    ]
  ]
];

?>