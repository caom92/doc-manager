<?php

require_once realpath(__DIR__.'/../../functions.php');

$service = [
  'requirements_desc' => [
    'logged_in' => 'any',
    'password' => [
      'type' => 'string',
      'min_length' => 6
    ],
    'new_password' => [
      'type' => 'string',
      'min_length' => 6
    ],
    'user_id' => [
      'type' => 'int',
      'min' => 1,
      'optional' => true
    ]
  ],
  'callback' => function($scope, $request) {
    // get the session segment
    $segment = $scope->session->getSegment('dm');

    // check if the password is valid
    $isPasswordValid = password_verify(
      $request['password'], 
      $segment->get('login_password')
    );

    if (!$isPasswordValid) {
      throw new \Exception(
        'Password could not be changed; authentication credentials '. 
        'where incorrect.',
        1
      );
    }

    // obtain the hash of the new password
    $newPasswd = password_hash($request['new_password'], \PASSWORD_BCRYPT);

    // check if the user is intending to update the password of another user
    $isUpdatingOtherPassword = 
      isset($request['user_id']) != $segment->get('user_id');

    // store the new password in the data base 
    $scope->fsmTableFactory->get('Users')->updatePasswordByUserID(
      ($isUpdatingOtherPassword) ? 
        $request['user_id'] : $segment->get('user_id'),
      $newPasswd
    );

    // save the new password in the session storage
    if (!$isUpdatingOtherPassword) {
      Core\resetSessionID($scope->session, $segment);
      $segment->set('login_password', $newPasswd);
    }
  }
];

?>