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
    'supplier' => [
      'type' => 'int',
      'min' => 1
    ],
    'notes' => [
      'type' => 'string',
      'max_length' => 65535,
      'optional' => TRUE
    ],
    'letter_file' => [
      'type' => 'files',
      'format' => 'document'
    ]
  ],
  'callback' => function($scope, $request) {
    $notesID = NULL;
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    $letterFile = Core\saveUploadedFileTo(
      $_FILES['letter_file']['name'],
      $_FILES['letter_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/guarantee'),
      "{$request['supplier']}"
    );

    if (!isset($letterFile)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['letter_file']['name']}",
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
      return $scope->docManagerTableFactory->get('Guarantee\Documents')
        ->insert([
          ':documentID' => $letterID,
          ':zoneID' => $zoneID,
          ':supplierID' => $request['supplier'],
          ':notes' => ($hasNotes) ? $request['notes'] : ''
        ]);
    } catch (\Exception $e) {
      $filepath = realpath(__DIR__."/../../documents/guarantee/$letterFile");
      unlink($filepath);
      $documents->delete($letterID);
      throw $e;
    } 
  }
];

?>