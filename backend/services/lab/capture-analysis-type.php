<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'name' => [
      'type' => 'string',
      'max_length' => 255
    ]
  ],
  'callback' => function($scope, $request) {
    // nos aseguramos de que el nombre esta en mayusculas
    $name = strtoupper($request['name']);

    // recuperamos el DAO de los tipos de analisis
    $types = $scope->docManagerTableFactory->get('Lab\AnalysisTypes');

    // nos aseguramos de que el nombre no esta registrado ya en la BD
    $id = $types->getIDByName($name);
    if (isset($id)) {
      return;
    }

    // si no es asi, lo agregamos en la BD
    $types->insert([ ':name' => $name ]);
  }
];

?>