export default function liquify(ast){

    const parameters = {};
    const locals = {};
    var loop = 1;
    const binary1 = ["+","-","*","/"];

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
        if (functionNode.isExport){
            return "(func (export $" + functionName + ")" + params + "(result i32)" + statements + ")";
        } else {
            return "(func $" + functionName + ")" + params + "(result i32)" + statements + ")";
        }
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
                       statementsString += assignment(statementsArray[statement], functionName);
                    } else {
                        locals[functionName].push(statementsArray[statement].name);
                        statementsString += "(local $"+ statementsArray[statement].name + "i32)" + assignment(statementsArray[statement], functionName);
                    }
                    break;
                case "RETURN_STATEMENT":
                    break;
                case "FUNCTION_CALL":
                    statementsString += "(call $" + statementsArray[statement].name + generateCallParams(statementsArray[statement].params) + ")";
                    break;
                default:
                    break;
            }
        }
        return statementsString;

    }

    const assignment = (statement, functionName) => {
        switch (statement.value.type) {
            case "NUMBER_LITERAL":
                return "(local.set $" + statement.name + "(i32.const" + statement.value.value + "))";
            case "IDENTIFIER":
                if (statement.name in locals[functionName] || statement.name in parameters[functionName]){
                    return "(local.set $" + statement.name + "(local.get $" + statement.value.value + "))";
                }//ERROR ELSE CUZ NEVER DECLARED
            case "BINARY_EXPRESSION":
                return "(local.set $" + statement.name + generateBinary(statement.value, functionName);
        }
    }

    const generateCallParams = (params) =>{
        var paramsString = '';
        for (const param in params){
            switch (params[param].type) {
                case "NUMBER_LITERAL":
                    paramsString += "(i32.const" + params[param].value + ")";
                case "IDENTIFIER":
                    paramsString += "(local.get $" + params[param].value + ")";
                }
        }
        return paramsString;
    }

    const generateBinary = (binaryExpression, functionName) =>{
        var operator = binaryExpression.operator;
        var leftNode = binaryExpression.left;
        var rightNode = binaryExpression.right;

        var left = generateExpression(leftNode, functionName);
        var right = generateExpression(rightNode, functionName);
        var operationType = generateOperation(operator);

        if (binary1.includes(operator)){
            return "(" + operationType + "(" + left + ")" + "(" + right + ")";
        }
        else {
            return "(" + operationType + "(" + left + ")" + "(" + right + ")";
        }
    }

    const generateExpression = (node, functionName) => {
        switch (node.type){
            case "NUMBER_LITERAL":
                return "(i32.const" + node.value + ")";
            case "IDENTIFIER": //CHECK IF WE HAVE ACTUALY DECLARED THIS VARIABLE
                return "(local.get $" + node.value + ")";
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
        loopname = generateLoopName();
        return "(loop"
    }

    const generateLoopName= () => {
        loopname = loop + 1;
        return "loop" + loopname;
    }

    return generateModule(ast);

}