<?php

$service = [
  'requirements_desc' => [
    'logged_in' => [ 'Supervisor', 'Manager', 'Director' ],
    'document_id' => [
      'type' => 'int',
      'min' => 1
    ]
  ],
  'callback' => function($scope, $request) {
    $signersTable = $scope->docManagerTableFactory->get('Signers');
    $documentsTable = $scope->docManagerTableFactory->get('Documents');
    $isRegistered = $signersTable->isSignerRegistered($_SESSION['dm']['user_id']) > 0;
    if ($isRegistered) {
      // Se actualiza el nombre (por si el nombre ha cambiado en el Food Safety Manual)
      $signersTable->update([
        ':foreignID' => $_SESSION['dm']['user_id'],
        ':firstName' => $_SESSION['dm']['first_name'],
        ':lastName' => $_SESSION['dm']['last_name']
      ]);
    } else {
      // Primero se añade a la tabla de signers
      $signersTable->insert([
        ':foreignID' => $_SESSION['dm']['user_id'],
        ':firstName' => $_SESSION['dm']['first_name'],
        ':lastName' => $_SESSION['dm']['last_name']
      ]);
    }

    $signerID = $signersTable->getSignerByForeignID($_SESSION['dm']['user_id']);

    $documentsTable->signDocument($request['document_id'], $signerID[0]['id']);
  }
];

?>