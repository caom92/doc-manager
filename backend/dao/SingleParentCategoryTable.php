<?php

namespace DataBase;
require_once realpath(__DIR__.'/SearchableByNameTable.php');

// Interfaz a una tabla en la base de datos que representa una categoria de 
// busqueda de documento que posea unicamente 1 padre
class SingleParentCategoryTable extends SearchableByNameTable
{
  // Crea una nueva instancia a la tabla producers
  function __construct($db, $table) {
    parent::__construct($db, $table);
  }

  // Retorna todos los elementos que tengan registrados el ID del padre 
  // especificado
  // [in]   parentID (uint): el ID del padre cuyos elementos hijos van a ser 
  //        recuperados
  // [out]  return (dictionary): los datos de los elementos de la tabla que 
  //        cumplen con las caracteristicas especificadas organizados en 
  //        renglones y columnas
  function selectByParentID($parentID) {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table` WHERE parent_id = :parentID"
    );
    $query->execute([
      ':parentID' => $parentID
    ]);
    return $query->fetchAll();
  }

  // Inserta uno o varios renglones nuevos en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        renglones y columnas
  // [out]  return (uint): el ID del ultimo renglon insertado
  function insert($row) {
    $query = $this->getStatement(
      "INSERT INTO `$this->table` (name, parent_id) VALUES (:name, :parentID)"
    );
    $query->execute($row);
    return $this->db->lastInsertId();
  }

  // Retorna el ID del elemento que tenga el nombre y padre especificados
  // [in]   name (string): el nombre del elemento cuyo ID sera recuperado
  // [in]   parentID (uint): el ID del padre cuyo elemento sera buscado
  // [out]  return (uint): el ID del elemento especificado si este fue 
  //        encontrado en la tabla, o nulo en caso contrario
  function getIDByNameAndParentID($name, $parentID) {
    $query = $this->getStatement(
      "SELECT * 
      FROM `$this->table` 
      WHERE :parentID = parent_id AND :name = name"
    );
    $query->execute([
      ':name' => $name,
      ':parentID' => $parentID
    ]);
    $rows = $query->fetchAll();
    return (count($rows) > 0) ? $rows[0]['id'] : NULL;
  }
}

?>