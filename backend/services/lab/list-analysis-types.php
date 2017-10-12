<?php

$service = [
  'requirements_desc' => [],
  'callback' => function($scope, $request, $args) {
    return $scope->docManagerTableFactory->get('Lab\AnalysisTypes')
      ->selectAll();
  }
];

?>