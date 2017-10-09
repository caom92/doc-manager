<?php

require_once realpath(__DIR__.'/../../functions.php');

$service = [
  'requirements_desc' => [
    'document_type_id' => [
      'type' => 'int',
      'min' => 1
    ],
    'capture_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'file_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'zone' => [
      'type' => 'string',
      'length' => 3
    ],
    'ranch' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'producer' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'area' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'notes' => [
      'type' => 'string',
      'max_length' => 65535,
      'optional' => TRUE
    ],
    'document_file' => [
      'type' => 'files',
      'format' => 'document'
    ]
  ],
  'callback' => function($scope, $request, $args) {
    // guardamos el archivo subido de forma permanente
    $filePath = Core\saveUploadedFileTo(
      $_FILES['document_file']['name'],
      $_FILES['document_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/producer'),
      $request['producer']
    );

    // si el archivo no pudo ser subido, truncamos el programa con un error
    if (!isset($filePath)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['document_file']['name']}",
        1
      );
    }

    // si el archivo se subio con exito, actualizamos la base de datos
    $documentID = $scope->docManagerTableFactory->get('Documents')->insert([
      ':typeID' => $request['document_type_id'],
      ':uploadDate' => $request['capture_date'],
      ':fileDate' => $request['file_date'],
      ':filePath' => $filePath
    ]);

    // obtenemos el ID del area, agregando la zona, rancho, productor y/o area 
    // si estas no estan ya almacenadas en la BD en el proceso
    $areaID = Core\getLastCategoryID(
      $scope->docManagerTableFactory, 
      [
        'name' => $request['zone'],
        'table' => 'Zones',
        'child' => [
          'name' => $request['ranch'],
          'table' => 'Ranches',
          'child' => [
            'name' => $request['producer'],
            'table' => 'Producers',
            'child' => [
              'name' => $request['area'],
              'table' => 'Areas',
              'child' => NULL
            ]
          ]
        ]
      ],
      NULL
    );

    // finalmente, capturamos los comentarios adicionales si estos fueron
    // proveidos y guardamos el registro
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    return $scope->docManagerTableFactory->get('AreasDocuments')->insert([
      ':documentID' => $documentID,
      ':areaID' => $areaID,
      ':notes' => ($hasNotes) ? $request['notes'] : ''
    ]);
  } // 'callback' => function($scope, $request, $args)
];

?>