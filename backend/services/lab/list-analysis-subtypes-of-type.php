<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'type_name' => [
      'type' => 'string',
      'min_length' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $typeID = $scope->docManagerTableFactory->get('Lab\AnalysisTypes')
      ->getIDByName($request['type_name']);

    return (isset($typeID)) ? 
      $scope->docManagerTableFactory->get('Lab\AnalysisSubTypes')
        ->selectByParentID($typeID)
      : [];
  }
];

?>