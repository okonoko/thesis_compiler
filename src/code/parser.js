export function parse(tokens){
    var currentIndex = 0;
    var currentToken = tokens[currentIndex];
    var nextToken = tokens[currentIndex+1];
    var ast = [];

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
                default:
                    throw new Error(
                    `Unknown keyword ${currentToken.value}`,
                    currentToken
                    );
            }
        } else if (currentToken.type === "identifier") {
            if (nextToken.value === "=") {
              return parseVariableAssignment();
            } else {
              return parseFunctionCall();
            }
          }
    };
        
    function parseExpression(){
        switch (currentToken.type) {
          case "NUMBER":
            var node = {
              type: "NUMBER_LITERAL",
              value: Number(currentToken.value)
            };
            eatToken();
            return node;
          case "IDENTIFIER":
            node = { type: "IDENTIFIER", value: currentToken.value };
            eatToken();
            return node;
          case "(":
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


    function parsePrintStatement(){
        eatToken("print");
        return {
          type: "PRINT_STATEMENT",
          expression: parseExpression()
        };
    };

    function parseIfStatement(){
        eatToken("if");
        const condition = parseExpression();
        const consequent = {
            type: "CONSEQUENT",
            statements: []
        };
        eatToken("{");
        while (currentToken.type !== "}") {
            consequent.statements.push(parseStatement())
            eatToken();
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
        while (currentToken.type !== "}") {
            loop.statements.append(parseStatement())
            eatToken();
        }
        eatToken("}");
        return { type: "whileStatement", condition: condition, loop: loop};
    };

    function parseVariableAssignment(){
        const name = currentToken.value;
        eatToken();
        eatToken("=");
        return {
            type: "VARIABLE_ASSIGNNMENT",
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

    function parseFunctionCall(){
        eatToken("func");
        const name = currentToken.value;
        eatToken();
        const args = parseArguments();
        return {
            type: "FUNCTION_CALL",
            name,
            args
        };
    };

    function parseArguments(){
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
        eatToken("func");
        const name = currentToken.value;
        eatToken();
        const args = parseArguments();
        const statements = [];
        eatToken("{")
        while (currentToken.type !== "}") {
            statements.push(parseStatement())
            eatToken();
        }
        eatToken("}");

        return {
            type: "FUNCTION",
            name,
            args,
            statements
        };
    };

    ast.push({type: "FUNCTION", name: "MAIN"})

    while(currentIndex < tokens.length){
        ast.push(parseStatement())
    }
    return ast;
}