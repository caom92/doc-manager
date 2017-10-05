<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// document_types en la base de datos
class DocumentTypes extends DataBaseTable
{
  // Crea una nueva instancia a la tabla document_types
  function __construct($db) {
    parent::__construct($db, 'document_types');
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

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      'insert_row',
      "INSERT INTO `$this->table` (
        name
      ) 
      VALUES (
        :name
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Retorna el ID del tipo que tenga el nombre especificado
  // [in]   name (string): el nombre del tipo cuyo ID sera recuperado
  // [out]  return (uint): el ID del tipo especificado si esta fue encontrado 
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