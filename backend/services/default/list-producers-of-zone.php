<?php

$service = [
  'requirements_desc' => [
    'zone_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $zoneID = $scope->docManagerTableFactory->get('Zones')
      ->getIDByForeignID($args['zone_id']);
    
    return $scope->docManagerTableFactory->get('Producers')
      ->selectByParentID($zoneID);
  }
]

?>