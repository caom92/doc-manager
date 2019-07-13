<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// lab_documents en la base de datos
class Photos extends DataBaseTable
{
  // Crea una nueva instancia a la tabla lab_documents
  function __construct($db) {
    parent::__construct($db, 'photos');
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (
        path
      ) 
      VALUES (
        :imagePath
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Borra de la BD el documento con el ID especificado y retorna el numero de 
  // renglones afectados
  function delete($id) {
    $query = $this->getStatement(
      "DELETE FROM `$this->table` WHERE id = :ID"
    );
    $query->execute([ ':ID' => $id ]);
    return $query->rowCount();
  }
}

?>