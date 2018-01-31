<?php

namespace DataBase\Procedure;
require_once realpath(__DIR__.'/../../dao/DocumentsTable.php');
use DataBase\DocumentsTable;

class Documents extends DocumentsTable {
  function __construct($db) {
    parent::__construct($db, 'sop_procedure_documents');
  }

  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (
        document_id,
        zone_id,
        notes
      ) 
      VALUES (
        :documentID,
        :zoneID,
        :notes
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  function selectByDateInterval(
    $typeID,
    $startDate, 
    $endDate,
    ...$categoryIDs
  ) {
    $queryStr = 
      "SELECT
        `$this->table`.id AS id,
        d.id AS document_id,
        d.upload_date AS upload_date,
        d.file_date AS file_date,
        d.file_path AS file_path,
        z.foreign_id AS zone_id,
        notes
      FROM
        `$this->table`
      INNER JOIN
        `zones` AS z ";
        
    $values = [
      ':documentTypeID' => $typeID,
      ':startDate' => $startDate,
      ':endDate' => $endDate
    ];

    if (isset($categoryIDs[0])) {
      $queryStr .= "ON z.foreign_id = :zoneID ";
      $values[':zoneID'] = $categoryIDs[0];
    } else {
      $queryStr .= "ON z.id = zone_id ";
    }

    $queryStr .= "INNER JOIN
        `documents` AS d
        ON document_id = d.id
      WHERE
        d.file_date >= :startDate AND d.file_date <= :endDate
        AND d.type_id = :documentTypeID ";

    $queryStr .= "ORDER BY d.file_date";

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    return $query->fetchAll();
  }

  function countPhysicalCopiesByDateInterval(
    $typeID,
    $startDate, 
    $endDate,
    ...$categoryIDs
  ) {
  }
}

?>