/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:43:41
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-05 14:58:07
 * @FilePath: \midway-project\script\create-module.js
 * @Description: 描述一下
 * 
 */
const fs = require('fs');
const path = require('path');

if (process.argv.length > 3) {
    console.log('只能有一个参数');
    process.exit();
}

function firstChartToUpperCase(str) {
    return str[0].toUpperCase() + str.substring(1)
}

const moduleName = process.argv.pop();

console.log(moduleName);

const resolve = (p) => path.resolve(__dirname, p)

// 如果没有module文件夹就创建文件夹
if (!fs.existsSync(resolve('../src/module'))) {
    fs.mkdirSync(resolve('../src/module'))
}

fs.mkdirSync(resolve(`../src/module/${moduleName}`))
fs.mkdirSync(resolve(`../src/module/${moduleName}/controller`))
fs.mkdirSync(resolve(`../src/module/${moduleName}/service`))
fs.mkdirSync(resolve(`../src/module/${moduleName}/entity`))
fs.mkdirSync(resolve(`../src/module/${moduleName}/dto`))
fs.mkdirSync(resolve(`../src/module/${moduleName}/vo`))

let controllerContent = fs.readFileSync(resolve('./template/controller.template')).toString()
let serviceContent = fs.readFileSync(resolve('./template/service.template')).toString()
let entityContent = fs.readFileSync(resolve('./template/entity.template')).toString()
let dtoContent = fs.readFileSync(resolve('./template/dto.template')).toString()
let voContent = fs.readFileSync(resolve('./template/vo.template')).toString()

let name;
const filename = moduleName;
let varName = moduleName;
let tableName = moduleName;
let route = moduleName;

if (moduleName.includes('.')) {
    name = moduleName.split('.').map(x => firstChartToUpperCase(x)).join('')
    varName = moduleName.split('.').filter((_, index) => index > 0).map(x => firstChartToUpperCase(x)).join('')
    varName = [moduleName.split('.')[0], varName.join('')]
    tableName = moduleName.replace(/\./g, '_');
    route = moduleName.replace(/\./g, '-');
} else {
    name = moduleName[0].toUpperCase() + moduleName.substring(1);
}

controllerContent = controllerContent.replace(/\$1/g, name).replace(/\$2/g, filename).replace(/\$3/g, varName).replace(/\$5/g, route);
serviceContent = serviceContent.replace(/\$1/g, name).replace(/\$2/g, filename).replace(/\$3/g, varName);
entityContent = entityContent.replace(/\$1/g, name).replace(/\$2/g, filename).replace(/\$3/g, varName).replace(/\$4/g, tableName);
dtoContent = dtoContent.replace(/\$1/g, name).replace(/\$2/g, filename).replace(/\$3/g, varName);
voContent = voContent.replace(/\$1/g, name).replace(/\$2/g, filename).replace(/\$3/g, varName);

fs.writeFileSync(resolve(`../src/module/${moduleName}/controller/${moduleName}.ts`), controllerContent);

fs.writeFileSync(resolve(`../src/module/${moduleName}/service/${moduleName}.ts`), serviceContent);

fs.writeFileSync(resolve(`../src/module/${moduleName}/entity/${moduleName}.ts`), entityContent);

fs.writeFileSync(resolve(`../src/module/${moduleName}/dto/${moduleName}.ts`), dtoContent);

fs.writeFileSync(resolve(`../src/module/${moduleName}/vo/${moduleName}.ts`), voContent);