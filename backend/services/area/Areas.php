<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/SingleParentCategoryTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// areas en la base de datos
class Areas extends SingleParentCategoryTable
{
  // Crea una nueva instancia a la tabla areas
  function __construct($db) {
    parent::__construct($db, 'areas');
  }
}

?>