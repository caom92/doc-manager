<?php

namespace DataBase\Lab;
require_once realpath(__DIR__.'/../../dao/SingleParentCategoryTable.php');
use DataBase\SingleParentCategoryTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// lab_areas en la base de datos
class Areas extends SingleParentCategoryTable
{
  // Crea una nueva instancia a la tabla lab_areas
  function __construct($db) {
    parent::__construct($db, 'lab_areas');
  }

  // Retorna una lista de todas las areas o productos junto con
  // el subtipo y tipo de analisis correspondiente
  function selectAll() {
    $query = $this->getStatement(
      "SELECT
        t.name AS type_name,
        s.name AS subtype_name,
        a.name AS area_name
      FROM
        lab_areas AS a 
      RIGHT JOIN 
        analysis_subtypes AS s 
        ON a.parent_id = s.id
      RIGHT JOIN 
        analysis_types AS t 
        ON s.parent_id = t.id
      ORDER BY
        type_name,
        subtype_name,
        area_name"
    );
    $query->execute([]);
    return $query->fetchAll();
  }
}

?>