<?php

$service = [
  'requirements_desc' => [
    'document_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    $document = $scope->docManagerTableFactory->get('Training\Documents')
      ->getByID($request['document_id']);
    
    $filepath = realpath(
      __DIR__
      .'/../../documents/training/'
      .$document['file_path']
    );

    if (!unlink($filepath)) {
      throw new \Exception("Failed to delete file: $filepath", 1);
    }

    return $scope->docManagerTableFactory->get('Documents')
      ->delete($document['id']);
  }
];

?>