<?php

$service = [
  'requirements_desc' => [
    // 'logged_in' => 'any',
    'subtype_name' => [
      'type' => 'string',
      'min_length' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $subtypeID = $scope->docManagerTableFactory->get('Lab\AnalysisSubTypes')
      ->getIDByName($request['subtype_name']);

    return (isset($subtypeID)) ? 
      $scope->docManagerTableFactory->get('Lab\Areas')
        ->selectByParentID($subtypeID)
      : [];
  }
];

?>