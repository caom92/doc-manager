<?php

$service = [
  'requirements_desc' => [
  ],
  'callback' => function($scope, $request) {
    $segment = $scope->session->getSegment('dm');
    $isLoggedIn = $segment->get('logged_in');
    return isset($isLoggedIn) ? $isLoggedIn : false;
  }
];

?>