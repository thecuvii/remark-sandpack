
# Write Live Code with Sandpack in MDX 


## Usage

### 1. Install
```shell
npm install remark-sandpack @codesandbox/sandpack-react
```

### 2. Register remark plugin

Maybe different for each MDX plugin you use, check out [examples](#Compatible) below.

### 3. Write your code

````md

import { Sandpack } from '@codesandbox/sandpack-react';


<Sandpack template="vanilla">
```js src/index.js
import "./styles.css";

document.getElementById("app").innerHTML = `
<h1>Hello Sandpack</h1>
`;

```

// import code from file, path should relative to process.cwd().
```css src/styles.css file=styles/globals.css
// those code will be ignored
h1{
  background: red;
}
```

```js readonly-file.js readOnly
// I'm  readonly
```
</Sandpack>

````

## Configuration

1. Sandpack component

All props will pass to `Sandpack` directly, except `files`.

````md

<Sandpack
  theme={theme}
  template="react"
  customSetup={{
    dependencies: {
      react: "17.0.2",
      "react-dom": "17.0.2",
      "react-scripts": "4.0.0",
    },
  }}
>
// markdown code blocks...
</Sandpack>

````

2. Code Blocks

All code blocks inside `<Sandpack></Sandpack>` will be parsed, then be passed as `files` prop to  `<Sandpack></Sandpack>`.

That means you can define [file property](https://sandpack.codesandbox.io/docs/getting-started/custom-content#advanced-usage) in code block meta.

````md

<Sandpack>
```js src/index.js active readOnly
console.log('Hello Sandpack')
```

```js src/hidden.js hidden
console.log('I'm hidden')
```
</Sandpack>

````

Code above will transform into:

```tsx
<Sandpack
  files={{
    "src/index.js": {
      code: `console.log('Hello Sandpack')`,
      active: true,
      readOnly: true,
    },
    "src/hidden.js": { 
      code: `console.log('I'm hidden')`, 
      hidden: true 
    },
  }}
/>;

```


## How it works

TODO

## Compatible  

- ✅ next.js with @next/mdx. 👉🏻[example](examples/next-mdx)
- ✅ next.js with next-remote-mdx. 👉🏻[example](examples/next-mdx-remote)
- ✅ gatsby.js . 👉🏻[example](examples/gatsby)
- ❎ docusaurus


## TODO 

- [ ](import folder directly)
