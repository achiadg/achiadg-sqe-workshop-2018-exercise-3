import {parseCode} from './code-analyzer';
import * as esgraph from 'esgraph';
import {createGraphNodesLabels , makeGraphFine , makeGraphMerged} from './graph';
import {parseArgs} from './params';
import $ from 'jquery';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#inputPlaceHolder').val();
        let parsedCode = parseCode(codeToParse);
        $('#outputCFG').empty();
        let argsAfterParse = parseArgs($('#inputArgs').val());
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        const cfgStr = esgraph.dot(graphAfterMerged);
        $('#outputCFG').val(cfgStr);
    });
});