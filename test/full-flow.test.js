/* eslint-disable max-lines-per-function */
import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
import * as esgraph from 'esgraph';
import {createGraphNodesLabels , makeGraphFine , makeGraphMerged} from '../src/js/graph';
import {parseArgs , createStringOfDeclerations} from '../src/js/handlrArgs';
import {createGraphFromStr} from '../src/js/graphConverter';
import {stringAfterChanges} from '../src/js/nodesUpdater';
import {getNodesToPrint,indexesToPrint} from '../src/js/evaluator';


describe('full flow test no indexes 1', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="b < z"]\n' +
            'n2 [label="c = c + 5"]\n' +
            'n3 [label="return c"]\n' +
            'n4 [label="b < z * 2"]\n' +
            'n5 [label="c = c + x + 5"]\n' +
            'n6 [label="c = c + z + 5"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n4 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n5 -> n3 []\n' +
            'n6 -> n3 []\n'
        );
    });
});

describe('full flow test with indexes 1', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,4,5,3]);
    });
});

describe('full flow test with graph 1', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'b < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = c + 5\n' +
            'n3=>operation: node-number: 4\n' +
            'return c|request\n' +
            'n4=>condition: node-number: 5\n' +
            'b < z * 2|request\n' +
            'n5=>operation: node-number: 6\n' +
            'c = c + x + 5|request\n' +
            'n6=>operation: node-number: 7\n' +
            'c = c + z + 5\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            '\n' +
            'n0->n1\n' +
            'n1(yes)->n2\n' +
            'n1(no)->n4\n' +
            'n2->node1\n' +
            'node1->n3\n' +
            'n4(yes)->n5\n' +
            'node1->n3\n' +
            'n4(no)->n6\n' +
            'node1->n3\n' +
            'n5->node1\n' +
            'node1->n3\n' +
            'n6->node1\n' +
            'node1->n3\n\n');
    });
});

describe('full flow test no indexes 2', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,1,0');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="a < z"]\n' +
            'n2 [label="c = a + b\n' +
            'z = c * 2\n' +
            'a++"]\n' +
            'n3 [label="return z"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n3 [label="false"]\n' +
            'n2 -> n1 []\n'
        );
    });
});

describe('full flow test with indexes 2', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,1,0');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,3]);
    });
});

describe('full flow test no indexes 2', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < z) {\n' +
            '       c = a + b;\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,1,0');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow,'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'a < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = a + b\n' +
            'z = c * 2\n' +
            'a++\n' +
            'n3=>operation: node-number: 4\n' +
            'return z|request\n' +
            'node1=>start: Merge|Merge\n' +
            '\n' +
            'n0->node1\n' +
            'node1->n1\n' +
            'n1(yes)->n2\n' +
            'node1->n1\n' +
            'n1(no)->n3\n' +
            'node1->n1\n' +
            'n2->node1\n' +
            'node1->n1\n\n'
        );
    });
});

describe('full flow test no indexes 3', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        c++;\n' +
            '        a++;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        b++;\n' +
            '        z++;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        e++;\n' +
            '        p++;\n' +
            '    }\n' +
            '    m = n;\n' +
            '    m = n+1;\n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="b < z"]\n' +
            'n2 [label="c = c + 5\n' +
            'c++\n' +
            'a++"]\n' +
            'n3 [label="m = n\n' +
            'm = n + 1"]\n' +
            'n4 [label="return c"]\n' +
            'n5 [label="b < z * 2"]\n' +
            'n6 [label="c = c + x + 5\n' +
            'b++\n' +
            'z++"]\n' +
            'n7 [label="c = c + z + 5\n' +
            'e++\n' +
            'p++"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n5 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 []\n' +
            'n5 -> n6 [label="true"]\n' +
            'n5 -> n7 [label="false"]\n' +
            'n6 -> n3 []\n' +
            'n7 -> n3 []\n'
        );
    });
});

describe('full flow test with indexes 3', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        c++;\n' +
            '        a++;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        b++;\n' +
            '        z++;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        e++;\n' +
            '        p++;\n' +
            '    }\n' +
            '    m = n;\n' +
            '    m = n+1;\n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,5,6,3,4]);
    });
});

