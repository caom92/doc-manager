<?php

$service = [
  'requirements_desc' => [
    'ranch_name' => [
      'type' => 'string',
      'min_length' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $ranchID = $scope->docManagerTableFactory->get('Ranches')
      ->getIDByName($request['ranch_name']);

    return (isset($ranchID)) ? 
      $scope->docManagerTableFactory->get('Producers')
        ->selectByRanchID($ranchID)
      : [];
  }
];

?>