<?php

$service = [
  'requirements_desc' => [
    'producer_name' => [
      'type' => 'string',
      'min_length' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $producerID = $scope->docManagerTableFactory->get('Producers')
      ->getIDByName($request['producer_name']);

    return (isset($producerID)) ? 
      $scope->docManagerTableFactory->get('Areas')
        ->selectByParentID($producerID)
      : [];
  }
];

?>