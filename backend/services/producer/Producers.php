<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// producers en la base de datos
class Producers extends DataBaseTable
{
  // Crea una nueva instancia a la tabla producers
  function __construct($db) {
    parent::__construct($db, 'producers');
  }

  // Retorna todos los elementos que tengan registrados el ID de rancho
  // especificado
  // [in]   ranchID (uint): el ID del rancho cuyos productores van a ser 
  //        recuperados
  // [out]  return (dictionary): los datos de los productores registrados en el 
  //        rancho especificado organizados en renglones y columnas
  function selectByRanchID($ranchID) {
    $query = $this->getStatement(
      'select_by_ranch',
      "SELECT * FROM `$this->table` WHERE parent_id = :ranch_id"
    );
    $query->execute([
      ':ranch_id' => $ranchID
    ]);
    return $query->fetchAll();
  }

  // Retorna el ID del productor que tenga el nombre especificado
  // [in]   name (string): el nombre del productor cuyo ID sera recuperado
  // [out]  return (uint): el ID del productor especificado si este fue 
  //        encontrado en la tabla, o nulo en caso contrario
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

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      'insert_row',
      "INSERT INTO `$this->table` (name, parent_id) VALUES (:name, :ranchID)"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }
}

?>