describe('full flow test with graph 3', () => {
    it('is parsing an args just numbers', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        c++;\n' +
            '        a++;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '        b++;\n' +
            '        z++;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '        e++;\n' +
            '        p++;\n' +
            '    }\n' +
            '    m = n;\n' +
            '    m = n+1;\n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'b < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = c + 5\n' +
            'c++\n' +
            'a++\n' +
            'n3=>operation: node-number: 4\n' +
            'm = n\n' +
            'm = n + 1|request\n' +
            'n4=>operation: node-number: 5\n' +
            'return c|request\n' +
            'n5=>condition: node-number: 6\n' +
            'b < z * 2|request\n' +
            'n6=>operation: node-number: 7\n' +
            'c = c + x + 5\n' +
            'b++\n' +
            'z++|request\n' +
            'n7=>operation: node-number: 8\n' +
            'c = c + z + 5\n' +
            'e++\n' +
            'p++\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            '\n' +
            'n0->n1\n' +
            'n1(yes)->n2\n' +
            'n1(no)->n5\n' +
            'n2->node1\n' +
            'node1->n3\n' +
            'n3->n4\n' +
            'node1->n3\n' +
            'n5(yes)->n6\n' +
            'node1->n3\n' +
            'n5(no)->n7\n' +
            'node1->n3\n' +
            'n6->node1\n' +
            'node1->n3\n' +
            'n7->node1\n' +
            'node1->n3\n\n');
    });
});

describe('full flow test no indexes 4', () => {
    it('if inside if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,0,2');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="b < z"]\n' +
            'n2 [label="c = c + 5"]\n' +
            'n3 [label="a < b"]\n' +
            'n4 [label="c = c + 7\n' +
            'c++"]\n' +
            'n5 [label="b = a + y"]\n' +
            'n6 [label="return c"]\n' +
            'n7 [label="true"]\n' +
            'n8 [label="c--"]\n' +
            'n9 [label="b = 6"]\n' +
            'n10 [label="b < z * 2"]\n' +
            'n11 [label="c = c + x + 5"]\n' +
            'n12 [label="c = c + z + 5"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n10 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n7 [label="false"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n5 []\n' +
            'n9 -> n5 []\n' +
            'n10 -> n11 [label="true"]\n' +
            'n10 -> n12 [label="false"]\n' +
            'n11 -> n6 []\n' +
            'n12 -> n6 []\n'
        );
    });
});

describe('full flow test with indexes 4', () => {
    it('if inside if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,0,2');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,2,3,7,8,5,6]);
    });
});

describe('full flow test with graph 4', () => {
    it('if inside if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,0,2');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'b < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = c + 5|request\n' +
            'n3=>condition: node-number: 4\n' +
            'a < b|request\n' +
            'n4=>operation: node-number: 5\n' +
            'c = c + 7\n' +
            'c++\n' +
            'n5=>operation: node-number: 6\n' +
            'b = a + y|request\n' +
            'n6=>operation: node-number: 7\n' +
            'return c|request\n' +
            'n7=>condition: node-number: 8\n' +
            'true|request\n' +
            'n8=>operation: node-number: 9\n' +
            'c--|request\n' +
            'n9=>operation: node-number: 10\n' +
            'b = 6\n' +
            'n10=>condition: node-number: 11\n' +
            'b < z * 2\n' +
            'n11=>operation: node-number: 12\n' +
            'c = c + x + 5\n' +
            'n12=>operation: node-number: 13\n' +
            'c = c + z + 5\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            'node3=>start: Merge|Merge\n' +
            'node4=>start: Merge|Merge\n' +
            '\n' +
            'n0->n1\n' +
            'n1(yes)->n2\n' +
            'n1(no)->n10\n' +
            'n2->n3\n' +
            'n3(yes)->n4\n' +
            'n3(no)->n7\n' +
            'n4->node1\n' +
            'node1->n5\n' +
            'n5->node3\n' +
            'node3->n6\n' +
            'n7(yes)->n8\n' +
            'node3->n6\n' +
            'n7(no)->n9\n' +
            'node3->n6\n' +
            'n8->node1\n' +
            'node1->n5\n' +
            'n9->node1\n' +
            'node1->n5\n' +
            'n10(yes)->n11\n' +
            'node1->n5\n' +
            'n10(no)->n12\n' +
            'node1->n5\n' +
            'n11->node3\n' +
            'node3->n6\n' +
            'n12->node3\n' +
            'node3->n6\n\n');
    });
});

