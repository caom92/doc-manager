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

  // Returns an associative array containing all the data elements
  // of the table
  // [out]    return: an associative array with the data contained in
  //          the data base table
  function selectAll() {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table` WHERE 1 ORDER BY id"
    );
    $query->execute();
    return $query->fetchAll();
  }

  // Retorna el nombre de la zona que tenga el ID especificado
  function getNameByID($zoneID) {
    $query = $this->getStatement(
      "SELECT name FROM  `$this->table` WHERE id = :zoneID"
    );
    $query->execute([ ':zoneID' => $zoneID ]);
    $rows = $query->fetchAll();
    return (isset($rows)) ? $rows[0]['name'] : NULL;
  }
}

?>