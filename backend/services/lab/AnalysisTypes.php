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

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (name) VALUES (:name)"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }
}

?>