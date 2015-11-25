/*
* Created by Abid Nurul Hakim, 2015
* Email : abidnurulhakim@gmail.com
* For README can be access in https://github.com/abidnurulhakim/input-gmaps
*/

var stackInputGmap = [];
var InputGmap = function(input, options) {
    this.default_options = {
        'point' : [],
        'height' : 400,
        'width' : 100,
        'maxMarker' : 100,
        'latitude' : null,
        'longitude' : null,
        'zoom' : 15,
        'points' : [],
        'latitude' : -6.1750359,
        'longitude' : 106.827192,
        'element' : $(document),
        'container' : $("<div class='input-map' style='width:100%;height:400px'></div>"),
    };
    console.log(options);
    this.settings = $.extend( {}, this.default_options, options);
    console.log(this.settings);
    if (Array.isArray(this.settings.point)) {
        console.log('isArray');
        for (var i = 0; i < this.settings.point.length; i++) {
            if ((typeof this.settings.point[i].latitude == 'number') && (typeof this.settings.point[i].longitude == 'number')) {
                this.settings.points.push(new google.maps.LatLng(this.settings.point[i].latitude, this.settings.point[i].longitude));
            }
        };
    }
    console.log(this.settings.points);
    this.settings.element = input;
    this.settings.container = $("<div class='input-map' style='width:"+this.settings.width+"%;height:"+this.settings.height+"px'></div>");

    /*
    * Initialize map
    * @param {Object}  data
    * @return {google.maps.Map}
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
    * Initialize event listener click for remove marker by user
    * @param {Object}  data
    * @param {google.maps.Marker}  marker
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
            var value = data.pointsToString(data.points);
            data.element.attr("value", value);
        });
    };

    /*
    * Initialize marker in a map
    * @param {Object}  data
    * @param {google.maps.Map} map
    * @param {google.maps.LatLng}  positions
    * @return {google.maps.Marker}
    */
    this.initializeMarker = function(data, map, positions) {
        var marker = new google.maps.Marker({
            position: positions,
            map: map,
        });
        console.log("marker");
        return marker;
    };

    /*
    * initialize event lister click for add marker by user
    * @param {Object}  data
    * @param {google.maps.Map}  map
    */
    this.initializeAddMarkerListener = function(data, map) {
        google.maps.event.addListener(map, 'click', function(event) {
            if (data.points.length < data.maxMarker) {
                var marker = data.initializeMarker(data, map, event.latLng);
                data.initializeRemoveMarkerListener(data, marker);
                data.points.push(event.latLng);
                var value = data.pointsToString(data.points);
                data.element.attr("value", value);
            }
        });
    };

    /*
    * Get string from array points
    * @param {Array}  points
    * @return {String}
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

    this.initializeDivMap = function (data) {
        data.element.attr("hidden", true);
        data.container.insertBefore(data.element);
        var inputMap = data.initializeMap(data);
        for (var i = 0; i < data.points.length; i++) {
            var marker =  this.initializeMarker(data, inputMap, data.points[i]);
            this.initializeRemoveMarkerListener(data, marker);
        }
        data.element.attr("value", data.pointsToString(data.points));
        data.initializeAddMarkerListener(data, inputMap);
    };

    this.data = {
        'position' : new google.maps.LatLng(options.latitude, options.longitude),
        'initializeMap' : this.initializeMap,
        'initializeMarker' : this.initializeMarker,
        'initializeAddMarkerListener' : this.initializeAddMarkerListener,
        'initializeRemoveMarkerListener' : this.initializeRemoveMarkerListener,
        'pointsToString' : this.pointsToString,
        'initializeDivMap' : this.initializeDivMap
    };
    this.data = $.extend({}, this.settings, this.data);

    if (!this.data.latitude || !this.data.longitude) {
        if (navigator.geolocation) {
            stackInputGmap.push(this.data);
            navigator.geolocation.getCurrentPosition(function(position){
                var data = stackInputGmap.pop();
                data.position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                data.initializeDivMap(data);
            }, function (){
                var data = stackInputGmap.pop();
                data.initializeDivMap(data);
            });
        } else {
            this.initializeDivMap(this.data);
        }
    } else {
        this.data.position = new google.maps.LatLng(options.latitude, options.longitude);
        this.initializeDivMap(this.data);
    }

};

$("[data-toggle='input-gmap']").each(function(i){
    var width = (!$(this).data('width')) ? 100 : $(this).data('width');
    var height = (!$(this).data('height')) ? 400 : $(this).data('height');
    var points = (!$(this).data('points')) ? "" : $(this).data('points');
    var maxMarker = (!$(this).data('max-marker')) ? 100 : $(this).data('max-marker');
    var latitude = (!$(this).data('latitude')) ? null : $(this).data('latitude');
    var longitude = (!$(this).data('longitude')) ? null : $(this).data('longitude');
    var zoom = (!$(this).data('zoom')) ? 15 : $(this).data('zoom');
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

    var map = new InputGmap($(this), {
        width : width,
        height : height,
        point : arrayPoints,
        maxMarker : maxMarker,
        latitude : latitude,
        longitude : longitude,
        zoom : zoom,
    });
});

