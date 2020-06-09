export default function liquify(ast){

    const parameters = {};
    const locals = {};

    const generateModule = (ast) => {
        // return `(module ${ast.functions.forEach(functionNode => generateFunction(functionNode))})`;
        var functionString = "";
        for (const functionNode in ast.functions){
            functionString += generateFunction(ast.functions[functionNode]);
        }
        return "(module " + functionString+ ")";
    }

    const generateFunction = (functionNode) => {
        console.log(functionNode.statements);
        parameters[functionNode.name] = [];
        locals[functionNode.name] = [];
        var functionName = functionNode.name;
        var params = generateParams(functionNode.params, functionName);
        var statements = generateStatements(functionNode.statements, functionNode.name);
        return "(func $" + functionName + params + "(result i32)" + statements + "(export $" + functionName + " (func $" + functionName + ") )";
    }

    const generateParams = (params, functionName) => {
        var paramsString = '';
        for (const param in params){

            parameters[functionName].push(params[param]);
            paramsString += "(param $" + params[param].value + " i32)";
        }
        return paramsString;
    }

    const generateStatements = (statementsArray, functionName) => {
        console.log(statementsArray[0].type);
        var statementsString = '';
        for (const statement in statementsArray){
            switch (statementsArray[statement].type) {
                case "IF_STATEMENT":
                    statementsString += generateIfStatement(statementsArray[statement], functionName);
                    break;
                case "WHILE_STATEMENT":
                    break;
                case "VARIABLE_ASSIGNMENT":
                    if (locals[functionName].includes(statementsArray[statement].name) || parameters[functionName].includes(statementsArray[statement].name)){
                        console.log("chuj")
                       statementsString += assignment(statementsArray[statement], functionName);
                    } else {
                        console.log("cipa")
                        locals[functionName].push(statementsArray[statement].name);
                        statementsString += "(local $"+ statementsArray[statement].name + "i32)" + assignment(statementsArray[statement], functionName);
                    }
                    break;
                case "RETURN_STATEMENT":
                default:
                    break;
            }
        }
        return statementsString;

    }

    const assignment = (statement, functionName) => {
        switch (statement.value.type) {
            case "NUMBER_LITERAL":
                return "(set_local $" + statement.name + "i32.const" + statement.value.value + ")";
            case "IDENTIFIER":
                if (statement.name in locals[functionName] || statement.name in parameters[functionName]){
                    return "(set_local $" + statement.name + "get_local $" + statement.value.value + ")";
                }//ERROR ELSE CUZ NEVER DECLARED
            case "BINARY_EXPRESSION":
                return "(set_local $" + statement.name + generateBinary(statement.value, functionName);
        }
}

    const generateBinary = (binaryExpression, functionName) =>{
        var operator = binaryExpression.operator;
        var leftNode = binaryExpression.left;
        var rightNode = binaryExpression.right;

        var left = generateExpression(leftNode, functionName);
        var right = generateExpression(rightNode, functionName);
        var operationType = generateOperation(operator);

        return "(" + operationType + "(" + left + ")" + "(" + right + ")";
    }

    const generateExpression = (node, functionName) => {
        switch (node.type){
            case "NUMBER_LITERAL":
                return "(i32.const" + node.value + ")";
            case "IDENTIFIER": //CHECK IF WE HAVE ACTUALY DECLARED THIS VARIABLE
                return "(get_local $" + node.value + ")";
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
        console.log(ifStatementNode.consequent.statements);
        return "(if " + generateBinary(ifStatementNode.condition, functionName) + ") (then" + generateStatements(ifStatementNode.consequent.statements, functionName) + ")"; 
    }

    const generateWhileStatement = (whileStatementNode) => {
        
    }

    return generateModule(ast);

}