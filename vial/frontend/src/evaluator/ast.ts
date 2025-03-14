export enum ASTNodeType{
    Undefined, 
    OperatorPlus,
    OperatorMinus,
    OperatorMult,
    OperatorDiv,
    OperatorPower,
    UnaryMinus,
    UnarySquareRoot,
    NumberValue,
}

class ASTNode {
    type: ASTNodeType;
    value: number;
    left: ASTNode | null;
    right: ASTNode | null;

    constructor (type: ASTNodeType, value: number, left: ASTNode | null, right: ASTNode | null) {
        this.type = type;
        this.value = value;
        this.left = left;
        this.right = right;
    }

    public toString(tabCount: number = 0): string {
        if (this.type == ASTNodeType.NumberValue) {
            return "\t".repeat(tabCount) + "value" + this.value + "\n";
        }
        let output: string = "\t".repeat(tabCount) + "operator: " + ASTNodeType[this.type] + "\n";
        if (this.left != null) {
            output += "\t".repeat(tabCount) + "Left:\n " + this.left.toString(tabCount+1) + "\n";
        } else {
            output += "\t".repeat(tabCount) + "Left: null" + "\n";
        }

        if (this.right != null) {
            output += "\t".repeat(tabCount) + "Right:\n" + this.right.toString(tabCount+1) + "\n";
        } else {
            output += "\t".repeat(tabCount) + "Right: null" + "\n";  
        }
        return output;
    }
}

export default ASTNode;