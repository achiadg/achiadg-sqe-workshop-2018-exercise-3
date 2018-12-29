import {parseCode} from './code-analyzer';
import * as flowchart from 'flowchart.js';
import * as esgraph from 'esgraph';
import {createGraphNodesLabels , makeGraphFine , makeGraphMerged} from './graph';
import {parseArgs , createStringOfDeclerations} from './handlrArgs';
import {createGraphFromStr} from './graphConverter';
import {stringAfterChanges} from './nodesUpdater';
import {getNodesToPrint} from './evaluator';
import $ from 'jquery';

const configs =  {'flowstate' : {'request' : {'fill' : '#32CD32'}, 'Merge' : {'fill': 'green'}}};

$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        document.getElementById('chart').innerHTML = '';
        let codeToParse = $('#inputPlaceHolder').val();
        let parsedCode = parseCode(codeToParse);
        $('#outputCFG').empty();
        let argsAfterParse = parseArgs($('#inputArgs').val());
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        $('#outputCFG').val(graphToShow);
        showGraph(graphToShow);
    });
});

function showGraph(graphToShow) {
    let afterFlowChart = flowchart.parse(graphToShow);
    afterFlowChart.drawSVG('chart',configs);
}

