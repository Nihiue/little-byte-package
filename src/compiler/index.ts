import * as vm from 'vm';
import * as fs from 'fs';
import * as _module from 'module';
import * as v8 from 'v8';
import * as path from 'path';
import getByteSource from './bytesource';

v8.setFlagsFromString('--no-lazy');

export async function compileFile(filePath:string, outputDir = '') {
  outputDir = outputDir || path.dirname(filePath);  
  const code = await fs.promises.readFile(filePath, 'utf-8');
  const wrappedCode = _module.wrap(code);
  const script = new vm.Script(wrappedCode, {
    filename: filePath
  });

  const prefix = path.join(outputDir, path.basename(filePath).replace(/\.js$/i, ''));
  const bytecode = script.createCachedData();
  await fs.promises.writeFile(prefix + '.bytecode', bytecode);

  const souceMap = getByteSource(wrappedCode);
  await fs.promises.writeFile(prefix + '.bytesource', souceMap, 'utf-8');
}
