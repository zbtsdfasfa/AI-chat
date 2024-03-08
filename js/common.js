// 封装一个函数用于获取页面元素，简化前端代码
function $(selector) {
    return document.querySelector(selector)
}

function $$(selector) {
    return document.querySelectorAll(selector)
}

// 用于创建元素
function $$$(tagName) {
    return document.createElement(tagName)
}