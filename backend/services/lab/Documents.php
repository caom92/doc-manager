<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');
use DataBase\DataBaseTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// lab_documents en la base de datos
class Documents extends DataBaseTable
{
  // Crea una nueva instancia a la tabla lab_documents
  function __construct($db) {
    parent::__construct($db, 'lab_documents');
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      'insert_row',
      "INSERT INTO `$this->table` (
        analysis_document_id, 
        result_document_id,
        producer_id
      ) 
      VALUES (
        :analysisDocumentID, 
        :resultDocumentID,
        :producerID
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Retorna los renglones que tengan registrados los valores especificados
  // [in]   producerID (uint): el ID del productor cuyos documentos van a ser 
  //        recuperados
  // [in]   startDate (string): la fecha de inicio de la busqueda
  // [in]   endDate (string): la fecha de fin de la busqueda
  // [out]  return (dictionary): la lista de los documentos encontrados que 
  //        cumplen con las caracteristicas especificadas organizados en 
  //        renglones y columnas
  function selectByProducerAndDateInterval($producerID, $startDate, $endDate) {
    $query = $this->getStatement(
      'select_by_producer_&_date_interval',
      "SELECT
        a.upload_date AS upload_date,
        a.file_date AS file_date,
        a.file_path AS file_path,
        r.upload_date AS result_upload_date,
        r.file_date AS result_file_date,
        r.file_path AS result_file_path
      FROM
        `$this->table`
      INNER JOIN
        documents AS a
        ON 
          analysis_document_id = a.id
      INNER JOIN
        documents AS r
        ON 
          result_document_id = r.id
      WHERE
        a.file_date >= :startDate AND a.file_date <= :endDate
        AND producer_id = :producerID
      ORDER BY
        a.file_date"
    );
    $query->execute([
      ':startDate' => $startDate,
      ':endDate' => $endDate,
      ':producerID' => $producerID
    ]);
    return $query->fetchAll();
  }
}

?>