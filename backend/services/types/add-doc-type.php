<?php

$service = [
  'requirements_desc' => [
    'name' => [
      'type' => 'string',
      'min_length' => 1,
      'max_length' => 255
    ]
  ],
  'callback' => function($scope, $request, $args) {
    $typeName = strtoupper($request['name']);
    $types = $scope->docManagerTableFactory->get('DocumentTypes');
    $isNameRepeated = $types->getIDByName($typeName) != NULL;

    if ($isNameRepeated) {
      throw new \Exception(
        'Failed to add document type; name is already taken', 
        1
      );
    }

    return $types->insert([
      ':name' => $typeName
    ]);
  } // 'callback' => function($scope, $request, $args)
];

?>