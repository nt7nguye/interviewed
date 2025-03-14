import BlockChildRenderer, { isText } from "./BlockChildRender";
import Text, { type TextProps } from "./Text";
import type { Mark } from "./types";

type BlockType =  'mention' | 'clause' | 'ul' | 'li' | 'lic' | 'block' |'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';


export type BlockProps = {
    title: string;  
    type: BlockType;
    children: (BlockProps | TextProps)[];
    // mention only
    id?: string;
    value?: string;
    // clause keeping track
    // I think it should be done in global state if we want to add/remove clauses
    // but this should work for now.
    clauseLevel: number;
} & Mark;


function Block({title, type, children, ...mark}: BlockProps) {
    if (type === "block") {
        let number = 0;
        return (
            <>
                {children.map(
                    (child) => {
                        if (!isText(child) && child.type === 'clause') {
                            number += 1;
                        }
                        return (<BlockChildRenderer {...mark} {...child} clauseNumbering={number}/>)
                    }
                )}
            </>
        )
    }

    if (type === 'clause') {
        let numbering = String(mark.clauseNumbering || 1);
        if (mark.clauseLevel === 1) {
            numbering = `${'abcdefghijklmnopqrstuvwxyz'[mark.clauseNumbering || 0]}. `;
        }
        const toRender = [{
            text: numbering + '.'
        }, ...children]
        return (
            <div>
                {toRender.map(
                    (child, index) => <BlockChildRenderer key={index} {...mark} {...child} clauseLevel={mark.clauseLevel + 1} clauseNumbering={0}/>
                )}
            </div>
        )
    }

    // TODO: persist changes would be cool
    const handleInput = (e: React.ChangeEvent<HTMLParagraphElement>) => {
        console.log(e.target.innerText);
    }
    if (type === 'p') {
        return (
            <p contentEditable suppressContentEditableWarning onInput={handleInput} style={{ display: 'inline'}}>
                {children.map(
                    (child, index) => <BlockChildRenderer key={index} {...mark} {...child} />
                )}
            </p>
        )
    }

    const Component = type;
    return (
        <Component title={title} >
            {children.map(
                (child, index) => <BlockChildRenderer key={index} {...mark} {...child} />
            )}
        </Component>
    );
}

export default Block;