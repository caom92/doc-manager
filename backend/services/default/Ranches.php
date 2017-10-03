<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// ranches en la base de datos
class Ranches extends DataBaseTable
{
  // Crea una nueva instancia a la tabla ranches
  function __construct($db) {
    parent::__construct($db, 'ranches');
  }

  // Retorna todos los elementos que tengan registrados el ID de zona 
  // especificado
  // [in]   zoneID (uint): el ID de la zona cuyos ranchos van a ser recuperados
  // [out]  return (dictionary): los datos de los ranchos registrados en la 
  //        zona especificada organizados en renglones y columnas
  function selectByZoneID($zoneID) {
    $query = $this->getStatement(
      'select_by_zone',
      "SELECT * FROM `$this->table` WHERE zone_id = :zone_id"
    );
    $query->execute([
      ':zone_id' => $zoneID
    ]);
    return $query->fetchAll();
  }

  // Retorna el ID del rancho que tenga el nombre especificado
  // [in]   name (string): el nombre del rancho cuyo ID sera recuperado
  // [out]  return (uint): el ID del rancho especificado si este fue encontrado 
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