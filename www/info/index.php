<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>bpoch.info</title>
    <link rel="shortcut icon" href="/img/favicon.png" type="image/x-icon">

    <link href="css/bootstrap-reboot.css" rel="stylesheet">
    <link href="css/bootstrap.css" rel="stylesheet">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> -->
    <link href="/css/navmenu.css" rel="stylesheet">
    <link href="/css/theme.css" rel="stylesheet">

    <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,300i,400,700i" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>

    <input type="checkbox" id="nav-trigger" class="nav-trigger" />
    <label for="nav-trigger"><span class="glyphicon glyphicon-menu-hamburger"></span></label>

    <nav>
      <ul class="navigation">
        <li class="nav-item"><a href="/btc"><img src="/img/bitcoin-icon.png"> Bitcoin</a></li>
        <li class="nav-item"><a href="/xmr"><img src="/img/monero-icon.png"> Monero</a></li>
        <li class="nav-item"><a href="/sdc"><img src="/img/shadowcash-icon.png"> Shadowcash</a></li>
        <li class="nav-item"><a href="/xcp"><img src="/img/counterparty-icon.png"> Counterparty</a></li>
        <li class="nav-item"><a href="/eth"><img src="/img/ethereum-icon.png"> Ethereum</a></li>
        <li class="nav-item"><a href="/etc"><img src="/img/ethereum-classic-icon.png"> Ethereum Classic</a></li>
        <li class="nav-footer">bpoch.info is a free service that is provided as-is with no warranty of any kind, express or implied.</li>
      </ul>
    </nav>

    <header>
      <span class="brand"><a href="/">bpoch<small>.info</small></a></span>
      
      <ul>
        <li><a href="/apidocs">API</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>
    </header>

    <?php

    require_once('php/easybitcoin.php');
    $bitcoind = new Bitcoin('dyvoLlSHZ8PdR1819npDxwOOGHUgjtOS','vWU64ytud9GGqZfhRfBRPGJiQ2sdyb34','104.36.80.109');
    $bitcoininfo = $bitcoind->getinfo();

    require_once('php/bpoch.php');

    $bpoch = bpoch();
    $seconds = $bpoch%(60);
    $minutes = floor($bpoch%(60*60)/(60));
    $hours   = floor($bpoch%(60*60*24)/(60*60));
    $date    = floor($bpoch%(60*60*24*30.44)/(60*60*24));
    $days    = floor($bpoch%(60*60*24*30.44)/(60*60*24))%7;
    $weeks   = floor($bpoch%(60*60*24*30.44)/(60*60*24*7));
    $months  = floor($bpoch%(60*60*24*30.44*12)/(60*60*24*30.44));
    $years   = floor($bpoch%(60*60*24*30.44*12*365.25)/(60*60*24*30.44*12));

    ?>

    <div class="wrapper">
      <div class="container">
        <div class="row">
          <div class="col-xl-6">
            <div class="card card-block" id="age">
              <h3 class="card-title">Bitcoin's age:</h3>
              <h4 class="display-4">
                <span class="chunk"><span id="age-years"><?php echo $years; ?></span>-<span id="age-months"><?php echo $months; ?></span>-<!--<span id="age-weeks"><?php echo $weeks; ?></span><span id="age-days"><?php echo $days; ?></span>--><span id="age-date"><?php echo sprintf("%02d", $date); ?></span></span>&nbsp;<span class="chunk"><span id="age-hours"><?php echo sprintf("%02d", $hours); ?></span>:<span id="age-minutes"><?php echo sprintf("%02d", $minutes); ?></span>:<span id="age-seconds"><?php echo sprintf("%02d", $seconds); ?></span></span>
              </h4>
            </div>
          </div>
          <div class="col-xl-3">
            <div class="card card-block">
              <h3 class="card-title">Height: <a href="/faq#height"><span class="glyphicon glyphicon-question-sign"></span></a></h3>
              <h4 class="display-4"><?php echo $bitcoininfo['blocks']; ?></h4>
            </div>
          </div>
          <div class="col-xl-2">
            <div class="card card-block">
              <h3 class="card-title">Era: <a href="/faq#era"><span class="glyphicon glyphicon-question-sign"></span></a></h3>
              <h4 class="display-4"><?php echo ordinal_suffix(block_era($bitcoininfo['blocks'])); ?></h4>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script type="text/javascript">
      var bpoch = <?php echo $bpoch; ?>;

      updateTime();

      function updateTime() {
        bpoch++;
        var seconds = bpoch%(60);
        var minutes = Math.floor(bpoch%(60*60)/(60));
        var hours   = Math.floor(bpoch%(60*60*24)/(60*60));
        var date    = Math.floor(bpoch%(60*60*24*30.44)/(60*60*24));
        var days    = Math.floor(bpoch%(60*60*24*30.44)/(60*60*24))%7;
        var weeks   = Math.floor(bpoch%(60*60*24*30.44)/(60*60*24*7));
        var months  = Math.floor(bpoch%(60*60*24*30.44*12)/(60*60*24*30.44));
        var years   = Math.floor(bpoch%(60*60*24*30.44*12*365.25)/(60*60*24*30.44*12));
        $("#age-seconds").html(pad(seconds));
        $("#age-minutes").html(pad(minutes));
        $("#age-hours").html(pad(hours));
        $("#age-date").html(pad(date));
        $("#age-days").html(pad(days));
        $("#age-weeks").html(pad(weeks));
        $("#age-months").html(pad(months));
        $("#age-years").html(years);
        setTimeout(updateTime, 1000);
      }

      function pad(n) {
        return (n < 10) ? ("0" + n) : n;
      }
    </script>

    <!-- <script src="/js/bootstrap.min.js"></script> -->
    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> -->
  </body>
</html>

<?php


function ordinal_suffix($num) {
  $num = $num % 100;
  if($num < 11 || $num > 13){
     switch($num % 10){
      case 1: return $num.'st';
      case 2: return $num.'nd';
      case 3: return $num.'rd';
    }
  }
  return $num.'th';
}

?>