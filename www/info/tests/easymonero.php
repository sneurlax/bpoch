<?php
/**
 * EasyMonero-PHP
 * 
 * A simple class for making calls to Monero's API using PHP.
 * https://github.com/sneurlax/EasyMonero-PHP
 *
 * Using work from
 *   Andrew LeCody (EasyBitcoin-PHP)
 *   TheKoziTwo <thekozitwo@gmail.com> (xmr-integration)
 *   Sergio Vaccaro <sergio@inservibile.org> (json-rpc2php)
 * 
 * @author     sneurlax <sneurlax@gmail.com>
 * @copyright  2016
 * @license    Public Domain
 *  
 * ============================================================================
 * 
 * // Initialize Monero connection/object
 * $monero = new Monero();
 * 
 * // Optionally, you can specify a host and port.
 * $monero = new Monero('host','port');
 * // Defaults are:
 * //  host = 127.0.0.1
 * //  port = 18081
 * 
 * // Make calls to monerod as methods for your object.
 * // Examples:
 * $monero->is_ready();
 * $monero->getblockcount();
 * $monero->get_block_header_by_height(1);
 * 
 */

class Monero {
  const READY   =  1;
  const BUSY    =  0;
  const OFFLINE = -1;
  
  private $daemon;

  private $host;
  private $port;

  /**
   * Initialize an instance of daemon
   * 
   * @param string      $host (default: 127.0.0.1)
   * @param int         $port (default: 18081)
   */
  function __construct($host = '127.0.0.1', $port = 18081) {
    $this->host          = $host;
    $this->port          = $port;

    $this->daemon = new jsonRPCClient('http://'.$host.':'.$port.'/json_rpc');
    
    // Run a cmd to set status:
    $this->_execute('getblockcount');
  }
    
  /**
   * Check if daemon is ready
   * @return  bool       true if ready
   */ 
  public function is_ready() {
    $this->_execute('getblockcount');
    return (bool) ($this->status === self::READY);
  }
  
  /**
   * Check if daemon is busy (it will be busy when saving blockchain etc)
   * @return  bool       true if busy
   */ 
  public function is_busy() {
    $this->_execute('getblockcount');
    return (bool) ($this->status === self::BUSY);
  }
  
  /**
   * Check if daemon is responding
   * @return  bool       true if no contact could be established
   */ 
  public function is_offline() {
    $this->_execute('getblockcount');
    return (bool) ($this->status === self::OFFLINE);
  }
  
  /**
   * Get current block height / count (keep in mind if daemon is not 
   * fully synced, this will be lower than actually exist in blockchain)
   * 
   * @return  int|bool    block height (or false on error/busy)
   */ 
  public function get_block_count() {
    return $this->_execute('getblockcount')['count'];
  }
  
  /**
   * Get block header by hash
   * 
   * @param   int         hash
   * @return  int|bool    block header (or false on error/busy)
   */ 
  public function get_block_header_by_hash($hash) {
    return $this->_execute('getblockheaderbyhash',array('hash'=>$hash));
  }
  
  /**
   * Get block header by height
   * 
   * @param   int         height (e.g 12345)
   * @return  int|bool    block header (or false on error/busy)
   */ 
  public function get_block_header_by_height($height) {
    return $this->_execute('getblockheaderbyheight',array('height'=>$height));
  }
  
  /**
   * Get last block header
   * @return  bool|int    block header (or false on error/busy) 
   */ 
  public function get_last_block_header() {
    return $this->_execute('getlastblockheader');   
  }
  
  /**
   * Execute / send rpc command to daemon
   * 
   * Status of daemon will be set after sending cmd: OK, BUSY or OFFLINE
   * 
   * @param   string      daemon command
   * @param   array       params as array
   * @return  array|bool  array as sent from daemon or false if daemon is OFFLINE or BUSY
   */ 
  private function _execute($command,$params = null) {
      $result = $this->daemon->$command(json_encode($params));
    
      if($result['status'] == 'OK') 
      {
          $this->status = self::READY;
          return $result;
      }
      elseif($result['status'] == 'BUSY')
      {
          $this->status = self::BUSY;
      }
      else
      {
          $this->status = self::OFFLINE;
      }
              
      return FALSE;
  }
}

/*
 * Copyright 2007 Sergio Vaccaro <sergio@inservibile.org>
 * GNU GPL LICENSE
 * The object of this class are generic jsonRPC 1.0 clients
 * http://json-rpc.org/wiki/specification
 * @author sergio <jsonrpcphp@inservibile.org>
 */
class jsonRPCClient {
  private $url;
  private $id;
  private $notification = false;

  public function __construct($url) {
    $this->url = $url;
    empty($proxy) ? $this->proxy = '' : $this->proxy = $proxy;
    $this->id = 1;
  }

  public function setRPCNotification($notification) {
    empty($notification) ? $this->notification = false : $this->notification = true;
  }

  public function __call($method,$params) {
    $is_param_arr = true;
    if(isset($params[0]) and !is_array($params[0])) {
      $is_param_arr = false;
    }

    if(!is_scalar($method)) { throw new Exception('Method name has no scalar value'); }              
    if(is_array($params)) { $params = array_values($params);}else{throw new Exception('Params must be given as array'); }
    if($this->notification) { $currentId = NULL; } else { $currentId = $this->id; }
    if($is_param_arr) {
      $request = array( 'method' => $method, 'params' => $params, 'id' => $currentId );
      $request = json_encode($request);
    } else {
      $request = '{"jsonrpc":"2.0","id":"'.$currentId.'","method":"'.$method.'","params":'.$params[0].'}';
    }

    $ch = curl_init($this->url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
    #curl_setopt($ch,CURLOPT_TIMEOUT,10);
    
    $response = json_decode(curl_exec($ch),true);
    curl_close($ch);
      
    if(!$this->notification) {
      if($response['id'] != $currentId) { return $response; }
      if(isset($response['error']) AND !is_null($response['error'])) { return $response; } 
      return $response['result'];
    } else {
      return true;
    }
  }
}

?>