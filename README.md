# 汉化自ignis05的baro-save-editor项目
使用Vue-i18n进行了国际化处理，中文文本进行了初步人工校对，英文文本仅提取，未校对。<br>
使用Electron进行打包，因此可以进一步提供离线exe版本。<br><br>
原项目仓库：https://github.com/ignis05/baro-save-editor<br>
原作者在线服务：https://ignis05.github.io/baro-save-editor

# 潜渊症存档与潜艇编辑器工具

基于Vue3、Vite2、Vuetify3 Beta开发，完全基于客户端浏览器运行。<br>
PWA安装方式:<br><br>
![pwa showcase](https://i.imgur.com/QeCvVXQ.png)
<br>

## 关于项目部署

建议使用 [node.js](https://nodejs.org) 16.20.2，不建议使用高版本node.js（技术栈太老会导致不兼容）。

`npm install` - 安装node插件依赖

- `npm run dev` - 启动开发服务器
- `npm run build` - 启动 Web 构建，构建至./dist
- `npm run preview` - 启动本地服务器，预览生产构建版本
- `npm run electron:build` - 启动 Electron 构建
