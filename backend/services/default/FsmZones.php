<?php

namespace DataBase\Fsm;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');
use DataBase\DataBaseTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// zones en la base de datos
class Zones extends DataBaseTable
{
  // Crea una nueva instancia a la tabla zones
  function __construct($db) {
    parent::__construct($db, 'zones');
  }

  // Resiva si existe en la tabla algun renglon que tenga registrado el ID 
  // especificado, retornando verdadero si este es el caso, o falso en caso 
  // contrario 
  function hasByID($id) {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table` WHERE id = :id"
    );
    $query->execute([
      ':id' => $id
    ]);
    $rows = $query->fetchAll();
    return count($rows) > 0;
  }

  // Retorna el nombre de la zona que tenga registrado el ID especificado
  function getNameByID($id) {
    $query = $this->getStatement(
      "SELECT name FROM `$this->table` WHERE id = :id"
    );
    $query->execute([
      ':id' => $id
    ]);
    $rows = $query->fetchAll();
    return (count($rows) > 0) ? $rows[0]['name'] : NULL;
  }
}

?>