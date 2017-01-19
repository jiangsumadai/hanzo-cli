import { join } from 'path';

import which from 'which';

var exec = require('child_process').exec;
var fs = require('fs');

// 加载编码转换模块
var iconv = require('iconv-lite');

export default function (projectName, clientType) {
  var npm = findNpm();
  var reactNative = findReactNative();

  var cmdStr = 'react-native init ' + projectName;
  console.log('downloading...');

  var dest = join(process.cwd(), projectName);
  exec(cmdStr, function (err, stdout, stderr) {
    modifyPackage(dest, ()=> {
      exec('cd ' + dest + ' && npm install', function (err, stdout, stderr) {
        console.log('download finished, initializing module');
        require('./addInitFiles')(clientType, dest);
      });
    });
  });
};

function findNpm() {
  var npms = ['tnpm', 'cnpm', 'npm'];
  for (var i = 0; i < npms.length; i++) {
    try {
      which.sync(npms[i]);
      console.log('use npm: ' + npms[i]);
      return npms[i];
    } catch (e) {}
  }

  throw new Error('please install npm');
}

function findReactNative() {
  var reactNative = 'react-native';
  try {
    which.sync(reactNative);
    console.log('use react-native');
    return reactNative;
  } catch (e) {}

  throw new Error('please run: npm install -g react-native-cli');
}

function modifyPackage(dest, callback) {
  var packageFile = dest + '/package.json';

  fs.readFile(packageFile, function (err, data) {
    if (err) {
      error('read package.json fail: ' + err);
      return;
    } else {
      var source = iconv.decode(data, 'gbk');

      var dependenciesIndex = source.indexOf('"dependencies": {');
      source = source.substr(0, dependenciesIndex + 17) + '\n"hanzojs": "^0.0.7",'
        + source.substr(dependenciesIndex + 18, source.length - dependenciesIndex - 18);

      fs.writeFile(packageFile, source, function (err) {
        if (err) {
          error('write package.json fail: ' + err);
          return;
        } else {
          callback();
        }
      });
    }
  });
}
