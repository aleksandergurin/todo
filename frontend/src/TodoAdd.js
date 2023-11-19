import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Col, Input, Row} from "antd"

import {TODOS_PATH, CSRF_PATH} from "./Constants"

const {TextArea} = Input

export const TodoAdd = () => {
    const navigate = useNavigate()
    const [content, setContent] = useState("")

    const handleSubmitTodo = () => {
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
                            navigate("/")
                        }
                    })
                    .catch(error => console.error(error.message))
            })
    }

    return (
        <>
            <Row style={{paddingBottom: "20px"}}>
                <Col span={8}>
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
                        Submit
                    </Button>
                </Col>
                <Col span={16}></Col>
            </Row>
        </>
    )
}
