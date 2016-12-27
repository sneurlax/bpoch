<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>bpoch.info/xmr</title>
    <link rel="shortcut icon" href="/img/favicon.png" type="image/x-icon">

    <link href="css/bootstrap-reboot.css" rel="stylesheet">
    <link href="css/bootstrap-flex.css" rel="stylesheet">
    <!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous"> -->
    <link href="/css/navmenu.css" rel="stylesheet">
    <link href="/css/theme.css" rel="stylesheet">
    <link href="/css/chart.css" rel="stylesheet">

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
        <li><a href="/charts">Charts</a></li>
      </ul>
    </header>

    <?php

    include 'php/bpoch.php';

    $bpoch = bpoch('xmr');

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
      <div id="bigChart"></div>

      <div class="container" id="toolbar">
        <div class="row flex-items-xs-center">
          <div class="col-xs-5">
            <div class="btn-toolbar" role="toolbar">
              <div class="btn-group btn-group-sm" role="group" aria-label="Zoom">
                <button type="button" class="btn btn-secondary disabled" style="cursor: default;">Zoom:</button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '6h');">6 hr</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '1d');">1 d</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '2d');">2 d</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '1w');">1 w</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '2w');">2 w</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '1m');">1 m</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '3m');">3 m</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', '6m');">6 m</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('zoom', 'all');">all</a></button>
              </div>
            </div>
          </div>
          <div class="col-xs-2">
          </div>
          <div class="col-xs-5">
            <div class="btn-toolbar" role="toolbar">
              <div class="btn-group btn-group-sm" role="group" aria-label="Candlesticks">
                <button type="button" class="btn btn-secondary disabled" style="cursor: default;">Candlesticks:</button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('period', '5min');">5 min</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('period', '15min');">15 min</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('period', '30min');">30 min</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('period', '2h');">2 hr</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('period', '4h');">4 hr</a></button>
                <button type="button" class="btn btn-secondary"><a href="javascript:addOrUpdateUrlParam('period', '1d');">1 day</a></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row">
          <div class="col-xs-12">
            <p>Monero is <span id="age-years"><?php echo $years; ?></span> years, <span id="age-months"><?php echo $months; ?></span> months, <span id="age-date"><?php echo $date; ?></span> days, <span id="age-hours"><?php echo $hours; ?></span> hours, <span id="age-minutes"><?php echo $minutes; ?></span> minutes, and <span id="age-seconds"><?php echo $seconds; ?></span> seconds old.</p>
          </div>
        </div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.1.1.min.js" integrity="sha256-hVVnYaiADRTO2PzUGmuLJr8BLUSjGIZsDYGmIJLv2b8=" crossorigin="anonymous"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="/js/techan.js"></script>
    <script src="/js/chart.js"></script>
    <script>
      (function(window, d3, techanSite) {
        d3.select('div#bigChart').call(techanSite.bigchart);
        window.onresize = function() {
          d3.select('div#bigChart').call(techanSite.bigchart.resize);
        };
      })(window, d3, techanSite);
    </script>
    
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
        $("#age-seconds").html(seconds);
        $("#age-minutes").html(minutes);
        $("#age-hours").html(hours);
        $("#age-date").html(date);
        $("#age-days").html(days);
        $("#age-weeks").html(weeks);
        $("#age-months").html(months);
        $("#age-years").html(years);
        setTimeout(updateTime, 1000);
      }
    </script>
    
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> -->
    <!-- <script src="/js/bootstrap.min.js"></script> -->
    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> -->
  </body>
</html>