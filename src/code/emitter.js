export default function emit(ast){
    const vars = ast.vars
    var loop = 0;
    var currentFunction = null;

    function generateModule(ast){
        var functionString = "";
        for (const functionNode in ast.functions){
            functionString += generateFunction(ast.functions[functionNode]);
        }
        return "(module " + functionString+ ")";
    }

    function generateFunction(functionNode){
        var functionName = functionNode.name;
        var previousFunction = currentFunction;
        currentFunction = functionName;
        if(!vars[functionName].isUsed && !functionNode.isExport){
            return ""
        }
        var params = generateParams(functionNode.params, functionName);
        var statements = generateStatements(functionNode.statements, functionNode.name);
        if (functionNode.isExport){
            currentFunction = previousFunction;
            return "(func (export " + functionName + ")" + params + "(result i32)" + statements + ")";
        } else {
            currentFunction = previousFunction;
            return "(func $" + functionName + ")" + params + "(result i32)" + statements + ")";
        }
    }

    function generateParams(params){
        var paramsString = '';
        for (const param in params){
            paramsString += "(param $" + params[param] + " i32)";
        }
        return paramsString;
    }

    function generateStatements(statementsArray){
        var statementsString = '';
        for (const statement in statementsArray){
            switch (statementsArray[statement].type) {
                case "IF_STATEMENT":
                    statementsString += generateIfStatement(statementsArray[statement]);
                    break;
                case "WHILE_STATEMENT":
                    statementsString += generateWhileStatement(statementsArray[statement]);
                    break;
                case "VARIABLE_ASSIGNMENT":
                    statementsString += generateVariableAssignment(statementsArray[statement]);
                    break;
                case "FUNCTION_CALL":
                    statementsString += generateFunctionCall(statementsArray[statement]);
                    break;
                case "RETURN_STATEMENT":
                    statementsString += generateReturnStatement(statementsArray[statement]);
                    return statementsString;
                default:
                    break;
            }
        }
        return statementsString;

    }

    function generateVariableAssignment(variableAssignmentNode){
        if (vars[currentFunction].locals[variableAssignmentNode.name].declared || vars[currentFunction].params.includes(variableAssignmentNode.name)){
            switch (variableAssignmentNode.value.type) {
                case "NUMBER_LITERAL":
                    return "(local.set $" + variableAssignmentNode.name + "(i32.const" + variableAssignmentNode.value.value + "))";
                case "IDENTIFIER":
                    return "(local.set $" + variableAssignmentNode.name + "(local.get $" + variableAssignmentNode.value.value + "))";
                case "BINARY_EXPRESSION":
                    return "(local.set $" + variableAssignmentNode.name + generateBinary(variableAssignmentNode.value) + ")";
            }
        } else {
            if(!vars[currentFunction].locals[variableAssignmentNode.name].isUsed){
                return "";
            }
            vars[currentFunction].locals[variableAssignmentNode.name].declared = true
            switch (variableAssignmentNode.value.type) {
                case "NUMBER_LITERAL":
                    return "(local $"+ variableAssignmentNode.name + " i32)(local.set $" + variableAssignmentNode.name + "(i32.const" + variableAssignmentNode.value.value + "))";
                case "IDENTIFIER":
                    return "(local $"+ variableAssignmentNode.name + " i32)(local.set $" + variableAssignmentNode.name + "(local.get $" + variableAssignmentNode.value.value + "))";
                case "BINARY_EXPRESSION":
                    return "(local $"+ variableAssignmentNode.name + " i32)(local.set $" + variableAssignmentNode.name + generateBinary(variableAssignmentNode.value);
            }
        }
    }

    function generateFunctionCall(functionCallNode){
        return "(call $" + functionCallNode.name + generateCallParams(functionCallNode.params) + ")";
    }

    function generateReturnStatement(returnStatementNode){
        if(returnStatementNode.name){
            return "(local.get $" + returnStatementNode.name + ")";
        }else{
            return "(i32.const $" + returnStatementNode.value + ")";
        }
    }

    function generateCallParams(params){
        var paramsString = '';
        for (const [key, value] of Object.entries(params)) {
            paramsString += "(i32.const" + value + ")";
          }
        return paramsString;
    }

    function generateBinary(binaryExpressionNode){
        var left = generateExpression(binaryExpressionNode.left);
        var right = generateExpression(binaryExpressionNode.right);
        var operationType = generateOperation(binaryExpressionNode.operator);
        return "(" + operationType + "(" + left + ")" + "(" + right + ")";
    }

    function generateExpression(node) {
        switch (node.type){
            case "NUMBER_LITERAL":
                return "(i32.const" + node.value + ")";
            case "IDENTIFIER":
                return "(local.get $" + node.value + ")";
            case "BINARY_EXPRESSION":
                return generateBinary(node)
        }
    }

    function generateOperation(operator){
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

    function generateIfStatement(ifStatementNode){
        if(ifStatementNode.valid){
            return "(if (" + generateBinary(ifStatementNode.condition) + ") (then" + generateStatements(ifStatementNode.consequent.statements) + ")";
        }
        else{
            return "(if (" + generateBinary(ifStatementNode.condition) + ") (then" + generateStatements(ifStatementNode.alternative.statements) + ")";
        }
    }

    function generateWhileStatement(whileStatementNode, functionName){
        if(whileStatementNode.valid){
            var loopname = generateLoopName();
            return "(loop $" + loopname + " " + generateStatements(whileStatementNode.statements , functionName) + "(br_if 1" + generateBinary(whileStatementNode.condition, functionName) + ")(br 0))";
        } else {
            return ""
        }
    } 

    function generateLoopName(){
        var loopname = loop + 1;
        return "loop" + loopname;
    }

    return generateModule(ast);

}