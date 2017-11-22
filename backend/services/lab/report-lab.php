<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'start_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'end_date' => [
      'type' => 'datetime',
      'format' => 'Y-m-d'
    ],
    'zone_id' => [
      'type' => 'int',
      'min' => 1
    ],
    'type_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ],
    'subtype_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => TRUE
    ]
  ],
  'callback' => function($scope, $request) {
    // revisamos cuales IDs fueron proveidos 
    $hasSubtypeID = 
      isset($request['subtype_id']) && array_key_exists('subtype_id', $request);
    $hasTypeID = 
      isset($request['type_id']) && array_key_exists('type_id', $request);

    // primero obtenemos los valores del reporte de la BD
    $rows = $scope->docManagerTableFactory->get('Lab\Documents')
      ->countByDateIntervalAndZoneID(
        $request['start_date'],
        $request['end_date'],
        $request['zone_id'],
        ($hasTypeID) ? $request['type_id'] : NULL,
        ($hasSubtypeID) ? $request['subtype_id'] : NULL
      );

    // inicializamos almacenamiento temporal para los tipos, subtipos, areas y 
    // productores que retornaremos al usuario
    $types = [];
    $subtypes = [];
    $areas = [];
    $producers = [];

    // inicializamos almacenamiento temporal para el tipo, subtipo y area que 
    // se esta vigilando en cada iteracion
    $type = [
      'name' => ''
    ];

    $subtype = [
      'name' => ''
    ];

    $area = '';

    // funcion auxiliar que busca el productor con el nombre especificado en el 
    // arreglo de productores y retorna su indice si lo encontro o nulo en caso 
    // contrario
    $getIndexOf = function($name, $producers) {
      for ($i = 0; $i < count($producers); ++$i) {
        if ($producers[$i]['name'] == $name) {
          return $i;
        }
      }
      return NULL;
    };

    // inicializamos el indice del ultimo elemento en el arreglo de areas
    $a = -1;

    // visitamos cada renglon obtenido de la BD uno por uno...
    foreach ($rows as $row) {
      // revisamos si el tipo cambio desde la ultima iteracion
      $hasTypeChanged = $row['type_name'] != $type['name'];
      if ($hasTypeChanged) {
        // si el tipo cambio, revisamos si el ultimo tipo poseia datos 
        // almacenados
        if (strlen($type['name']) > 0) {
          // si los poseia, hay que guardarlos en el almacenamiento final
          array_push($areas, $area);
          array_push($subtypes, $subtype);
          array_push($types, $type);
        }

        // vigilamos la nueva area
        $area = $row['area_name'];
        ++$a;

        // vigilamos el nuevo subtipo
        $subtype = [
          'span' => 1,
          'name' => $row['subtype_name'],
          'start' => $a,
          'length' => 1
        ];

        // vigilamos el nuevo tipo
        $type = [
          'span' => 1,
          'name' => $row['type_name'],
          'start' => $a,
          'length' => 1
        ];
      } else {
        // revisamos si el subtipo ha cambiado desde la ultima iteracion
        $hasSubtypeChanged = $row['subtype_name'] != $subtype['name'];
        if ($hasSubtypeChanged) {
          // si el subtipo cambio, revisamos si el ultimo subtipo tenia datos 
          // almacenados
          if (strlen($subtype['name']) > 0) {
            // si los tenia, hay que guardarlos en el almacenamiento final
            array_push($areas, $area);
            array_push($subtypes, $subtype);
          }

          // vigilamos la nueva area
          $area = $row['area_name'];
          ++$a;

          // vigilamos el nuevo subtipo
          $subtype = [
            'span' => 1,
            'name' => $row['subtype_name'],
            'start' => $a,
            'length' => 1
          ];

          // actualizamos los valores del tipo
          ++$type['span'];
          ++$type['length'];
        } else {
          // revisamos si el area cambio desde la ultima iteracion
          $hasAreaChanged = $row['area_name'] != $area;
          if ($hasAreaChanged) {
            // si cambio, revisamos si la ultima area tenia datos almacenados
            if (strlen($area) > 0) {
              // si los tenia, los agregamos al almacenamiento final
              array_push($areas, $area);
            }

            // vigilamos la nueva area
            $area = $row['area_name'];
            ++$a;

            // actualizamos los datos del subtipo y del tipo
            ++$subtype['span'];
            ++$subtype['length'];
            ++$type['span'];
            ++$type['length'];
          } // if ($hasAreaChanged)
        } // if ($hasSubtypeChanged)
      } // if ($hasTypeChanged)

      // revisamos si este productor ya habia sido capturado en el 
      // almacenamiento final
      $idx = $getIndexOf($row['producer_name'], $producers);
      if (isset($idx)) {
        // si asi fue, actualizamos sus datos
        $producers[$idx]['values'][$a] = $row['num_documents'];
      } else {
        // en caso contrario, lo agregamos al almacenamiento final
        array_push($producers, [
          'name' => $row['producer_name'],
          'values' => [
            $a => $row['num_documents']
          ]
        ]);
      }
    } // foreach ($rows as $row)

    // no hay que olvidar almacenar los ultimos renglones
    if (strlen($area) > 0) {
      array_push($areas, $area);
    }

    if (strlen($subtype['name']) > 0) {
      array_push($subtypes, $subtype);
    }

    if (strlen($type['name']) > 0) {
      array_push($types, $type);
    }

    // retornamos el resultado al usuario
    return [
      'types' => $types,
      'subtypes' => $subtypes,
      'areas' => $areas,
      'producers' => $producers
    ];
  }
];

?>