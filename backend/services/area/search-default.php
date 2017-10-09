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
    'area_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    return $scope->docManagerTableFactory->get('AreasDocuments')
      ->selectByTypeAreaAndDateInterval(
        $request['document_type_id'],
        $request['area_id'],
        $request['start_date'],
        $request['end_date']
      );
  } // 'callback' => function($scope, $request, $args)
];

?>