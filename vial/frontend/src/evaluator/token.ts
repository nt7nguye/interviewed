// Define the token types that can be parsed
export enum TokenType {
    Plus,
    Minus, 
    Mult,
    Div,
    Percentage,
    Power,
    SquareRoot,
    OpenParen,
    ClosedParen,
    Number,
    Error,
    EOF,
};

// Token is a struct to hold the type of token.
// If the token is a number, the value is stored in the value field.
// If the token is a symbol, the symbol is stored in the char field.
class Token {
    type: TokenType;
    value: number;
    symbol: string;

    constructor(type: TokenType, value: number, char: string) {
        this.type = type;
        this.value = value;
        this.symbol = char;
    } 
}

export default Token;