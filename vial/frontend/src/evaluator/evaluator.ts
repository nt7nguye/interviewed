import ASTNode, { ASTNodeType } from "./ast";
import Parser from "./parser";

class Evaluator {
    ast: ASTNode | null;
    parser: Parser;

    constructor() {
        this.ast = null;
        this.parser = new Parser();
    }

    private evaluateAST(node: ASTNode | null): number {
        if (node == null) {
            throw new Error("Invalid AST tree");   
        }
        
        // Special case for power operator
        // It's the only binary operator that is not commutative
        // So we need to check if the left or right node is a power operator
        if (node.right != null && node.right.type == ASTNodeType.OperatorPower) {
            node.right.type = ASTNodeType.OperatorMult;
            return Math.pow(this.evaluateAST(node.left), this.evaluateAST(node.right));
        } else if (node.left != null && node.left.type === ASTNodeType.OperatorPower) {
            node.left.type = ASTNodeType.OperatorMult;
            return Math.pow(this.evaluateAST(node.right), this.evaluateAST(node.left));
        };

        if (node.type == ASTNodeType.NumberValue) {
            return node.value;
        } else if (node.type == ASTNodeType.UnaryMinus) {
            return -this.evaluateAST(node.left);
        } else if (node.type == ASTNodeType.UnarySquareRoot) {
            return Math.sqrt(this.evaluateAST(node.left));
        } else {
            let left = this.evaluateAST(node.left);
            let right = this.evaluateAST(node.right);

            if (node.type == ASTNodeType.OperatorPlus) {
                return left + right;
            } else if (node.type == ASTNodeType.OperatorMinus) {
                return left - right;
            } else if (node.type == ASTNodeType.OperatorMult) {
                return left * right;
            } else if (node.type == ASTNodeType.OperatorDiv) {
                return left / right;
            } else {
                throw new Error("Invalid AST tree");
            }
        }
    }

    public evaluate(expr: string): number {
        this.ast = this.parser.parse(expr);
        return this.evaluateAST(this.ast);
    }
}

export default Evaluator;