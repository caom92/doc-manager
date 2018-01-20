<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'document_type_id' => [
      'type' => 'int',
      'min' => 1
    ],
    'start_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'end_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'zone_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'supplier_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ]
  ],
  'callback' => function($scope, $request) {
    $documents = $scope->docManagerTableFactory->get('Guarantee\Documents');
    $rows = $documents->selectByDateInterval(
      $request['document_type_id'],
      $request['start_date'],
      $request['end_date'],
      (isset($request['zone_id']) 
        && array_key_exists('zone_id', $request)) ? 
          $request['zone_id'] : NULL,
      (isset($request['supplier_id'])
        && array_key_exists('supplier_id', $request)) ?
          $request['supplier_id'] : NULL
    );

    $fsmZones = $scope->fsmTableFactory->get('Zones');
    foreach ($rows as &$row) {
      $zoneName = $fsmZones->getNameByID($row['zone_id']);
      $row['zone_name'] = $zoneName;
    }
    unset($row);

    return [
      'documents' => $rows
    ];
  }
]

?>