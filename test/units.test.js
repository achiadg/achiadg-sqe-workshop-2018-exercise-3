/* eslint-disable max-lines-per-function */
import assert from 'assert';
import {parseArgs,createStringOfDeclerations} from '../src/js/handlrArgs';
import {parseCode} from '../src/js/code-analyzer';
import {checkIfCondExist,checkExist} from '../src/js/graphConverter';

describe('unis tests for parseArgs', () => {
    it('is parsing an args just numbers', () => {
        assert.deepEqual(
            parseArgs('1,2,3'), ['1','2','3']
        );
    });
    it('is parsing an args with booleans', () => {
        assert.deepEqual(parseArgs('1,true,3,false'),['1','true','3','false']
        );
    });
    it('is parsing an args with arrays', () => {
        assert.deepEqual(parseArgs('1,true,3,[1,2,true]'),['1','true','3','[1,2,true]']
        );
    });
    it('is parsing an args with no args', () => {
        assert.deepEqual(parseArgs(''),['']
        );
    });
    it('is parsing an args with no args', () => {
        assert.deepEqual(parseArgs('      '),['      ']
        );
    });
});

describe('unis tests for createStringOfDeclerations', () => {
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
        let parsedCode = parseCode(codeToParse);
        let argsAfterParse = parseArgs('1,2,3');
        let strOfParamsAndValues = createStringOfDeclerations(argsAfterParse, parsedCode.body[0].params);
        assert.deepEqual(strOfParamsAndValues,'var x = 1;\n' +
            'var y = 2;\n' +
            'var z = 3;\n'
        );
    });
});

describe('unis tests for checkIfCondExist', () => {
    it('is not finding cond in conds', () => {
        let result = checkIfCondExist(1);
        assert.deepEqual(result,false
        );
    });
    it('is not finding cond in conds', () => {
        let result = checkIfCondExist(true);
        assert.deepEqual(result,false
        );
    });
    it('check is transition', () => {
        let result = checkExist('n0 -> n1');
        assert.deepEqual(result,true
        );
    });
    it('check is no transition', () => {
        let result = checkExist('n0n12345');
        assert.deepEqual(result,false
        );
    });
});