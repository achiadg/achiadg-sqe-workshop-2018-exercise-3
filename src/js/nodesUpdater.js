export {createLabelsInNodes,stringAfterChanges};
var stringAfterChanges = '';
var temp = [];

function createLabelsInNodes(cfg,strOfParamsAndValues) {
    stringAfterChanges = strOfParamsAndValues;
    temp = [];
    for(let node of cfg[2]){
        node.label = getLabelFromNode(node.astNode,stringAfterChanges);
    }
    let length = temp.length;
    length = length/2;
    for(let i=1; i<=length;i++){
        stringAfterChanges = stringAfterChanges + temp[i-1];
    }
    return cfg;
}

function getLabelFromNode(expression,stringAfterChanges) {
    if (expression === null || expression === undefined)
        return '';
    else if(expression.type === 'BlockStatement')
        return handleBlockStatement(expression,stringAfterChanges);
    else if(expression.type === 'VariableDeclaration')
        return handleVariableDeclaration(expression,stringAfterChanges);
    else
        return handleMoreStatements(expression,stringAfterChanges);
}

function handleMoreStatements(expression,stringAfterChanges) {
    if(expression.type === 'ExpressionStatement')
        return handleExpressionStatement(expression,stringAfterChanges);
    else if(expression.type === 'AssignmentExpression')
        return handleAssignmentStatement(expression,stringAfterChanges);
    else if(expression.type === 'ReturnStatement')
        return handleReturnStatement(expression,stringAfterChanges);
    else if(expression.type === 'MemberExpression')
        return handleMemberExpression(expression,stringAfterChanges);
    else
        return handleMoreStatements2(expression,stringAfterChanges);
}

function handleMoreStatements2(expression,stringAfterChanges){
    if (expression.type === 'BinaryExpression')
        return handleBinaryExpression(expression,stringAfterChanges);
    else if(expression.type === 'UnaryExpression')
        return handleUnaryExpression(expression,stringAfterChanges);
    else if(expression.type === 'ArrayExpression')
        return handleArrayExpression(expression,stringAfterChanges);
    else if(expression.type === 'Literal')
        return handleLiteral(expression,stringAfterChanges);
    else
        return handleMoreStatements3(expression,stringAfterChanges);
}

function handleMoreStatements3(expression,stringAfterChanges) {
    if (expression.type === 'Identifier')
        return handleIdentifier(expression,stringAfterChanges);
    else if(expression.type === 'UpdateExpression')
        return handleUpdateExpression(expression,stringAfterChanges);

}

function handleBlockStatement(expression,stringAfterChanges) {
    let result = '';
    let i;
    for(i=0;i<expression.body.length;i++){
        result = result + getLabelFromNode(expression.body[i],stringAfterChanges)+'\n';
    }
    return result;
}

function handleVariableDeclaration(expression,stringAfterChanges) {
    if(expression.declarations[0].init === null) {
        temp.push('let ' + getLabelFromNode(expression.declarations[0].id,stringAfterChanges) + ';\n');
        return getLabelFromNode(expression.declarations[0].id,stringAfterChanges);
    }
    else{
        temp.push('let ' + getLabelFromNode(expression.declarations[0].id,stringAfterChanges) + ' = ' + getLabelFromNode(expression.declarations[0].init,stringAfterChanges) + ';\n');
        return getLabelFromNode(expression.declarations[0].id,stringAfterChanges) + ' = ' + getLabelFromNode(expression.declarations[0].init,stringAfterChanges);
    }
}

function handleExpressionStatement(expression,stringAfterChanges){
    return getLabelFromNode(expression.expression,stringAfterChanges);
}

function handleAssignmentStatement(expression,stringAfterChanges) {
    return getLabelFromNode(expression.left,stringAfterChanges) + ' = ' + getLabelFromNode(expression.right,stringAfterChanges);
}

function handleReturnStatement(expression,stringAfterChanges) {
    return 'return ' + getLabelFromNode(expression.argument,stringAfterChanges);
}

function handleMemberExpression(expression,stringAfterChanges){
    return expression.object.name + '[' + getLabelFromNode(expression.property,stringAfterChanges) + ']';
}

function handleBinaryExpression(expression,stringAfterChanges) {
    return getLabelFromNode(expression.left,stringAfterChanges) + ' ' + expression.operator + ' ' + getLabelFromNode(expression.right,stringAfterChanges);
}

function handleUnaryExpression(expression,stringAfterChanges) {
    return expression.operator + getLabelFromNode(expression.argument,stringAfterChanges);
}

function handleArrayExpression(expression,stringAfterChanges) {
    let tmp = [];
    for(let i=0;i<expression.elements.length;i++){
        tmp.push(getLabelFromNode(expression.elements[i],stringAfterChanges));
    }
    let result = '[';
    let i;
    for(i = 0;i<tmp.length-1;i++){
        result = result + tmp[i] + ',';
    }
    result = result + tmp[i] + ']';
    return result;
}

function handleLiteral(expression) {
    return expression.raw;
}

function handleIdentifier(expression) {
    return expression.name;
}

function handleUpdateExpression(expression,stringAfterChanges) {
    if(expression.prefix){
        return expression.operator + getLabelFromNode(expression.argument,stringAfterChanges);
    }else{
        return getLabelFromNode(expression.argument,stringAfterChanges) + expression.operator;
    }
}
