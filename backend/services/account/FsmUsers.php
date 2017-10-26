<?php

namespace DataBase\Fsm;
require_once realpath(__DIR__.'/../../dao/DataBaseTable.php');
use DataBase\DataBaseTable;

// Esta clase define la interfaz con la cual se interactua con la tabla 
// users en la base de datos
class Users extends DataBaseTable 
{
  // Crea una nueva instancia a la tabla users
  function __construct($db) {
    parent::__construct($db, 'users');
  }

  // Returns an associative with the basic information of every user in the 
  // data base which is not an administrator, where the key is the field name
  // and the value is the field value
  function selectAll() {
    $query = $this->getStatement(
      "SELECT 
        `$this->table`.id,
        role_id,
        r.name AS role_name,
        employee_num,
        login_name,
        first_name,
        last_name,
        is_active
      FROM `$this->table`
      INNER JOIN 
        roles AS r
        ON role_id = r.id
      WHERE 
        `$this->table`.id != :userID"
    );
    $query->execute([
      ':userID' => $_SESSION['dm']['user_id']
    ]);
    return $query->fetchAll();
  }

  // Returns the name of the role of the user which has the especified 
  // employee number
  function getRoleByID($userID) {
    $query = $this->getStatement(
      "SELECT
        r.name AS role_name
      INNER JOIN
        roles AS r
        ON role_id = r.id
      WHERE
        `$this->table`.id = :userID"
    );
    $query->execute([
      ':userID' => $userID
    ]);
    $rows = $query->fetchAll();
    return (count($rows) > 0) ? $rows[0]['role_name'] : NULL;
  }

  // Cambia el estado de activacion del renglon con el ID especificado entre
  // encendido y apagado
  // [in]   itemID (int): el ID del renglon cuyo estado de activacion sera 
  //        cambiado
  function toggleActivationByID($itemID) {
    $query = $this->getStatement(
      "UPDATE 
        `$this->table`
      SET 
        is_active = NOT is_active
      WHERE 
        id = :itemID"
    );
    $query->execute([
      ':itemID' => $itemID
    ]);
  }

  // Returns true if there is data in the data base that shares the given 
  // user name
  function hasByLogInName($username) {
    $query = $this->getStatement(
      "SELECT * FROM `$this->table` WHERE login_name = :username"
    );
    $query->execute([
      ':username' => $username
    ]);
    $rows = $query->fetchAll();
    return isset($rows);
  }

  // Changes the login name field of the element in the table which has the 
  // especified user ID
  // [in]     id: the user ID of the element which login name we 
  //          want to change
  // [in]     newName: the new login name value that is to be assigned
  //          to the element found
  // [out]    return: the number of rows affected
  function updateLogInNameByUserID($id, $newName) {
    $query = $this->getStatement(
      "UPDATE `$this->table` SET login = :newName WHERE id = :userID"
    );
    $query->execute([
      ':userID' => $id, 
      ':newName' => $newName
    ]);
  }

  // Changes the login password field of the element in the table which has 
  // the especified user ID
  // [in]     id: the user ID of the elemente which login password we 
  //          want to change
  // [in]     newPassword: the new password value that is to be assigned
  //          to the element found
  // [out]    return: the number of rows affected
  function updatePasswordByUserID($id, $newPassword) {
    $query = $this->getStatement(
      "UPDATE 
        `$this->table` 
      SET 
        login_password = :newPassword 
      WHERE 
        id = :userID"
    );
    $query->execute([
      ':userID' => $id, 
      ':newPassword' => $newPassword
    ]);
  }

  // Returns an associative array containing the data of the which
  // has the especified identifier; it can also search for an 
  // identifier and password combination
  // [in]     identifier: the identifier of the element that we want 
  //          to look for; in this case, this can be either the ID, the
  //          user name, the employee number
  // [out]    return: an associative array with the data of the element
  //          that contained the especified identifier and password 
  //          combination, or an empty string in case none was found
  function getByIdentifier($identifier) {
    $query = $this->getStatement(
      "SELECT
        `$this->table`.id AS user_id,
        r.id AS role_id,
        r.name AS role_name,
        z.id AS zone_id,
        z.name AS zone_name, 
        z.company_name AS zone_company,
        z.address AS zone_address,
        z.logo_path AS zone_logo,
        employee_num,
        first_name,
        last_name,
        login_name, 
        login_password
      FROM
        `$this->table`
      INNER JOIN
        roles AS r
        ON role_id = r.id
      INNER JOIN 
        zones AS z
        ON zone_id = z.id
      WHERE 
        (
          `$this->table`.id = :userID
          OR employee_num = :employeeNum
          OR login_name = :loginName
        )
        AND `$this->table`.is_active = 1"
    );

    $query->execute([
      ':userID' => $identifier,
      ':employeeNum' => $identifier,
      ':loginName' => $identifier
    ]);

    $rows = $query->fetchAll();
    return (count($rows) > 0) ? $rows[0] : NULL; 
  }
}

?>