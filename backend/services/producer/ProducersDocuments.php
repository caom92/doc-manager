<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// producers_documents en la base de datos
class ProducersDocuments extends DataBaseTable
{
  // Crea una nueva instancia a la tabla producers_documents
  function __construct($db) {
    parent::__construct($db, 'producers_documents');
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      'insert_row',
      "INSERT INTO `$this->table` (
        document_id, 
        producer_id
      ) 
      VALUES (
        :documentID, 
        :producerID
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  function selectByTypeProducerAndDateInterval(
    $typeID,
    $producerID, 
    $startDate, 
    $endDate
  ) {
    $query = $this->getStatement(
      'select_by_date_interval',
      "SELECT
        d.upload_date AS upload_date,
        d.file_date AS file_date,
        d.file_path AS file_path
      FROM
        `$this->table`
      INNER JOIN
        `documents` AS d
        ON
          d.id = document_id
      WHERE
        d.file_date >= :startDate AND d.file_date <= :endDate
        AND d.type_id = :typeID
        AND producer_id = :producerID
      ORDER BY
        d.file_date"
    );
    $query->execute([
      ':typeID' => $typeID,
      ':producerID' => $producerID,
      ':startDate' => $startDate,
      ':endDate' => $endDate
    ]);
    return $query->fetchAll();
  }
}

?>