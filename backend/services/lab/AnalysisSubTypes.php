<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/SingleParentCategoryTable.php');
use DataBase\SingleParentCategoryTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// analysis_subtypes en la base de datos
class AnalysisSubTypes extends SingleParentCategoryTable
{
  // Crea una nueva instancia a la tabla analysis_subtypes
  function __construct($db) {
    parent::__construct($db, 'analysis_subtypes');
  }
}

?>