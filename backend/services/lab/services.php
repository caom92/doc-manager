<?php

$lab = [
  'tables' => [
    'Lab\Documents' => realpath(__DIR__.'/Documents.php'),
    'Lab\Laboratories' => realpath(__DIR__.'/Laboratories.php'),
    'Lab\AnalysisTypes' => realpath(__DIR__.'/AnalysisTypes.php')
  ],
  'services' => [
    'GET' => [
      'list-labs' => realpath(__DIR__.'/list-labs.php'),
      'list-analysis-types' => realpath(__DIR__.'/list-analysis-types.php')
    ],
    'POST' => [
      'capture-lab' => realpath(__DIR__.'/capture-lab.php'),
      'search-lab' => realpath(__DIR__.'/search-lab.php')
    ],
    'DELETE' => [
      'delete-lab/{document_id}' => realpath(__DIR__.'/delete-lab.php')
    ]
  ]
];

?>