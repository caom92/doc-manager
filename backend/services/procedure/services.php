<?php

$procedure = [
  'tables' => [
    'Procedure\Documents' => realpath(__DIR__.'/Documents.php')
  ],
  'services' => [
    'POST' => [
      'capture-procedure' => realpath(__DIR__.'/capture-procedure.php'),
      'search-procedure' => realpath(__DIR__.'/search-procedure.php')
    ]
  ]
];

?>