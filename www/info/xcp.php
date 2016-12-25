<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>bpoch.info</title>
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

    <div class="wrapper">
      <div id="bigChart"></div>

      <script src="https://d3js.org/d3.v4.min.js"></script>
      <script src="/js/techan.js"></script>
      <script src="/js/chartdata.xcp.js"></script>
      <script src="/js/chart.js"></script>
      <script>
        (function(window, d3, techanSite) {
          d3.select('div#bigChart').call(techanSite.bigchart);
          window.onresize = function() {
            d3.select('div#bigChart').call(techanSite.bigchart.resize);
          };
        })(window, d3, techanSite);
      </script>
    </div>
    <!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script> -->
    <!-- <script src="/js/bootstrap.min.js"></script> -->
    <!-- <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script> -->
  </body>
</html>