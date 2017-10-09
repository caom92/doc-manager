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
      "INSERT INTO `$this->table` (
        analysis_document_id,
        lab_id,
        area_id,
        notes
      ) 
      VALUES (
        :analysisDocumentID,
        :labID,
        :areaID,
        :notes
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Retorna los renglones que tengan registrados los valores especificados
  // [in]   typeID (uint): el ID del tipo de documento cuyos elementos seran 
  //        recuperados
  // [in]   labID (uint): el ID del laboratorio cuyos elementos seran 
  //        recuperados
  // [in]   areaID (uint): el ID del area o producto cuyos elementos seran 
  //        recuperados
  // [in]   startDate (string): la fecha de inicio de la busqueda
  // [in]   endDate (string): la fecha de fin de la busqueda
  // [out]  return (dictionary): la lista de los documentos encontrados que 
  //        cumplen con las caracteristicas especificadas organizados en 
  //        renglones y columnas
  function selectByLabAreaAndDateInterval(
    $typeID,
    $labID, 
    $areaID, 
    $startDate, 
    $endDate
  ) {
    $query = $this->getStatement(
      "SELECT
        a.upload_date AS upload_date,
        a.file_date AS file_date,
        a.file_path AS file_path,
        notes
      FROM
        `$this->table`
      INNER JOIN
        `documents` AS a
        ON 
          analysis_document_id = a.id
      INNER JOIN
        `laboratories` AS l
        ON
          lab_id = l.id
      WHERE
        a.file_date >= :startDate AND a.file_date <= :endDate
        AND lab_id = :labID
        AND area_id = :areaID
        AND a.type_id = :documentTypeID
      ORDER BY
        a.file_date"
    );
    $query->execute([
      ':startDate' => $startDate,
      ':endDate' => $endDate,
      ':labID' => $labID,
      ':areaID' => $areaID,
      ':documentTypeID' => $typeID
    ]);
    return $query->fetchAll();
  }
}

?>