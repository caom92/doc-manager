<?php

$procedure = [
  'tables' => [
    'Procedure\Sections' => realpath(__DIR__.'/Sections.php'),
    'Procedure\Documents' => realpath(__DIR__.'/Documents.php')
  ],
  'services' => [
    'GET' => [
      'list-sections' => realpath(__DIR__.'/list-sections.php')
    ],
    'POST' => [
      'capture-procedure' => realpath(__DIR__.'/capture-procedure.php'),
      'search-procedure' => realpath(__DIR__.'/search-procedure.php'),
      'add-section' => realpath(__DIR__.'/add-section.php')
    ],
    'DELETE' => [
      'delete-procedure/{document_id}' => 
        realpath(__DIR__.'/delete-procedure.php')
    ]
  ]
];

?>