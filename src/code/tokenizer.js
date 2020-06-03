export function tokenize(rawCode){
    var currentIndex = 0;
    var tokens = [];

    var ALPHA = /[a-zA-Z]/;
    var NEWLINE = /\n/;
    var NUMERIC = /[0-9]/;
    var WHITESPACE = /\s/;

    var keywords = [
        "var",
        "print",
        "while",
        "if",
        "func",
        "return",
        "export",
    ]

    while (currentIndex < rawCode.length){
        var current = rawCode[currentIndex];
        var next = rawCode[currentIndex+1];
        //Skip Whitespace
        if (WHITESPACE.test(current) || NEWLINE.test(current)) {
            currentIndex++;
            continue;
        }
        //Read numeric string
        if (NUMERIC.test(current)) {
            var number = 0;
            while(NUMERIC.test(current) && currentIndex < rawCode.length) {
                number += current;
                currentIndex++;
                current = rawCode[currentIndex];
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
            while(ALPHA.test(current) && currentIndex < rawCode.length) {
                string += current;
                currentIndex++;
                current = rawCode[currentIndex];
                
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
            while(current !== '"' && currentIndex < rawCode.length) {
                string += current;
                currentIndex++;
                current = rawCode[currentIndex];
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
                        type: 'ASSIGN',
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
            case ';':
                tokens.push({
                    type: 'SEMICOLON',
                    value: ';'
                })
                currentIndex++;
                break;
            case ':':
                tokens.push({
                    type: 'COLON',
                    value: ':'
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
                    type: 'CURLY_OPEN',
                    value: '{'
                })
                currentIndex++;
                break;
            case '}':
                tokens.push({
                    type: 'CURLY_CLOSE',
                    value: '}'
                })
                currentIndex++;
                break;
            case '(':
                tokens.push({
                    type: 'PARENS_OPEN',
                    value: '('
                })
                currentIndex++;
                break;
            case ')':
                tokens.push({
                    type: 'PARENS_CLOSE',
                    value: ')'
                })
                currentIndex++;
                break;
            case '[':
                tokens.push({
                    type: 'BRACKET_OPEN',
                    value: '['
                })
                currentIndex++;
                break;
            case ']':
                tokens.push({
                    type: 'BRACKET_CLOSE',
                    value: ']'
                })
                currentIndex++;
                break;
            default:
                tokens.push({
                    type: 'BAD',
                    value: current
                })
                break;
        }
    }
    return tokens;
}