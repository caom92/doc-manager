<?php

$lab = [
  'tables' => [
    'Lab\Documents' => realpath(__DIR__.'/Documents.php'),
    'Lab\Laboratories' => realpath(__DIR__.'/Laboratories.php'),
    'Lab\AnalysisTypes' => realpath(__DIR__.'/AnalysisTypes.php'),
    'Lab\AnalysisSubTypes' => realpath(__DIR__.'/AnalysisSubTypes.php'),
    'Lab\Areas' => realpath(__DIR__.'/Areas.php')
  ],
  'services' => [
    'GET' => [
      'list-labs' => realpath(__DIR__.'/list-labs.php'),
      'list-analysis-types' => realpath(__DIR__.'/list-analysis-types.php'),
      'report-lab/{start_date}/{end_date}/{zone_id}/{subtype_id}' =>
        realpath(__DIR__.'/report-lab.php'),
      'list-lab-categories' => realpath(__DIR__.'/list-lab-categories.php')
    ],
    'POST' => [
      'list-analysis-subtypes-of-type' => 
        realpath(__DIR__.'/list-analysis-subtypes-of-type.php'),
      'list-areas-of-subtype' =>
        realpath(__DIR__.'/list-areas-of-subtype.php'),
      'capture-lab' => realpath(__DIR__.'/capture-lab.php'),
      'search-lab' => realpath(__DIR__.'/search-lab.php'),
      'capture-analysis-type' => realpath(__DIR__.'/capture-analysis-type.php'),
      'capture-analysis-subtype' => 
        realpath(__DIR__.'/capture-analysis-subtype.php')
    ],
    'DELETE' => [
      'delete-lab/{document_id}' => realpath(__DIR__.'/delete-lab.php')
    ]
  ]
];

?>