<h2><b>This plugin for generate input map with gmaps</b></h2>

<h2><b>Required :</b></h2>
1. JQuery (recommend version 2.1.4)
2. GMaps JavaScript API (https://maps.googleapis.com/maps/api/js?key=API_KEY)

<h2><b>Install</b></h2>
<h3><b>1.  Embed in element HTML</b></h3>
    You simply add <b>data-toggle=&quot;input-gmap&quot;</b> on the desired element. example:
      &lt;input name='map' data-toggle='input-gmap'&gt;
    a. You can add your location to default location via "data-latitude" and "data-longitude", example :
      &lt;input name='map' data-toggle='input-gmap' data-latitude='-6.1750359' data-longitude='106.827192'&gt;
    b. You can set size window from map via "data-height" and "data-width", value of data-height in pixel and value of data-width in percent, example :
      &lt;input name='map' data-toggle='input-gmap' data-width='100' data-height='400'&gt;
    c. You can set zoom of map via "data-zoom", example :
      &lt;input name='map' data-toggle='input-gmap' data-zoom='15'&gt;
    d. You can add points of markers via "data-points", with format : "[latitude],[longitude];[latitude],[longitude];..." if you have n point, example :
      &lt;input name='map' data-toggle='input-gmap' data-points='-6.169696,106.821420;-6.170080,106.840088'&gt;
    e. You can set max of total marker which user can add to map via "data-max-marker", example :
      &lt;input name='map' data-toggle='input-gmap' data-max-marker='10'&gt;

<h3><b>2.  Or via Methods</b></h3>
    You simply make input maps with like this:
    // new InputGmap(element, options)
    var inputMap = new InputGmap($(&quot;input&quot;));
    or with options
    var a = new InputGmap($(&quot;input&quot;), {'width': 100, zoom : 15});

<h2><b>Options :</b></h2>
    a. width, default : 100
    b. height, default : 400
    c. points, default : []
    d. minMarker, default : 0
    e. maxMarker, default : 100
    f. latitude, default : current latitude
    g. longitude, default : current longitude

<h3><b>*Note: </b></h3>
<ul>
  <li>
    Type of latitude and longitude must be number
  </li>
  <li>
    This plugin not use to commercial
  </li>
  <li>
    Contact : abidnurulhakim@gmail.com
  </li>
</ul>
