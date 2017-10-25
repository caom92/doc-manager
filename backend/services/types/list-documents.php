<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any'
  ],
  'callback' => function($scope, $request, $args) {
    return $scope->docManagerTableFactory->get('DocumentTypes')
      ->selectAll();
  }
];

?>