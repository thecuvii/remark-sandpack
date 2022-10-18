import { readFileSync } from 'fs';
import type { GetStaticProps, NextPage } from 'next';
import { join } from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import { remarkSandpack } from 'remark-sandpack';
import { MDXRemote } from 'next-mdx-remote';
import { Sandpack } from '@codesandbox/sandpack-react';
interface Props {
  source: string;
}

const Home: NextPage<Props> = ({ source }) => {
  return (
    <div>
      <MDXRemote compiledSource={source} components={{ Sandpack }} />
    </div>
  );
};

export default Home;

export const getStaticProps: GetStaticProps = async () => {
  const source = readFileSync(join(process.cwd(), '/mdx/content.mdx'), 'utf8');

  const { compiledSource } = await serialize(source, {
    mdxOptions: { remarkPlugins: [remarkSandpack], format: 'mdx' },
  });

  return {
    props: {
      source: compiledSource,
    },
  };
};
