<?php

$service = [
  'requirements_desc' => [
    'document_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    // recuperamos la instancia a la tabla de documentos
    $document = $scope->docManagerTableFactory->get('Lab\Documents')
      ->getByID($request['document_id']);

    // computamos la direccion donde se encuentra almacenado el archivo PDF
    $filepath = realpath(
      __DIR__
      .'/../../documents/lab/'
      .$document['file_path']
    );

    $imagepath = realpath(
      __DIR__
      .'/../../images/lab/'
      .$document['image_path']
    );

    // intentamos borrar el archivo
    if (!unlink($filepath)) {
      // si el archivo no pudo ser borrado, lanzamos una excepcion
      throw new \Exception("Failed to delete file: $filepath", 1);
    }

    if (!unlink($imagepath)) {
      // si el archivo no pudo ser borrado, lanzamos una excepcion
      throw new \Exception("Failed to delete image: $imagepath", 2);
    }

    // una vez borrado el archivo, borramos la entrada en la BD
    return $scope->docManagerTableFactory->get('Documents')
      ->delete($document['id']);
  }
]

?>