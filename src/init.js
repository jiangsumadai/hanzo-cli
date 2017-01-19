import { join } from 'path';
import { sync as emptyDir } from 'empty-dir';
import { error } from './log';

var clientType = '';
var projectName = '';
var dest = '';
var clientTypeIndex = '';
var projectNameIndex = '';

function init(argv) {
  clientTypeIndex = argv.indexOf('--client');
  projectNameIndex = argv.indexOf('--project');

  if (-1 == clientTypeIndex) {
    error("clientType is needed, such as '--client app'");
    return;
  };

  if (argv[clientTypeIndex + 1] == '--project' || argv.length == clientTypeIndex + 1) {
    error("clientType is needed, such as '--client app' or '--client web'");
    return;
  };

  if (argv[clientTypeIndex + 1] !== 'app' && argv[clientTypeIndex + 1] !== 'web') {
    error('only app and web is valid for clientType');
    return;
  };

  if (-1 == projectNameIndex) {
    error("projectName is needed, such as '--project test'");
    return;
  };

  if (argv[projectNameIndex + 1] == '--client' || argv.length == projectNameIndex + 1) {
    error("projectName is needed, such as '--project test'");
    return;
  };

  clientType = argv[clientTypeIndex + 1];
  projectName = argv[projectNameIndex + 1];

  dest = join(process.cwd(), projectName);
  if (emptyDir(dest)) {
    error(dest + ', the file already exists, please change projectName');
    process.exit(1);
  }

  console.log('Creating a new hanzo app in ' + dest + '.');

  require('./reactNativeInit')(projectName, clientType);
}

export default init;
