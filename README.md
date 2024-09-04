
# Power MDX with Sandpack

<br/>
<br/>

## Usage

### 1. Install
```shell
npm install remark-sandpack @codesandbox/sandpack-react
```

### 2. Register remark plugin

It may be different for each MDX plugin you use. Check out [examples](#Compatible) below.

### 3. Write your code

````md

## 👍Sandpack is awesome.

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

👍Sandpack is awesome.
👍Sandpack is awesome.
👍Sandpack is awesome.

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

All code blocks contained within `<Sandpack>/Sandpack>` will be parsed and passed to `<Sandpack>/Sandpack>` as file props. 

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


## Compatible  

- ✅ next.js with @next/mdx. 👉🏻[example](examples/next-mdx)
- ✅ next.js with next-remote-mdx. 👉🏻[example](examples/next-mdx-remote)
- ✅ gatsby.js . 👉🏻[example](examples/gatsby)
- ✅ docusaurus.  👉🏻[example](examples/docusaurus)
- ✅ astro.  👉🏻[example](examples/astro)

❗️for docusaurus, you need upgrade mdx to v2, please checkout [docusaurus-mdx-2](https://github.com/pomber/docusaurus-mdx-2)

---
<br/>

## Advance Useage

### Custom Sandpack component

`remark-sandpack` will parse `<Sandpack></Sandpack>` jsx statements in your MDX files. If your custom sandpack component uses a different name, such as `SandpackEnhanced`. For instance:

```js
// in your mdx config
remarkPlugins: [[remarkSandpack, { componentName: 'SandpackEnhanced' }]],
```

Additionally, you can pass an array of component names if you want to support multiple components. For instance:

```js
// in your mdx config
remarkPlugins: [[remarkSandpack, { componentName: ['SandpackEnhanced', 'AnotherSandpackComponent'] }]],
```

This configuration allows you to use either `SandpackEnhanced` or `AnotherSandpackComponent` in your MDX files.

```mdx
// in your MDX file

import SandpackEnhanced from 'your-component-path'
import AnotherSandpackComponent from 'another-component-path'

<SandpackEnhanced>
// code blocks for SandpackEnhanced
</SandpackEnhanced>

<AnotherSandpackComponent>
// code blocks for AnotherSandpackComponent
</AnotherSandpackComponent>

```
By passing an array, you can utilize multiple custom sandpack components within your MDX files.

> Make sure your custom sandpack component receive `files` prop.
