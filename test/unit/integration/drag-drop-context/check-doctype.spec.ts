import { JSDOM } from 'jsdom';
import checkDoctype from '../../../../src/view/drag-drop-context/check-doctype';

let consoleWarnSpy: jest.SpyInstance;

beforeEach(() => {
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  consoleWarnSpy.mockRestore();
});

it('should pass if using a html doctype', () => {
  const jsdom = new JSDOM(`<!doctype html><p>Hello world</p>`);

  checkDoctype(jsdom.window.document);

  expect(consoleWarnSpy).not.toHaveBeenCalled();
});

it('should fail if there is no doctype', () => {
  const jsdom = new JSDOM(`<html><body>Hello world</body></html>`);

  checkDoctype(jsdom.window.document);

  expect(consoleWarnSpy).toHaveBeenCalled();
});

it('should fail if there is a non-html5 doctype', () => {
  // HTML 4.01 Strict
  const jsdom = new JSDOM(
    `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><body>Hello world</body></html>`,
  );

  checkDoctype(jsdom.window.document);

  expect(consoleWarnSpy).toHaveBeenCalled();
});
