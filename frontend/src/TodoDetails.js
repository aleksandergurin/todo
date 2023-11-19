import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {Button, Col, Row, Input, Flex} from "antd"

import {TODOS_PATH, CSRF_PATH} from "./Constants"


export const TodoDetails = () => {
    const navigate = useNavigate()
    const {todoId} = useParams()

    const [todo, setTodo] = useState(null)

    useEffect(() => {
        fetch(`${TODOS_PATH}${todoId}`)
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data => setTodo(data))
                    console.log(todo)
                }
            })
    }, [todoId])

    const deleteHandler = () => {
        fetch(CSRF_PATH)
            .then(response => {
                fetch(`${TODOS_PATH}${todo.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": response.headers.get('X-CSRFToken'),
                    },
                })
                    .then(response => {
                        if (response.status === 204) {
                            navigate("/")
                        }
                    })
                    .catch(error => console.error(error.message))
            })
            .catch(error => console.error(error.message))
    }

    const saveHandler = () => {
        fetch(CSRF_PATH)
            .then(response => {
                fetch(`${TODOS_PATH}${todoId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": response.headers.get('X-CSRFToken'),
                    },
                    body: JSON.stringify(todo),
                })
                    .then(response => {
                        if (response.status === 200) {
                            navigate("/")
                        }
                    })
                    .catch(error => console.error(error.message))
            })
            .catch(error => console.error(error.message))
    }

    return (
        <>
            <Row style={{paddingBottom: '20px'}}>
                <Col span={10}>
                    {
                        todo ?
                            <Input.TextArea
                                defaultValue={todo.content}
                                rows={4}
                                onChange={(e) => setTodo({
                                    ...todo,
                                    content: e.target.value,
                                })}
                            /> : '--'
                    }
                </Col>
                <Col span={14}></Col>
            </Row>
            <Row style={{paddingBottom: '20px'}}>
                <Col span={8}>
                    <Flex gap="small" wrap="wrap">
                        <Button
                            type="primary"
                            onClick={saveHandler}
                        >
                            Save
                        </Button>
                        <Button
                            danger
                            type="primary"
                            onClick={deleteHandler}
                        >
                            Delete todo
                        </Button>
                    </Flex>
                </Col>
                <Col span={16}></Col>
            </Row>
        </>
    )
}
