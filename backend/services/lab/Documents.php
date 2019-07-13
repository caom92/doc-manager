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
        photo_id,
        producer_id,
        lab_id,
        subarea_id,
        notes,
        link
      ) 
      VALUES (
        :documentID,
        :photoID,
        :producerID,
        :labID,
        :subareaID,
        :notes,
        :link
      )"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Actualiza los viejos registros para que estos también tengan subarea
  // o subproducto
  // [in]   row (dictionary): el ID del subarea, asi como el ID del documento
  //        que debe ser reasignado, organizado en renglones y columnas
  //        
  function editSubArea($row) {
    $query = $this->getStatement(
      "UPDATE `$this->table` SET 
        area_id = NULL,
        subarea_id = :subareaID
      WHERE id = :documentID"
    );
    $query->execute($row);
  }

  function selectAreaSubAreaByID($id) {
    $queryStr = 
      "SELECT
        `$this->table`.id AS id,
        a.name AS area_name,
        sa.name AS subarea_name,
        subarea_id
      FROM
        `$this->table`
      INNER JOIN
        `lab_subareas` AS sa
        ON sa.id = subarea_id
      INNER JOIN
        `lab_areas` AS a
        ON a.id = sa.parent_id
      WHERE
        `$this->table`.id = :id
      ";
    
    $values = [
      ':id' => $id
    ];

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    return $query->fetchAll()[0];
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
        d.id AS document_id,
        d.upload_date AS upload_date,
        d.file_date AS file_date,
        d.file_path AS file_path,
        i.path AS image_path,
        d.has_physical_copy AS has_physical_copy,
        d.signed_by AS signed_by,
        CONCAT(u.first_name, ' ', u.last_name) AS signer,
        z.foreign_id AS zone_id,
        p.name AS producer_name,
        l.name AS lab_name,
        t.name AS analysis_type_name,
        s.name AS analysis_subtype_name,
        a.name AS area_name,
        sa.name AS subarea_name,
        area_id,
        subarea_id,
        notes,
        link
      FROM
        `$this->table`
      LEFT JOIN
        `lab_subareas` AS sa
        ON sa.id = subarea_id
      LEFT JOIN
        `lab_areas` AS a
        ON a.id = sa.parent_id OR a.id = area_id
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
        `analysis_subtypes` AS s
        ON s.id = a.parent_id
      INNER JOIN
        `analysis_types` AS t
        ON t.id = s.parent_id
      INNER JOIN
        `documents` AS d
        ON document_id = d.id
      LEFT JOIN
        `photos` AS i
        ON photo_id = i.id
      LEFT JOIN
        signers AS u
        ON u.id = d.signed_by
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
      $queryStr .= "AND a.id = :areaID ";
      $values[':areaID'] = $categoryIDs[5];
    }

    if (isset($categoryIDs[6])) {
      $queryStr .= "AND subarea_id = :subareaID ";
      $values[':subareaID'] = $categoryIDs[6];
    }

    $queryStr .= "ORDER BY d.file_date";

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    return $query->fetchAll();
  }

  // Retorna el numero de documentos que tienen la bandera de copia fisica 
  // activada y que cumplan con las caracteristicas especificadas
  // [in]   typeID (uint): el ID del tipo de documento cuyos elementos seran 
  //        recuperados
  // [in]   startDate (string): la fecha de inicio de la busqueda
  // [in]   endDate (string): la fecha de fin de la busqueda
  // [in]   [categoryIDs] (dictionary): la lista de los IDs de las categorias 
  //        necesarias para buscar el documento en la BD
  // [out]  return (dictionary): la lista de todos los documentos encontrados 
  //        en el tabla organizados por renglones y columnas
  function countPhysicalCopiesByDateInterval(
    $typeID,
    $startDate, 
    $endDate,
    ...$categoryIDs
  ) {
    $queryStr = 
      "SELECT
        COUNT(*) AS count
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
        `lab_subareas` AS a
        ON a.id = subarea_id
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
        d.has_physical_copy = 1
        AND d.file_date >= :startDate AND d.file_date <= :endDate
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
      $queryStr .= "AND subarea_id = :subareaID ";
      $values[':subareaID'] = $categoryIDs[5];
    }

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    $rows = $query->fetchAll();
    return $rows[0]['count'];
  }

  // Retorna una tabla que cuenta cuantos documentos fueron capturados de cada 
  // area para cada productor
  // [in]   startDate (string): la fecha de inicio en la que se realizara la 
  //        busqueda
  // [in]   endDate (string): la fecha final en la que se realizara la busqueda
  // [in]   zoneID (uint): el ID de la zona cuyos productores van a ser 
  //        buscados en la BD
  // [in]   [typeID] (uint): el ID del tipo de analisis que sera buscado
  // [in]   [subtypeID] (uint): el ID del subtipo de analisis que sera buscado
  // [out]  return (dictionary): la tabla que contiene cuantos documentos hay 
  //        organizados por renglones y columnas
  function countByDateIntervalAndZoneID(
    $startDate, $endDate, $zoneID, $typeID = NULL, $subtypeID = NULL
  ) {
    $values = [
      ':zoneID' => $zoneID,
      ':startDate' => $startDate,
      ':endDate' => $endDate
    ];

    $queryStr = 
      "SELECT areas.type_name AS type_name, areas.subtype_name AS subtype_name, areas.area_name AS area_name, areas.producer_name AS producer_name, IFNULL(docs.num_documents, 0) as num_documents FROM (SELECT
        t.id AS type_id,
        t.name AS type_name,
        s.id AS subtype_id,
        s.name AS subtype_name,
        a.id AS area_id,
        a.name AS area_name,
        p.id AS producer_id,
        p.name AS producer_name
      FROM 
        `lab_areas` AS a
      INNER JOIN
        `analysis_subtypes` AS s
        ON a.parent_id = s.id
      INNER JOIN
        `analysis_types` AS t
        ON s.parent_id = t.id
      RIGHT JOIN 
        `producers` AS p 
        ON 1
      WHERE 
        p.parent_id = :zoneID ";

    if (isset($subtypeID)) {
      $queryStr .= "AND a.parent_id = :subtypeID ";
      $values[':subtypeID'] = $subtypeID;
    } else if (isset($typeID)) {
      $queryStr .= "AND s.parent_id = :typeID ";
      $values[':typeID'] = $typeID;
    }
      
    $queryStr .= 
        "GROUP BY
          type_name,
          subtype_name,
          area_name,
          producer_name) AS areas
        LEFT JOIN
        (SELECT
          t.name AS type_name,
          s.name AS subtype_name,
          a.name AS area_name,
          p.name AS producer_name,
          COUNT(a.name) AS num_documents
        FROM
          lab_documents AS l
        LEFT JOIN
          `lab_subareas` AS sa
          ON sa.id = l.subarea_id
        RIGHT JOIN
          `lab_areas` AS a
          ON a.id = sa.parent_id OR a.id = l.area_id
        INNER JOIN
          `producers` AS p
          ON p.id = l.producer_id
        INNER JOIN 
          `analysis_subtypes` AS s
          ON s.id = a.parent_id
        INNER JOIN
          `analysis_types` AS t
          ON t.id = s.parent_id
        INNER JOIN
          `documents` AS d
          ON l.document_id = d.id
        WHERE
          d.file_date >= :startDate AND d.file_date <= :endDate
        GROUP BY
          type_name,
          subtype_name,
          area_name,
          producer_name) AS docs
        ON areas.producer_name = docs.producer_name AND areas.area_name = docs.area_name AND areas.subtype_name = docs.subtype_name AND areas.type_name = docs.type_name
        GROUP BY
          areas.type_name,
          areas.subtype_name,
          areas.area_name,
          areas.producer_name";

    $query = $this->getStatement($queryStr);
    $query->execute($values);
    return $query->fetchAll();
  }
}

?>