<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/NoParentCategoryTable.php');
use DataBase\NoParentCategoryTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// analysis_types en la base de datos
class AnalysisTypes extends NoParentCategoryTable
{
  // Crea una nueva instancia a la tabla analysis_types
  function __construct($db) {
    parent::__construct($db, 'analysis_types');
  }
}

?>