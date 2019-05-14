define("models/map.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Direction;
    (function (Direction) {
        Direction[Direction["UP"] = 1] = "UP";
        Direction[Direction["DOWN"] = 2] = "DOWN";
        Direction[Direction["LEFT"] = 3] = "LEFT";
        Direction[Direction["RIGHT"] = 4] = "RIGHT";
    })(Direction = exports.Direction || (exports.Direction = {}));
    var MapModel = /** @class */ (function () {
        function MapModel() {
            this.WALL_SIGN = '#';
            this.DIRECTION_SIGNS = {
                '^': Direction.UP,
                '_': Direction.DOWN,
                '<': Direction.LEFT,
                '>': Direction.RIGHT
            };
            this._map = [];
        }
        MapModel.prototype.init = function (mapText) {
            var _this = this;
            if (!mapText)
                return null;
            this._map = new Array();
            var playerPosition = null;
            mapText.split('\n')
                .forEach(function (row, i) {
                _this._map[i] = new Array();
                row.split('')
                    .forEach(function (sign, j) {
                    if (sign === _this.WALL_SIGN) {
                        _this._map[i][j] = false;
                    }
                    else {
                        _this._map[i][j] = true;
                        if (_this.DIRECTION_SIGNS.hasOwnProperty(sign)) {
                            if (playerPosition) {
                                console.log('Warning! Player position duplication!');
                            }
                            playerPosition = {
                                posX: i,
                                posY: j,
                                direction: _this.DIRECTION_SIGNS[sign]
                            };
                        }
                    }
                });
            });
            if (!playerPosition) {
                return null;
            }
            return playerPosition;
        };
        Object.defineProperty(MapModel.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapModel.prototype, "height", {
            get: function () {
                return this._map ? this._map.length : 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapModel.prototype, "width", {
            get: function () {
                return this._map && this._map[0] ? this._map[0].length : 0;
            },
            enumerable: true,
            configurable: true
        });
        return MapModel;
    }());
    exports.MapModel = MapModel;
});
define("app", ["require", "exports", "models/map.model"], function (require, exports, map_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
            this.mapModel = new map_model_1.MapModel();
        }
        Main.prototype.init = function () {
            var logArea = document.getElementById('log-area');
            if (logArea) {
            }
            this.mapModel = new map_model_1.MapModel();
            this.mapModel.init('#####\n# > #\n#####');
            console.log(this.mapModel.height, this.mapModel.width);
        };
        return Main;
    }());
    var app = new Main();
    app.init();
});
