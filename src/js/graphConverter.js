export {createGraphFromStr};
var condElements = [];
var countNodes = 1;

function createGraphFromStr(graphInStr) {
    condElements = [];
    countNodes = 1;
    let graphElements = graphInStr.split(']\n');
    let res2 = handleTrans(graphElements);
    let res1 = handleNodes(graphElements);
    let result = res1 + '\n' + res2 + '\n';
    return result;
}

function handleNodes(graphElements) {
    let strOfNodes = '';
    for(let element of graphElements){
        if(element !== '' && !checkExist(element)){
            strOfNodes = strOfNodes + handleRelevantElementNode(element);
            countNodes = countNodes + 1;
        }
    }
    return strOfNodes;
}


function checkExist(element) {
    for(let i=0;i<element.length - 1;i++){
        if(element[i] === '-' && element[i+1] === '>')
            return true;
    }
    return false;
}

function handleRelevantElementNode(element) {
    let name = element.split('[');
    let nameOfNode = name[0].substring(0,name[0].length-1);
    let splitByEqual = name[1].split('="');
    let type = checkIfNodeExist(nameOfNode);
    let result = nameOfNode + '=>' + type + ': ' + 'node-number: ' + countNodes + '\n' + splitByEqual[1].substring(0,splitByEqual[1].length-1) + '\n';
    return result;
}

function handleTrans(graphElements) {
    let strOfTrans = '';
    for(let element of graphElements){
        if(element !== '' && checkExist(element)){
            strOfTrans = strOfTrans + handleRelevantElementTrans(element);
        }
    }
    return strOfTrans;
}

function checkIfNodeExist(nameOfNode) {
    for(let element of condElements){
        if(nameOfNode === element){
            return 'condition';
        }
    }
    return 'operation';
}

// function removeBrackets(str) {
//     let res = '';
//     for(let i=0;i<str.length;i++){
//         if(i !== 0 && i !== str.length-1)
//             res = res + str[i];
//     }
//     return res;
// }

function handleRelevantElementTrans(element) {
    let cond = '';
    let names = element.split('->');
    let firstName = names[0].substring(0,names[0].length-1);
    names[1] = names[1].substr(1);
    let nodeAndLabel = names[1].split(' ');
    let secondName = nodeAndLabel[0];
    let splitByEqual = nodeAndLabel[1].split('=');
    if(splitByEqual.length > 1){
        if(splitByEqual[1] === '"true"')
            cond = '(yes)';
        else
            cond = '(no)';
        if(!checkIfCondExist(firstName))
            condElements.push(firstName);
    }
    let result = firstName + cond + '->' + secondName + '\n';
    return result;
}

function checkIfCondExist(firstName) {
    for(let element of condElements){
        if(firstName === element){
            return true;
        }
    }
    return false;
}