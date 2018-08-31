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
    'product' => [
      'type' => 'int',
      'min' => 1
    ],
    'notes' => [
      'type' => 'string',
      'max_length' => 65535,
      'optional' => TRUE
    ],
    'certificate_file' => [
      'type' => 'files',
      'format' => 'document'
    ]
  ],
  'callback' => function($scope, $request) {
    $notesID = NULL;
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    $letterFile = Core\saveUploadedFileTo(
      $_FILES['certificate_file']['name'],
      $_FILES['certificate_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/certificate'),
      "{$request['product']}"
    );

    if (!isset($letterFile)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['certificate_file']['name']}",
        1
      );
    }

    $zoneID = $scope->docManagerTableFactory->get('Zones')
      ->getIDByForeignID($request['zone']);
    $documents = $scope->docManagerTableFactory->get('Documents');
    try {
      $letterID = $documents->insert([
        ':typeID' => $request['document_type_id'],
        ':uploadDate' => $request['capture_date'],
        ':fileDate' => $request['file_date'],
        ':filePath' => $letterFile
      ]);

      // guardamos el registro
      return $scope->docManagerTableFactory->get('Certificate\Documents')
        ->insert([
          ':documentID' => $letterID,
          ':zoneID' => $zoneID,
          ':productID' => $request['product'],
          ':notes' => ($hasNotes) ? $request['notes'] : ''
        ]);
    } catch (\Exception $e) {
      $filepath = realpath(__DIR__."/../../documents/certificate/$letterFile");
      unlink($filepath);
      $documents->delete($letterID);
      throw $e;
    } 
  }
];

?>