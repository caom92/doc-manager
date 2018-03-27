<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any'
  ],
  'callback' => function($scope, $request) {
    return $scope->docManagerTableFactory->get('Procedure\Sections')
      ->selectAll();
  }
];

?>