<?php

$guarantee = [
  'tables' => [
    'Guarantee\Suppliers' => realpath(__DIR__.'/Suppliers.php'),
    'Guarantee\Documents' => realpath(__DIR__.'/Documents.php')
  ],
  'services' => [
    'GET' => [
      'list-suppliers' => realpath(__DIR__.'/list-suppliers.php')
    ],
    'POST' => [
      'capture-guarantee' => realpath(__DIR__.'/capture-guarantee.php'),
      'search-guarantee' => realpath(__DIR__.'/search-guarantee.php'),
      'add-supplier' => realpath(__DIR__.'/add-supplier.php')
    ],
    'DELETE' => [
      'delete-guarantee/{document_id}' => realpath(__DIR__.'/delete-guarantee.php')
    ]
  ]
];

?>