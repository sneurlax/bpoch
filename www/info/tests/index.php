<html><body><pre>
<?php

echo "Server IP: ".$_SERVER['SERVER_ADDR']."\n\n";

// bitcoin json-rpc test
echo "--------------------------------------------------------------------------------\nbitcoind test:\n\n";

require_once('easybitcoin.php');

$bitcoind = new Bitcoin('dyvoLlSHZ8PdR1819npDxwOOGHUgjtOS','vWU64ytud9GGqZfhRfBRPGJiQ2sdyb34','104.36.80.109');

print_r($bitcoind->getinfo());

if($bitcoind->error) {
  echo $bitcoind->error;
}

// monero json-rpc test
echo "--------------------------------------------------------------------------------\nmonerod test:\n\n";

require_once('easymonero.php');

$monerod = new Monero('104.36.80.109');

echo 'Status: '.($monerod->is_offline() ? 'Offline' : ($monerod->is_busy() ? 'Busy' : ($monerod->is_ready() ? 'Ready' : 'Not ready')))."\n";
echo 'Block count: '.$monerod->get_block_count()."\n";

// shadowcash json-rpc test
echo "--------------------------------------------------------------------------------\nshadowcoind test:\n\n";

require_once('easyshadowcash.php');

$shadowd = new Shadowcash('H15ZmulQKahUQYkKq49SbXL8fQTvsv9N','ZVoFJiFaF2buUfsvX2WwR9hRAtu0HExa','104.36.80.109');

print_r($shadowd->getinfo());

if($shadowd->error) {
  echo $shadowd->error;
}

?>