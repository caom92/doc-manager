<?php

$service = [
  'requirements_desc' => [
    'logged_in' => [ 'Supervisor' ],
    'name' => [
      'type' => 'string',
      'max_length' => 255
    ]
  ],
  'callback' => function($scope, $request) {
    $name = strtoupper($request['name']);
    $suppliers = $scope->docManagerTableFactory->get('Training\Sections');

    $id = $suppliers->getIDByName($name);
    if (isset($id)) {
      return;
    }

    $suppliers->insert([ ':name' => $name ]);
  }
]

?>