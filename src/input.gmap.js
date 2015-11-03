var InputGmap = function(input, options) {
    if (!options) {
        this.dataPoints = Array();
        this.height = 400;
        this.width = 100;
        this.totalMinMarker = 0;
        this.totalMaxMarker = 10;
        this.latitude = -6.1750359;
        this.longitude = 106.827192;
        this.zoom = 15;
    } else {
        this.dataPoints = (!options.points) ? Array() : options.points;
        this.height = (!options.height) ? 300 : options.height;
        this.width = (!options.width) ? 100 : options.width;
        this.totalMinMarker = (!options.minMarker) ? 0 : options.minMarker;
        this.totalMaxMarker = (!options.maxMarker) ? 10 : options.maxMarker;
        this.latitude = (!options.latitude) ? -6.1750359 : options.latitude;
        this.longitude = (!options.longitude) ? 106.827192 : options.longitude;
        this.zoom = (!options.zoom) ? 15 : options.zoom;
    }
    this.points = Array();
    if (!Array.isArray(this.dataPoints)) {
        for (var i = 0; i < this.dataPoints.length; i++) {
            if ((typeof dataPoints[i].latitude == 'Number') && (typeof dataPoints[i].longitude == 'Number')) {
                this.points.push(new google.maps.LatLng(dataPoints[i].latitude, dataPoints[i].longitude));
            }
        };
    }
    this.input = input;
    this.container = $("<div class='input-map' style='width:"+this.width+"%;height:"+this.height+"px'></div>");

    this.data = {
        'position' : new google.maps.LatLng(this.latitude, this.longitude),
        'width' : this.width,
        'height' : this.height,
        'minMarker' : this.totalMinMarker,
        'maxMarker' : this.totalMaxMarker,
        'points' : this.points,
        'container' : this.container,
        'element' : this.input,
        'zoom' : this.zoom,
    };

    this.data.element.attr("hidden", true);
    this.data.container.insertBefore(this.data.element);

    /*
    * initialize map
    * @param this.data  data
    * @return google.maps.Map
    */
    this.initializeMap = function(data) {
        var map_options = {
            center: data.position,
            zoom: data.zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(data.container[0], map_options);
        return map;
    };

    /*
    * initialize event listener click for remove marker by user
    * @param this.data  data
    * @param google.maps.Marker  marker
    */
    this.initializeRemoveMarkerListener = function(data, marker) {
        google.maps.event.addListener(marker, 'click', function(event) {
            marker.setMap(null);
            var arrayTempPosition = Array();
            for (var i = data.points.length-1; i >= 0 ; i--) {
                if (data.points[i].lat() != marker.getPosition().lat() || data.points[i].lng() != marker.getPosition().lng()) {
                    var position = data.points.pop();
                    arrayTempPosition.push(position);
                } else {
                    var position = data.points.pop();
                }
            }
            for (var i = arrayTempPosition.length-1; i >= 0 ; i--) {
                var position = arrayTempPosition.pop();
                data.points.push(position);
            }
            var value = this.pointsToString();
            data.element.attr("value", value);
        });
    };

    /*
    * initialize marker in a map
    * @param this.data  data
    * @param google.maps.Map map
    * @param google.maps.LatLng  positions
    * @param function  callbackInitializeRemoveMarkerListener
    */
    this.initializeMarker = function(data, map, positions, callbackInitializeRemoveMarkerListener) {
        var marker = new google.maps.Marker({
            position: positions,
            map: map,
        });
        callbackInitializeRemoveMarkerListener(data, marker);
    };

    /*
    * initialize event lister click for add marker by user
    * @param this.data  data
    * @param google.maps.Map  map
    * @param function  callbackInitializeMarker
    * @param function  callbackPointToString
    * @param function  callbackInitializeRemoveMarkerListener
    */
    this.initializeAddMarkerListener = function(data, map, callbackInitializeMarker, callbackPointToString, callbackInitializeRemoveMarkerListener) {
        google.maps.event.addListener(map, 'click', function(event) {
            if (data.points.length < data.maxMarker) {
                callbackInitializeMarker(data, map, event.latLng, callbackInitializeRemoveMarkerListener);
                data.points.push(event.latLng);
                var value = callbackPointToString(data.points);
                data.element.attr("value", value);
            }
        });
    };

    /*
    * Get string from array points
    * @param Array  points
    * @return String
    */
    this.pointsToString = function(points) {
        if (points.length < 1) {
            return "";
        }
        var result = points[0].lat()+","+points[0].lng();
        for (var i = 1; i < points.length; i++) {
            result += ";" + points[i].lat() + "," + points[i].lng();
        }
        return result;
    };

    var inputMap = this.initializeMap(this.data);
    this.initializeAddMarkerListener(this.data, inputMap, this.initializeMarker, this.pointsToString, this.initializeRemoveMarkerListener);
};

$("[data-toggle='input-gmap']").each(function(i){
    var myLatitude = -6.1750359;
    var myLongitude = 106.827192;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position){
            myLatitude = position.coords.latitude;
            myLongitude = position.coords.longitude;
        }, function (){});
    }
    var width = (!$(this).data('width')) ? 100 : $(this).data('width');
    var height = (!$(this).data('height')) ? 400 : $(this).data('height');
    var points = (!$(this).data('points')) ? "" : $(this).data('points');
    var minMarker = (!$(this).data('min-marker')) ? 0 : $(this).data('min-marker');
    var maxMarker = (!$(this).data('max-marker')) ? 0 : $(this).data('max-marker');
    var latitude = (!$(this).data('latitude')) ? myLatitude : $(this).data('latitude');
    var longitude = (!$(this).data('longitude')) ? myLongitude : $(this).data('longitude');
    var zoom = (!$(this).data('zoom')) ? 15 : $(this).data('zoom');
    var arrayPoints = Array();
    if (points.trim.length > 0) {
        var split = points.split(";");
        for (var i = 0; i < split.length; i++) {
            var position = split[i].split(",");
            if (position.length > 1) {
                arrayPoints.push({ 'latitude' : position[0], 'longitude' : position[1]});
            }
        };
    }
    var map = new InputGmap($(this), {
        'width' : width,
        'height' : height,
        'points' : points,
        'minMarker' : minMarker,
        'maxMarker' : maxMarker,
        'latitude' : latitude,
        'longitude' : longitude
    });
});
