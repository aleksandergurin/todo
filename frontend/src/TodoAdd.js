import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Col, Input, Row, Typography} from "antd"

import {
    TODOS_PATH,
    CSRF_PATH,
    QUICK_NOTIF_DURATION_SEC,
} from "./Constants"

const {TextArea} = Input

export const TodoAdd = ({notifApi}) => {
    const navigate = useNavigate()
    const [content, setContent] = useState("")

    const handleSubmitTodo = () => {
        const errorNotif = {
            message: "Unable to add task",
            description: "Try again later.",
        }
        const successNotif = {
            message: "Task added",
            duration: QUICK_NOTIF_DURATION_SEC, // sec
            onClose: () => navigate("/"),
        }
        fetch(CSRF_PATH)
            .then(response => {
                fetch(TODOS_PATH, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": response.headers.get("X-CSRFToken"),
                    },
                    body: JSON.stringify({content}),
                })
                    .then(response => {
                        if (response.status === 201) {
                            notifApi.success(successNotif)
                        } else {
                            notifApi.error(errorNotif)
                        }
                    })
                    .catch(error => notifApi.error(errorNotif))
            })
            .catch(error => notifApi.error(errorNotif))
    }

    return (
        <>
            <Row style={{paddingBottom: "20px"}}>
                <Col span={8}>
                    <Typography.Title level={5}>Task content</Typography.Title>
                    <TextArea
                        rows={4}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Col>
                <Col span={16}></Col>
            </Row>
            <Row style={{paddingBottom: "20px"}}>
                <Col span={8}>
                    <Button
                        type="primary"
                        onClick={handleSubmitTodo}
                    >
                        Save
                    </Button>
                </Col>
                <Col span={16}></Col>
            </Row>
        </>
    )
}
