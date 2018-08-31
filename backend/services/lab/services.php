<?php

$lab = [
  'tables' => [
    'Lab\Documents' => realpath(__DIR__.'/Documents.php'),
    'Lab\Laboratories' => realpath(__DIR__.'/Laboratories.php'),
    'Lab\AnalysisTypes' => realpath(__DIR__.'/AnalysisTypes.php'),
    'Lab\AnalysisSubTypes' => realpath(__DIR__.'/AnalysisSubTypes.php'),
    'Lab\Areas' => realpath(__DIR__.'/Areas.php'),
    'Lab\SubAreas' => realpath(__DIR__.'/SubAreas.php')
  ],
  'services' => [
    'GET' => [
      'list-labs' => realpath(__DIR__.'/list-labs.php'),
      'list-analysis-types' => realpath(__DIR__.'/list-analysis-types.php'),
      'list-lab-categories' => realpath(__DIR__.'/list-lab-categories.php')
    ],
    'POST' => [
      'list-analysis-subtypes-of-type' => 
        realpath(__DIR__.'/list-analysis-subtypes-of-type.php'),
      'list-areas-of-subtype' =>
        realpath(__DIR__.'/list-areas-of-subtype.php'),
      'list-subareas-of-area' =>
        realpath(__DIR__.'/list-subareas-of-area.php'),
      'capture-lab' => realpath(__DIR__.'/capture-lab.php'),
      'edit-lab-subarea' => realpath(__DIR__.'/edit-lab-subarea.php'),
      'search-lab' => realpath(__DIR__.'/search-lab.php'),
      'add-analysis-type' => realpath(__DIR__.'/add-analysis-type.php'),
      'add-analysis-subtype' => 
        realpath(__DIR__.'/add-analysis-subtype.php'),
      'add-product' => realpath(__DIR__.'/add-product.php'),
      'add-subarea' => realpath(__DIR__.'/add-subarea.php'),
      'add-lab' => realpath(__DIR__.'/add-lab.php'),
      'add-producer' => realpath(__DIR__.'/add-producer.php'),
      'toggle-physical-copy-lab' => 
        realpath(__DIR__.'/toggle-physical-copy-lab.php'),
      'report-lab' => realpath(__DIR__.'/report-lab.php')
    ],
    'DELETE' => [
      'delete-lab/{document_id}' => realpath(__DIR__.'/delete-lab.php')
    ]
  ]
];

?>
