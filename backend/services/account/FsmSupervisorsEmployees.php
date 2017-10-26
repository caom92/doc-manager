<?php

namespace DataBase\Fsm;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');
use DataBase\DataBaseTable;

class SupervisorsEmployees extends DataBaseTable
{
  // Crea una nueva instancia a la tabla supervisors_employees
  function __construct($db) {
    parent::__construct($db, 'supervisors_employees');
  }

  // Returns the number of rows that comply to the especified where query
  function getNumEmployeesBySupervisorID($supervisorID) {
    $query = $this->getStatement(
      "SELECT 
        COUNT(*) AS num 
      FROM `$this->table` 
      WHERE 
        supervisor_id = :supervisorID"
    );
    $query->execute([
      ':supervisorID' => $supervisorID
    ]);
    $rows = $query->fetchAll();
    return (isset($rows)) ? $rows[0]['num'] : 0;
  }
}

?>