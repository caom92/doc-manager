<?php

$default = [
  'tables' => [
    'dm' => [
      'Zones' => realpath(__DIR__.'/Zones.php'),
      'Producers' => realpath(__DIR__.'/Producers.php'),
      'Documents' => realpath(__DIR__.'/Documents.php')
    ],
    'fsm' => [
      'Zones' => realpath(__DIR__.'/FsmZones.php')
    ]
  ],
  'services' => [
    'GET' => [
      'list-producers-of-zone/{zone_id}' =>
        realpath(__DIR__.'/list-producers-of-zone.php'),
      'list-zones' =>
        realpath(__DIR__.'/list-zones.php')
    ]
  ]
];

?>