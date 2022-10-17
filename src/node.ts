import { existsSync, readFileSync } from 'fs';
import { basename, join } from 'path';

import type { CodeNodeElement, CodeNodeMeta, JsxNodeElement, SandpackFiles, VFile } from './types';
import { isFilename } from './utils';

export const transformCode = async (jsxNode: JsxNodeElement, file: VFile): Promise<void> => {
  const files: SandpackFiles = {};

  const visit = await import('unist-util-visit').then((module) => module.visit);

  visit(jsxNode, 'code', (codeNode: CodeNodeElement) => {
    const meta = resolveCodeMeta(codeNode);
    let code = codeNode.value;

    if (meta.file) {
      const filePath = join(file.cwd, meta.file);
      if (existsSync(filePath)) {
        code = readFileSync(filePath, 'utf8');

        meta.name ||= basename(filePath);
      }
    }

    if (meta.name) {
      files[meta.name] = {
        code: code || '',
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
