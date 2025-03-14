import BlockChildRenderer from "./BlockChildRender";
import { memo, useContext, } from 'react';
import { EditorContext } from "../Provider";
import { TextProps } from "./Text";

export type MentionProps = {id :string}

function Mention({ id }: MentionProps) {
    const { mentions, updateMention } = useContext(EditorContext);

    // On first mount, check if there's a value in the mention map, if not populate it
    const handleInput = (e: React.ChangeEvent<HTMLParagraphElement>) => {
        // This doesn't handle child changes yet. But it works for 1 level
        if (e.target.innerText !== mentions[id].value) {
            const props = mentions[id];
            updateMention(id, { ...props, value: e.target.innerText, children: [{
                ...props.children[0],
                text: e.target.innerText
            } as TextProps] });
        }
    }

    return (
        <div 
            key={id}
            style={{
                // Mention doesn't inherit style if i understand the spec
                backgroundColor: mentions[id]?.color || 'white', 
                display: 'inline-block',
                padding: '0 4px',  // horizontal padding
                borderRadius: '4px'
            }}
            contentEditable
            onInput={handleInput}
        >
            <div>
                {mentions[id] && mentions[id].children.map((child) => (
                    <BlockChildRenderer {...child}/>
                ))}
            </div>
        </div>
    )
}

export default memo(Mention, (prevProps, nextProps) => {
    // Only re-render if ID changes
    // Ignore value changes since they're handled by contentEditable
    return prevProps.id === nextProps.id;
});