<?php

namespace DataBase;
require_once realpath(__DIR__.'/SearchableByNameTable.php');

// Interfaz a una tabla en la base de datos que representa una categoria de 
// busqueda de documento que no posee ningun padre
class NoParentCategoryTable extends SearchableByNameTable
{
  // Crea una nueva instancia a la tabla producers
  function __construct($db, $table) {
    parent::__construct($db, $table);
  }

  // Retorna todos los elementos de la tabla organizado en renglones y columnas
  function selectAll() {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table`"
    );
    $query->execute();
    return $query->fetchAll();
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