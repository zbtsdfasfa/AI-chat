let loginValidator = new FieldValidator('txtLoginId', async function (val) {
    if (!val) {
        return '账号不能为空 '
    }
    const result = await API.exists(val)
    if (result.data) {
        return '该账号已存在'
    }
})
let nicknameValidator = new FieldValidator('txtNickname', async function (val) {
    if (!val) {
        return '昵称不能为空 '
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

let txtLoginPwdConfirm = new FieldValidator('txtLoginPwdConfirm', function (val) {
    if (!val) {
        return '请输入密码确认 '
    }
    if (passwordValidator.input.value !== val) {
        return '两次输入的密码不一致'
    }
})

const from = $('.user-form')
from.onsubmit = async function (e) {
    e.preventDefault()
    const result = await FieldValidator.validate(
        loginValidator,
        nicknameValidator,
        passwordValidator,
        txtLoginPwdConfirm
    )
    console.log(result);
    if (!result) return
    // 发送注册请求
    const res = await API.reg(
        {
            loginId: loginValidator.input.value,
            nickname: nicknameValidator.input.value,
            loginPwd: passwordValidator.input.value

        }
    )
    if (res.code === 0) {
        alert('注册成功')
        location.href = './login.html'
        loginValidator.input.value = '',
            nicknameValidator.input.value = '',
            passwordValidator.input.value = '',
            txtLoginPwdConfirm.input.value = ''


    }
}