<?php
/**
 * EasyShadowcash-PHP
 * 
 * A simple class for making calls to Shadowcash's API using PHP.
 * https://github.com/sneurlax/EasyShadowcash-PHP
 *
 * Using work from
 *   Andrew LeCody (EasyBitcoin-PHP)
 * 
 * @author     sneurlax <sneurlax@gmail.com>
 * @copyright  2016
 * @license    Public Domain
 *  
 * ============================================================================
 * 
 * // Initialize Shadowcash connection/object
 * $shadowcash = new Shadowcash('rpcuser','rpcpassword');
 * 
 * // Optionally, you can specify a host and port.
 * $shadowcash = new Shadowcash('rpcuser','rpcpassword','host','port');
 * // Defaults are:
 * //  host = 127.0.0.1
 * //  port = 51736
 * 
 * // Make calls to shadowcashd as methods for your object.
 * // Examples:
 * $shadowcash->getinfo();
 * $shadowcash->getblockcount();
 * $shadowcash->getrawtransaction('9e79d2201393286e1ada3f0fbbe24b996a6cbcdabaa91b6701a8501e36fbf1e4',1);
 * $shadowcash->getblock('0000002372e70c3e4113a41364acd0ad1b7e51b9a9d3014f7b1e1e11a4cc0256');
 * 
 */

class Shadowcash {
  // Configuration options
  private $rpcuser;
  private $rpcpassword;
  private $host;
  private $port;

  // Information and debugging
  public $status;
  public $error;
  public $raw_response;
  public $response;

  private $id = 0;

  /**
   * Initialize an instance of daemon
   * 
   * @param string      $rpcuser      (default: shadowcoinrpc)
   * @param string      $rpcpassword  (default: hunter2)
   * @param string      $host         (default: 127.0.0.1)
   * @param int         $port         (default: 51736)
   */
  function __construct($rpcuser = 'shadowcoinrpc', $rpcpassword = 'hunter2', $host = 'localhost', $port = 51736) {
    $this->rpcuser       = $rpcuser;
    $this->rpcpassword   = $rpcpassword;
    $this->host          = $host;
    $this->port          = $port;
  }

  function __call($method, $params) {
    $this->status       = null;
    $this->error        = null;
    $this->raw_response = null;
    $this->response     = null;

    // If no parameters are passed, this will be an empty array
    $params = array_values($params);

    // The ID should be unique for each call
    $this->id++;

    // Build the request, it's ok that params might have any empty array
    $request = json_encode(array(
      'method' => $method,
      'params' => $params,
      'id'     => $this->id
    ));

    // Build the cURL session
    $curl    = curl_init("http://{$this->host}:{$this->port}/{$this->url}");
    $options = array(
      CURLOPT_HTTPAUTH       => CURLAUTH_BASIC,
      CURLOPT_USERPWD        => $this->rpcuser . ':' . $this->rpcpassword,
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_FOLLOWLOCATION => TRUE,
      CURLOPT_MAXREDIRS      => 10,
      CURLOPT_HTTPHEADER     => array('Content-type: application/json'),
      CURLOPT_POST           => TRUE,
      CURLOPT_POSTFIELDS     => $request
    );

    // This prevents users from getting the following warning when open_basedir is set:
    // Warning: curl_setopt() [function.curl-setopt]: CURLOPT_FOLLOWLOCATION cannot be activated when in safe_mode or an open_basedir is set
    if (ini_get('open_basedir')) {
      unset($options[CURLOPT_FOLLOWLOCATION]);
    }

    curl_setopt_array($curl, $options);

    // Execute the request and decode to an array
    $this->raw_response = curl_exec($curl);
    $this->response     = json_decode($this->raw_response, TRUE);

    // If the status is not 200, something is wrong
    $this->status = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    // If there was no error, this will be an empty string
    $curl_error = curl_error($curl);

    curl_close($curl);

    if (!empty($curl_error)) {
      $this->error = $curl_error;
    }

    if ($this->response['error']) {
      // If bitcoind returned an error, put that in $this->error
      $this->error = $this->response['error']['message'];
    }
    elseif ($this->status != 200) {
      // If bitcoind didn't return a nice error message, we need to make our own
      switch ($this->status) {
        case 400:
          $this->error = 'HTTP_BAD_REQUEST';
          break;
        case 401:
          $this->error = 'HTTP_UNAUTHORIZED';
          break;
        case 403:
          $this->error = 'HTTP_FORBIDDEN';
          break;
        case 404:
          $this->error = 'HTTP_NOT_FOUND';
          break;
      }
    }

    if ($this->error) {
      return FALSE;
    }

    return $this->response['result'];
  }
}

?>