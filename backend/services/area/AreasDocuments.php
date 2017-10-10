<?php

namespace DataBase;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');

// Esta clase define la interfaz con la cual se interactua con la tabla 
// areas_documents en la base de datos
class AreasDocuments extends DataBaseTable
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
  // [in]   areaID (uint): el ID del area o producto cuyos elementos seran 
  //        recuperados
  // [in]   startDate (string): la fecha de inicio de la busqueda
  // [in]   endDate (string): la fecha de fin de la busqueda
  // [out]  return (dictionary): la lista de todos los documentos encontrados 
  //        en el tabla organizados por renglones y columnas
  function selectByTypeAreaAndDateInterval(
    $typeID,
    $areaID, 
    $startDate, 
    $endDate
  ) {
    $query = $this->getStatement(
      "SELECT
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
        AND d.type_id = :typeID
        AND area_id = :areaID
      ORDER BY
        d.file_date"
    );
    $query->execute([
      ':typeID' => $typeID,
      ':areaID' => $areaID,
      ':startDate' => $startDate,
      ':endDate' => $endDate
    ]);
    return $query->fetchAll();
  }
}

?>