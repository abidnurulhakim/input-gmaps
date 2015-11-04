var InputGmap = function(input, options) {
    if (!options) {
        this.dataPoints = [];
        this.height = 400;
        this.width = 100;
        this.totalMaxMarker = 100;
        this.latitude = -6.1750359;
        this.longitude = 106.827192;
        this.zoom = 15;
    } else {
        this.dataPoints = (!options.points) ? [] : options.points;
        this.height = (!options.height) ? 300 : options.height;
        this.width = (!options.width) ? 100 : options.width;
        this.totalMaxMarker = (!options.maxMarker) ? 100 : options.maxMarker;
        this.latitude = (!options.latitude) ? -6.1750359 : Number(options.latitude);
        this.longitude = (!options.longitude) ? 106.827192 : Number(options.longitude);
        this.zoom = (!options.zoom) ? 15 : options.zoom;
    }
    this.points = [];
    if (Array.isArray(this.dataPoints)) {
        for (var i = 0; i < this.dataPoints.length; i++) {
            if ((typeof this.dataPoints[i].latitude == 'number') && (typeof this.dataPoints[i].longitude == 'number')) {
                this.points.push(new google.maps.LatLng(this.dataPoints[i].latitude, this.dataPoints[i].longitude));
            }
        };
    }
    this.input = input;
    this.container = $("<div class='input-map' style='width:"+this.width+"%;height:"+this.height+"px'></div>");

    this.data = {
        'position' : new google.maps.LatLng(this.latitude, this.longitude),
        'width' : this.width,
        'height' : this.height,
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
            var arrayTempPosition = [];
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
    * @return google.maps.Marker
    */
    this.initializeMarker = function(data, map, positions) {
        var marker = new google.maps.Marker({
            position: positions,
            map: map,
        });
        return marker;
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
                var marker = callbackInitializeMarker(data, map, event.latLng);
                callbackInitializeRemoveMarkerListener(data, marker);
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
    for (var i = 0; i < this.data.points.length; i++) {
        var marker =  this.initializeMarker(this.data, inputMap, this.data.points[i]);
        this.initializeRemoveMarkerListener(this.data, marker);
    }
    this.data.element.attr("value", this.pointsToString(this.data.points));
    this.initializeAddMarkerListener(this.data, inputMap, this.initializeMarker, this.pointsToString, this.initializeRemoveMarkerListener);
};

var elementInputMap = [];
$("[data-toggle='input-gmap']").each(function(i){
    var myLatitude = -6.1750359;
    var myLongitude = 106.827192;
    if (navigator.geolocation) {
        element.push($(this));
        navigator.geolocation.getCurrentPosition(function(position){
            myLatitude = position.coords.latitude;
            myLongitude = position.coords.longitude;
            var el = elementInputMap.pop();
            initInputMap(el, myLatitude, myLongitude);
        }, function (){
            var el = elementInputMap.pop();
            initInputMap(el, myLatitude, myLongitude);
        });
    } else {
        initInputMap($(this), myLatitude, myLongitude);
    }
});

function initInputMap (container, myLatitude, myLongitude) {
    var width = (!container.data('width')) ? 100 : container.data('width');
    var height = (!container.data('height')) ? 400 : container.data('height');
    var points = (!container.data('points')) ? "" : container.data('points');
    var maxMarker = (!container.data('max-marker')) ? 100 : container.data('max-marker');
    var latitude = (!container.data('latitude')) ? myLatitude : container.data('latitude');
    var longitude = (!container.data('longitude')) ? myLongitude : container.data('longitude');
    var zoom = (!container.data('zoom')) ? 15 : container.data('zoom');
    var arrayPoints = [];
    if (points.trim().length > 0) {
        var split = points.split(";");
        for (var i = 0; i < split.length; i++) {
            var position = split[i].split(",");
            if (position.length > 1) {
                arrayPoints.push({ 'latitude' : Number(position[0]), 'longitude' : Number(position[1])});
            }
        };
    }
    var map = new InputGmap(container, {
        'width' : width,
        'height' : height,
        'points' : arrayPoints,
        'maxMarker' : maxMarker,
        'latitude' : latitude,
        'longitude' : longitude,
    });
}
