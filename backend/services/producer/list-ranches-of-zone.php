<?php

$service = [
  'requirements_desc' => [
    'zone_name' => [
      'type' => 'string',
      'length' => 3
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $zoneID = $scope->docManagerTableFactory->get('Zones')
      ->getIDByName($request['zone_name']);

    return (isset($zoneID)) ? 
      $scope->docManagerTableFactory->get('Ranches')->selectByZoneID($zoneID)
      : [];
  }
];

?>