import Hanzo from 'hanzojs/mobile';

//新建hanzo实例
const app = new Hanzo();

//注册模块
app.registerModule(require('../modules/helloworld'));

//引入路由
app.router(require('./router'));

//启动应用
const App = app.start();

export default App;
