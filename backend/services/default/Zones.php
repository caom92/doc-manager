<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// zones en la base de datos
class Zones extends DataBaseTable
{
  // Crea una nueva instancia a la tabla zones
  function __construct($db) {
    parent::__construct($db, 'zones');
  }

  // Retorna todos los elementos de la tabla organizado en renglones y columnas
  function selectAll() {
    $query = $this->getStatement(
      'select_all',
      "SELECT * FROM `$this->table`"
    );
    $query->execute();
    return $query->fetchAll();
  }

  // Retorna el ID de la zona que tenga el nombre especificado
  // [in]   name (string): el nombre de la zona cuyo ID sera recuperado
  // [out]  return (uint): el ID de la zona especificada si esta fue encontrada 
  //        en la tabla, o nulo en caso contrario
  function getIDByName($name) {
    $query = $this->getStatement(
      'select_id_by_name',
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