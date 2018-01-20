<?php

namespace DataBase\Guarantee;
require_once realpath(__DIR__.'/../../dao/NoParentCategoryTable.php');
use DataBase\NoParentCategoryTable;

class Suppliers extends NoParentCategoryTable {
  function __construct($db) {
    parent::__construct($db, 'suppliers');
  }
}

?>