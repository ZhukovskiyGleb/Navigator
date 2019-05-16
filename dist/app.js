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
define("models/map.model", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Direction;
    (function (Direction) {
        Direction["UP"] = "Up";
        Direction["DOWN"] = "Down";
        Direction["LEFT"] = "Left";
        Direction["RIGHT"] = "Right";
    })(Direction = exports.Direction || (exports.Direction = {}));
    var MapModel = /** @class */ (function () {
        function MapModel() {
            var _a;
            this.WALL_SIGN = '#';
            this.EXIT_SIGN = '@';
            this.UP_SIGN = '^';
            this.DOWN_SIGN = 'v';
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
            if (!mapText || mapText.length === 0)
                return false;
            this.clear();
            var maxRowLength = 0;
            mapText.split('\n')
                .forEach(function (row, i) {
                _this._map[i] = new Array();
                maxRowLength = Math.max(maxRowLength, row.length);
                if (row.length > 0) {
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
                }
            });
            this._map.forEach(function (row) {
                while (row.length < maxRowLength) {
                    row.push(true);
                }
            });
            if (!this._playerPosition) {
                var keys = Object.keys(__assign({}, this.DIRECTION_SIGNS));
                console.log("Error: Player position [" + keys + "] not found!");
                return false;
            }
            if (!this._exitPosition) {
                console.log("Warning: Exit position [" + this.EXIT_SIGN + "] not found!");
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
        return MapModel;
    }());
    exports.MapModel = MapModel;
});
define("utils/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isContains(map, pos) {
        return (pos.row >= 0 && pos.row < map.length &&
            pos.col >= 0 && pos.col < map[pos.row].length);
    }
    exports.isContains = isContains;
    function isExit(map, pos) {
        return (pos.row === 0 || pos.row === map.length - 1 ||
            pos.col === 0 || (map.length > pos.row && pos.col === map[pos.row].length - 1));
    }
    exports.isExit = isExit;
    function isEqual(origin, target) {
        return (origin.row === target.row && origin.col === target.col);
    }
    exports.isEqual = isEqual;
});
define("utils/path-finder.util", ["require", "exports", "utils/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PathFinder = /** @class */ (function () {
        function PathFinder() {
        }
        PathFinder.find = function (map, startPos, endPos) {
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
                pathFound = this.DIRECTIONS.some(function (direction) {
                    targetPos = {
                        row: currentPos.row + direction[0],
                        col: currentPos.col + direction[1]
                    };
                    if (utils_1.isContains(pathMap, targetPos) && pathMap[targetPos.row][targetPos.col] === true) {
                        pathMap[targetPos.row][targetPos.col] = pathMap[currentPos.row][currentPos.col] + 1;
                        nextSteps.push(targetPos);
                        if ((endPos && utils_1.isEqual(targetPos, endPos)) ||
                            (!endPos && utils_1.isExit(pathMap, targetPos))) {
                            endPos = targetPos;
                            return true;
                        }
                    }
                    return false;
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
                if (utils_1.isEqual(currentPos, startPos)) {
                    break;
                }
                result.unshift(currentPos);
                this.DIRECTIONS.some(function (direction) {
                    targetPos = {
                        row: currentPos.row + direction[0],
                        col: currentPos.col + direction[1]
                    };
                    if (utils_1.isContains(pathMap, targetPos)) {
                        var value = pathMap[targetPos.row][targetPos.col];
                        if (typeof value === "number" && value < pathMap[currentPos.row][currentPos.col]) {
                            currentPos = targetPos;
                            return true;
                        }
                    }
                    return false;
                });
            }
            pathMap.length = 0;
            return result;
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
define("views/map.view", ["require", "exports", "models/map.model"], function (require, exports, map_model_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapView = /** @class */ (function () {
        function MapView() {
            var _a;
            this.MAX_CELL_SIZE = 50;
            this.STEPS_IMG = 'images/steps.png';
            this.ARROW_IMG = 'images/arrow.png';
            this.DIRECTION_TRANSFORMS = (_a = {},
                _a[map_model_1.Direction.UP] = '',
                _a[map_model_1.Direction.DOWN] = 'transform: rotate(180deg)',
                _a[map_model_1.Direction.LEFT] = 'transform: rotate(270deg)',
                _a[map_model_1.Direction.RIGHT] = 'transform: rotate(90deg)',
                _a);
            this._mapGrid = [];
            this._size = 0;
            this._mapArea = document.getElementById('map-area');
        }
        MapView.prototype.buildMap = function (map, playerPos) {
            var _this = this;
            if (!map || map.length === 0) {
                return;
            }
            this.clear();
            this._size = Math.min(Math.floor(window.innerWidth / map[0].length / 2), this.MAX_CELL_SIZE);
            map.forEach(function (row, i) {
                var rowDiv = document.createElement('div');
                rowDiv.className = 'grid-row';
                _this._mapGrid[i] = new Array();
                row.forEach(function (isEmpty, j) {
                    var cellDiv = document.createElement('div');
                    cellDiv.className = "grid-cell " + (!isEmpty ? 'grid-wall' : '');
                    cellDiv.style.width = _this._size + "px";
                    cellDiv.style.height = _this._size + "px";
                    rowDiv.appendChild(cellDiv);
                    _this._mapGrid[i][j] = cellDiv;
                });
                _this._mapArea.appendChild(rowDiv);
            });
            this.movePlayer(playerPos, false);
            this._mapArea.style.width = map.length ? (map[0].length) * this._size + 'px' : '0px';
        };
        MapView.prototype.clear = function () {
            this._mapGrid = new Array();
            this._mapArea.innerHTML = '';
        };
        MapView.prototype.updateMap = function () {
            var _this = this;
            this._mapGrid.forEach(function (row, i) {
                row.forEach(function (div, j) {
                    if (!_this._playerPosition || _this._playerPosition.row !== i || _this._playerPosition.col !== j)
                        div.innerHTML = '';
                });
            });
        };
        MapView.prototype.movePlayer = function (playerPos, leaveStep) {
            if (leaveStep === void 0) { leaveStep = true; }
            var cell;
            if (this._playerPosition && (this._playerPosition.row != playerPos.row || this._playerPosition.col != playerPos.col)) {
                cell = this._mapGrid[this._playerPosition.row][this._playerPosition.col];
                if (leaveStep)
                    cell.innerHTML = this.getImage(this.STEPS_IMG, .5);
                else
                    cell.innerHTML = '';
            }
            this._playerPosition = {
                row: playerPos.row,
                col: playerPos.col,
                direction: playerPos.direction
            };
            cell = this._mapGrid[this._playerPosition.row][this._playerPosition.col];
            cell.innerHTML = this.getImage(this.ARROW_IMG);
        };
        MapView.prototype.getImage = function (path, opacity) {
            if (opacity === void 0) { opacity = 1; }
            return "<img src=\"" + path + "\" \n                width=\"" + this._size + "\" height=\"" + this._size + "\" \n                style=\"opacity: opacity; " + (this._playerPosition ?
                this.DIRECTION_TRANSFORMS[this._playerPosition.direction]
                : '') + "\">";
        };
        return MapView;
    }());
    exports.MapView = MapView;
});
define("services/map-edit.service", ["require", "exports", "services/controls.service", "models/map.model", "utils/injector.util", "utils/path-finder.util", "views/map.view"], function (require, exports, controls_service_1, map_model_2, injector_util_1, path_finder_util_1, map_view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var MapEditService = /** @class */ (function () {
        function MapEditService() {
            this.DEFAULT_MAP = '##### #\n' +
                '# # # #\n' +
                '#   # #\n' +
                '# # # #\n' +
                '#v#   #\n' +
                '#######';
            this._controlsService = injector_util_1.Injector.get(controls_service_1.ControlsService);
            this._mapView = injector_util_1.Injector.get(map_view_1.MapView);
            this._map = new map_model_2.MapModel();
            this._gameTab = document.getElementById('game-tab');
            this._editTab = document.getElementById('edit-tab');
            this._speedControl = document.getElementById('speed-control');
            this._editArea = document.getElementById('edit-area');
            this._editArea.addEventListener('paste', this.updateEditAreaSize.bind(this));
            this._editArea.addEventListener('keyup', this.updateEditAreaSize.bind(this));
            window.addEventListener('resize', this.updateEditAreaSize.bind(this));
            this.loadDefaultMap();
            this._controlsService.subscribeEditClick(this.onEditClick.bind(this));
        }
        MapEditService.prototype.updateEditAreaSize = function () {
            if (!this._editArea.value || this._editArea.value.length === 0) {
                return;
            }
            var sizes = this._editArea.value.split('\n');
            var h = sizes.length;
            var w = sizes.reduce(function (max, row) {
                return Math.max(max, row.length);
            }, 0);
            var size = Math.min(Math.floor(this._editArea.offsetWidth / w), Math.floor(this._editArea.offsetHeight / h));
            this._editArea.style.fontSize = size + 'px';
        };
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
                this._speedControl.style.display = 'none';
                this._editTab.style.display = 'block';
                this.updateEditAreaSize();
            }
            else {
                if (this._map.init(this._editArea.value) && this.findPath()) {
                    this._controlsService.activateStartButton();
                    this._controlsService.switchEditState(controls_service_1.EditStates.EDIT);
                    this._gameTab.style.display = 'block';
                    this._speedControl.style.display = 'block';
                    this._editTab.style.display = 'none';
                    this._mapView.buildMap(this._map.content, this._map.player);
                }
                else {
                    alert('Wrong configuration!');
                }
            }
        };
        MapEditService.prototype.findPath = function () {
            this._path = path_finder_util_1.PathFinder.find(this._map.content, {
                row: this._map.player.row,
                col: this._map.player.col
            }, this._map.exit ? {
                row: this._map.exit.row,
                col: this._map.exit.col
            } : undefined);
            if (this._path.length === 0) {
                console.log('Error: Path not found!');
                return false;
            }
            return true;
        };
        Object.defineProperty(MapEditService.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapEditService.prototype, "pathClone", {
            get: function () {
                return this._path ? this._path.slice() : [];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MapEditService.prototype, "playerClone", {
            get: function () {
                return {
                    row: this._map.player.row,
                    col: this._map.player.col,
                    direction: this._map.player.direction
                };
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
define("services/game.service", ["require", "exports", "services/controls.service", "services/logger.service", "services/map-edit.service", "utils/injector.util", "views/map.view", "models/map.model", "utils/utils"], function (require, exports, controls_service_2, logger_service_1, map_edit_service_1, injector_util_2, map_view_2, map_model_3, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameService = /** @class */ (function () {
        function GameService() {
            var _this = this;
            var _a;
            this.GAME_BEGIN_MESSAGE = 'Game begins!';
            this.AMOUNT_PLACEHOLDER = '{amount}';
            this.MOVE_FORWARD_MESSAGE = "Move forward " + this.AMOUNT_PLACEHOLDER + " steps.";
            this.TURN_LEFT_MESSAGE = "Turn left and";
            this.TURN_RIGHT_MESSAGE = "Turn right and";
            this.TURN_AROUND_MESSAGE = "Turn around and";
            this.EXIT_MESSAGE = "Exit!";
            this.DEFAULT_STEP_TIME = 1000;
            this.DIRECTION_ANGLES = (_a = {},
                _a[map_model_3.Direction.UP] = 0,
                _a[map_model_3.Direction.DOWN] = 180,
                _a[map_model_3.Direction.LEFT] = -90,
                _a[map_model_3.Direction.RIGHT] = 90,
                _a);
            this.ANGLES_MAP = [
                { angle: 180, power: 2, msg: this.TURN_AROUND_MESSAGE },
                { angle: 90, power: 1, msg: this.TURN_RIGHT_MESSAGE },
                { angle: -90, power: -1, msg: this.TURN_LEFT_MESSAGE }
            ];
            this.DIRECTION_SEQUENCE = [
                map_model_3.Direction.UP, map_model_3.Direction.RIGHT, map_model_3.Direction.DOWN, map_model_3.Direction.LEFT
            ];
            this._controlsService = injector_util_2.Injector.get(controls_service_2.ControlsService);
            this._loggerService = injector_util_2.Injector.get(logger_service_1.LoggerService);
            this._mapService = injector_util_2.Injector.get(map_edit_service_1.MapEditService);
            this._mapView = injector_util_2.Injector.get(map_view_2.MapView);
            this._path = [];
            this._speedControl = document.getElementById('speed-input');
            this._speedControl.valueAsNumber = this.DEFAULT_STEP_TIME;
            this._speedControl.addEventListener('blur', function () {
                if (_this._speedControl.valueAsNumber > _this.DEFAULT_STEP_TIME) {
                    _this._speedControl.valueAsNumber = _this.DEFAULT_STEP_TIME;
                }
                if (_this._speedControl.valueAsNumber < 0) {
                    _this._speedControl.valueAsNumber = 0;
                }
            });
            this._controlsService.subscribeStartClick(this.onStartClick.bind(this));
            this.stopGame();
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
                this.startGame();
                this._controlsService.deactivateEditButton();
                this._controlsService.switchStartState(controls_service_2.StartStates.STOP);
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
        GameService.prototype.startGame = function () {
            this._loggerService.clear();
            this._mapView.updateMap();
            this._player = this._mapService.playerClone;
            this._mapView.movePlayer(this._player, false);
            this._path = this._mapService.pathClone;
            this._loggerService.log(this.GAME_BEGIN_MESSAGE);
        };
        GameService.prototype.nextStep = function () {
            var _this = this;
            this._timer = setTimeout(function () {
                var targetCell;
                if (_this._player) {
                    var steps = 0;
                    var targetAngle = 0;
                    do {
                        targetCell = _this._path[steps];
                        targetAngle = _this.calculateAngle(targetCell);
                        if (targetAngle === 0) {
                            steps++;
                        }
                    } while (targetAngle === 0 && _this._path.length > steps);
                    if (steps > 0) {
                        targetCell = _this._path[steps - 1];
                        _this._loggerService.log(_this.MOVE_FORWARD_MESSAGE.replace(_this.AMOUNT_PLACEHOLDER, steps.toString()));
                        _this.switchPosition(targetCell);
                    }
                    else {
                        _this._loggerService.log(_this.getTurnMessage(targetAngle));
                        _this.switchDirection(targetAngle);
                    }
                    if (utils_2.isEqual(_this._player, targetCell)) {
                        steps = Math.max(1, steps);
                        while (steps > 0) {
                            _this._mapView.movePlayer(__assign({}, _this._path[0], { direction: _this._player.direction }));
                            _this._path.shift();
                            steps--;
                        }
                    }
                    else
                        _this._mapView.movePlayer(_this._player);
                }
                if (_this._path.length > 0) {
                    _this.nextStep();
                }
                else {
                    _this._loggerService.log(_this.EXIT_MESSAGE);
                    _this.stopGame();
                }
            }, this._speedControl.valueAsNumber);
        };
        GameService.prototype.stopGame = function () {
            this.togglePlayMode(false);
        };
        GameService.prototype.calculateAngle = function (targetPos) {
            if (this._player) {
                var row = targetPos.row - this._player.row;
                var col = targetPos.col - this._player.col;
                var angle = Math.atan2(row, col) * 180 / Math.PI + 90;
                if (angle > 90) {
                    angle -= 360;
                }
                angle -= this.DIRECTION_ANGLES[this._player.direction];
                if (angle < -90) {
                    angle += 360;
                }
                return angle;
            }
            return 0;
        };
        GameService.prototype.switchPosition = function (target) {
            if (this._player) {
                this._player.row = target.row;
                this._player.col = target.col;
            }
        };
        GameService.prototype.switchDirection = function (angle) {
            if (this._player) {
                var position = this.DIRECTION_SEQUENCE.indexOf(this._player.direction);
                position = position + this.getTurnPower(angle);
                if (position >= this.DIRECTION_SEQUENCE.length)
                    position -= this.DIRECTION_SEQUENCE.length;
                if (position < 0)
                    position += this.DIRECTION_SEQUENCE.length;
                this._player.direction = this.DIRECTION_SEQUENCE[position];
            }
        };
        GameService.prototype.getTurnPower = function (angle) {
            var power = 0;
            this.ANGLES_MAP.some(function (value) {
                if (angle >= value.angle) {
                    power = value.power;
                    return true;
                }
                return false;
            });
            return power;
        };
        GameService.prototype.getTurnMessage = function (angle) {
            var result = 'Fail!';
            this.ANGLES_MAP.some(function (value) {
                if (angle >= value.angle) {
                    result = value.msg;
                    return true;
                }
                return false;
            });
            return result;
        };
        return GameService;
    }());
    exports.GameService = GameService;
});
define("app", ["require", "exports", "services/controls.service", "services/map-edit.service", "services/logger.service", "services/game.service", "views/map.view", "utils/injector.util"], function (require, exports, controls_service_3, map_edit_service_2, logger_service_2, game_service_1, map_view_3, injector_util_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Main = /** @class */ (function () {
        function Main() {
            injector_util_3.Injector.inject(controls_service_3.ControlsService);
            injector_util_3.Injector.inject(map_view_3.MapView);
            injector_util_3.Injector.inject(map_edit_service_2.MapEditService);
            injector_util_3.Injector.inject(logger_service_2.LoggerService);
            injector_util_3.Injector.inject(game_service_1.GameService);
        }
        Main.prototype.init = function () {
        };
        return Main;
    }());
    var app = new Main();
    app.init();
});
