<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'zone_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    $zoneID = $scope->docManagerTableFactory->get('Zones')
      ->getIDByForeignID($request['zone_id']);
    
    return $scope->docManagerTableFactory->get('Producers')
      ->selectByParentID($zoneID);
  }
]

?>