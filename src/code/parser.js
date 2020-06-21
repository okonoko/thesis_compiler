export function parse(tokens){
    var currentIndex = 0;
    var currentToken = tokens[currentIndex];
    var nextToken = tokens[currentIndex+1];
    const ast = [];

    function updateTokens(){
        currentIndex++;
        currentToken = tokens[currentIndex];
        nextToken = tokens[currentIndex+1];
    };

    function eatToken(value){
        if (value && value !== currentToken.value) {
            throw new Error(
            `Unexpected token value, expected ${value}, received ${
                currentToken.value
            }`,
            currentToken
            );
        }
        updateTokens();
    };

    function parseStatement(){
        if (currentToken.type === "KEYWORD") {
            switch (currentToken.value) {
                case "print":
                    return parsePrintStatement();
                case "var":
                    return parseVariableDeclaration();
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
                parseExpression()
            }
          }
    };
        
    function parseExpression(){
        var node = {}
        switch (currentToken.type) {
          case "NUMBER":
            node = { type: "NUMBER_LITERAL", value: currentToken.value };
            eatToken();
            return node;
          case "IDENTIFIER":
            node = { type: "IDENTIFIER", value: currentToken.value };
            eatToken();
            return node;
          case "PARENS_OPEN":
            eatToken("(");
            const left = parseExpression();
            const operator = currentToken.value;
            eatToken();
            const right = parseExpression();
            eatToken(")");
            return {
              type: "BINARY_EXPRESSION",
              left,
              right,
              operator: operator
            };
          default:
            throw new Error(
              `Unexpected token type ${currentToken.type}`,
              currentToken
            );
        }
      };

    function parseVariableAssignment(){
        const name = currentToken.value;
        eatToken();
        eatToken("=");
        return {
            type: "VARIABLE_ASSIGNMENT",
            name,
            value: parseExpression()
        };
    };

    function parseVariableDeclaration(){
        eatToken("var");
        const name = currentToken.value;
        eatToken();
        eatToken("=");
        return {
            type: "VARIABLE_DECLARATION",
            name,
            value: parseExpression()
        };
    };

    function parsePrintStatement(){
        eatToken("print");
        return {
          type: "PRINT_STATEMENT",
          expression: parseExpression()
        };
    };

    function parseReturnStatement(){
        eatToken("return");
        const node = {
            type: "RETURN_STATEMENT",
            statements: []
        }
        eatToken("(");
        while (currentToken.value !== ")") {
            node.statements.push(parseStatement());
            if(currentToken.value !== ")"){
                eatToken()
            }
        }
        eatToken(")");
        return node;
    }

    function parseIfStatement(){
        eatToken("if");
        const condition = parseExpression();
        const consequent = {
            type: "CONSEQUENT",
            statements: []
        };
        eatToken("{");
        while (currentToken.value !== "}") {
            consequent.statements.push(parseStatement());
            if(currentToken.value !== "}"){
                eatToken()
            }
        }
        eatToken("}");
        return { type: "IF_STATEMENT", condition: condition, consequent: consequent};
      };

    function parseWhileStatement(){
        eatToken("while");
        const condition = parseExpression();
        const loop = {
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
        return { type: "WHILE_STATEMENT", condition: condition, loop: loop};
    };

    

    function parseFunctionCall(){
        eatToken("func");
        const name = currentToken.value;
        eatToken();
        const params = parseParameters();
        return {
            type: "FUNCTION_CALL",
            name,
            params
        };
    };

    function parseParameters(){
        const args = [];
        eatToken("(");
        while (currentToken.value !== ")") {
            args.push(parseExpression());
            if (currentToken.value !== ")") {
            eatToken(",");
            }
        }
        eatToken(")");
        return args;
    }

    function parseFunctionDeclaration(){
        eatToken()
        if(currentToken.value === "export"){
            eatToken("export");
            const isExport = true;
        }
        const name = currentToken.value;
        eatToken();
        const params = parseParameters();
        const statements = [];
        eatToken("{");
        while (currentToken.value !== "}") {
            statements.push(parseStatement());
            if(currentToken.value !== "}"){
                eatToken()
            }
        }
        eatToken("}");

        return {
            type: "FUNCTION_DECLARATION",
            name,
            params,
            statements,
            isExport
        };
    };

    while(currentIndex < tokens.length){
        ast.push(parseStatement())
    }
    const tree = {type: "MODULE", functions: ast};
    return tree;
}