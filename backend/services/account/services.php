<?php

$account = [
  'tables' => [
    'fsm' => [
      'Users' => realpath(__DIR__.'/FsmUsers.php'),
      'SupervisorsEmployees' => realpath(__DIR__.'/FsmSupervisorsEmployees')
    ]
  ],
  'services' => [
    'GET' => [
      'list-users' =>
        realpath(__DIR__.'/list-users.php')
    ],
    'POST' => [
      'toggle-account-activation' =>
        realpath(__DIR__.'/toggle-account-activation.php'),
      'change-username' =>
        realpath(__DIR__.'/change-username.php'),
      'change-password' =>
        realpath(__DIR__.'/change-password.php')
    ]
  ]
];

?>