describe('full flow test no indexes 5', () => {
    it('if and while inside if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '\ta = 0;\n' +
            '\twhile(a < 5){\n' +
            '            c = c + 12;\n' +
            '\t    a++;\n' +
            '\t}\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '\tc = c + z + 5;\n' +
            '\tc = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="b < z"]\n' +
            'n2 [label="c = c + 5"]\n' +
            'n3 [label="a < b"]\n' +
            'n4 [label="c = c + 7\n' +
            'c++"]\n' +
            'n5 [label="b = a + y"]\n' +
            'n6 [label="return c"]\n' +
            'n7 [label="true"]\n' +
            'n8 [label="c--"]\n' +
            'n9 [label="b = 6"]\n' +
            'n10 [label="b < z * 2"]\n' +
            'n11 [label="c = c + x + 5\n' +
            'a = 0"]\n' +
            'n12 [label="a < 5"]\n' +
            'n13 [label="c = c + 12\n' +
            'a++"]\n' +
            'n14 [label="c = c + z + 5\n' +
            'c = c + z + 5\n' +
            'c = c + z + 5"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n10 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n7 [label="false"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n5 []\n' +
            'n9 -> n5 []\n' +
            'n10 -> n11 [label="true"]\n' +
            'n10 -> n14 [label="false"]\n' +
            'n11 -> n12 []\n' +
            'n12 -> n13 [label="true"]\n' +
            'n12 -> n6 [label="false"]\n' +
            'n13 -> n12 []\n' +
            'n14 -> n6 []\n'
        );
    });
});

describe('full flow test with indexes 5', () => {
    it('if and while inside if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '\ta = 0;\n' +
            '\twhile(a < 5){\n' +
            '            c = c + 12;\n' +
            '\t    a++;\n' +
            '\t}\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '\tc = c + z + 5;\n' +
            '\tc = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,10,11,12,13,6]);
    });
});

describe('full flow test with graph 5', () => {
    it('if and while inside if statement', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = c + 5;\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '\ta = 0;\n' +
            '\twhile(a < 5){\n' +
            '            c = c + 12;\n' +
            '\t    a++;\n' +
            '\t}\n' +
            '    } else {\n' +
            '        c = c + z + 5;\n' +
            '\tc = c + z + 5;\n' +
            '\tc = c + z + 5;\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'b < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = c + 5\n' +
            'n3=>condition: node-number: 4\n' +
            'a < b\n' +
            'n4=>operation: node-number: 5\n' +
            'c = c + 7\n' +
            'c++\n' +
            'n5=>operation: node-number: 6\n' +
            'b = a + y\n' +
            'n6=>operation: node-number: 7\n' +
            'return c|request\n' +
            'n7=>condition: node-number: 8\n' +
            'true\n' +
            'n8=>operation: node-number: 9\n' +
            'c--\n' +
            'n9=>operation: node-number: 10\n' +
            'b = 6\n' +
            'n10=>condition: node-number: 11\n' +
            'b < z * 2|request\n' +
            'n11=>operation: node-number: 12\n' +
            'c = c + x + 5\n' +
            'a = 0|request\n' +
            'n12=>condition: node-number: 13\n' +
            'a < 5|request\n' +
            'n13=>operation: node-number: 14\n' +
            'c = c + 12\n' +
            'a++|request\n' +
            'n14=>operation: node-number: 15\n' +
            'c = c + z + 5\n' +
            'c = c + z + 5\n' +
            'c = c + z + 5\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            'node3=>start: Merge|Merge\n' +
            'node4=>start: Merge|Merge\n' +
            'node5=>start: Merge|Merge\n' +
            '\n' +
            'n0->n1\n' +
            'n1(yes)->n2\n' +
            'n1(no)->n10\n' +
            'n2->n3\n' +
            'n3(yes)->n4\n' +
            'n3(no)->n7\n' +
            'n4->node1\n' +
            'node1->n5\n' +
            'n5->node3\n' +
            'node3->n6\n' +
            'n7(yes)->n8\n' +
            'node3->n6\n' +
            'n7(no)->n9\n' +
            'node3->n6\n' +
            'n8->node1\n' +
            'node1->n5\n' +
            'n9->node1\n' +
            'node1->n5\n' +
            'n10(yes)->n11\n' +
            'node1->n5\n' +
            'n10(no)->n14\n' +
            'node1->n5\n' +
            'n11->node4\n' +
            'node4->n12\n' +
            'n12(yes)->n13\n' +
            'node4->n12\n' +
            'n12(no)->node3\n' +
            'node3->n6\n' +
            'n13->node4\n' +
            'node4->n12\n' +
            'n14->node3\n' +
            'node3->n6\n\n');
    });
});

