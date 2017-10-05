<?php

include realpath(__DIR__.'/../../functions.php');

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
    'analysis_file' => [
      'type' => 'files',
      'format' => 'document'
    ],
    'result_file' => [
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

    $resultFile = Core\saveUploadedFileTo(
      $_FILES['result_file']['name'],
      $_FILES['result_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/lab'),
      "Result_{$request['producer']}"
    );

    // si el archivo no pudo ser subido, truncamos el programa con un error
    if (!isset($resultFile)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['result_file']['name']}",
        1
      );
    }

    // si el archivo se subio con exito, actualizamos la base de datos
    $documents = $scope->docManagerTableFactory->get('Documents');
    $analysisID = $documents->insert([
      ':typeID' => $request['document_type_id'],
      ':uploadDate' => $request['capture_date'],
      ':fileDate' => $request['file_date'],
      ':filePath' => $analysisFile
    ]);
    $resultID = $documents->insert([
      ':typeID' => $request['document_type_id'],
      ':uploadDate' => $request['capture_date'],
      ':fileDate' => $request['file_date'],
      ':filePath' => $resultFile
    ]);

    // obtenemos una instancia a los DAOs que vamos a necesitar
    $zones = $ranches = NULL;
    $producers = $scope->docManagerTableFactory->get('Producers');

    // primero hay que revisar si el productor ingresado existe en la BD
    $producerID = $producers->getIDByName($request['producer']);

    // si el productor no existe, necesitamos crearlo en la BD
    if (!isset($producerID)) {
      // para agregar al productor, primero es necesario revisar si el rancho 
      // existe en la BD
      $ranches = $scope->docManagerTableFactory->get('Ranches');
      $ranchID = $ranches->getIDByName($request['ranch']);

      // si el rancho no existe, debemos agregarlo
      if (!isset($ranchID)) {
        // para agregar el rancho, primero debemos revisar si la zona existe en 
        // la BD
        $zones = $scope->docManagerTableFactory->get('Zones');
        $zoneID = $zones->getIDByName($request['zone']);

        // si la zona no existe, debemos agregarla a la BD
        if (!isset($zoneID)) {
          // agregamos la zona a la BD
          $zoneID = $zones->insert([
            ':name' => strtoupper($request['zone'])
          ]);
        } // if (!isset($zoneID))

        // agregamos el rancho a la BD
        $ranchID = $ranches->insert([
          ':name' => strtoupper($request['ranch']),
          ':zoneID' => $zoneID
        ]);
      } // if (!isset($ranchID))

      // agregamos el productor
      $producerID = $producers->insert([
        ':name' => strtoupper($request['producer']),
        ':ranchID' => $ranchID
      ]);
    } // if (!isset($producerID))

    return $scope->docManagerTableFactory->get('Lab\Documents')->insert([
      ':analysisDocumentID' => $analysisID,
      ':resultDocumentID' => $resultID,
      ':producerID' => $producerID
    ]);
  } // 'callback' => function($scope, $request, $args)
];

?>