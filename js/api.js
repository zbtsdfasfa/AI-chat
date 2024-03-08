var API = (function () {
    const BASE_URL = 'https://study.duyiedu.com'
    const TOKEN_KEY = 'token'

    // 封装一个get请求（用于携带token信息）
    function get(path) {
        const headers = {}
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, { headers })
    }

    // 封装一个post请求函数用于携带token
    function post(path, bodyObj) {
        const headers = {
            'Content-Type': 'application/json',
        }
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
            headers.authorization = `Bearer ${token}`
        }
        return fetch(BASE_URL + path, {
            headers,
            method: 'POST',
            body: JSON.stringify(bodyObj)
        })
    }

    // 注册接口reg
    async function reg(userInfo) {
        let res = await post("/api/user/reg", userInfo)
        let result = await res.json()
        return result
    }

    // 登录接口login
    async function login(loginInfo) {
        let res = await post('/api/user/login', loginInfo)
        const result = await res.json()
        // 获取token
        if (result.code === 0) {
            let token = res.headers.get('authorization')
            localStorage.setItem(TOKEN_KEY, token)
        }
        return result

    }


    // 验证账号exists
    async function exists(loginId) {
        let res = await get('/api/user/exists?loginId=' + loginId)
        let result = await res.json()
        return result
    }


    // 当前用户的登录信息profile
    async function profile() {
        let res = await get('/api/user/profile')
        let result = await res.json()
        return result

    }


    // 发送聊天信息sendChat
    async function sendChat(content) {
        let res = await post('/api/chat', { content })
        let result = await res.json()
        return result
    }


    // 获取聊天记录 gitHistory
    async function gitHistory() {
        let res = await get('/api/chat/history')
        let result = await res.json()
        return result
    }

    // 退出登录
    function loginOut() {
        localStorage.removeItem(TOKEN_KEY)
    }
    return {
        loginOut,
        gitHistory,
        sendChat,
        profile,
        exists,
        login,
        reg
    }
})()

// 为了防止全局函数污染，我们把说有的接口放在一个函数里面，避免全局污染；使用立即执行函数，并且要把每一个接口返回出去