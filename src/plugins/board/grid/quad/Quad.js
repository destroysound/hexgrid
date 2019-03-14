import Quad from '../../../utils/grid/quad/Quad.js';
import SaveOrigin from '../utils/SaveOrigin.js';
import RestoreOrigin from '../utils/RestoreOrigin.js';
import GetNeighborTileX from '../../../utils/grid/quad/GetNeighborTileX.js';
import GetNeighborTileY from '../../../utils/grid/quad/GetNeighborTileY.js';
import GetNeighborTileDirection from '../../../utils/grid/quad/GetNeighborTileDirection.js';
import GetOppositeDirection from '../../../utils/grid/quad/GetOppositeDirection.js';
import Offset from '../../../utils/grid/quad/Offset.js';
import Rotate from '../../../utils/grid/quad/Rotate.js';
import GetDistance from '../../../utils/grid/quad/GetDistance.js';
import DirectionBetween from '../../../utils/grid/quad/DirectionBetween.js';
import DirectionNormalize from '../utils/DirectionNormalize.js';
import GetValue from '../../../utils/object/GetValue.js';

import GetGridPoints from './GetGridPoints.js';

class QuadGrid extends Quad {
    constructor(config) {
        super(config);
    }

    resetFromJSON(o) {
        super.resetFromJSON(o);
        this.directions = 4; // Faces
    }

    // Direction of neighbors
    get allDirections() {
        return (this.directions === 4) ? ALLDIR4 : ALLDIR8;
    }

    // Board-match
    get halfDirections() {
        return (this.directions === 4) ? HALFDIR4 : HALFDIR8;
    }

    // setOriginPosition
    // setCellSize
    // setType
    // getWorldX
    // getWorldY
    // getTileX
    // getTileY
    // getGridPolygon        
}

const ALLDIR4 = [0, 1, 2, 3];
const ALLDIR8 = [0, 1, 2, 3, 4, 5, 6, 7];
const HALFDIR4 = [0, 1];
const HALFDIR8 = [0, 1, 4, 5];

var methods = {
    saveOrigin: SaveOrigin,
    restoreOrigin: RestoreOrigin,
    getNeighborTileX: GetNeighborTileX,
    getNeighborTileY: GetNeighborTileY,
    getNeighborTileDirection: GetNeighborTileDirection,
    getOppositeDirection: GetOppositeDirection,
    offset: Offset,
    rotate: Rotate,
    getDistance: GetDistance,
    directionBetween: DirectionBetween,
    directionNormalize: DirectionNormalize,
    getGridPoints: GetGridPoints,
}
Object.assign(
    QuadGrid.prototype,
    methods
);

const DIRMODE = {
    '4dir': 4,
    '8dir': 8
}

export default QuadGrid;