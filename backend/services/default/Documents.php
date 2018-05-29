<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// documents en la base de datos
class Documents extends DataBaseTable
{
  // Crea una nueva instancia a la tabla documents
  function __construct($db) {
    parent::__construct($db, 'documents');
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (
        type_id,
        upload_date,
        file_date,
        file_path
      ) 
      VALUES (
        :typeID,
        :uploadDate,
        :fileDate,
        :filePath
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

  // Invierte el valor de la bandera que indica si existe una copia fisica del 
  // documento que tenga el ID ingresado
  function togglePhysicalCopyFlagByID($id) {
    $query = $this->getStatement(
      "UPDATE `$this->table` 
      SET has_physical_copy = NOT has_physical_copy 
      WHERE id = :ID"
    );
    $query->execute([ ':ID' => $id ]);
    return $query->rowCount();
  }

  // Registra el ID del usuario que desea firmar un documento
  function signDocument($documentID, $signerID) {
    $query = $this->getStatement(
      "UPDATE `$this->table` 
      SET signed_by = :signerID
      WHERE id = :ID"
    );
    $query->execute([ ':ID' => $documentID, ':signerID' => $signerID]);
    return $query->rowCount();
  }
}

?>