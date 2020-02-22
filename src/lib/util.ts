import { readFileSync } from 'fs';
import { resolve } from 'path';
import { TicketBotOptions } from '../Client';
import { Defaults } from '../Constants';

const markdownCharRegex = /(\*|_|~|`|\|\||<|>)/g;
const ordinalSuffixes = ['th', 'st', 'nd', 'rd'];
type codeblockLanguage = '1c' | 'abnf' | 'accesslog' | 'actionscript' | 'ada' | 'apache' | 'applescript' | 'cpp' | 'arduino' | 'armasm' | 'xml' | 'asciidoc' | 'aspectj' | 'autohotkey' | 'autoit' | 'avrasm' | 'awk' | 'axapta' | 'bash' | 'basic' | 'bnf' | 'brainfuck' | 'cal' | 'capnproto' | 'ceylon' | 'clean' | 'clojure' | 'clojure-repl' | 'cmake' | 'coffeescript' | 'coq' | 'cos' | 'crmsh' | 'crystal' | 'cs' | 'csp' | 'css' | 'd' | 'markdown' | 'dart' | 'delphi' | 'diff' | 'django' | 'dns' | 'dockerfile' | 'dos' | 'dsconfig' | 'dts' | 'dust' | 'ebnf' | 'elixir' | 'elm' | 'ruby' | 'erb' | 'erlang-repl' | 'erlang' | 'excel' | 'fix' | 'flix' | 'fortran' | 'fsharp' | 'gams' | 'gauss' | 'gcode' | 'gherkin' | 'glsl' | 'go' | 'golo' | 'gradle' | 'groovy' | 'haml' | 'handlebars' | 'haskell' | 'haxe' | 'hsp' | 'htmlbars' | 'http' | 'hy' | 'inform7' | 'ini' | 'irpf90' | 'java' | 'javascript' | 'jboss-cli' | 'json' | 'julia' | 'kotlin' | 'lasso' | 'ldif' | 'leaf' | 'less' | 'lisp' | 'livecodeserver' | 'livescript' | 'llvm' | 'lsl' | 'lua' | 'makefile' | 'mathematica' | 'matlab' | 'maxima' | 'mel' | 'mercury' | 'mipsasm' | 'mizar' | 'perl' | 'mojolicious' | 'monkey' | 'moonscript' | 'n1ql' | 'nginx' | 'nimrod' | 'nix' | 'nsis' | 'objectivec' | 'ocaml' | 'openscad' | 'oxygene' | 'parser3' | 'pf' | 'php' | 'pony' | 'powershell' | 'processing' | 'profile' | 'prolog' | 'protobuf' | 'puppet' | 'purebasic' | 'python' | 'q' | 'qml' | 'r' | 'rib' | 'roboconf' | 'rsl' | 'ruleslanguage' | 'rust' | 'scala' | 'scheme' | 'scilab' | 'scss' | 'shell' | 'smali' | 'smalltalk' | 'sml' | 'sqf' | 'sql' | 'stan' | 'stata' | 'step21' | 'stylus' | 'subunit' | 'swift' | 'taggerscript' | 'yaml' | 'tap' | 'tcl' | 'tex' | 'thrift' | 'tp' | 'twig' | 'typescript' | 'vala' | 'vbnet' | 'vbscript' | 'vbscript-html' | 'verilog' | 'vhdl' | 'vim' | 'x86asm' | 'xl' | 'xquery' | 'zephir';

export const dateToString = (time: Date): string =>
  new Date(time)
    .toString()
    .split(' ')
    .slice(1, 5)
    .join(' ');

export const randomInArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

export const loadConfig = (): TicketBotOptions =>
  JSON.parse(readFileSync(resolve(__dirname, '..', '..', 'config.json'), 'utf8'));

export const paginate = <T>(
  arr: T[],
  pageIndex: number,
  resultsPerPage: number = Defaults.RESULTS_PER_PAGE,
): T[] =>
  arr.slice(
    pageIndex * resultsPerPage,
    (pageIndex + 1) * resultsPerPage
  );

export const codeblock = (text: string, language?: codeblockLanguage): string =>
  `\`\`\`${language ?? ''}\n${text}\n\`\`\``;

export const escapeMarkdown = (text: string): string =>
  text.replace(markdownCharRegex, '\\$1');

export const getOrdinal = (number: number): string => {
  const base = number % 100;
  const suffix = ordinalSuffixes[(base - 20) % 10] || ordinalSuffixes[base] || ordinalSuffixes[0];
  return number.toString() + suffix;
};

export const capitalize = (text: string): string =>
  text.slice(0, 1).toUpperCase() + text.slice(1);

export const unique = (elem, index, self): boolean =>
  self.indexOf(elem) === index;

export const escapeRegex = (str: string): string =>
  str.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');

export const humanConcatenate: {
  (...params: string[]);
  (params: string[]);
} = (...strings): string => {
  strings = Array.isArray(strings[0])
    ? strings[0]
    : strings;

  return strings.length === 1
    ? strings[0]
    : `${strings.slice(0, -1).join(', ')} and ${strings[strings.length - 1]}`;
};

export type Awaitable<T> = Promise<T> | T;
