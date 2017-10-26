<?php

$service = [
  'requirements_desc' => [
  ],
  'callback' => function($scope, $request) {
    $scope->session->clear();
    $scope->session->destroy();
  }
];

?>