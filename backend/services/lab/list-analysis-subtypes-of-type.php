<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'type' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    return $scope->docManagerTableFactory->get('Lab\AnalysisSubTypes')
      ->selectByParentID($request['type']);
  }
];

?>