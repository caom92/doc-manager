<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// signers en la base de datos
class Signers extends DataBaseTable
{
  // Crea una nueva instancia a la tabla signers
  function __construct($db) {
    parent::__construct($db, 'signers');
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (
        foreign_id,
        first_name,
        last_name
      ) 
      VALUES (
        :foreignID,
        :firstName,
        :lastName
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Actualiza uno o varios renglones nuevos en la tabla en la base de datos
  // Para ello es necesario el foreign_id, ya que es el que se conoce en la
  // sesión del usuario
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function update($row) {
    $query = $this->getStatement(
      "UPDATE 
        `$this->table`
      SET 
        first_name = :firstName,
        last_name = :lastName
      WHERE 
        foreign_id = :foreignID"
    );
    $query->execute($row);
    return $query->rowCount();
  }

  function isSignerRegistered($id) {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table` 
      WHERE foreign_id = :ID"
    );
    $query->execute([ ':ID' => $id ]);
    return $query->rowCount();
  }

  function getSignerByForeignID($id) {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table` 
      WHERE foreign_id = :ID"
    );
    $query->execute([ ':ID' => $id ]);
    return $query->fetchAll();
  }
}

?>