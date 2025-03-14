import { BlockProps } from "./Block";
import Block from "./Block";
import Mention from "./Mention";
import { TextProps } from "./Text";
import Text from './Text';
import { useContext } from "react";
import { EditorContext } from "../Provider";

export function isText(child: BlockProps | TextProps): child is TextProps{
    return !('type' in child);
}

function BlockChildRenderer(child: BlockProps | TextProps) {
    const { mentions, updateMention } = useContext(EditorContext);
    if (isText(child)) {
        return <Text {...child} />;
    }
    if (
        child.type === 'p' && !child.children
    ) {
        return <Text {...child} />;
    }
    if (child.type === 'mention') {
        if (child.id){
            if (!mentions[child.id]) {
                updateMention(child.id, {...child});
            }
            return <Mention id={child.id} key={child.id} />;
        }
    }
    return <Block {...child} />;
    
}

export default BlockChildRenderer;