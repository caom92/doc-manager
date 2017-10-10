<?php

require_once realpath(__DIR__.'/../../functions.php');

$service = [
  'requirements_desc' => [
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
    'ranch_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'producer_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'area_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ]
  ],
  'callback' => function($scope, $request, $args) {
    return $scope->docManagerTableFactory->get('AreasDocuments')
      ->selectByDateInterval(
        $request['document_type_id'],
        $request['start_date'],
        $request['end_date'],
        (isset($request['zone_id']) 
          && array_key_exists('zone_id', $request)) ? 
            $request['zone_id'] : NULL,
        (isset($request['ranch_id']) 
          && array_key_exists('ranch_id', $request)) ?
            $request['ranch_id'] : NULL,
        (isset($request['producer_id'])
          && array_key_exists('producer_id', $request)) ?
            $request['producer_id'] : NULL,
        (isset($request['area_id']) 
          && array_key_exists('area_id', $request)) ?
            $request['area_id'] : NULL
      );
  } // 'callback' => function($scope, $request, $args)
];

?>