describe('full flow test no indexes 6', () => {
    it('if and while inside if statement with arrays', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = [1,2,3,[1]];\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '\ta = 0;\n' +
            '\twhile(a < 5){\n' +
            '            c = [1,2,3];\n' +
            '\t    a++;\n' +
            '\t}\n' +
            '    } else {\n' +
            '        c = [1,2,3,4,true,[1,2,3]];\n' +
            '\tc = c + z + 5;\n' +
            '\tc = [1,2,3,4,true,[1,2,3]];\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="b < z"]\n' +
            'n2 [label="c = [1,2,3,[1]]"]\n' +
            'n3 [label="a < b"]\n' +
            'n4 [label="c = c + 7\n' +
            'c++"]\n' +
            'n5 [label="b = a + y"]\n' +
            'n6 [label="return c"]\n' +
            'n7 [label="true"]\n' +
            'n8 [label="c--"]\n' +
            'n9 [label="b = 6"]\n' +
            'n10 [label="b < z * 2"]\n' +
            'n11 [label="c = c + x + 5\n' +
            'a = 0"]\n' +
            'n12 [label="a < 5"]\n' +
            'n13 [label="c = [1,2,3]\n' +
            'a++"]\n' +
            'n14 [label="c = [1,2,3,4,true,[1,2,3]]\n' +
            'c = c + z + 5\n' +
            'c = [1,2,3,4,true,[1,2,3]]"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n10 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n7 [label="false"]\n' +
            'n4 -> n5 []\n' +
            'n5 -> n6 []\n' +
            'n7 -> n8 [label="true"]\n' +
            'n7 -> n9 [label="false"]\n' +
            'n8 -> n5 []\n' +
            'n9 -> n5 []\n' +
            'n10 -> n11 [label="true"]\n' +
            'n10 -> n14 [label="false"]\n' +
            'n11 -> n12 []\n' +
            'n12 -> n13 [label="true"]\n' +
            'n12 -> n6 [label="false"]\n' +
            'n13 -> n12 []\n' +
            'n14 -> n6 []\n'
        );
    });
});

describe('full flow test with indexes 6', () => {
    it('if and while inside if statement euth arrays', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = [1,2,3,[1]];\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '\ta = 0;\n' +
            '\twhile(a < 5){\n' +
            '            c = [1,2,3];\n' +
            '\t    a++;\n' +
            '\t}\n' +
            '    } else {\n' +
            '        c = [1,2,3,4,true,[1,2,3]];\n' +
            '\tc = c + z + 5;\n' +
            '\tc = [1,2,3,4,true,[1,2,3]];\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,10,11,12,13,6]);
    });
});

