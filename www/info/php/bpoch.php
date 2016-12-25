<?php
/**
 * bpoch
 * Time and calendar tools for bitcoin and decentralized currencies
 *
 * @package    bpoch.php
 * @author     sneurlax <sneurlax@gmail.com>
 * @license    public domain
 */

/**
 * Return the number of seconds since the genesis block of a given currency.
 *
 * Coin    Genesis datetime         Genesis epoch
 * ----    ----------------         -------------
 * btc     2009-01-03 18:15:05 UTC  1231028105
 * xmr     2014-04-18 10:49:53 UTC  1397818193
 * sdc     2014-07-19 22:06:08 UTC  1405803968
 * xcp     2014-01-04 21:45:32 UTC  1388871932
 * eth     2015-07-30 17:26:1  UTC  1438295161
 * etc     2016-07-20 13:20:40 UTC  1469020840    (eth block 1920000)
 *
 * @param  str  currency abbreviation, default 'btc'
 *
 * @return int  seconds since 2009-01-03 18:15:05
 */
function bpoch( $coin = 'btc' ) {
  $coin = mb_strtolower( $coin );
  $adjustment = 1231028105; // btc genesis epoch

  if( $coin == 'xmr' ) {
    $adjustment = 1397818193;
  } elseif( $coin == 'sdc' ) {
    $adjustment = 1405803968;
  } elseif( $coin == 'xcp' ) {
    $adjustment = 1388871932;
  } elseif( $coin == 'eth' ) {
    $adjustment = 1438295161;
  } elseif( $coin == 'etc' ) {
    $adjustment = 1469020840;
  }

  return time() - $adjustment;
}

?>