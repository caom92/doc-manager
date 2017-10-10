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
        d.upload_date AS upload_date,
        d.file_date AS file_date,
        d.file_path AS file_path,
        l.name AS lab_name,
        z.name AS zone_name,
        r.name AS ranch_name,
        p.name AS producer_name,
        a.name AS area_name,
        notes
      FROM
        `$this->table`
      INNER JOIN
        `documents` AS d
        ON analysis_document_id = d.id
      INNER JOIN
        `laboratories` AS l
        ON lab_id = l.id
      INNER JOIN
        `areas` AS a
        ON a.id = area_id
      INNER JOIN
        `producers` AS p
        ON p.id = a.parent_id
      INNER JOIN 
        `ranches` AS r
        ON r.id = p.parent_id
      INNER JOIN
        `zones` AS z
        ON z.id = r.parent_id
      WHERE
        d.file_date >= :startDate AND d.file_date <= :endDate
        AND lab_id = :labID
        AND area_id = :areaID
        AND d.type_id = :documentTypeID
      ORDER BY
        d.file_date"
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