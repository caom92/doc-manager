<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/NoParentCategoryTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// zones en la base de datos
class Zones extends NoParentCategoryTable
{
  // Crea una nueva instancia a la tabla zones
  function __construct($db) {
    parent::__construct($db, 'zones');
  }
}

?>