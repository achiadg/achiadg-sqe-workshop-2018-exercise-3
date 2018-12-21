import {parseCode} from './code-analyzer';
import {createElementsResult} from './parser';
import {parseArgs} from './params';
import $ from 'jquery';


$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        let codeToParse = $('#inputPlaceHolder').val();
        let parsedCode = parseCode(codeToParse);
        let argsValues = parseArgs($('#inputArgs').val());
        let elements = createElementsResult(parsedCode);
    });
});