<?php

require_once realpath(__DIR__.'/../../functions.php');

$service = [
  'requirements_desc' => [
    'logged_in' => [ 'Supervisor' ],
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
    'producer' => [
      'type' => 'int',
      'min' => 1
    ],
    'lab' => [
      'type' => 'int',
      'min' => 1
    ],
    'subarea' => [
      'type' => 'int',
      'min' => 1
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
  'callback' => function($scope, $request) {
    // finalmente, capturamos los comentarios adicionales si estos fueron
    // proveidos
    $notesID = NULL;
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    // guardamos el archivo subido de forma permanente
    $analysisFile = Core\saveUploadedFileTo(
      $_FILES['analysis_file']['name'],
      $_FILES['analysis_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/lab'),
      "{$request['producer']}_{$request['lab']}_{$request['subarea']}"
    );

    // si el archivo no pudo ser subido, truncamos el programa con un error
    if (!isset($analysisFile)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['analysis_file']['name']}",
        1
      );
    }

    // si el archivo se subio con exito, actualizamos la base de datos
    $documents = $scope->docManagerTableFactory->get('Documents');
    try {
      $analysisID = $documents->insert([
        ':typeID' => $request['document_type_id'],
        ':uploadDate' => $request['capture_date'],
        ':fileDate' => $request['file_date'],
        ':filePath' => $analysisFile
      ]);

      // guardamos el registro
      return $scope->docManagerTableFactory->get('Lab\Documents')->insert([
        ':documentID' => $analysisID,
        ':producerID' => $request['producer'],
        ':labID' => $request['lab'],
        ':subareaID' => $request['subarea'],
        ':notes' => ($hasNotes) ? $request['notes'] : ''
      ]);
    } catch (\Exception $e) {
      // computamos la direccion donde se encuentra almacenado el archivo PDF
      $filepath = realpath(__DIR__."/../../documents/lab/$analysisFile");

      // intentamos borrar el archivo
      unlink($filepath);

      // una vez borrado el archivo, borramos la entrada en la BD
      $documents->delete($analysisID);

      // pasamos la excepcion a la siguiente capa
      throw $e;
    } 
  } // 'callback' => function($scope, $request)
];

?>