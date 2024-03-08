let loginValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '账号不能为空 '
    }
})
let passwordValidator = new FieldValidator('txtLoginPwd', function (val) {
    if (!val) {
        return '密码不能为空 '
    }
    if (val.length < 6) {
        return '密码长度不能小于6位'
    }

})
const from = $('.user-form')
from.onsubmit = async function (e) {
    e.preventDefault()
    const result = await FieldValidator.validate(
        loginValidator,
        passwordValidator,
    )
    console.log(result);
    if (!result) return
    // 发送注册请求
    const res = await API.login(
        {
            loginId: loginValidator.input.value,
            loginPwd: passwordValidator.input.value

        }
    )
    if (res.code === 0) {
        alert('登录成功')
        location.href = './index.html'
        loginValidator.input.value = '',
            passwordValidator.input.value = ''


    }
}