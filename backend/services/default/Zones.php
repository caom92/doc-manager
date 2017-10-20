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

  // Retorna el ID del renglon que tenga registrado el ID foraneo especificado
  function getIDByForeignID($foreignID) {
    $query = $this->getStatement(
      "SELECT id FROM `$this->table` WHERE foreign_id = :foreignID"
    );
    $query->execute([
      ':foreignID' => $foreignID
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
      "INSERT INTO `$this->table` (foreign_id) VALUES (:foreignID)"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }
}

?>