<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'subtype' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    return $scope->docManagerTableFactory->get('Lab\Areas')
      ->selectByParentID($request['subtype']);
  }
];

?>