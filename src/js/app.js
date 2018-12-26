import {parseCode} from './code-analyzer';
import * as esgraph from 'esgraph';
import {createGraph} from './graph';
import {parseArgs} from './params';
import $ from 'jquery';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#inputPlaceHolder').val();
        let parsedCode = parseCode(codeToParse);
        let argsAfterParse = parseArgs($('#inputArgs').val());
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraph(graph);
    });
});