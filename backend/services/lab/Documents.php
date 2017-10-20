<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/DocumentsTable.php');
use DataBase\DocumentsTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// lab_documents en la base de datos
class Documents extends DocumentsTable
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
        document_id,
        producer_id,
        lab_id,
        area_id,
        notes
      ) 
      VALUES (
        :documentID,
        :producerID,
        :labID,
        :areaID,
        :notes
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Retorna una lista de todos los documentos que tengan registradas las 
  // caracteristicas especificadas
  // [in]   typeID (uint): el ID del tipo de documento cuyos elementos seran 
  //        recuperados
  // [in]   startDate (string): la fecha de inicio de la busqueda
  // [in]   endDate (string): la fecha de fin de la busqueda
  // [in]   [categoryIDs] (dictionary): la lista de los IDs de las categorias 
  //        necesarias para buscar el documento en la BD
  // [out]  return (dictionary): la lista de todos los documentos encontrados 
  //        en el tabla organizados por renglones y columnas
  function selectByDateInterval(
    $typeID,
    $startDate, 
    $endDate,
    ...$categoryIDs
  ) {
    $queryStr = 
      "SELECT
        `$this->table`.id AS id,
        d.upload_date AS upload_date,
        d.file_date AS file_date,
        d.file_path AS file_path,
        z.foreign_id AS zone_id,
        p.name AS producer_name,
        l.name AS lab_name,
        t.name AS analysis_type_name,
        s.name AS analysis_subtype_name,
        a.name AS area_name,
        notes
      FROM
        `$this->table`
      INNER JOIN
        `producers` AS p
        ON p.id = producer_id
      INNER JOIN
        `zones` AS z
        ON z.id = p.parent_id
      INNER JOIN
        `laboratories` AS l
        ON lab_id = l.id
      INNER JOIN
        `lab_areas` AS a
        ON a.id = area_id
      INNER JOIN 
        `analysis_subtypes` AS s
        ON s.id = a.parent_id
      INNER JOIN
        `analysis_types` AS t
        ON t.id = s.parent_id
      INNER JOIN
        `documents` AS d
        ON document_id = d.id
      WHERE
        d.file_date >= :startDate AND d.file_date <= :endDate
        AND d.type_id = :documentTypeID ";

    $values = [
      ':documentTypeID' => $typeID,
      ':startDate' => $startDate,
      ':endDate' => $endDate
    ];

    if (isset($categoryIDs[0])) {
      $queryStr .= "AND z.foreign_id = :zoneID ";
      $values[':zoneID'] = $categoryIDs[0];
    }

    if (isset($categoryIDs[1])) {
      $queryStr .= "AND p.id = :producerID ";
      $values[':producerID'] = $categoryIDs[1];
    }

    if (isset($categoryIDs[2])) {
      $queryStr .= "AND lab_id = :labID ";
      $values[':labID'] = $categoryIDs[2];
    }

    if (isset($categoryIDs[3])) {
      $queryStr .= "AND t.id = :analysisTypeID ";
      $values[':analysisTypeID'] = $categoryIDs[3];
    }

    if (isset($categoryIDs[4])) {
      $queryStr .= "AND s.id = :analysisSubTypeID ";
      $values[':analysisSubTypeID'] = $categoryIDs[4];
    }

    if (isset($categoryIDs[5])) {
      $queryStr .= "AND area_id = :areaID ";
      $values[':areaID'] = $categoryIDs[5];
    }

    $queryStr .= "ORDER BY d.file_date";

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    return $query->fetchAll();
  }
}

?>