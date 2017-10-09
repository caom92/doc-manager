<?php

namespace DataBase;

// Una interfaz para acceder a y modificar los datos almacenados dentro de una 
// tabla especifica en la base de datos
class DataBaseTable
{ 
  // El nombre de la tabla que este objeto representa
  protected $table;

  // Interfaz que representa la conexion a la base de datos
  protected $db;

  // La lista de las consultas SQL que fueron cacheadas para ser reutilizadas
  // luego
  static private $cachedQueries = [];
 
  // Crea una interfaz para interactuar con la tabla en la base de datos que 
  // tenga el nombre especificado
  // [in]   db (PDO): la instancia de la interfaz que representa la conexion a 
  //        la base de datos que contiene la tabla representada por esta clase
  // [in]   table (string): el nombre de la tabla que el objeto representara
  function __construct($db, $table) {
    $this->db = $db;
    $this->table = $table;
  }

  // Retorna verdadero si la consulta con el indice especificado fue creado 
  // anteriormente y esta guardado en cache o falso en caso contrario
  protected function isStatementCached($query) {
    return 
      isset($this->cachedQueries[$query])
      && array_key_exists($query, $this->cachedQueries);
  }

  // Retorna una instancia del PDOStatement que corresponde a la consulta SQL 
  // especificada
  // [in]   query (string): la consulta SQL cuyo PDOStatement deseamos obtener
  // [out]  return (PDOStatement): la interfaz que representa los datos 
  //        obtenidos al ejecutar la consulta especificada en la base de datos
  protected function getStatement($query) {
    if (!$this->isStatementCached($query)) {
      $this->cachedQueries[$query] = $this->db->prepare($query);
    }

    return $this->cachedQueries[$query];
  }
}   // class DataBaseTable

?>