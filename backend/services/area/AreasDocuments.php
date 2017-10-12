<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DocumentsTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// areas_documents en la base de datos
class AreasDocuments extends DocumentsTable
{
  // Crea una nueva instancia a la tabla areas_documents
  function __construct($db) {
    parent::__construct($db, 'areas_documents');
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (
        document_id, 
        area_id,
        notes
      ) 
      VALUES (
        :documentID, 
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
        z.name AS zone_name,
        r.name AS ranch_name,
        p.name AS producer_name,
        a.name AS area_name,
        notes
      FROM
        `$this->table`
      INNER JOIN
        `documents` AS d
        ON d.id = document_id
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
        AND d.type_id = :typeID ";
    
    $values = [
      ':typeID' => $typeID,
      ':startDate' => $startDate,
      ':endDate' => $endDate
    ];
    
    if (isset($categoryIDs[0]) ) {
      $queryStr .= "AND area_id = :areaID ";
      $values[':areaID'] = $categoryIDs[0];
    }

    if (isset($categoryIDs[1])) {
      $queryStr .= "AND p.id = :producerID ";
      $values[':producerID'] = $categoryIDs[1];
    }

    if (isset($categoryIDs[2])) {
      $queryStr .= "AND r.id = :ranchID ";
      $values[':ranchID'] = $categoryIDs[2];
    }

    if (isset($categoryIDs[3])) {
      $queryStr .= "AND z.id = :zoneID ";
      $values[':zoneID'] = $categoryIDs[3];
    }

    $queryStr .= "ORDER BY d.file_date";

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    return $query->fetchAll();
  }

  // Retorna el nombre del archivo que posea el ID especificado en esta tabla
  function getPathByID($id) {
    $query = $this->getStatement(
      "SELECT 
        d.file_path AS file_path
      FROM 
        `$this->table` AS t
      INNER JOIN 
        `documents` AS d
        ON
          document_id = d.id
      WHERE 
        t.id = :ID"
    );
    $query->execute([ ':ID' => $id ]);
    $rows = $query->fetchAll();
    return $rows[0]['file_path'];
  }
}

?>