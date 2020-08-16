export function tokenize(sourceCode){
    var currentIndex = 0;
    var tokens = [];
    var line = 0;
    var index = 0;
    var ALPHA = /[a-zA-Z]/;
    var NUMERIC = /[0-9]/;
    var NEWLINE = /\n/;
    var WHITESPACE = /\s/;

    var keywords = [
        "while",
        "if",
        "func",
        "export",
        "return"
    ]

    while (currentIndex < sourceCode.length){
        var current = sourceCode[currentIndex];
        var next = sourceCode[currentIndex+1];
        //Skip Whitespace
        if (WHITESPACE.test(current)){
            currentIndex++;
            index++
            continue;
        }
        if (NEWLINE.test(current)) {
            line++
            index = 0;
            currentIndex++;
            continue;
        }
        //Read numeric string
        if (NUMERIC.test(current)) {
            var number = 0;
            while(NUMERIC.test(current) && currentIndex < sourceCode.length) {
                number += current;
                currentIndex++;
                current = sourceCode[currentIndex];
            }
            tokens.push({
                type: 'NUMBER',
                value: parseInt(number)
            });
            continue;
        }
        //Read alphabetical string
        if (ALPHA.test(current)) {
            var string = "";
            while(ALPHA.test(current) && currentIndex < sourceCode.length) {
                string += current;
                currentIndex++;
                current = sourceCode[currentIndex];
                
            }
            if (keywords.includes(string)){
                tokens.push({
                    type: 'KEYWORD',
                    value: string
                });
            }else tokens.push({
                type: 'IDENTIFIER',
                value: string
            });
            continue;
        }

        //Read string
        if (current === '"') {
            string = '';
            while(current !== '"' && currentIndex < sourceCode.length) {
                string += current;
                currentIndex++;
                current = sourceCode[currentIndex];
            }
            currentIndex++;
            tokens.push({
                type: 'STRING',
                value: string
            });
            continue;
        }
        switch (current) {
            case '=':
                if (next === '=') {
                    currentIndex++;
                    tokens.push({
                        type: 'OPERATOR',
                        value: '=='
                    })
                    currentIndex++;
                } else {
                    tokens.push({
                        type: 'OPERATOR',
                        value: '='
                    })
                    currentIndex++;
                }
                break;
            case '!':
                if (next === '=') {
                    currentIndex++;
                    tokens.push({
                        type: 'OPERATOR',
                        value: '!='
                    })
                    currentIndex++;
                } else {
                    tokens.push({
                        type: 'OPERATOR',
                        value: '!'
                    })
                    currentIndex++;
                }
                break;
            case '+':
                tokens.push({
                    type: 'OPERATOR',
                    value: '+'
                })
                currentIndex++;
                break;
            case '-':
                tokens.push({
                    type: 'OPERATOR',
                    value: '-'
                })
                currentIndex++;
                break;
            case '/':
                tokens.push({
                    type: 'OPERATOR',
                    value: '/'
                })
                currentIndex++;
                break;
            case '*':
                tokens.push({
                    type: 'OPERATOR',
                    value: '*'
                })
                currentIndex++;
                break;
            case '<':
                tokens.push({
                    type: 'OPERATOR',
                    value: '<'
                })
                currentIndex++;
                break;
            case '>':
                tokens.push({
                    type: 'OPERATOR',
                    value: '>'
                })
                currentIndex++;
                break;
            case ',':
                tokens.push({
                    type: 'COMMA',
                    value: ','
                })
                currentIndex++;
                break;
            case '{':
                tokens.push({
                    type: 'BRACE',
                    value: '{'
                })
                currentIndex++;
                break;
            case '}':
                tokens.push({
                    type: 'BRACE',
                    value: '}'
                })
                currentIndex++;
                break;
            case '(':
                tokens.push({
                    type: 'PAREN',
                    value: '('
                })
                currentIndex++;
                break;
            case ')':
                tokens.push({
                    type: 'PAREN',
                    value: ')'
                })
                currentIndex++;
                break;
            case '[':
                tokens.push({
                    type: 'BRACKET',
                    value: '['
                })
                currentIndex++;
                break;
            case ']':
                tokens.push({
                    type: 'BRACKET',
                    value: ']'
                })
                currentIndex++;
                break;
            default:
                throw new Error(
                    `Unsupported character ${current}`,
                    current
                );
                break;
        }
    }
    return tokens;
}