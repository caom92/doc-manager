<?php

namespace Core;

// Mueve un archivo en el servidor a otra direccion con un nombre diferente
// [in]   sourceFileName (string): el nombre original del archivo a mover
// [in]   sourceFilePath (string): la direccion en donde se encuentra el 
//        archivo a mover
// [in]   destinationFolder (string): la direccion a donde se movera el archivo
// [in]   [uid] (string): identificador adicional unico que ayudara a mitigar 
//        la probabilidad de que haya una colision de nombre con otro archivo 
//        que ya exista en el sistema
// [out]  return (string): el nombre asignado al archivo despues de moverlo
function saveUploadedFileTo(
  $sourceFileName, 
  $sourceFilePath,
  $destinationFolder, 
  $uid = NULL
) {
  // primero extraemos el formato del archivo original
  $format = substr($sourceFileName, strpos($sourceFileName, '.'));

  // computamos el nuevo nombre del archivo
  $fileName = "{$uid}_".date('Y-m-d_H-i-s')."{$format}";

  // dependiendo del sistema operativo, sera la diagonal utilizada para dividir 
  // elementos de una direccion
  $s = NULL;
  if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    $s = '\\';
  } else {
    $s = '/';
  }

  // la direccion en donde sera movido el archivo
  $uploadDir = "$destinationFolder$s$fileName";

  // movemos el archivo
  $wasMoveSuccessful = 
    move_uploaded_file($sourceFilePath, $uploadDir);

  // retornamos el resultado al usuario
  return ($wasMoveSuccessful) ? $fileName : NULL;
}

// Revisa si el arreglo contiene llaves que no sean numericas (y por ende sea 
// un arreglo asotiavito en lugar de uno unidimensional) y retorna verdadero si 
// este es el caso, o falso en caso contrario
function hasStringKeys($array) {
  return count(array_filter(array_keys($array), 'is_string')) > 0;
}

// Funcion auxiliar que ira agregando la jerarquia de categorias para este tipo 
// de documento, agregando valores nuevos en cada uno de ellas si el valor 
// asignado no esta almacenado ya en la base de datos y retrona el ID del valor 
// de la ultima categoria de la jerarquia
// [in]   daoFactory (TableFactory): instancia a la interfaz que permite crear 
//        interfaces a las tablas individuales de la base de datos
// [in]   current (dictionary): arreglo asociativo que define la jerarquia de 
//        categorias, cada nivel tiene los siguientes atributos:
//        * name (string): el valor de la categoria actual que sera buscado en 
//          la base de datos; si este valor no se encuentra en la BD, sera 
//          agregado
//        * table (string): el nombre de la tabla que almacena los valores de 
//          la categoria actual
//        * child (dictionary): instancia a la siguiente categoria
// [in]   parentID (uint): el ID del valor de la categoria a la cual pertenece 
//        el valor de la categoria actual
// [out]  return (uint): el ID del valor de la ultima categoria de la jerarquia 
//        defindina en current
function getLastCategoryID($daoFactory, $current, $parentID) {
  // primero revisamos si esta categoria existe en la BD
  $table = $daoFactory->get($current['table']);
  $currentName = strtoupper($current['name']);
  $currentID = $table->getIDByName($currentName);
  if (!isset($currentID)) {
    // si no existe, tenemos que agregarla
    if (isset($parentID)) {
      $currentID = $table->insert([
        ':name' => $currentName,
        ':parentID' => $parentID
      ]);
    } else {
      $currentID = $table->insert([
        ':name' => $currentName
      ]);
    }
  }

  // una vez que tenemos el ID de esta categoria, nos recorremos a la sig.
  return isset($current['child']) ? 
    getLastCategoryID($daoFactory, $current['child'], $currentID)
    : $currentID;
}

?>