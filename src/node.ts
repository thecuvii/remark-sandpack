import { assert } from 'console';
import { existsSync, readFileSync } from 'fs';
import readDirRecursive from 'fs-readdir-recursive';
import { basename, join } from 'path';

import type { CodeNodeElement, CodeNodeMeta, JsxNodeElement, SandpackFile, VFile } from './types';
import { isFilename } from './utils';

export const transformCode = async (jsxNode: JsxNodeElement, file: VFile): Promise<void> => {
  const files: Record<string, SandpackFile> = {};

  const visit = await import('unist-util-visit').then((module) => module.visit);

  visit(jsxNode, 'code', (codeNode: CodeNodeElement) => {
    const meta = resolveCodeMeta(codeNode);
    let code = codeNode.value;

    if (meta.dir) {
      const dir = join(process.cwd(), meta.dir);
      assert(existsSync(dir));
      const dirFiles = readDirRecursive(dir);
      dirFiles.forEach((path) => {
        // If user already define code block use same path, preserve all properties except code.
        const file = files[path] || {};
        files[path] = { ...file, code: readFileSync(join(dir, path), 'utf8') };
      });
    } else if (meta.file) {
      const filePath = join(file.cwd, meta.file);
      if (existsSync(filePath)) {
        code = readFileSync(filePath, 'utf8');

        meta.name ||= basename(filePath);
      }
    }

    if (meta.name) {
      let rawCode = '';

      /**
       * If user import code from dir, and use meta to define file property like below, we should preserve code from dir
       * ```dir=code/some-dir
       * ```
       *
       * ```src/index.js active
       * ```
       */
      rawCode = files[meta.name].code;

      files[meta.name] = {
        code: code || rawCode || '',
        active: meta.active,
        hidden: meta.hidden,
        readOnly: meta.readOnly,
      };
    }
  });

  await appendProp(jsxNode, 'files', files);
};

export const resolveCodeMeta = (codeNode: CodeNodeElement): CodeNodeMeta => {
  /**
   * First attribute is treated as `lang` by visitor
   */
  const joinedMeta = codeNode.lang + ' ' + (codeNode.meta || '');
  return joinedMeta
    .split(' ')
    .filter((meta) => meta.length)
    .reduce<CodeNodeMeta>((meta, expression) => {
      const [key, value] = expression.split('=');

      // TODO improve filename checking
      if (!value && isFilename(key)) {
        meta.name = key;
      } else {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        meta[key] = value || true;
      }
      return meta;
    }, {});
};

const appendProp = async (node: JsxNodeElement, propName: string, propValue: unknown): Promise<void> => {
  const valueToEstree = await import('estree-util-value-to-estree').then((module) => module.valueToEstree);

  node.attributes.push({
    type: 'mdxJsxAttribute',
    name: propName,
    value: {
      type: 'mdxJsxAttributeValueExpression',
      value: JSON.stringify(propValue),
      data: {
        estree: {
          type: 'Program',
          body: [
            {
              type: 'ExpressionStatement',
              expression: valueToEstree(propValue),
            },
          ],
          sourceType: 'module',
        },
      },
    },
  });
};
