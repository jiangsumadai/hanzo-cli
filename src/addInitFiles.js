import { join, basename } from 'path';
import vfs from 'vinyl-fs';
import through from 'through2';
import { error } from './log';

var fs = require('fs');

// 加载编码转换模块
var iconv = require('iconv-lite');

export default function (clientType, dest) {
  var cwd = '';
  if (clientType == 'app') {
    cwd = join(__dirname, '../boilerplates/app');
  } else {
    cwd = join(__dirname, '../boilerplates/web');
  }

  vfs.src(['**/*'], { cwd: cwd, cwdbase: true, dot: true })
    .pipe(template(cwd))
    .pipe(vfs.dest(dest))
    .on('end', function () {
      console.log('congratulations, init success!');
      modifyIndexFiles(dest);
    })
    .resume();
};

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

function modifyIndexFiles(dest) {
  var indexIosFile = dest + '/index.ios.js';
  var indexAndroidFile = dest + '/index.android.js';

  fs.readFile(indexIosFile, function (err, data) {
    if (err) {
      error('read index.ios.js fail: ' + err);
      return;
    } else {
      var source = iconv.decode(data, 'gbk');
      source = source.replace('AppName', basename(dest));

      fs.writeFile(indexIosFile, source, function (err) {
        if (err) {
          error('write index.ios.js fail: ' + err);
          return;
        } else {
          fs.writeFile(indexAndroidFile, source, function (err) {
            if (err) {
              error('write index.android.js fail: ' + err);
              return;
            }
          });
        }
      });
    }
  });
}
