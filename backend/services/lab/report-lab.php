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
    ]
  ],
  'callback' => function($scope, $request) {
    // primero obtenemos los valores del reporte de la BD
    $rows = $scope->docManagerTableFactory->get('Lab\Documents')
      ->countByDateIntervalAndZoneID(
        $request['zone_id'],
        $request['start_date'],
        $request['end_date']
      );
    
    // inicializamos almacenamiento temporal para almacenar los encabezados de 
    // la tabla de reporte y el cuerpo de la misma
    $headers = [ '' ];
    $reportData = [];

    // almacenamiento auxiliar que contendra los datos del area actual que esta 
    // siendo procesada
    $currentArea = [
      'name' => ''
    ];

    // visitamos cada renglon obtenido de la BD uno por uno ...
    foreach ($rows as $row) {
      // revisamos si este renglon contiene un area diferente a todos los 
      // renglones procesados anteriormente hasta ahora
      $hasAreaChanged = $currentArea['name'] != $row['area_name'];
      if ($hasAreaChanged) {
        // si se trata de un renglon nuevo...
        if (strlen($currentArea['name']) > 0) {
          // guardamos el area que recien terminamos de procesar
          array_push($reportData, $currentArea);
        }

        // procesamos la nueva area
        $currentArea = [
          'name' => $row['area_name'],
          'values' => [
            $row['num_documents']
          ]
        ];
      } else {
        // si el nuevo renglon pertenece a la misma area que estamos procesando 
        // actualmente, simplemente almacenamos los datos de este renglon en 
        // esta area
        array_push($currentArea['values'], $row['num_documents']);
      }

      // agregamos al nombre del productor a la lista de encabezados si este es 
      // la 1er area que es procesada en el bucle
      if (count($reportData) == 0) {
        array_push($headers, $row['producer_name']);
      }
    }

    // no hay que olvidar almacenar los datos de la ultima area procesada 
    if (strlen($currentArea['name']) > 0) {
      array_push($reportData, $currentArea);
    }

    // retornamos los datos procesados del reporte
    return [
      'headers' => $headers,
      'body' => $reportData
    ];
  }
];

?>