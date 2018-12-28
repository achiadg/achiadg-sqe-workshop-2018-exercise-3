import {parseCode} from './code-analyzer';
import * as flowchart from 'flowchart.js';
import * as esgraph from 'esgraph';
import {createGraphNodesLabels , makeGraphFine , makeGraphMerged} from './graph';
import {parseArgs} from './params';
import {createGraphFromStr} from './graphConverter';
import $ from 'jquery';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        document.getElementById('chart').innerHTML = '';
        let codeToParse = $('#inputPlaceHolder').val();
        let parsedCode = parseCode(codeToParse);
        $('#outputCFG').empty();
        let argsAfterParse = parseArgs($('#inputArgs').val());
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        $('#outputCFG').val(cfgInStringOrient);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        let afterFlowChart = flowchart.parse(graphToShow);
        afterFlowChart.drawSVG('chart');
    });
});