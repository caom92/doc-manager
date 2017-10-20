<?php

require_once realpath(__DIR__.'/ServiceProvider.php');
require_once realpath(dirname(__FILE__).'/dao/TableFactory.php');
require_once realpath(dirname(__FILE__).'/services/services.php');

use \Core\ServiceProvider as ServiceProvider;
use \DataBase\TableFactory as TableFactory;

// Definimos los validadores personalizados que vamos a utilizar en
// este proyecto
// ServiceProvider::addValidationRule(
//   'nombre del validador', 
//   function($scope, $name, $value, $options) {
//   }
// );

// Instanciamos el provedor de servicios
$controller = new ServiceProvider(
  [
    'docManagerTableFactory' => function($config) 
    use ($default, $lab, $types) {
      return new TableFactory(
        'DocManager',
        'DataBase\\',
        $default['tables']['dm'] + 
        $lab['tables'] +
        $types['tables']
      );
    },
    'fsmTableFactory' => function($config) 
    use ($default) {
      return new TableFactory(
        'FoodSafetyManual',
        'DataBase\\Fsm\\',
        $default['tables']['fsm']
      );
    }
  ],
  [
    'GET' => 
      $default['services']['GET'] +
      $lab['services']['GET'] +
      $types['services']['GET'],
    'PUT' => [
      // 'nombre del servicio' => function($scope, $request) {
      // }
    ],
    'POST' =>
      $lab['services']['POST'],
    'DELETE' =>
      $lab['services']['DELETE']
  ]
);

// Proveemos el servicio
$controller->serveRemoteClient();

?>