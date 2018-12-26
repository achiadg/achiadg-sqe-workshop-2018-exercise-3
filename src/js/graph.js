export {createGraphNodesLabels , makeGraphFine , makeGraphMerged};
import {createLabelsInNodes} from './nodesUpdater';

function createGraphNodesLabels(cfg) {
    return createLabelsInNodes(cfg);
}

function makeGraphFine(graph) {
    for(let i=1;i<graph[2].length-1;i++) {
        if (graph[2][i].label.startsWith('return '))
            delete graph[2][i].normal;
        delete graph[2][i].exception;
    }
    graph[2].splice(0,1);
    graph[2].splice(graph[2].length-1,graph[2].length);
    let result = [];
    for(let i=0;i<graph[2].length;i++){
        if(Object.keys(graph[2][i]).length !== 0){
            result.push(graph[2][i]);
        }
    }
    graph[2] = result;
    return graph;
}

function makeGraphMerged(graph) {
    graph = mergeAllRelevantNodes(graph);
    graph[2] = graph[2].filter(element => Object.keys(element).length !== 0);
    return graph;
}

function mergeAllRelevantNodes(graph) {
    let i;
    for(i=0;i<graph[2].length;i++){
        if(graph[2][i].normal && graph[2][i].normal.normal && graph[2][i].normal.prev.length === 1){
            changeNodePointers(graph[2][i]);
            delete graph[2][i];
        }
    }
    return graph;
}

function changeNodePointers(node) {
    node.normal.label = node.label + '\n' + node.normal.label;
    for(let j=0;j< node.prev.length;j++) {
        if(node.prev[j].normal)
            node.prev[j].normal = node.normal;
        else if(node.prev[j].true === node)
            node.prev[j].true = node.normal;
        else
            node.prev[j].false = node.normal;
    }
}