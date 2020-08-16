export function parse(tokens){
    var currentIndex = 0;
    var currentToken = tokens[currentIndex];
    var nextToken = tokens[currentIndex+1];
    var currentFunction = null;
    var level = 0;
    var ast = [];
    var vars = {};

    function eatToken(value){
            if (value && value !== currentToken.value) {
                throw new Error(
                `Unexpected token value, expected ${value}, received ${
                    currentToken.value
                }`,
                currentToken
                );
            }
            currentIndex++;
            currentToken = tokens[currentIndex];
            nextToken = tokens[currentIndex+1];
    };

    function parseStatement(){
        if (currentToken.type === "KEYWORD") {
            switch (currentToken.value) {
                case "while":
                    return parseWhileStatement();
                case "if":
                    return parseIfStatement();
                case "func":
                    return parseFunctionDeclaration();
                case "call":
                    return parseFunctionCall();
                case "return":
                    return parseReturnStatement();
                default:
                    throw new Error(
                    `Unknown keyword ${currentToken.value}`,
                    currentToken
                    );
            }
        } else if (currentToken.type === "IDENTIFIER") {
            if (nextToken.value === "=") {
                return parseVariableAssignment();
            } else {
                throw new Error(
                    `Unexpected token type ${nextToken.type}`,
                    nextToken
                  );
            }
        } else {
            throw new Error(
              `Unexpected token type ${currentToken.type}`,
              currentToken
            );
        }
    };
        
    function parseExpression(varName){
        var node = {}
        switch (currentToken.type) {
          case "NUMBER":
            node = {type: "NUMBER_LITERAL", value: currentToken.value}
            vars[currentFunction].locals[varName] = {value: currentToken.value, isUsed: false};
            eatToken();
            return node;
          case "IDENTIFIER":
            if (!vars[currentFunction].locals[currentToken.value] && !vars[currentFunction].params.includes(currentToken.value))
            {
                throw new Error( 
                    `Variable undefined ${currentToken.value}`,
                    currentToken.value
                ); 
            } else {
                console.log(vars)
                //node = {type: "NUMBER_LITERAL", value: vars[currentFunction].locals[currentToken.value].value.value}
                node = {type: "IDENTIFIER", value: vars[currentFunction].locals[currentToken.value].value.value}
                vars[currentFunction].locals[currentToken.value].isUsed = true;
            }
            eatToken();
            return node;
          case "PAREN":
            eatToken("(");
            var left = parseExpression();
            var operator = currentToken.value;
            eatToken();
            var right = parseExpression();
            eatToken(")");
            if(operator == "/" && right == 0){
                throw new Error( 
                    `Division by zero!`
                ); 
            }
            var formula = left.value + operator + right.value;
            // if (left.type === "NUMBER_LITERAL" && right.type == "NUMBER_LITERAL"){          
            //     return {type: 'NUMBER_LITERAL', value: eval(formula)}
            // }
            // if(operator == "*"){
            //     if (left.value === 0 || right.value === 0){
            //         return {type: "NUMBER_LITERAL", value: 0}
            //     }
            //     if (left.value === 1){
            //         return {type: right.type, value: right.value}
            //     }
            //     if (right.value === 1){
            //         return {type: left.type, value: left.value}
            //     }
            // }
            return {type: "BINARY_EXPRESSION", left, right, operator: operator};
            
          default:
            throw new Error(
              `Unexpected token type ${currentToken.type}`,
            );
        }
      };

    function parseReturnStatement(){
        eatToken('return');
        if(vars[currentFunction].returned){
            throw new Error(
                `Too many returns in ${currentFunction}`,
              );
        }
        if(currentToken.type === "IDENTIFIER"){
            if (vars[currentFunction].locals[currentToken.value]){
                var node = {type: 'RETURN_STATEMENT', name: currentToken.value};
            } else {
                throw new Error(
                    `Undefined variable ${currentToken.value}`,
                );
            } 
        } else {
            node = {type: 'RETURN_STATEMENT', value: currentToken.value};
        } 
        vars[currentFunction].returned = true;
        eatToken()
        return node;
    }

    function parseVariableAssignment(){
        var varName = currentToken.value;
        eatToken();
        eatToken("=");
        var node =  {
            type: "VARIABLE_ASSIGNMENT",
            name: varName,
            value: parseExpression(varName)
        };
        vars[currentFunction].locals[varName] = {value: node.value, isUsed: false, declared: false}
        return node;
    };


    function parseIfStatement(){
        eatToken("if");
        var condition = parseExpression();
        var consequent = {
            type: "CONSEQUENT",
            statements: []
        };
        var alternative = {
            type: "ALTERNATIVE",
            statements: []
        };
        eatToken("{");
        while (currentToken.value !== "}") {
            consequent.statements.push(parseStatement());
            if(currentToken.value !== "}"){
                eatToken()
            }
        }
        eatToken("}")
        if (currentToken.value === "else"){
            eatToken("else");
            eatToken("{");
            while (currentToken.value !== "}") {
                alternative.statements.push(parseStatement());
                if(currentToken.value !== "}"){
                    eatToken()
                }
            }
            eatToken("}");
        }
        return { type: "IF_STATEMENT", condition: condition, consequent: consequent, alternative: alternative, valid: eval(condition)};
      };

    function parseWhileStatement(){
        eatToken("while");
        var condition = parseExpression();
        var loop = {
            type: "WHILE_LOOP",
            statements: []
        };
        eatToken("{")
        while (currentToken.value !== "}") {
            loop.statements.push(parseStatement());
            if(currentToken.value !== "}"){
                eatToken()
            }
        }
        eatToken("}");
        return { type: "WHILE_STATEMENT", condition: condition, loop: loop, valid: eval(condition)};
    };

    

    function parseFunctionCall(){
        eatToken("func");
        var name = currentToken.value;
        var paramNames = vars[currentFunction].params;
        var params = {};
        var paramIndex = 0;
        if (vars[name]){
            vars[name].isUsed = true
        } else {
            throw new Error( 
                `CALLING UNDEFINED FUNCTION ${name}`,
                currentToken
            );
        }
        var mother = vars[name].motherFunction;
        if( !mother && !vars[mother.functions].includes(name)){
            throw new Error( 
                `CALLING the FUNCTION ${name} in wrong scope`,
                currentToken
            );
        }
        eatToken();
        eatToken("(");
        while (currentToken.value !== ")") {
            if (currentToken.type === "NUMBER_LITERAL"){ 
                throw new Error( 
                    `INCORRECT ARGUMENT TYPE ${currentToken.type}`,
                    currentToken
                );
            }
            params[String(paramNames[paramIndex])] = currentToken.value;
            paramIndex++;
            eatToken();
            if (currentToken.value !== ")") {
            eatToken(",");
            }
        }
        eatToken(")");
        return {
            type: "FUNCTION_CALL",
            name,
            params
        };
    };

    function parseFunctionDeclaration(){
        var motherFunction = currentFunction;
        var params = [];
        var statements = [];
        var isExport = false; 
        eatToken('func')
        if(currentToken.value === "export"){
            if(level > 0){
                throw new Error( 
                    'You can not nest export functions'
                );
            }
            eatToken("export");
            isExport = true;
        }
        var name = currentToken.value;
        if (vars[String(name)]){
            throw new Error( 
                `THIS FUNCTION, ${currentToken.value} IS ALREADY DECLARED`,
                currentToken
            );
        }
        currentFunction = name;
        if(motherFunction){
            vars.motherFunction.localFunctions.push(name);
        }
        vars[String(name)] = {motherFunction, params, localFunctions: [], locals: {}, isUsed: false, returned: false, isExport};
        level += 1;
        eatToken();
        eatToken("(");
        while (currentToken.value !== ")") {
            if(params.includes(currentToken.value)){
                throw new Error( 
                    `WRONG PARAMETER NAME, ${currentToken.value} IS ALREADY used`,
                    currentToken
                );
            }
            params.push(currentToken.value);
            eatToken();
            if (currentToken.value !== ")") {
            eatToken(",");
            }
        }
        eatToken(")");
        eatToken("{");
        while (currentToken.value !== "}") {
            statements.push(parseStatement());
            if(currentToken.value !== "}"){
                //eatToken()
            }
        }
        eatToken("}");
        level -= 1;
        currentFunction = motherFunction;
        return {
            type: "FUNCTION_DEFINITION",
            name,
            params,
            statements,
            isExport
        };
    };

    while(currentIndex < tokens.length){
        ast.push(parseStatement())
    }
    var tree = {type: "MODULE", functions: ast, vars: vars};
    return tree;
}