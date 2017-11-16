<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
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
    $subtypes = $scope->docManagerTableFactory->get('Lab\AnalysisSubTypes');

    // revisamos si el subtipo de analisis ya esta registrado en la BD
    $id = $subtypes->getIDByName($name);
    if (isset($id)) {
      return;
    }

    // si no esta registrado, lo agregamos a la BD
    $subtypes->insert([
      ':parentID' => $request['parent_id'],
      ':name' => $name
    ]);
  }
];

?>