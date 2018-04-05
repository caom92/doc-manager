<?php

$training = [
  'tables' => [
    'Training\Sections' => realpath(__DIR__.'/Sections.php'),
    'Training\Documents' => realpath(__DIR__.'/Documents.php')
  ],
  'services' => [
    'GET' => [
      'list-training-sections' => realpath(__DIR__.'/list-training-sections.php')
    ],
    'POST' => [
      'capture-training' => realpath(__DIR__.'/capture-training.php'),
      'search-training' => realpath(__DIR__.'/search-training.php'),
      'add-training-section' => realpath(__DIR__.'/add-training-section.php')
    ],
    'DELETE' => [
      'delete-training/{document_id}' => 
        realpath(__DIR__.'/delete-training.php')
    ]
  ]
];

?>