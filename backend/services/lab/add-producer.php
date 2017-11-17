<?php

$service = [
  'requirements_desc' => [
    'logged_in' => [ 'Supervisor' ],
    'parent_id' => [
      'type' => 'int',
      'min' => 1
    ],
    'name' => [
      'type' => 'string',
      'max_length' => 255
    ]
  ],
  'callback' => function($scope, $request) {
    // nos aseguramos de que el nombre esta en mayusculas
    $name = strtoupper($request['name']);

    // recuperamos el DAO de los subtipos de analisis
    $producers = $scope->docManagerTableFactory->get('Producers');

    // revisamos si el subtipo de analisis ya esta registrado en la BD
    $id = $producers->getIDByNameAndParentID($name, $request['parent_id']);
    if (isset($id)) {
      return;
    }

    // si no esta registrado, lo agregamos a la BD
    $producers->insert([
      ':parentID' => $request['parent_id'],
      ':name' => $name
    ]);
  }
];

?>