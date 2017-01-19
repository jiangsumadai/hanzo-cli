import { join } from 'path';
import vfs from 'vinyl-fs';
import through from 'through2';
import { error } from './log';

var exec = require('child_process').exec;
var fs = require('fs');

// 加载编码转换模块
var iconv = require('iconv-lite');

var moduleName = '';
var moduleNameIndex = '';

export default function (argv) {
  moduleNameIndex = argv.indexOf('--module');

  if (-1 == moduleNameIndex) {
    error("moduleName is needed, such as '--module test'");
    return;
  };

  if (argv.length == moduleNameIndex + 1) {
    error("moduleName is needed, such as '--module test'");
    return;
  };

  moduleName = argv[moduleNameIndex + 1];

  var cwd = join(__dirname, '../boilerplates/app/app/modules');

  vfs.src(['**/*'], { cwd: cwd, cwdbase: true, dot: true })
    .pipe(template(cwd))
    .pipe(vfs.dest(process.cwd()))
    .on('end', function () {
      console.log('congratulations, generate success!');
      exec('mv helloworld ' + moduleName, function (err, stdout, stderr) {
        modifyIndexFile();
        modifyModelFile();
        modifyView();
      });
    }).resume();
};

function modifyIndexFile() {
  var indexFile = process.cwd() + '/' + moduleName + '/index.js';
  var upperModuleName = moduleName[0].toUpperCase() + moduleName.substr(1, moduleName.length - 1);

  fs.readFile(indexFile, function (err, data) {
    if (err) {
      error('read ' + indexFile + ' fail: ' + err);
      return;
    } else {
      var source = iconv.decode(data, 'gbk');
      source = source.replace('Helloworld', upperModuleName);

      fs.writeFile(indexFile, source, function (err) {
        if (err) {
          error('write ' + indexFile + ' fail: ' + err);
          return;
        }
      });
    }
  });
}

function modifyModelFile() {
  var modelFile = process.cwd() + '/' + moduleName + '/model.js';

  fs.readFile(modelFile, function (err, data) {
    if (err) {
      error('read ' + modelFile + ' fail: ' + err);
      return;
    } else {
      var source = iconv.decode(data, 'gbk');
      source = source.replace('helloworld', moduleName);

      fs.writeFile(modelFile, source, function (err) {
        if (err) {
          error('write ' + modelFile + ' fail: ' + err);
          return;
        }
      });
    }
  });
}

function modifyView() {
  var viewFile = process.cwd() + '/' + moduleName + '/views/index.js';
  var upperModuleName = moduleName[0].toUpperCase() + moduleName.substr(1, moduleName.length - 1);

  fs.readFile(viewFile, function (err, data) {
    if (err) {
      error('read ' + viewFile + ' fail: ' + err);
      return;
    } else {
      var source = iconv.decode(data, 'gbk');
      source = source.replace(/Helloworld/g, upperModuleName);

      var viewStartIndex = source.indexOf('<View');
      var viewEndIndex = source.indexOf('</View');
      source = source.substr(0, viewStartIndex + 5) + '>'
        + source.substr(viewEndIndex, source.length - viewEndIndex);

      var styleSheetIndex = source.indexOf('StyleSheet.create({');
      var moduleExportIndex = source.indexOf('module.exports');
      source = source.substr(0, styleSheetIndex + 19) + '\n\n});\n\n'
        + source.substr(moduleExportIndex, source.length - moduleExportIndex);

      fs.writeFile(viewFile, source, function (err) {
        if (err) {
          error('write ' + viewFile + ' fail: ' + err);
          return;
        }
      });
    }
  });
}

function template(cwd) {
  return through.obj(function (file, enc, cb) {
    if (!file.stat.isFile()) {
      return cb();
    }

    //console.log('create', file.path.replace(cwd + '/', ''));
    this.push(file);
    cb();
  });
}
