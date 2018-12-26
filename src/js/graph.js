export {createGraph};
import {createLabelsInNodes} from './nodesUpdater';

function createGraph(cfg) {
    cfg = createLabelsInNodes(cfg);
}