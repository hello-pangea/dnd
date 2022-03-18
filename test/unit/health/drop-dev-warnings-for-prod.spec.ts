/**
 * @jest-environment node
 */
import child from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const exec = promisify(child.exec);
const readFile = promisify(fs.readFile);

// 120 second timeout
jest.setTimeout(120 * 1000);

async function clean() {
  await exec('pnpm build:clean');
}

beforeAll(async () => {
  await clean();
  await exec('pnpm build:dist');
});

afterAll(clean);

it('should contain warnings in development', async () => {
  const filePath = path.resolve(__dirname, '../../../dist/dnd.js');
  const contents: string = await readFile(filePath, 'utf-8');

  expect(contents.includes('This is a development only message')).toBe(true);
});

it('should not contain warnings in production', async () => {
  const filePath = path.resolve(__dirname, '../../../dist/dnd.min.js');
  const contents: string = await readFile(filePath, 'utf-8');

  expect(contents.includes('This is a development only message')).toBe(false);

  // Checking there are no console.* messages
  // Using regex so we can get really nice error messages

  // https://regexr.com/40pno
  // .*? is a lazy match - will grab as little as possible
  const regex = /console\.\w+\(.*?\)/g;

  const matches: string[] | null = contents.match(regex);
  expect(matches).toEqual(null);
});
