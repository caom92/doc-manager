<?php

namespace DataBase;
require_once realpath(__DIR__.'/DataBaseTable.php');

// Esta clase define una interfaz a una tabla que almacene los datos de alguno 
// de los tipos de documentos existentes en el sistema
abstract class DocumentsTable extends DataBaseTable
{
  // Crea una nueva instancia a la tabla
  function __construct($db, $table) {
    parent::__construct($db, $table);
  }

  // Inserta un renglon nuevo en la tabla en la base de datos
  // [in]   row (dictionary): los datos a insertar en la tabla, organizados en 
  //        columnas
  // [out]  return (uint): el ID del renglon insertado
  abstract function insert($row);

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
  abstract function selectByDateInterval(
    $typeID,
    $startDate, 
    $endDate,
    ...$categoryIDs
  );

  // Retorna el nombre del archivo que posea el ID especificado en esta tabla
  abstract function getPathByID($id);
}

?>