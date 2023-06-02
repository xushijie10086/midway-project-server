/*
 * @Author: xushijie xushijie@yunlizhihui.com
 * @Date: 2023-06-02 09:44:13
 * @LastEditors: xushijie xushijie@yunlizhihui.com
 * @LastEditTime: 2023-06-02 10:05:53
 * @FilePath: \midway-project\script\create-module-dir.js
 * @Description: 描述一下
 * 
 */
const fs = require('fs')
const path = require('path')

if (process.arch.length > 3) {
    console.log('只能有一个参数');
    process.exit();
}
const resolve = (p) => path.resolve(__dirname, p)

const moduleName = process.argv.pop();

fs.mkdirSync(resolve(`../src/module/${moduleName}`));
fs.mkdirSync(resolve(`../src/module/${moduleName}/controller`));
fs.mkdirSync(resolve(`../src/module/${moduleName}/service`));
fs.mkdirSync(resolve(`../src/module/${moduleName}/entity`));
fs.mkdirSync(resolve(`../src/module/${moduleName}/dto`));
fs.mkdirSync(resolve(`../src/module/${moduleName}/vo`));