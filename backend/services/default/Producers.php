<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/SingleParentCategoryTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// producers en la base de datos
class Producers extends SingleParentCategoryTable
{
  // Crea una nueva instancia a la tabla producers
  function __construct($db) {
    parent::__construct($db, 'producers');
  }
}

?>