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
    'zone' => [
      'type' => 'int',
      'min' => 1
    ],
    'producer' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'lab_name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'analysis_type_name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ],
    'subtype' => [
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
  'callback' => function($scope, $request) {
    // obtenemos el ID del laboratorio, agregandolo a la BD si aun no esta 
    // registrado
    $labID = 
      Core\getCategoryID(
        $scope->docManagerTableFactory,
        [
          'lab' => [
            'name' => $request['lab_name'],
            'table' => 'Lab\Laboratories'
          ]
        ]
      )['lab']['id'];

    // recuperamos el ID local de la zona
    $zones = $scope->docManagerTableFactory->get('Zones');
    $zoneID = $zones->getIDByForeignID($request['zone']);
    
    // si el ID local no existe, tal vez es porque esta zona fue agregada 
    // recientemente en la BD foranea, hay que asignarle un ID local
    if (!isset($zoneID)) {
      // primero revisamos si el ID proveido existe en la BD foranea
      $isValid = 
        $scope->fsmTableFactory->get('Zones')->hasByID($request['zone']);
      if ($isValid) {
        $zoneID = $zones->insert([ ':foreignID' => $request['zone'] ]);
      } else {
        // lanzamos una excepcion
        throw new \Exception(
          "The value for 'zone_id' is not registered in the foreign data base",
          1
        );
      }
    }

    // obtenemos el ID del proveedor, agregandolo a la BD si aun no esta 
    // registrado
    $producerID = Core\getLastCategoryID(
      $scope->docManagerTableFactory,
      [
        'name' => $request['producer'],
        'table' => 'Producers',
        'child' => NULL
      ],
      $zoneID
    );

    // obtenemos el ID del area, agregandolo a la BD si aun no esta regsistrado
    $areaID = Core\getLastCategoryID(
      $scope->docManagerTableFactory,
      [
        'name' => $request['analysis_type_name'],
        'table' => 'Lab\AnalysisTypes',
        'child' => [
          'name' => $request['subtype'],
          'table' => 'Lab\AnalysisSubTypes',
          'child' => [
            'name' => $request['area'],
            'table' => 'Lab\Areas',
            'child' => NULL
          ]
        ]
      ],
      NULL
    );

    // finalmente, capturamos los comentarios adicionales si estos fueron
    // proveidos
    $notesID = NULL;
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    // guardamos el archivo subido de forma permanente
    $analysisFile = Core\saveUploadedFileTo(
      $_FILES['analysis_file']['name'],
      $_FILES['analysis_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/lab'),
      "{$producerID}_{$labID}_{$areaID}"
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
        ':producerID' => $producerID,
        ':labID' => $labID,
        ':areaID' => $areaID,
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