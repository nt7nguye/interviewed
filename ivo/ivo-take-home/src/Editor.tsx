import { useState } from "react";
import Block, { BlockProps } from "./components/Block";
import { EditorContext } from "./Provider";

function Editor({input}: {input: BlockProps}) {
    const [mentions, setMentions] = useState<Record<string, BlockProps>>({});

    const updateMention = (id: string, value: BlockProps) => {
        setMentions({
            ...mentions,
            [id]: value,
        })
    };

    return (
        <EditorContext.Provider value={{ mentions, updateMention }}>
            <Block {...input} clauseLevel={0}/>
        </EditorContext.Provider>
    );
}

export default Editor;