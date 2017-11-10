<?php

$service = [
  'requirements_desc' => [
    'username' => [
      'type' => 'string',
      'min_length' => 3
    ],
    'password' => [
      'type' => 'string',
      'min_length' => 6
    ]
  ],
  'callback' => function($scope, $request) {
    // if there is a session already opened, close it before openning the 
    // new one
    $isLoggedIn = function($scope) {
      $segment = $scope->session->getSegment('dm');
      $isLoggedIn = $segment->get('logged_in');
      return isset($isLoggedIn) ? $isLoggedIn : false;
    };

    if ($isLoggedIn($scope)) {
      $scope->session->clear();
      $scope->session->destroy();
    }

    // attempt to connect to the data base to retrieve the user information
    $userData = $scope->fsmTableFactory->get('Users')->getByIdentifier(
      $request['username']
    );

    if (strlen($userData['zone_logo']) == 0) {
      $userData['zone_logo'] = 'default.png';
    }

    // check if the query was successful
    if (isset($userData) && count($userData) > 1) {
      // check if the password is correct
      $isPasswordValid = password_verify(
        $request['password'], 
        $userData['login_password']
      );

      // if it is not, notify the user
      if (!$isPasswordValid) {
        throw new \Exception('Log in credentials are incorrect.', 1);
      } 

      // store the user profile in the session cookie and return the info to 
      // the client
      $segment = $scope->session->getSegment('dm');
      $segment->set('logged_in', TRUE);
      $_SESSION['dm'] += $userData;
      
      return $userData;
    } else {
      throw new \Exception('Log in credentials are incorrect.', 1);
    }
  }
];

?>