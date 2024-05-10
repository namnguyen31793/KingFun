/**
 * Created by Nofear on 2/27/2019.
 */

(function () {
    var MapString;

    MapString = (function () {
        function MapString() {
            this.map = {};
        }

        MapString.prototype.getLength = function() {
            return Object.keys(this.map).length;
        };
        MapString.prototype.set = function(t, e) {
            this.map[t] = e;
        };
        MapString.prototype.get = function(t) {
            return this.map[t];
        };
        MapString.prototype.forEach = function(t) {
            var e = Object.keys(this.map);
            if (e !== null && e !== undefined)
                for (var i = 0; i < e.length; i++)
                    if (e[i] !== null && e[i] !== undefined) t(e[i], this.map[e[i]]);
        };
        MapString.prototype.getListKeys = function() {
            return Object.keys(this.map);
        };
        MapString.prototype.isContainKey = function(t) {
            return this.map[t] !== undefined;
        };
        MapString.prototype.removeKey = function(t) {
            delete this.map[t];
        };
        MapString.prototype.clear = function() {
            for (var t = Object.keys(this.map), e = 0; e < t.length; e++) this.removeKey(t[e]);
        };
        return MapString;

    })();

    cc.MapString = MapString;

}).call(this);
