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

    // obtenemos el ID de la zona en la BD de este sistema
    $zones = $scope->docManagerTableFactory->get('Zones');
    $parentID = $zones->getIDByForeignID($request['parent_id']);
    
    // si la zona no esta registrada en esta BD, hay que agregarla
    if (!isset($parentID)) {
      $parentID = $zones->insert([
        ':foreignID' => $request['parent_id']
      ]);
    }

    // si no esta registrado, lo agregamos a la BD
    $producers->insert([
      ':parentID' => $parentID,
      ':name' => $name
    ]);
  }
];

?>