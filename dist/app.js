var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define("utils/injector.util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Injector = /** @class */ (function () {
        function Injector() {
        }
        Injector.inject = function (ref) {
            var name = ref.toString();
            if (this._injects.hasOwnProperty(name)) {
                console.log("Error: Inject " + name + " already exist!");
                return;
            }
            this._injects[name] = new ref();
        };
        Injector.get = function (ref) {
            return this._injects[ref.toString()] || null;
        };
        Injector._injects = {};
        return Injector;
    }());
    exports.Injector = Injector;
});
define("services/controls.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EditStates;
    (function (EditStates) {
        EditStates["EDIT"] = "Edit";
        EditStates["SAVE"] = "Save";
    })(EditStates = exports.EditStates || (exports.EditStates = {}));
    var StartStates;
    (function (StartStates) {
        StartStates["PLAY"] = "Play";
        StartStates["STOP"] = "Stop";
        StartStates["PAUSE"] = "Pause";
    })(StartStates = exports.StartStates || (exports.StartStates = {}));
    var ControlsService = /** @class */ (function () {
        function ControlsService() {
            this._editButton = document.getElementById('edit-button');
            this._startButton = document.getElementById('start-button');
        }
        ControlsService.prototype.subscribeEditClick = function (callback) {
            if (this._editButton) {
                this._editButton.addEventListener('click', function () {
                    callback();
                });
            }
        };
        ControlsService.prototype.subscribeStartClick = function (callback) {
            if (this._startButton) {
                this._startButton.addEventListener('click', function () {
                    callback();
                });
            }
        };
        ControlsService.prototype.activateEditButton = function () {
            this._editButton.disabled = false;
        };
        ControlsService.prototype.deactivateEditButton = function () {
            this._editButton.disabled = true;
        };
        ControlsService.prototype.activateStartButton = function () {
            this._startButton.disabled = false;
        };
        ControlsService.prototype.deactivateStartButton = function () {
            this._startButton.disabled = true;
        };
        ControlsService.prototype.switchEditState = function (state) {
            this._editButton.innerText = state;
        };
        ControlsService.prototype.switchStartState = function (state) {
            this._startButton.innerText = state;
        };
        return ControlsService;
    }());
    exports.ControlsService = ControlsService;
});
define("utils/path-finder.util", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PathFinder = /** @class */ (function () {
        function PathFinder() {
        }
        PathFinder.find = function (map, startPos, endPos) {
            var _this = this;
            var pathMap = new Array();
            map.forEach(function (row) {
                pathMap.push(row.slice());
            });
            var currentPos = {
                row: startPos.row,
                col: startPos.col
            };
            var targetPos;
            var nextSteps = new Array();
            pathMap[currentPos.row][currentPos.col] = 0;
            var pathFound = false;
            while (true) {
                this.DIRECTIONS.forEach(function (direction) {
                    targetPos = {
                        row: currentPos.row + direction[0],
                        col: currentPos.col + direction[1]
                    };
                    if (_this.isContains(pathMap, targetPos) && pathMap[targetPos.row][targetPos.col] === true) {
                        pathMap[targetPos.row][targetPos.col] = pathMap[currentPos.row][currentPos.col] + 1;
                        nextSteps.push(targetPos);
                        if ((endPos && _this.isEqual(targetPos, endPos)) ||
                            (!endPos && _this.isExit(pathMap, targetPos))) {
                            endPos = targetPos;
                            pathFound = true;
                            return;
                        }
                    }
                });
                if (pathFound || nextSteps.length === 0) {
                    break;
                }
                else {
                    currentPos = nextSteps.shift();
                }
            }
            nextSteps.length = 0;
            if (!pathFound) {
                pathMap.length = 0;
                return [];
            }
            currentPos = endPos ? {
                row: endPos.row,
                col: endPos.col
            } : {
                row: startPos.row,
                col: startPos.col
            };
            var result = new Array();
            while (true) {
                result.push(currentPos);
                if (this.isEqual(currentPos, startPos)) {
                    break;
                }
                this.DIRECTIONS.forEach(function (direction) {
                    targetPos = {
                        row: currentPos.row + direction[0],
                        col: currentPos.col + direction[1]
                    };
                    if (_this.isContains(pathMap, targetPos)) {
                        var value = pathMap[targetPos.row][targetPos.col];
                        if (typeof value === "number" && value < pathMap[currentPos.row][currentPos.col]) {
                            currentPos = targetPos;
                            return;
                        }
                    }
                });
            }
            pathMap.length = 0;
            return result;
        };
        PathFinder.isContains = function (map, pos) {
            return (pos.row >= 0 && pos.row < map.length &&
                pos.col >= 0 && pos.col < map[pos.row].length);
        };
        PathFinder.isExit = function (map, pos) {
            return (pos.row === 0 || pos.row === map.length - 1 ||
                pos.col === 0 || (map.length > pos.row && pos.col === map[pos.row].length - 1));
        };
        PathFinder.isEqual = function (origin, target) {
            return (origin.row === target.row && origin.col === target.col);
        };
        PathFinder.DIRECTIONS = [
            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]
        ];
        return PathFinder;
    }());
    exports.PathFinder = PathFinder;
});
define("models/map.model", ["require", "exports", "utils/path-finder.util"], function (require, exports, path_finder_util_1) {
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
            var _a;
            this.WALL_SIGN = '#';
            this.EXIT_SIGN = '@';
            this.UP_SIGN = '^';
            this.DOWN_SIGN = '_';
            this.LEFT_SIGN = '<';
            this.RIGHT_SIGN = '>';
            this.DIRECTION_SIGNS = (_a = {},
                _a[this.UP_SIGN] = Direction.UP,
                _a[this.DOWN_SIGN] = Direction.DOWN,
                _a[this.LEFT_SIGN] = Direction.LEFT,
                _a[this.RIGHT_SIGN] = Direction.RIGHT,
                _a);
            this._map = [];
        }
        MapModel.prototype.init = function (mapText) {
            var _this = this;
            if (!mapText)
                return false;
            this.clear();
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
                            if (_this._playerPosition) {
                                console.log('Warning: Player position duplication!');
                            }
                            _this._playerPosition = {
                                row: i,
                                col: j,
                                direction: _this.DIRECTION_SIGNS[sign]
                            };
                        }
                        else if (sign === _this.EXIT_SIGN) {
                            if (_this._exitPosition) {
                                console.log('Warning: Exit position duplication!');
                            }
                            _this._exitPosition = {
                                row: i,
                                col: j
                            };
                        }
                    }
                });
            });
            if (!this._playerPosition) {
                var keys = Object.keys(__assign({}, this.DIRECTION_SIGNS));
                console.log("Error: Player position [" + keys + "] not found!");
                return false;
            }
            if (!this._exitPosition) {
                console.log("Warning: Exit position [" + this.EXIT_SIGN + "] not found!");
            }
            this._path = path_finder_util_1.PathFinder.find(this._map, {
                row: this._playerPosition.row,
                col: this._playerPosition.col
            }, this._exitPosition ? {
                row: this._exitPosition.row,
                col: this._exitPosition.col
            } : undefined);
            if (this._path.length === 0) {
                console.log('Error: Path not found!');
                return false;
            }
            return true;
        };
        MapModel.prototype.clear = function () {
            this._map = new Array();
            this._playerPosition = undefined;
            this._exitPosition = undefined;
        };
        Object.defineProperty(MapModel.prototype, "content", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapModel.prototype, "clone", {
            get: function () {
                var clone = new Array();
                this._map.forEach(function (row) {
                    clone.push(row.slice());
                });
                return clone;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapModel.prototype, "player", {
            get: function () {
                return this._playerPosition || {
                    row: 0,
                    col: 0,
                    direction: Direction.UP
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapModel.prototype, "exit", {
            get: function () {
                return this._exitPosition;
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
        Object.defineProperty(MapModel.prototype, "path", {
            get: function () {
                return this._path || [];
            },
            enumerable: true,
            configurable: true
        });
        return MapModel;
    }());
    exports.MapModel = MapModel;
});
define("services/map-edit.service", ["require", "exports", "services/controls.service", "models/map.model", "utils/injector.util"], function (require, exports, controls_service_1, map_model_1, injector_util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapEditService = /** @class */ (function () {
        function MapEditService() {
            this.DEFAULT_MAP = '#######\n#   #>#\n#   # #\n# # # #\n# #   #\n# #####';
            this._controlsService = injector_util_1.Injector.get(controls_service_1.ControlsService);
            this._map = new map_model_1.MapModel();
            this._gameTab = document.getElementById('game-tab');
            this._editTab = document.getElementById('edit-tab');
            this._editArea = document.getElementById('edit-area');
            this.loadDefaultMap();
            this._controlsService.subscribeEditClick(this.onEditClick.bind(this));
        }
        MapEditService.prototype.loadDefaultMap = function () {
            this._editArea.textContent = this.DEFAULT_MAP;
            this.toggleEditMode(false);
        };
        MapEditService.prototype.onEditClick = function () {
            this.toggleEditMode(!this._inEditMode);
        };
        MapEditService.prototype.toggleEditMode = function (value) {
            if (this._inEditMode === value) {
                return;
            }
            this._inEditMode = value;
            if (this._inEditMode) {
                this._controlsService.deactivateStartButton();
                this._controlsService.switchEditState(controls_service_1.EditStates.SAVE);
                this._gameTab.style.display = 'none';
                this._editTab.style.display = 'block';
            }
            else {
                if (this._map.init(this._editArea.value)) {
                    this._controlsService.activateStartButton();
                    this._controlsService.switchEditState(controls_service_1.EditStates.EDIT);
                    this._gameTab.style.display = 'block';
                    this._editTab.style.display = 'none';
                }
                else {
                    alert('Wrong configuration!');
                }
            }
        };
        Object.defineProperty(MapEditService.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        return MapEditService;
    }());
    exports.MapEditService = MapEditService;
});
define("services/logger.service", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoggerService = /** @class */ (function () {
        function LoggerService() {
            this._logArea = document.getElementById('log-area');
        }
        LoggerService.prototype.clear = function () {
            this._logArea.textContent = '';
        };
        LoggerService.prototype.log = function (message) {
            this._logArea.textContent = message + '\n' + this._logArea.value;
        };
        return LoggerService;
    }());
    exports.LoggerService = LoggerService;
});
define("views/map.view", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapView = /** @class */ (function () {
        function MapView() {
            this._mapArea = document.getElementById('map-area');
        }
        MapView.prototype.buildMap = function (map) {
        };
        MapView.prototype.clear = function () {
            this._mapArea.innerHTML = '';
        };
        return MapView;
    }());
    exports.MapView = MapView;
});
define("services/game.service", ["require", "exports", "services/controls.service", "services/logger.service", "services/map-edit.service", "utils/injector.util", "views/map.view"], function (require, exports, controls_service_2, logger_service_1, map_edit_service_1, injector_util_2, map_view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameService = /** @class */ (function () {
        function GameService() {
            this.STEP_TIME = 1000;
            this._controlsService = injector_util_2.Injector.get(controls_service_2.ControlsService);
            this._loggerService = injector_util_2.Injector.get(logger_service_1.LoggerService);
            this._mapService = injector_util_2.Injector.get(map_edit_service_1.MapEditService);
            this._mapView = injector_util_2.Injector.get(map_view_1.MapView);
            this._controlsService.subscribeStartClick(this.onStartClick.bind(this));
            this.togglePlayMode(false);
        }
        GameService.prototype.onStartClick = function () {
            this.togglePlayMode(!this._isGameStarted);
        };
        GameService.prototype.togglePlayMode = function (value) {
            if (this._isGameStarted === value) {
                return;
            }
            this._isGameStarted = value;
            if (this._isGameStarted) {
                this._loggerService.clear();
                this._loggerService.log('Game begins!');
                this._controlsService.deactivateEditButton();
                this._controlsService.switchStartState(controls_service_2.StartStates.PAUSE);
                this.nextStep();
            }
            else {
                this._controlsService.activateEditButton();
                this._controlsService.switchStartState(controls_service_2.StartStates.PLAY);
                if (this._timer) {
                    clearTimeout(this._timer);
                }
            }
        };
        GameService.prototype.nextStep = function () {
            var _this = this;
            this._timer = setTimeout(function () {
                // this._loggerService.log();
                _this.nextStep();
            }, this.STEP_TIME);
        };
        GameService.prototype.stopGame = function () {
            this.togglePlayMode(false);
        };
        return GameService;
    }());
    exports.GameService = GameService;
});
define("app", ["require", "exports", "services/controls.service", "services/map-edit.service", "services/logger.service", "services/game.service", "views/map.view", "utils/injector.util"], function (require, exports, controls_service_3, map_edit_service_2, logger_service_2, game_service_1, map_view_2, injector_util_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
            injector_util_3.Injector.inject(controls_service_3.ControlsService);
            injector_util_3.Injector.inject(map_edit_service_2.MapEditService);
            injector_util_3.Injector.inject(logger_service_2.LoggerService);
            injector_util_3.Injector.inject(map_view_2.MapView);
            injector_util_3.Injector.inject(game_service_1.GameService);
        }
        Main.prototype.init = function () {
        };
        return Main;
    }());
    var app = new Main();
    app.init();
});
