<?php

$service = [
  'requirements_desc' => [
    'document_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request, $args) {
    // recuperamos la instancia a la tabla de documentos
    $document = $scope->docManagerTableFactory->get('Lab\Documents')
      ->getByID($args['document_id']);

    // computamos la direccion donde se encuentra almacenado el archivo PDF
    $filepath = realpath(
      __DIR__
      .'/../../documents/lab/'
      .$document['file_path']
    );

    // intentamos borrar el archivo
    if (!unlink($filepath)) {
      // si el archivo no pudo ser borrado, lanzamos una excepcion
      throw new \Exception("Failed to delete file: $filepath", 1);
    }

    // una vez borrado el archivo, borramos la entrada en la BD
    return $scope->docManagerTableFactory->get('Documents')
      ->delete($document['id']);
  }
]

?>