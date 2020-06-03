export default function liquify(ast){

    const parameters = {};
    const locals = {};

    const generateModule = (ast) => {
        // return `(module ${ast.functions.forEach(functionNode => generateFunction(functionNode))})`;
        return `(module ${ast.functions.forEach(functionNode => console.log(functionNode))})`;
    }

    const generateFunction = (functionNode) => {
        // parameters[functionNode.name] = [];
        // return `(func $${functionNode.name}
        //         ${generateParams(functionNode.params, functionNode.name)} 
        //         (result i32)
        //         ${functionNode.statements ? generateStatements(functionNode.statements, functionNode.name) : ''})
        //         (export "${functionNode.name}" (func  $${functionNode.name}))`
        return functionNode;
    }

    const generateParams = (params, functionName) => {
        var paramsString = '';
        params.forEach(param => {
            paramsString += `(param $${param.name} i32)`
            parameters[functionName].push(param.name);
        })
        return paramsString;
    }

    const generateStatements = (statementsNode, functionName) => {
        const statementsString = '';
        statementsNode.forEach(statement => {
            switch (statement.type) {
                case "IF_STATEMENT":
                    statementsString += generateIfStatement(statement, functionName);
                    break;
                case "WHILE_STATEMENT":
                    break;
                case "VARIABLE_ASSIGNMENT":
                    if (statement.name in locals[functionName] || statement.name in parameters[functionName]){
                        statementsString += assignment(statement, functionName);
                    } else {
                        locals[functionName].push(statement.name);
                        statementsString += `(local $${statement.name} i32) ${assignment(statement, functionName)}`;
                    }
                    break;
                case "RETURN_STATEMENT":
                default:
                    break;
            }
        })
        return statementsString;

    }

    const assignment = (statement, functionName) => {
        switch (statement.value.type) {
            case "NUMBER_LITERAL":
                return `(set_local $${statement.name} i32.const ${statement.value.value})`;
            case "IDENTIFIER":
                if (statement.name in locals[functionName] || statement.name in parameters[functionName]){
                    return `(set_local $${statement.name} get_local $${statement.value.value})`;
                }//ERROR ELSE CUZ NEVER DECLARED
            case "BINARY_EXPRESSION":
                return `(set_local $${statement.name} ${generateBinary(statement.value, functionName)})`
        }
}

    const generateBinary = (binaryExpression, functionName) =>{
        var operator = binaryExpression.operator;
        var leftNode = binaryExpression.left;
        var rightNode = binaryExpression.right;

        var left = generateExpression(leftNode, functionName);
        var right = generateExpression(rightNode, functionName);
        var operationType = generateOperation(operator);

        return`(${operationType} (${left}) (${right})`
    }

    const generateExpression = (node, functionName) => {
        switch (node.type){
            case "NUMBER_LITERAL":
                return `(i32.const ${node.value})`;
            case "IDENTIFIER": //CHECK IF WE HAVE ACTUALY DECLARED THIS VARIABLE
                return `(get_local $${node.value})`
            case "BINARY_EXPRESSION":
                return generateBinary(node, functionName)
        }
    }

    const generateOperation = (operator) => {
        switch (operator){
            case "+":
                return 'i32.add'
            case "-":
                return 'i32.sub'
            case "*":
                return "i32.mul"
            case "/":
                return "i32.div"
            case "<":
                return "i32.lt_s"
            case ">":
                return "i32.gt_s"
            case "==":
                return "i32.eq"
            case "!=":
                return "i32.ne"
            default:
                break;

        }
    }

    const generateIfStatement = (ifStatementNode, functionName) => {
        return `(if ${generateBinary(ifStatementNode.condition)} (then ${generateStatements(ifStatementNode.consequent, functionName)}))` 
    }

    const generateWhileStatement = (whileStatementNode) => {
        
    }

    return generateModule(ast);

}