import * as React from "react";
import {ButtonProps} from "./Button";
import Evaluator from "../../evaluator/evaluator";
import { Box } from "@mui/system";
import { Grid, Paper, Typography, Popover, Button } from "@mui/material";
import CalcButton from "./Button";

interface Equation {
    expression: string;
    result: string;
}

const Calculator: React.FC<{}> = () => {
    const evaluator = new Evaluator();
    // Core state of the calculator
    const [expr, setExpr] = React.useState<string>("");
    const [prevExpr, setPrevExpr] = React.useState<string>("");
    const [register, setRegister] = React.useState<number>(0);
    const [history, setHistory] = React.useState<Equation[]>([]);

    // Validity checks for the expression
    const [dotExistInExpr, setDotExistInExpr] = React.useState(false);
    const [parenthesisBalance, setParenthesisBalance] = React.useState(0);
    const [expectValue, setExpectValue] = React.useState(true);
    
    const valueButtonPropsGenerator = (value: string): ButtonProps => ({
        type: "value",
        value: value,
        onClick: () => {
            setExpr(expr + value);
            if (expectValue) {
                setExpectValue(false);
            };
        },
    })

    const dotButtonProps: ButtonProps = {
        type: "value",
        value: ".",
        onClick: () => {
            if (!dotExistInExpr) {
                setExpr(expr + ".");
                setDotExistInExpr(true);
            }
        },
    };
    
    // const signs = ["+", "-", "*", "/", "^", "√"];
    const signButtonPropsGenerator = (sign: string): ButtonProps => ({
        type: "sign",
        value: sign,
        onClick: () => {
            if (expectValue && sign !== "-" && sign !== "√") {
                return;
            }
            setExpr(expr + sign);
            setDotExistInExpr(false);
            setExpectValue(true);
        }
    });

    const percentageClickHandler = () => {
        if (expectValue) {
            return;
        } else {
            setExpr(expr + "%");
        }
    };

    const percentageButtonProps: ButtonProps = {
        type: "sign",
        value: "%",
        onClick: () => percentageClickHandler(),
    }

    const brackets = ["(", ")"];
    const bracketClickHandler = (bracket: string) => {
        if (bracket === "(") {
            setParenthesisBalance(parenthesisBalance + 1);
            setExpr(expr + bracket);
        } else if (bracket === ")") {
            if (parenthesisBalance > 0) {
                setParenthesisBalance(parenthesisBalance - 1);
                setExpr(expr + bracket);
            } else {
                return;
            }
            setExpr(expr + bracket);
        }
    };
    
    const bracketButtonProps: ButtonProps[] = brackets.map((bracket) => ({
        type: "sign",
        value: bracket,
        onClick: () => bracketClickHandler(bracket),
    }));

    const memoryAddButtonProps: ButtonProps = {
        type: "sign",
        value: "M+",
        onClick: () => {
            equalClickHandler();
            setRegister(register + Number(expr));
        }
    }

    const memoryMinusButtonProps: ButtonProps = {
        type: "sign",
        value: "M-",
        onClick: () => {
            equalClickHandler();
            setRegister(register - Number(expr));
        }
    }

    const memoryRecallButtonProps: ButtonProps = {
        type: "sign",
        value: "MR",
        onClick: () => {
            setExpr(register.toString());
        }
    }

    const memoryClearButtonProps: ButtonProps = {
        type: "sign",
        value: "MC",
        onClick: () => {
            setRegister(0);
        }
    }

    const equalClickHandler = () => {
        try {
            let res = evaluator.evaluate(expr);
            setHistory([...history, {expression: expr, result: res.toString()}]);
            setPrevExpr(expr);
            setExpr(res.toString());
        } catch (err: any) {
            setPrevExpr(err.message);
        }
    };

    const equalButtonProps: ButtonProps = {
        type: "equal",
        value: "=",
        onClick: () => equalClickHandler(),
    };

    const delButtonProps: ButtonProps = {
        type: "sign",
        value: "DEL",
        onClick: () => {
            const newExpr = expr.slice(0, -1);
            setExpr(newExpr);
        },
    }

    const clearClickHandler = () => {
        setExpr("");
        setPrevExpr("");
        setDotExistInExpr(false);
        setExpectValue(true);
    };

    const clearButtonProps: ButtonProps = {
        type: "sign",
        value: "C",
        onClick: () => clearClickHandler(),
    }; 

    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
    const popoverClickHandler = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event?.currentTarget);
        setOpen(!open);
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Grid container maxWidth={650}>
                <Grid item xs={12}>
                    <Box 
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            padding: 2,
                        }}
                    >
                        <Typography component="h1" variant="h3" align="left">Calculator</Typography>
                        <Button variant="contained" onClick={popoverClickHandler}> History </Button>
                        <Popover
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={open}
                            onClose={popoverClickHandler}
                            anchorEl={anchorEl}
                            PaperProps={{
                                sx: { backgroundColor: "#242d44", borderRadius: 3},
                            }}
                        >
                            <Grid container minWidth={200}>
                                {history.length > 0 ? history.map((equation, index) => (
                                        <Grid container spacing={1} sx={{margin: 1}}>
                                            <Grid item sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} key={index}>
                                                <Button variant="contained" onClick={() => setExpr(equation.expression)}>{equation.expression}</Button>
                                            </Grid>
                                            <Grid item sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} key={index}>
                                                <Typography component="h1" variant="h6" align="left"> = </Typography> 
                                            </Grid>
                                            <Grid item sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} key={index}>
                                                <Button variant="contained" onClick={() => setExpr(equation.result)}>{equation.result}</Button>
                                            </Grid>
                                        </Grid>
                                    ))
                                : (
                                    <Grid item xs={12} sx={{display: 'flex', flexDirection: 'row', height: 60, alignItems:'center', alignContent:'center'}}>
                                        <Typography component="h1" variant="h6" align="center" width={150}>No history</Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Popover>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Paper
                        sx={{
                            p: 2,
                            width: "100%",
                            alignItems: 'right',
                            backgroundColor: "#191f2f",
                            height: 100,
                            borderRadius: 5,
                        }}
                    >
                        <Box 
                            sx={{
                                height: 30
                            }}
                        >
                            <Typography component="h1" variant="h6" align="right">{prevExpr}</Typography>
                        </Box>
                        <Typography component="h1" variant="h4" align="right">{expr}</Typography>
                    </Paper>
                </Grid>
                <Grid container xs={12} sx={{ backgroundColor: "#242d44", marginTop: 3, padding: 3, borderRadius: 5}}>
                    <CalcButton {...bracketButtonProps[0]} />
                    <CalcButton {...bracketButtonProps[1]} />
                    {/* TODO: Get more functionalities to round out the calculator */}
                    <CalcButton {...bracketButtonProps[0]} />
                    <CalcButton {...bracketButtonProps[0]} />
                    <CalcButton {...bracketButtonProps[0]} />

                    <CalcButton {...percentageButtonProps} />
                    <CalcButton {...signButtonPropsGenerator("√")} />
                    <CalcButton {...signButtonPropsGenerator("^")} />
                    <CalcButton {...signButtonPropsGenerator("+")} />
                    <CalcButton {...delButtonProps} />

                    <CalcButton {...memoryAddButtonProps} />
                    <CalcButton {...valueButtonPropsGenerator("7")} />
                    <CalcButton {...valueButtonPropsGenerator("8")} />
                    <CalcButton {...valueButtonPropsGenerator("9")} />
                    <CalcButton {...signButtonPropsGenerator("-")} />

                    <CalcButton {...memoryMinusButtonProps} />
                    <CalcButton {...valueButtonPropsGenerator("4")} />
                    <CalcButton {...valueButtonPropsGenerator("5")} />
                    <CalcButton {...valueButtonPropsGenerator("6")} />
                    <CalcButton {...signButtonPropsGenerator("/")} />

                    <CalcButton {...memoryRecallButtonProps} />
                    <CalcButton {...valueButtonPropsGenerator("1")} />
                    <CalcButton {...valueButtonPropsGenerator("2")} />
                    <CalcButton {...valueButtonPropsGenerator("3")} />
                    <CalcButton {...signButtonPropsGenerator("*")} />

                    <CalcButton {...memoryClearButtonProps} />
                    <CalcButton {...valueButtonPropsGenerator("0")} />
                    <CalcButton {...dotButtonProps} />
                    <CalcButton {...clearButtonProps} />
                    <CalcButton {...equalButtonProps} />
                </Grid>
            </Grid>
        </Box> 
    )
}

export default Calculator;