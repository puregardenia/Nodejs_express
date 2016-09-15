# 模板引擎

## ejs模板引擎
> ejs 的标签系统非常简单，它只有以下三种标签：

```
    <% code %>：JavaScript 代码。
    <%= code %>：显示替换过 HTML 特殊字符的内容。(模板变量)
    <%- code %>：显示原始 HTML 内容。(比如include)
```