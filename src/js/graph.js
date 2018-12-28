export {createGraphNodesLabels , makeGraphFine , makeGraphMerged};
import {createLabelsInNodes} from './nodesUpdater';

function createGraphNodesLabels(cfg,strOfParamsAndValues) {
    return createLabelsInNodes(cfg,strOfParamsAndValues);
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
    let deleteIndexex = [];
    let min = graph[2].length;
    for(i=0;i<graph[2].length;i++){
        if(checkCondOfUpdateNodes(graph,i)){
            min = checkUpdateMin(i , min);
            changeNodePointers(graph[2][min], graph[2][i]);
            deleteIndexex.push(i);
        }
        else{
            min = graph[2].length;
        }
    }
    graph = deleteAllIndexes(deleteIndexex,graph);
    return graph;
}

function checkCondOfUpdateNodes(graph,i) {
    if(hasNormal(graph,i) && graph[2][i].normal.prev.length === 1 && (graph[2][i].parent === graph[2][i].normal.parent || !graph[2][i].parent)){
        return true;
    }else{
        return false;
    }
}

function hasNormal(graph,i) {
    if(graph[2][i].normal && graph[2][i].normal.normal){
        return true;
    }else{
        return false;
    }
}

function checkUpdateMin(i , min) {
    if(i < min){
        min = i;
    }
    return min;
}

function deleteAllIndexes(deleteIndexex,graph) {
    let i;
    for(i=0;i<deleteIndexex.length;i++){
        delete graph[2][deleteIndexex[i]];
    }
    return graph;
}

function changeNodePointers(prev, node) {
    node.normal.label = node.label + '\n' + node.normal.label;
    for(let j=0;j< prev.prev.length;j++) {
        if(prev.prev[j].normal === node)
            prev.prev[j].normal = node.normal;
        else if(prev.prev[j].true === node)
            prev.prev[j].true = node.normal;
        else
            prev.prev[j].false = node.normal;
    }
}