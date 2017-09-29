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
}

?>