<?php

$service = [
  'requirements_desc' => [
    'logged_in' => 'any'
  ],
  'callback' => function($scope, $request) {
    // obtenemos la lista de zonas
    $rows = $scope->fsmTableFactory->get('Zones')->selectAll();

    // visitamos renglon por renglon
    foreach ($rows as &$row) {
      $row['logo_path'] = (strlen($row['logo_path']) > 0) ?
        $row['logo_path'] : 'default.png';
    }
    unset($row);

    // retornamos las zonas recuperadas
    return $rows;
  }
];

?>