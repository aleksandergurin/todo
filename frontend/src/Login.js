import React from "react"
import {Button, Form, Input, notification} from "antd"
import {CSRF_PATH, LOGIN_PATH} from "./Constants"
import {useNavigate} from "react-router-dom"


export const Login = () => {
    const navigate = useNavigate()
    const [api, contextHolder] = notification.useNotification();
    const couldNotLogin = () => {
        api.error({
            key: "login-notification",
            message: "Unable to login",
            description: "Check login and password.",
        })
    }

    const onFinish = (values) => {
        fetch(CSRF_PATH)
            .then(tokenResp => {
                fetch(LOGIN_PATH, {
                        method: "POST",
                        headers: {
                            "Accept": "application/json",
                            "Content-Type": "application/json",
                            "X-CSRFToken": tokenResp.headers.get("X-CSRFToken"),
                        },
                        body: JSON.stringify(values)
                    }
                )
                    .then(response => {
                        if (response.status === 200) {
                            navigate("/")
                        } else if ([400].includes(response.status)) {
                            // Go to login page.
                            couldNotLogin()
                        }
                    })
                    .catch(error => console.error(error.message))
            })
    }

    return (
        <>
            {contextHolder}
            <Form
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                style={{maxWidth: 600}}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                        {
                            required: true,
                            message: "Enter username",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: "Enter password",
                        },
                    ]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}
