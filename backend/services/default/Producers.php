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
      "SELECT * FROM `$this->table` WHERE ranch_id = :ranch_id"
    );
    $query->execute([
      ':ranch_id' => $ranchID
    ]);
    return $query->fetchAll();
  }
}

?>