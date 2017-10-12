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
    'analysis_type_name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'lab_name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
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
    'analysis_file' => [
      'type' => 'files',
      'format' => 'document'
    ]
  ],
  'callback' => function($scope, $request, $args) {
    // guardamos el archivo subido de forma permanente
    $analysisFile = Core\saveUploadedFileTo(
      $_FILES['analysis_file']['name'],
      $_FILES['analysis_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/lab'),
      "Analysis_{$request['producer']}"
    );

    // si el archivo no pudo ser subido, truncamos el programa con un error
    if (!isset($analysisFile)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['analysis_file']['name']}",
        1
      );
    }

    // si el archivo se subio con exito, actualizamos la base de datos
    $analysisID =  $scope->docManagerTableFactory->get('Documents')->insert([
      ':typeID' => $request['document_type_id'],
      ':uploadDate' => $request['capture_date'],
      ':fileDate' => $request['file_date'],
      ':filePath' => $analysisFile
    ]);

    // obtenemos el ID del laboratorio
    $labName = strtoupper($request['lab_name']);
    $labs = $scope->docManagerTableFactory->get('Lab\Laboratories');
    $labID = $labs->getIDByName($labName);
    
    // si el ID no pudo ser recuperado, significa que el lab no existe en la BD,
    // tenemos que agregarlo
    if (!isset($labID)) {
      $labID = $labs->insert([ ':name' => $labName ]);
    }

    // obtenemos el ID del tipo de analysis
    $typeName = strtoupper($request['analysis_type_name']);
    $analysisTypes = $scope->docManagerTableFactory->get('Lab\AnalysisTypes');
    $typeID = $analysisTypes->getIDByName($typeName);

    // si el ID no pudo ser recuperado, significa que el tipo de analisis no 
    // existe en la BD, tenemos que agregarlo
    if (!isset($typeID)) {
      $typeID = $analysisTypes->insert([ ':name' => $typeName ]);
    }

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
    // proveidos
    $notesID = NULL;
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    // guardamos el registro
    return $scope->docManagerTableFactory->get('Lab\Documents')->insert([
      ':analysisDocumentID' => $analysisID,
      ':analysisTypeID' => $typeID,
      ':labID' => $labID,
      ':areaID' => $areaID,
      ':notes' => ($hasNotes) ? $request['notes'] : ''
    ]);
  } // 'callback' => function($scope, $request, $args)
];

?>