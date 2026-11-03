import fs from 'node:fs/promises';

/** Serverless tracing may omit an empty directory. An absent journal is empty, not an error. */
export async function articleNames(directory: string): Promise<string[]> {
  try {
    return (await fs.readdir(directory)).filter((name) => name.endsWith('.mdx'));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return [];
    throw error;
  }
}
