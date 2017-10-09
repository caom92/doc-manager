<?php

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
    'lab_id' => [
      'type' => 'int',
      'min' => 1
    ],
    'area_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    return $scope->docManagerTableFactory->get('Lab\Documents')
      ->selectByLabAreaAndDateInterval(
        $request['document_type_id'],
        $request['lab_id'],
        $request['area_id'],
        $request['start_date'],
        $request['end_date']
      );
  } // 'callback' => function($scope, $request, $args)
];

?>