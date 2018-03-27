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
    'document_name' => [
      'type' => 'string',
      'max_length' => 255
    ],
    'section_id' => [
      'type' => 'int',
      'min' => 1
    ],
    'notes' => [
      'type' => 'string',
      'max_length' => 65535,
      'optional' => TRUE
    ],
    'procedure_file' => [
      'type' => 'files',
      'format' => 'document'
    ]
  ],
  'callback' => function($scope, $request) {
    $notesID = NULL;
    $hasNotes = isset($request['notes']) && array_key_exists('notes', $request);

    $procedureFile = Core\saveUploadedFileTo(
      $_FILES['procedure_file']['name'],
      $_FILES['procedure_file']['tmp_name'],
      realpath(__DIR__.'/../../documents/procedure'),
      ""
    );

    if (!isset($procedureFile)) {
      throw new \Exception(
        "Failed to save upload {$_FILES['procedure_file']['name']}",
        1
      );
    }

    $zoneID = $scope->docManagerTableFactory->get('Zones')
      ->getIDByForeignID($request['zone']);
    $documents = $scope->docManagerTableFactory->get('Documents');
    try {
      $procedureID = $documents->insert([
        ':typeID' => $request['document_type_id'],
        ':uploadDate' => $request['capture_date'],
        ':fileDate' => $request['file_date'],
        ':filePath' => $procedureFile
      ]);

      // guardamos el registro
      return $scope->docManagerTableFactory->get('Procedure\Documents')
        ->insert([
          ':documentID' => $procedureID,
          ':zoneID' => $zoneID,
          ':sectionID' => $request['section_id'],
          ':documentName' => $request['document_name'],
          ':notes' => ($hasNotes) ? $request['notes'] : ''
        ]);
    } catch (\Exception $e) {
      $filepath = realpath(__DIR__."/../../documents/procedure/$procedureFile");
      unlink($filepath);
      $documents->delete($procedureID);
      throw $e;
    } 
  }
];

?>