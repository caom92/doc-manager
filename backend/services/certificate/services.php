<?php

$certificate = [
  'tables' => [
    'Certificate\Products' => realpath(__DIR__.'/Products.php'),
    'Certificate\Documents' => realpath(__DIR__.'/Documents.php')
  ],
  'services' => [
    'GET' => [
      'list-certificate-products' => realpath(__DIR__.'/list-certificate-products.php')
    ],
    'POST' => [
      'capture-certificate' => realpath(__DIR__.'/capture-certificate.php'),
      'search-certificate' => realpath(__DIR__.'/search-certificate.php'),
      'add-certificate-product' => realpath(__DIR__.'/add-certificate-product.php')
    ],
    'DELETE' => [
      'delete-certificate/{document_id}' => realpath(__DIR__.'/delete-certificate.php')
    ]
  ]
];

?>