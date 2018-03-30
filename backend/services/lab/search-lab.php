<?php

require_once realpath(__DIR__.'/../../functions.php');

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
    'producer_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'lab_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'analysis_type_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'analysis_subtype_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'area_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'subarea_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ]
  ],
  'callback' => function($scope, $request) {
    $documents = $scope->docManagerTableFactory->get('Lab\Documents');
    $rows = $documents->selectByDateInterval(
      $request['document_type_id'],
      $request['start_date'],
      $request['end_date'],
      (isset($request['zone_id']) 
        && array_key_exists('zone_id', $request)) ? 
          $request['zone_id'] : NULL,
      (isset($request['producer_id'])
        && array_key_exists('producer_id', $request)) ?
          $request['producer_id'] : NULL,
      (isset($request['lab_id']) 
        && array_key_exists('lab_id', $request)) ? 
          $request['lab_id'] : NULL,
      (isset($request['analysis_type_id']) 
        && array_key_exists('analysis_type_id', $request)) ? 
          $request['analysis_type_id'] : NULL,
      (isset($request['analysis_subtype_id']) 
        && array_key_exists('analysis_subtype_id', $request)) ?
          $request['analysis_subtype_id'] : NULL,
      (isset($request['area_id']) 
        && array_key_exists('area_id', $request)) ?
          $request['area_id'] : NULL,
      (isset($request['subarea_id']) 
        && array_key_exists('subarea_id', $request)) ?
          $request['subarea_id'] : NULL
    );

    $count = $documents->countPhysicalCopiesByDateInterval(
      $request['document_type_id'],
      $request['start_date'],
      $request['end_date'],
      (isset($request['zone_id']) 
        && array_key_exists('zone_id', $request)) ? 
          $request['zone_id'] : NULL,
      (isset($request['producer_id'])
        && array_key_exists('producer_id', $request)) ?
          $request['producer_id'] : NULL,
      (isset($request['lab_id']) 
        && array_key_exists('lab_id', $request)) ? 
          $request['lab_id'] : NULL,
      (isset($request['analysis_type_id']) 
        && array_key_exists('analysis_type_id', $request)) ? 
          $request['analysis_type_id'] : NULL,
      (isset($request['analysis_subtype_id']) 
        && array_key_exists('analysis_subtype_id', $request)) ?
          $request['analysis_subtype_id'] : NULL,
      (isset($request['area_id']) 
        && array_key_exists('area_id', $request)) ?
          $request['area_id'] : NULL,
      (isset($request['subarea_id']) 
        && array_key_exists('subarea_id', $request)) ?
          $request['subarea_id'] : NULL
    );

    $fsmZones = $scope->fsmTableFactory->get('Zones');
    foreach ($rows as &$row) {
      $zoneName = $fsmZones->getNameByID($row['zone_id']);
      $row['zone_name'] = $zoneName;
    }
    unset($row);

    return [
      'num_docs_with_physical_copy' => $count,
      'documents' => $rows
    ];
  } // 'callback' => function($scope, $request)
];

?>