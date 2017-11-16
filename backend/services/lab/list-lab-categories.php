<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any'
  ],
  'callback' => function($scope, $request) {
    // recuperamos la lista de categories
    $rows = $scope->docManagerTableFactory->get('Lab\Areas')
      ->selectAll();

    // el almacenamiento de la tabla que sera retornada al cliente
    $tableRows = [];

    // el almacenamiento para guardar el tipo y subtipo del renglon anterior
    $lastType = [
      'name' => '',
      'index' => 0
    ];
    $lastSubtype = [
      'name' => '',
      'index' => 0
    ];
    
    // visitamos cada renglon recuperado de la BD
    $i = 0;
    foreach ($rows as $row) {
      // almacenamiento temporal para cada renglon de la tabla a retornar al 
      // cliente
      $tempRow = [
        'area' => [
          'name' => $row['area_name'],
          'border' => TRUE
        ],
        'subtype' => [
          'name' => NULL,
          'rowspan' => 1,
          'border' => FALSE
        ],
        'type' => [
          'name' => NULL,
          'rowspan' => 1,
          'border' => FALSE
        ]
      ];

      // revisamos si el tipo de este renglon ha cambiado
      if ($lastType['name'] == $row['type_name']) {
        // si no ha cambiado
        // incrementamos el numero de renglones que va a ocupar este tipo
        $tableRows[$lastType['index']]['type']['rowspan']++;

        // revisamos si el subtipo de este renglon ha cambiado
        if ($lastSubtype['name'] == $row['subtype_name']) {
          // si no ha cambiado, incrementamos el numero de renglones que va a 
          // ocupar
          $tableRows[$lastSubtype['index']]['subtype']['rowspan']++;
        } else {
          // si el subtipo cambio, actualizamos el ultimo subtipo
          $tempRow['subtype']['name'] = $lastSubtype['name'] = 
            $row['subtype_name'];
          $lastSubtype['index'] = $i;
          $tempRow['subtype']['border'] = TRUE;
        } 
      } else {
        // si el tipo ha cambiado, actualizamos el ultimo tipo
        $tempRow['type']['name'] = $lastType['name'] = $row['type_name'];
        $lastType['index'] = $i;
        $tempRow['type']['border'] = TRUE;

        // y tambien el subtipo
        $tempRow['subtype']['name'] = $lastSubtype['name'] = 
          $row['subtype_name'];
        $lastSubtype['index'] = $i;
        $tempRow['subtype']['border'] = TRUE;
      }

      // almacenamos el renglon en la tabla final a enviar al cliente
      array_push($tableRows, $tempRow);
      ++$i;
    }

    return $tableRows;
  }
];

?>