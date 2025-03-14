### To run

```
cd ivo-take-home
npm run dev
```

### Summary

1. No styling framework, just basic React code.
2. Loads value from `input.json`. I kept the component props very close the input structure for easier serialization (and potential deserialization).
3. Basic editing and styling through `Cmd + B`, `Cmd + I`, etc... works
4. Most of the rendering is in `Text` component where it renders a span with styling
5. Each node in the input is a `Block` component that can be nested and render different tags (`h1...h6`, `li`, `p`, ...)
6. `Clause` is custom implemented through keeping track of the current clause level and whats the ordered of the clause element at that level.
7. `Mention` is implemented through a global context that keeps track of `{id: BlockProps}` for extensibility

### Final view
<img width="1512" alt="image" src="https://github.com/user-attachments/assets/52ae0aae-9edc-404f-8aaf-6924d835f3c4" />

Editing is working with `contentEditable`, but obviously need global context to navigate between nodes

https://github.com/user-attachments/assets/a605393e-fb4e-42d2-b0a9-f28dec9174b7



### Issues that I couldn't fix in time

#### 1. Mentions are completely re-rendered on every input, this is why the cursor jumps back to index 0 while you're editing the mention component

a) Normal block component doesn't re-renbder

https://github.com/user-attachments/assets/73de8621-2224-45de-963f-11e3ae96e163

b) Mention component re-renders everything

https://github.com/user-attachments/assets/16c9e182-29cd-4ddb-9f50-ec575f2b3169




#### 2. I spent too much time on the mention re-rendering I couldn't get the clause working in time 😭 

a) The number is in a different line because the first child of `clause` likes to be in its own block :( 

b) I should have indentation based on level

c) The numbering logic is kinda broken 




