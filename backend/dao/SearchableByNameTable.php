<?php

namespace DataBase;
require_once realpath(__DIR__.'/DataBaseTable.php');

// Interfaz a una tabla en la base de datos cuyos elementos pueden ser buscados 
// por nombre
class SearchableByNameTable extends DataBaseTable
{
  // Crea una nueva instancia a la tabla producers
  function __construct($db, $table) {
    parent::__construct($db, $table);
  }

  // Retorna el ID del elemento que tenga el nombre especificado
  // [in]   name (string): el nombre del elemento cuyo ID sera recuperado
  // [out]  return (uint): el ID del elemento especificado si este fue 
  //        encontrado en la tabla, o nulo en caso contrario
  function getIDByName($name) {
    $query = $this->getStatement(
      "SELECT id FROM `$this->table` WHERE name = :name"
    );
    $query->execute([
      ':name' => $name
    ]);
    $rows = $query->fetchAll();
    return (count($rows) > 0) ? $rows[0]['id'] : NULL;
  }
}

?>