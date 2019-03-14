import GetChessData from '../chess/GetChessData.js';
import GetCost from './GetCost.js';
import IsInCone from './IsInCone.js';
import IsInLOS from './IsInLOS.js';
import LOS from './LOS.js';
import FindFOV from './FindFOV.js';
import CONST from './const.js';
import DegToRad from '../../utils/math/DegToRad.js';
import AngleNormalize from '../../utils/math/angle/Normalize.js';
import GetValue from '../../utils/object/GetValue.js';

const BLOCKER = CONST.BLOCKER;
const INFINITY = CONST.INFINITY;

class FieldOfView {
    constructor(gameObject, config) {
        this.gameObject = gameObject;
        this.chessData = GetChessData(gameObject);
        this.resetFromJSON(config);
    }

    resetFromJSON(o) {
        var costCallback = GetValue(o, 'costCallback', undefined);
        var costCallbackScope = GetValue(o, 'costCallbackScope', undefined);
        if (costCallback === undefined) {
            costCallback = GetValue(o, 'cost', 0);
        }
        this.setFaceDirection(GetValue(o, 'face', 0));
        this.setConeMode(GetValue(o, 'coneMode', 0));
        this.setCone(GetValue(o, 'cone', undefined));
        this.setOccupiedTest(GetValue(o, 'occupiedTest', false));
        this.setBlockerTest(GetValue(o, 'blockerTest', false));
        this.setEdgeBlockerTest(GetValue(o, 'edgeBlockerTest', false));
        this.setCostFunction(costCallback, costCallbackScope);
        return this;
    }

    boot() {
        if (this.gameObject.on) { // oops, bob object does not have event emitter
            this.gameObject.on('destroy', this.destroy, this);
        }
    }

    shutdown() {
        this.gameObject = undefined;
        this.chessData = undefined;
        return this;
    }

    destroy() {
        this.shutdown();
        return this;
    }

    get face() {
        return this._face;
    }

    set face(direction) {
        direction = this.board.grid.directionNormalize(direction);
        this._face = direction;
        if (this.coneMode === 0) { // Direction
            // Do nothing
        } else { // Angle
            var angle = this.board.angleToward(this.chessData.tileXYZ, direction); // -PI~PI
            this.faceAngle = AngleNormalize(angle); // 0~2PI
        }
    }

    setFaceDirection(direction) {
        this.face = direction;
        return this;
    }

    get cone() {
        return this._cone;
    }

    set cone(value) {
        this._cone = value;

        if (value !== undefined) {
            if (this.coneMode === 0) { // Direction
                this.halfConeRad = value / 2;
            } else { // Angle
                this.halfConeRad = DegToRad(value / 2);
            }
        }
    }

    setConeMode(mode) {
        if (typeof (mode) === 'string') {
            mode = CONEMODE[mode];
        }
        this.coneMode = mode;
        return this;
    }

    setCone(value) {
        this.cone = value;
        return this;
    }

    setOccupiedTest(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.occupiedTest = enable;
        return this;
    }

    setBlockerTest(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.blockerTest = enable;
        return this;
    }

    setEdgeBlockerTest(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.edgeBlockerTest = enable;
        return this;
    }

    setCostFunction(callback, scope) {
        this.costCallback = callback;
        this.costCallbackScope = scope;
        return this;
    }

    get BLOCKER() {
        return BLOCKER;
    }

    get INFINITY() {
        return INFINITY;
    }

    get board() {
        return this.chessData.board;
    }
}

const CONEMODE = {
    direction: 0,
    angle: 1,
};

var methods = {
    getCost: GetCost,
    isInCone: IsInCone,
    isInLOS: IsInLOS,
    LOS: LOS,
    findFOV: FindFOV,
};
Object.assign(
    FieldOfView.prototype,
    methods
);

export default FieldOfView;