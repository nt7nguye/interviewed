import Token, { TokenType } from "./token";
import ASTNode, { ASTNodeType } from "./ast";

// Parser is a class that parses a string expression into an Abstract Syntax Tree.
// Abstract Syntax Tree is represented by the ASTNode class, a modified version of Binary Tree Node.
class Parser {
    token: Token;
    index: number;
    expr: string;
    
    constructor() {
        this.token = new Token(TokenType.EOF, 0, "");
        this.expr = "";
        this.index = 0;
    }

    // getNumber() returns the number at the current index of the expression.
    // Updates the index to the next character after the number.
    private getNumber(): number {
        let startIndex: number = this.index;
        while (this.index < this.expr.length && !isNaN(Number(this.expr[this.index]))) {
            this.index++;
        }
        if (this.expr[this.index] == ".") {
            this.index++;
        }
        while (this.index < this.expr.length && !isNaN(Number(this.expr[this.index]))) {
            this.index++;
        }

        return Number(this.expr.substring(startIndex, this.index));
    }

    // getNextToken() stores the next token in the token field.
    // Updates the index to the next character after the token.
    private getNextToken() {
        // Reset the token
        this.token.value = 0;
        this.token.symbol = "";

        // Check if we are at the end of the expression
        if (this.index >= this.expr.length) {
            this.token.type = TokenType.EOF;
            return;
        }

        // Check if the current character is a number
        if (!isNaN(Number(this.expr[this.index])) || this.expr[this.index] == ".") {
            this.token.type = TokenType.Number;
            this.token.value = this.getNumber();
            return;
        }

        switch (this.expr[this.index]) {
            case "+":
                this.token.type = TokenType.Plus; 
                break;
            case "-":
                this.token.type = TokenType.Minus;
                break;
            case "*":
                this.token.type = TokenType.Mult;
                break;
            case "/":
                this.token.type = TokenType.Div;
                break;
            case "%":
                this.token.type = TokenType.Percentage;
                break;
            case "^":
                this.token.type = TokenType.Power;
                break;
            case "√":
                this.token.type = TokenType.SquareRoot;
                break;
            case "(":
                this.token.type = TokenType.OpenParen;
                break;
            case ")":
                this.token.type = TokenType.ClosedParen;
                break;
            default:
                this.token.type = TokenType.Error;
                throw new Error("Parsing token: Invalid token encountered "  + this.expr[this.index] + " at index " + this.index);
        }

        this.index++;
        this.token.symbol = this.expr[this.index];
    }

    private matchChar(expected: string) {
        if (this.expr[this.index - 1] == expected) {
            this.getNextToken();
        } else {
            throw new Error("Expected " + expected + " but got " + this.expr[this.index - 1]);
        }
    }


    private createBinaryNode(type: ASTNodeType, left: ASTNode, right: ASTNode): ASTNode {
        return new ASTNode(type, 0, left, right);
    }

    private createUnaryNode(type: ASTNodeType, left: ASTNode): ASTNode {
        return new ASTNode(type, 0, left, null);
    }

    private createNumberNode(value: number): ASTNode {
        return new ASTNode(ASTNodeType.NumberValue, value, null, null);
    }

    private expression(): ASTNode {
        return this.createBinaryNode(ASTNodeType.OperatorPlus, this.term(), this.expression1());
    }

    private expression1(): ASTNode {
        if (this.token.type == TokenType.Plus) {
            this.getNextToken();
            // Reverse the order of the nodes
            let tnode = this.term();
            let e1node = this.expression1();
            return this.createBinaryNode(ASTNodeType.OperatorPlus, e1node, tnode);
        } else if (this.token.type == TokenType.Minus) {
            this.getNextToken();
            // Reverse the order of the nodes
            let tnode = this.term();
            let e1node = this.expression1();
            return this.createBinaryNode(ASTNodeType.OperatorMinus, e1node, tnode);
        } else {
            return this.createNumberNode(0);
        }
    }

    private term(): ASTNode {
        return this.createBinaryNode(ASTNodeType.OperatorMult, this.factor(), this.term1());
    }

    private term1(): ASTNode {
        if (this.token.type == TokenType.Mult) {
            this.getNextToken();
            let fnode = this.factor();
            let t1node = this.term1();
            return this.createBinaryNode(ASTNodeType.OperatorMult, t1node, fnode);
        } else if (this.token.type == TokenType.Div) {
            this.getNextToken();
            let fnode = this.factor();
            let t1node = this.term1();
            return this.createBinaryNode(ASTNodeType.OperatorDiv, t1node, fnode);
        } else if (this.token.type == TokenType.Percentage) {
            this.getNextToken();
            let t1node = this.term1();
            return this.createBinaryNode(ASTNodeType.OperatorDiv, t1node, this.createNumberNode(100));
        } else if (this.token.type == TokenType.Power) {
            this.getNextToken();
            let fnode = this.factor();
            let t1node = this.term1();
            return this.createBinaryNode(ASTNodeType.OperatorPower, t1node, fnode);
        } else {
            return this.createNumberNode(1);
        }
    }

    private factor(): ASTNode {
        if (this.token.type == TokenType.Number) {
            let node = this. createNumberNode(this.token.value);
            this.getNextToken();
            return node;
        } else if (this.token.type == TokenType.OpenParen) {
            this.getNextToken();
            let node = this.expression();
            this.matchChar(")");
            return node;
        } else if (this.token.type == TokenType.Minus) {
            this.getNextToken();
            return this.createUnaryNode(ASTNodeType.UnaryMinus, this.factor());
        } else if (this.token.type == TokenType.SquareRoot) {
            this.getNextToken();
            return this.createUnaryNode(ASTNodeType.UnarySquareRoot, this.factor());
        } else if (this.token.type == TokenType.EOF) {
            return this.createNumberNode(0);
        } else {
            throw new Error("Building tree: Invalid token " + this.token.symbol + " at index " + this.index);
        }
    }

    public parse(expr: string): ASTNode {
        this.expr = expr;
        this.index = 0;
        this.getNextToken();
        let tree = this.expression();
        if (process.env.NODE_ENV === "development") {
            console.log("Parsing tree: \n" + tree.toString());
        }
        return tree;
    }
}

export default Parser;