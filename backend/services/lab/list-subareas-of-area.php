<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'area' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    return $scope->docManagerTableFactory->get('Lab\SubAreas')
      ->selectByParentID($request['area']);
  }
];

?>