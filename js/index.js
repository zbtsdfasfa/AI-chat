// 第一步要验证登录是否成功，登录成功就获取用户的登录信息，验证失败就跳转到登录页面
(async function () {
    let result = await API.profile()
    const user = result.data
    if (!user) {
        // 登录失败
        alert('登录已过期，请重新登录')
        location.href = './login.html'
        return
    }
    // 登录成功
    // 获取dom元素
    let doms = {
        aside: {
            nickname: $('#nickname'),
            loginId: $('#loginId')
        },
        close: $('.close'),
        chatContainer: $('.chat-container'),
        txtMsg: $('#txtMsg'),
        msgContainer: $('.msg-container'),
    }
    // 渲染用户信息 
    function setUserInfo() {
        doms.aside.nickname.innerText = user.nickname
        doms.aside.loginId.innerText = user.loginId
    }
    setUserInfo()

    // 加载历史记录
    await loadHistory();
    async function loadHistory() {
        const resp = await API.gitHistory();
        for (const item of resp.data) {
            addChat(item);
        }
        scrollBottom();
    }

    // 发送消息事件
    doms.msgContainer.onsubmit = function (e) {
        e.preventDefault();
        sendChat();
    };

    // 根据消息对象，将其添加到页面中
    /*
    content: "你几岁啦？"
    createdAt: 1651213093992
    from: "haha"
    to: null
    */
    function addChat(chatInfo) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (chatInfo.from) {
            div.classList.add('me');
        }
        const img = $$$('img');
        img.className = 'chat-avatar';
        img.src = chatInfo.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';

        const content = $$$('div');
        content.className = 'chat-content';
        content.innerText = chatInfo.content;

        const date = $$$('div');
        date.className = 'chat-date';
        date.innerText = formatDate(chatInfo.createdAt);

        div.appendChild(img);
        div.appendChild(content);
        div.appendChild(date);

        doms.chatContainer.appendChild(div);
    }

    // 让聊天区域的滚动条滚动到底
    function scrollBottom() {
        doms.chatContainer.scrollTop = doms.chatContainer.scrollHeight;
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    async function sendChat() {
        const content = doms.txtMsg.value.trim();
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            to: null,
            createdAt: Date.now(),
            content,
        });
        doms.txtMsg.value = '';
        scrollBottom();
        const resp = await API.sendChat(content);
        addChat({
            from: null,
            to: user.loginId,
            ...resp.data,
        });
        scrollBottom();
    }
    window.sendChat = sendChat;

    // 注销
    doms.close.onclick = function () {
        API.loginOut()
        location.href = './login.html'
    }
})()