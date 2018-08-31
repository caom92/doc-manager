<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/SingleParentCategoryTable.php');
use DataBase\SingleParentCategoryTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// lab_subareas en la base de datos
class SubAreas extends SingleParentCategoryTable
{
  // Crea una nueva instancia a la tabla lab_areas
  function __construct($db) {
    parent::__construct($db, 'lab_subareas');
  }

  // Retorna una lista de todas las areas o productos junto con
  // el subtipo y tipo de analisis correspondiente
  function selectAll() {
    $query = $this->getStatement(
      "SELECT
        t.name AS type_name,
        s.name AS subtype_name,
        a.name AS area_name,
        sa.name AS subarea_name
      FROM
        lab_subareas AS sa
      RIGHT JOIN
        lab_areas AS a 
        ON sa.parent_id = a.id
      RIGHT JOIN 
        analysis_subtypes AS s 
        ON a.parent_id = s.id
      RIGHT JOIN 
        analysis_types AS t 
        ON s.parent_id = t.id
      ORDER BY
        type_name,
        subtype_name,
        area_name,
        subarea_name"
    );
    $query->execute([]);
    return $query->fetchAll();
  }
}

?>