describe('full flow test with graph 6', () => {
    it('if and while inside if statement with arrays', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = 0;\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = [1,2,3,[1]];\n' +
            '        if(a < b){\n' +
            '           c = c + 7;\n' +
            '           c++;\n' +
            '        }else if(true){\n' +
            '           c--;\n' +
            '        }else{\n' +
            '           b = 6;\n' +
            '        }\n' +
            '        b = a + y;\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = c + x + 5;\n' +
            '\ta = 0;\n' +
            '\twhile(a < 5){\n' +
            '            c = [1,2,3];\n' +
            '\t    a++;\n' +
            '\t}\n' +
            '    } else {\n' +
            '        c = [1,2,3,4,true,[1,2,3]];\n' +
            '\tc = c + z + 5;\n' +
            '\tc = [1,2,3,4,true,[1,2,3]];\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'b < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = [1,2,3,[1]]\n' +
            'n3=>condition: node-number: 4\n' +
            'a < b\n' +
            'n4=>operation: node-number: 5\n' +
            'c = c + 7\n' +
            'c++\n' +
            'n5=>operation: node-number: 6\n' +
            'b = a + y\n' +
            'n6=>operation: node-number: 7\n' +
            'return c|request\n' +
            'n7=>condition: node-number: 8\n' +
            'true\n' +
            'n8=>operation: node-number: 9\n' +
            'c--\n' +
            'n9=>operation: node-number: 10\n' +
            'b = 6\n' +
            'n10=>condition: node-number: 11\n' +
            'b < z * 2|request\n' +
            'n11=>operation: node-number: 12\n' +
            'c = c + x + 5\n' +
            'a = 0|request\n' +
            'n12=>condition: node-number: 13\n' +
            'a < 5|request\n' +
            'n13=>operation: node-number: 14\n' +
            'c = [1,2,3]\n' +
            'a++|request\n' +
            'n14=>operation: node-number: 15\n' +
            'c = [1,2,3,4,true,[1,2,3]]\n' +
            'c = c + z + 5\n' +
            'c = [1,2,3,4,true,[1,2,3]]\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            'node3=>start: Merge|Merge\n' +
            'node4=>start: Merge|Merge\n' +
            'node5=>start: Merge|Merge\n' +
            '\n' +
            'n0->n1\n' +
            'n1(yes)->n2\n' +
            'n1(no)->n10\n' +
            'n2->n3\n' +
            'n3(yes)->n4\n' +
            'n3(no)->n7\n' +
            'n4->node1\n' +
            'node1->n5\n' +
            'n5->node3\n' +
            'node3->n6\n' +
            'n7(yes)->n8\n' +
            'node3->n6\n' +
            'n7(no)->n9\n' +
            'node3->n6\n' +
            'n8->node1\n' +
            'node1->n5\n' +
            'n9->node1\n' +
            'node1->n5\n' +
            'n10(yes)->n11\n' +
            'node1->n5\n' +
            'n10(no)->n14\n' +
            'node1->n5\n' +
            'n11->node4\n' +
            'node4->n12\n' +
            'n12(yes)->n13\n' +
            'node4->n12\n' +
            'n12(no)->node3\n' +
            'node3->n6\n' +
            'n13->node4\n' +
            'node4->n12\n' +
            'n14->node3\n' +
            'node3->n6\n\n');
    });
});

describe('full flow test no indexes 7', () => {
    it('simple with arrays no indexes', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = [1,2,3];\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = [1,2,[1,2]];\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = [1];\n' +
            '    } else {\n' +
            '        c = [1];\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = [1,2,3]"]\n' +
            'n1 [label="b < z"]\n' +
            'n2 [label="c = [1,2,[1,2]]"]\n' +
            'n3 [label="return c"]\n' +
            'n4 [label="b < z * 2"]\n' +
            'n5 [label="c = [1]"]\n' +
            'n6 [label="c = [1]"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n4 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n4 -> n5 [label="true"]\n' +
            'n4 -> n6 [label="false"]\n' +
            'n5 -> n3 []\n' +
            'n6 -> n3 []\n'
        );
    });
});

describe('full flow test with indexes 7', () => {
    it('simple with arrays with indexes', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = [1,2,3];\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = [1,2,[1,2]];\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = [1];\n' +
            '    } else {\n' +
            '        c = [1];\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,4,5,3]);
    });
});

describe('full flow test with graph 7', () => {
    it('simple with arrays with graph', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '    let a = x + 1;\n' +
            '    let b = a + y;\n' +
            '    let c = [1,2,3];\n' +
            '    \n' +
            '    if (b < z) {\n' +
            '        c = [1,2,[1,2]];\n' +
            '    } else if (b < z * 2) {\n' +
            '        c = [1];\n' +
            '    } else {\n' +
            '        c = [1];\n' +
            '    }\n' +
            '    \n' +
            '    return c;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = [1,2,3]|request\n' +
            'n1=>condition: node-number: 2\n' +
            'b < z|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = [1,2,[1,2]]\n' +
            'n3=>operation: node-number: 4\n' +
            'return c|request\n' +
            'n4=>condition: node-number: 5\n' +
            'b < z * 2|request\n' +
            'n5=>operation: node-number: 6\n' +
            'c = [1]|request\n' +
            'n6=>operation: node-number: 7\n' +
            'c = [1]\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            '\n' +
            'n0->n1\n' +
            'n1(yes)->n2\n' +
            'n1(no)->n4\n' +
            'n2->node1\n' +
            'node1->n3\n' +
            'n4(yes)->n5\n' +
            'node1->n3\n' +
            'n4(no)->n6\n' +
            'node1->n3\n' +
            'n5->node1\n' +
            'node1->n3\n' +
            'n6->node1\n' +
            'node1->n3\n\n');
    });
});

