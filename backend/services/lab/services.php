<?php

$lab = [
  'tables' => [
    'Lab\Documents' => realpath(__DIR__.'/Documents.php')
  ],
  'services' => [
    'GET' => [
    ],
    'POST' => [
      'capture-lab' => realpath(__DIR__.'/capture-lab.php'),
      'search-lab' => realpath(__DIR__.'/search-lab.php')
    ]
  ]
];

?>