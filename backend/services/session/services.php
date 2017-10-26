<?php

$session = [
  'services' => [
    'GET' => [
      'check-session' => 
        realpath(dirname(__FILE__).'/check-session.php'),
      'logout' =>
        realpath(dirname(__FILE__).'/logout.php')
    ],
    'POST' => [
      'login' => 
        realpath(dirname(__FILE__).'/login.php'),
    ]
  ]
];

?>