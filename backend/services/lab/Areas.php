<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/SingleParentCategoryTable.php');
use DataBase\SingleParentCategoryTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// lab_areas en la base de datos
class Areas extends SingleParentCategoryTable
{
  // Crea una nueva instancia a la tabla lab_areas
  function __construct($db) {
    parent::__construct($db, 'lab_areas');
  }
}

?>