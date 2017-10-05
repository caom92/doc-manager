<?php

$service = [
  'requirements_desc' => [
    'start_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'end_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'producer_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    return $scope->docManagerTableFactory->get('Lab\Documents')
      ->selectByProducerAndDateInterval(
        $request['producer_id'],
        $request['start_date'],
        $request['end_date']
      );
  } // 'callback' => function($scope, $request, $args)
];

?>