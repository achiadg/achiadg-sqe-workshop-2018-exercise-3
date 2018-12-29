export {getNodesToPrint,indexesToPrint};

var indexesToPrint = [];

function getNodesToPrint(graph,strOfDeclarations) {
    indexesToPrint = [];
    graph = graph[2];
    if(strOfDeclarations.includes('undefined'))
        return;
    getNodesToPrintHelp(graph,graph[0],strOfDeclarations);
    indexesToPrint = indexesToPrint.filter(function(item, pos) {
        return indexesToPrint.indexOf(item) == pos;
    });
}

function splitByBackslashN(nodeToSplit) {
    let res = '';
    let statements = nodeToSplit.split('\n');
    for(let statement of statements){
        res = res + statement + ';\n';
    }
    return res;
}

function getNodesToPrintHelp(graph,current,strOfDeclarations) {
    if(current.astNode.type === 'ReturnStatement'){
        indexesToPrint.push(findIndex(graph,current));
        return;
    }
    if(current.normal){
        indexesToPrint.push(findIndex(graph,current));
        strOfDeclarations = strOfDeclarations + splitByBackslashN(current.label);
        getNodesToPrintHelp(graph,current.normal,strOfDeclarations);
    }else{
        indexesToPrint.push(findIndex(graph,current));
        let strToCheck = strOfDeclarations + current.label + '\n';
        if(eval(strToCheck)){
            getNodesToPrintHelp(graph,current.true,strOfDeclarations);
        }else{
            getNodesToPrintHelp(graph,current.false,strOfDeclarations);
        }
    }
}

function findIndex(graph,current) {
    for(let i = 0;i<graph.length;i++){
        if(graph[i] === current){
            return i;
        }
    }
    return -1;
}

