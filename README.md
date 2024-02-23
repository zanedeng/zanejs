
<h1>@zanejs</h1>

采用 pnpm + changeset + typescript + vite + tsup 等技术栈, 使用 monorepo 管理项目。包名称是 @zanejs，将开发过程中经常用到的工具封装起来使用。

## 安装使用

- 获取项目代码

```bash
git clone http://github.com/zanedeng/zanejs.git
```

- 安装依赖

```bash
cd zanejs

# npm config set registry https://registry.npm.taobao.org

pnpm i --ignore-scripts

```

- 运行

```bash
pnpm dev
```

- 打包

```bash
pnpm build
```

- 删除目录下所有 node_modules 文件夹

```bash
find ./ -type d -name "node_modules" | xargs rm -rf
```
