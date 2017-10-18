<?php

$types = [
  'tables' => [
    'DocumentTypes' => realpath(__DIR__.'/DocumentTypes.php')
  ],
  'services' => [
    'GET' => [
      'list-documents' => realpath(__DIR__.'/list-documents.php')
    ]
  ]
];

?>