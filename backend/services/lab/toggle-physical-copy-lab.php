<?php

$service = [
  'requirements_desc' => [
    'logged_in' => [ 'Supervisor' ],
    'document_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    $scope->docManagerTableFactory->get('Documents')
      ->togglePhysicalCopyFlagByID($request['document_id']);
  }
];

?>