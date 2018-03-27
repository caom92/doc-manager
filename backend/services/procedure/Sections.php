<?php

namespace DataBase\Procedure;
require_once realpath(__DIR__.'/../../dao/NoParentCategoryTable.php');
use DataBase\NoParentCategoryTable;

class Sections extends NoParentCategoryTable {
  function __construct($db) {
    parent::__construct($db, 'sections');
  }
}

?>