describe('full flow test no indexes 8', () => {
    it('simple with arrays no indexes while inside while', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < 15) {\n' +
            '       c = a + b;\n' +
            '       while(b < 10){\n' +
            '\t  b++;\n' +
            '\t  c = [1,2,3]\n' +
            '       }\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,1,0');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        assert.deepEqual(cfgInStringOrient,'n0 [label="a = x + 1\n' +
            'b = a + y\n' +
            'c = 0"]\n' +
            'n1 [label="a < 15"]\n' +
            'n2 [label="c = a + b"]\n' +
            'n3 [label="b < 10"]\n' +
            'n4 [label="b++\n' +
            'c = [1,2,3]"]\n' +
            'n5 [label="z = c * 2\n' +
            'a++"]\n' +
            'n6 [label="return z"]\n' +
            'n0 -> n1 []\n' +
            'n1 -> n2 [label="true"]\n' +
            'n1 -> n6 [label="false"]\n' +
            'n2 -> n3 []\n' +
            'n3 -> n4 [label="true"]\n' +
            'n3 -> n5 [label="false"]\n' +
            'n4 -> n3 []\n' +
            'n5 -> n1 []\n'
        );
    });
});

describe('full flow test with indexes 8', () => {
    it('simple with arrays with indexes while inside while', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < 15) {\n' +
            '       c = a + b;\n' +
            '       while(b < 10){\n' +
            '\t  b++;\n' +
            '\t  c = [1,2,3]\n' +
            '       }\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argsAfterParse = parseArgs('0,1,0');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        assert.deepEqual(indexesToPrint,[0,1,2,3,4,5,6]);
    });
});

describe('full flow test with graph 8', () => {
    it('simple with arrays with graph while inside while', () => {
        let codeToParse = 'function foo(x, y, z){\n' +
            '   let a = x + 1;\n' +
            '   let b = a + y;\n' +
            '   let c = 0;\n' +
            '   \n' +
            '   while (a < 15) {\n' +
            '       c = a + b;\n' +
            '       while(b < 10){\n' +
            '\t  b++;\n' +
            '\t  c = [1,2,3]\n' +
            '       }\n' +
            '       z = c * 2;\n' +
            '       a++;\n' +
            '   }\n' +
            '   \n' +
            '   return z;\n' +
            '}\n';
        let argsAfterParse = parseArgs('1,2,3');
        let parsedCode = parseCode(codeToParse);
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        const graph = esgraph(parsedCode.body[0].body);
        let graphAfterGeneration = createGraphNodesLabels(graph,strOfParamsAndValues);
        let graphAfterClean = makeGraphFine(graphAfterGeneration);
        let graphAfterMerged = makeGraphMerged(graphAfterClean);
        getNodesToPrint(graphAfterMerged,stringAfterChanges);
        const cfgInStringOrient = esgraph.dot(graphAfterMerged);
        let graphToShow = createGraphFromStr(cfgInStringOrient);
        assert.deepEqual(graphToShow, 'n0=>operation: node-number: 1\n' +
            'a = x + 1\n' +
            'b = a + y\n' +
            'c = 0|request\n' +
            'n1=>condition: node-number: 2\n' +
            'a < 15|request\n' +
            'n2=>operation: node-number: 3\n' +
            'c = a + b|request\n' +
            'n3=>condition: node-number: 4\n' +
            'b < 10|request\n' +
            'n4=>operation: node-number: 5\n' +
            'b++\n' +
            'c = [1,2,3]|request\n' +
            'n5=>operation: node-number: 6\n' +
            'z = c * 2\n' +
            'a++|request\n' +
            'n6=>operation: node-number: 7\n' +
            'return z|request\n' +
            'node1=>start: Merge|Merge\n' +
            'node2=>start: Merge|Merge\n' +
            '\n' +
            'n0->node2\n' +
            'node2->n1\n' +
            'n1(yes)->n2\n' +
            'node2->n1\n' +
            'n1(no)->n6\n' +
            'node2->n1\n' +
            'n2->node1\n' +
            'node1->n3\n' +
            'n3(yes)->n4\n' +
            'node1->n3\n' +
            'n3(no)->n5\n' +
            'node1->n3\n' +
            'n4->node1\n' +
            'node1->n3\n' +
            'n5->node2\n' +
            'node2->n1\n\n');
    });
});