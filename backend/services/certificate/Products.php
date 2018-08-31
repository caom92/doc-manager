<?php

namespace DataBase\Certificate;
require_once realpath(__DIR__.'/../../dao/NoParentCategoryTable.php');
use DataBase\NoParentCategoryTable;

class Products extends NoParentCategoryTable {
  function __construct($db) {
    parent::__construct($db, 'certificate_products');
  }
}

?>