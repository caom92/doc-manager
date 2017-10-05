<?php

$types = [
  'tables' => [
    'DocumentTypes' => realpath(__DIR__.'/DocumentTypes.php')
  ],
  'services' => [
    'GET' => [
      'list-documents' => realpath(__DIR__.'/list-documents.php')
    ],
    'POST' => [
      'add-doc-type' => realpath(__DIR__.'/add-doc-type.php')
    ]
  ]
];

?>