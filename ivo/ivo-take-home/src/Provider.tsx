import { createContext } from 'react';
import { BlockProps } from './components/Block';

type EditorContext = {
    mentions: Record<string, BlockProps>;
    updateMention: (id: string, value: BlockProps) => void;
};

export const EditorContext = createContext<EditorContext>({
    mentions: {},
    updateMention: () => {},
});
