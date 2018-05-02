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
ServiceProvider::addValidationRule(
  'logged_in', 
  function($scope, $name, $value, $options) {
    $service = NULL;
    require_once realpath(__DIR__.'/services/session/check-session.php');

    // check if the user has logged in
    if ($service['callback']($scope, NULL, NULL)) {
      // get the session segment
      $segment = $scope->session->getSegment('dm');

      // if she is, then check if the service is expecting
      // the user to have an specific role
      $mustCheckRoles = $options !== 'any';
      if ($mustCheckRoles) {
        // retrieve the current role of the user
        $role = $segment->get('role_name');
        $hasProperRole = false;

        // check if the user's role correspond to any of
        // the roles that the service is expecting
        foreach ($options as $requiredRole) {
          if ($role === $requiredRole) {
            $hasProperRole = true;
            break;
          }
        }

        if (!$hasProperRole) {
          throw new Exception(
            'User does not have the proper role.',
            117
          );
        }
      }
    } else {
      throw new Exception('The user is not logged in', 118);
    }
  }
);

// Instanciamos el provedor de servicios
$controller = new ServiceProvider(
  [
    'docManagerTableFactory' => function($config) 
    use ($default, $lab, $types, $guarantee, $procedure, $training, $certificate) {
      return new TableFactory(
        'DocManager',
        'DataBase\\',
        $default['tables']['dm'] + 
        $lab['tables'] +
        $types['tables'] +
        $guarantee['tables'] +
        $procedure['tables'] +
        $training['tables'] +
        $certificate['tables']
      );
    },
    'fsmTableFactory' => function($config) 
    use ($default, $account) {
      return new TableFactory(
        'FoodSafetyManual',
        'DataBase\\Fsm\\',
        $default['tables']['fsm'] +
        $default['tables']['fsm'] +
        $account['tables']['fsm']
      );
    }
  ],
  [
    'GET' => 
      $default['services']['GET'] +
      $lab['services']['GET'] +
      $types['services']['GET'] +
      $session['services']['GET'] +
      $account['services']['GET'] +
      $guarantee['services']['GET'] +
      $procedure['services']['GET'] +
      $training['services']['GET'] +
      $certificate['services']['GET'],
    'POST' =>
      $lab['services']['POST'] +
      $account['services']['POST'] +
      $session['services']['POST'] +
      $guarantee['services']['POST'] +
      $procedure['services']['POST'] +
      $training['services']['POST'] +
      $certificate['services']['POST'],
    'DELETE' =>
      $lab['services']['DELETE'] + 
      $guarantee['services']['DELETE'] +
      $procedure['services']['DELETE'] +
      $training['services']['DELETE'] +
      $certificate['services']['DELETE']
  ]
);

// Proveemos el servicio
$controller->serveRemoteClient();

?>