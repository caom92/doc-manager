<?php

$service = [
  'requirements_desc' => [],
  'callback' => function($scope, $request) {
    return $scope->docManagerTableFactory->get('DocumentTypes')
      ->selectAll();
  }
];

?>