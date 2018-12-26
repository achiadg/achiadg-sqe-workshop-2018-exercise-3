export {createLabelsInNodes};

function createLabelsInNodes(cfg) {
    for(let node of cfg[2]){
        node.label = getLabelFromNode(node.astNode);
    }
    return cfg;
}

function getLabelFromNode(expression) {
    if (expression === null || expression === undefined)
        return '';
    else if(expression.type === 'BlockStatement')
        return handleBlockStatement(expression);
    else if(expression.type === 'VariableDeclaration')
        return handleVariableDeclaration(expression);
    else
        return handleMoreStatements(expression);
}

function handleMoreStatements(expression) {
    if(expression.type === 'ExpressionStatement')
        return handleExpressionStatement(expression);
    else if(expression.type === 'AssignmentExpression')
        return handleAssignmentStatement(expression);
    else if(expression.type === 'ReturnStatement')
        return handleReturnStatement(expression);
    else if(expression.type === 'MemberExpression')
        return handleMemberExpression(expression);
    else
        return handleMoreStatements2(expression);
}

function handleMoreStatements2(expression){
    if (expression.type === 'BinaryExpression')
        return handleBinaryExpression(expression);
    else if(expression.type === 'UnaryExpression')
        return handleUnaryExpression(expression);
    else if(expression.type === 'ArrayExpression')
        return handleArrayExpression(expression);
    else if(expression.type === 'Literal')
        return handleLiteral(expression);
    else
        return handleMoreStatements3(expression);
}

function handleMoreStatements3(expression) {
    if (expression.type === 'Identifier')
        return handleIdentifier(expression);
    else if(expression.type === 'UpdateExpression')
        return handleUpdateExpression(expression);

}

function handleBlockStatement(expression) {
    let result = '';
    let i;
    for(i=0;i<expression.body.length;i++){
        result = result + getLabelFromNode(expression.body[i])+'\n';
    }
    return result;
}

function handleVariableDeclaration(expression) {
    return getLabelFromNode(expression.declarations[0].id) + ' = ' + getLabelFromNode(expression.declarations[0].init);
}

function handleExpressionStatement(expression){
    return getLabelFromNode(expression.expression);
}

function handleAssignmentStatement(expression) {
    return getLabelFromNode(expression.left) + ' = ' + getLabelFromNode(expression.right);
}

function handleReturnStatement(expression) {
    return 'return ' + getLabelFromNode(expression.argument);
}

function handleMemberExpression(expression){
    return expression.object.name + '[' + getLabelFromNode(expression.property) + ']';
}

function handleBinaryExpression(expression) {
    return getLabelFromNode(expression.left) + ' ' + expression.operator + ' ' + getLabelFromNode(expression.right);
}

function handleUnaryExpression(expression) {
    return expression.operator + getLabelFromNode(expression.argument);
}

function handleArrayExpression(expression) {
    let tmp = [];
    for(let i=0;i<expression.elements.length;i++){
        tmp.push(getLabelFromNode(expression.elements[i]));
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

function handleUpdateExpression(expression) {
    if(expression.prefix){
        return expression.operator + getLabelFromNode(expression.argument);
    }else{
        return getLabelFromNode(expression.argument) + expression.operator;
    }
}
