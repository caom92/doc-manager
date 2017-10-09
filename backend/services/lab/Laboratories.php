<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/NoParentCategoryTable.php');
use DataBase\NoParentCategoryTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// laboratories en la base de datos
class Laboratories extends NoParentCategoryTable
{
  // Crea una nueva instancia a la tabla laboratories
  function __construct($db) {
    parent::__construct($db, 'laboratories');
  }
}

?>