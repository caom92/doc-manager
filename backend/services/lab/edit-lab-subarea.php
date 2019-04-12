<?php

$service = [
  'requirements_desc' => [
    'logged_in' => [ 'Supervisor' ],
    'document' => [
      'type' => 'int',
      'min' => 1
    ],
    'subarea' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    // recuperamos el DAO de los documentos de analisis
    $documents = $scope->docManagerTableFactory->get('Lab\Documents');

    // enviamos la solicitud para editar la subarea
    $documents->editSubArea([
      ':subareaID' => $request['subarea'],
      ':documentID' => $request['document']
    ]);

    // recuperamos los datos actualizados

    return $documents->selectAreaSubAreaByID($request['document']);
  }
];

?>