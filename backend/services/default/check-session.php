<?php

$service = [
  'requirements_desc' => [
  ],
  'callback' => function($scope, $request) {
    $segment = $scope->session->getSegment('fsm');
    $isLoggedIn = $segment->get('logged_in');
    return isset($isLoggedIn) ? $isLoggedIn : false;
  }
];

?>