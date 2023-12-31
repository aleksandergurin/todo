import {useEffect, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {Button, Col, Row, Input, Flex, Checkbox, Typography, AutoComplete} from "antd"

import {
    TODOS_PATH,
    CSRF_PATH,
    TODO_STATUS_DONE,
    TODO_STATUS_ACTIVE,
    QUICK_NOTIF_DURATION_SEC, GEO_PATH,
} from "./Constants"
import {joinCityStateCountry, uniqueGeoData} from "./utils"


export const TodoDetails = ({notifApi}) => {
    const navigate = useNavigate()
    const {todoId} = useParams()

    const [todo, setTodo] = useState(null)
    const [locationOptions, setLocationOptions] = useState(null)

    useEffect(() => {
        fetch(`${TODOS_PATH}/${todoId}`)
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data => setTodo(data))
                }
            })
    }, [todoId])

    const deleteHandler = () => {
        const errorNotif = {
            message: "Unable to delete task",
            description: "Try again later.",
        }
        const successNotif = {
            message: "Task deleted",
            duration: QUICK_NOTIF_DURATION_SEC,
            onClose: () => navigate("/"),
        }
        fetch(CSRF_PATH)
            .then(response => {
                fetch(`${TODOS_PATH}/${todo.id}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": response.headers.get("X-CSRFToken"),
                    },
                })
                    .then(response => {
                        if (response.status === 204) {
                            notifApi.success(successNotif)
                        } else {
                            notifApi.error(errorNotif)
                        }
                    })
                    .catch(error => notifApi.error(errorNotif))
            })
            .catch(error => notifApi.error(errorNotif))
    }

    const saveHandler = () => {
        const errorNotif = {
            message: "Unable to save task",
            description: "Try again later.",
        }
        const successNotif = {
            message: "Task saved",
            duration: QUICK_NOTIF_DURATION_SEC,
            onClose: () => navigate("/"),
        }
        fetch(CSRF_PATH)
            .then(response => {
                fetch(`${TODOS_PATH}/${todoId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": response.headers.get("X-CSRFToken"),
                    },
                    body: JSON.stringify(todo),
                })
                    .then(response => {
                        if (response.status === 200) {
                            notifApi.success(successNotif)
                        } else {
                            notifApi.error(errorNotif)
                        }
                    })
                    .catch(error => notifApi.error(errorNotif))
            })
            .catch(error => notifApi.error(errorNotif))
    }

    const doneHandler = (e) => {
        const status = e.target.checked ? TODO_STATUS_DONE : TODO_STATUS_ACTIVE
        setTodo(prev => ({...prev, status}))
    }

    const searchLocation = (query) => {
        if (!query) {
            setLocationOptions(null)
            return
        }

        const errorNotif = {
            message: "Unable to obtain GEO data",
            description: "Try again later.",
        }

        fetch(`${GEO_PATH}/${encodeURI(query)}`)
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data =>
                        setLocationOptions(uniqueGeoData(data.data))
                    )
                } else {
                    notifApi.error(errorNotif)
                }
            })
            .catch(error => notifApi.error(errorNotif))
    }

    const changeLocation = (_, {data}) => {
        setTodo(prev => ({
            ...prev,
            city: data?.name,
            state: data?.state,
            country: data?.country,
        }))
    }

    const clearLocation = () => {
        setTodo(prev => ({...prev, city: null, state: null, country: null}))
    }

    return (
        <>
            <Row style={{paddingBottom: "20px"}}>
                <Col span={10}>
                    {
                        todo ?
                            <>
                                <Typography.Title level={5}>Task content</Typography.Title>
                                <Input.TextArea
                                    defaultValue={todo.content}
                                    rows={4}
                                    onChange={(e) => setTodo(prev => ({
                                        ...prev,
                                        content: e.target.value,
                                    }))}
                                />
                            </> : "Not found"
                    }
                </Col>
                <Col span={14}></Col>
            </Row>
            {todo ?
                <>
                    <Row style={{paddingBottom: "20px"}}>
                        <AutoComplete
                            allowClear
                            style={{width: "250px"}}
                            defaultValue={joinCityStateCountry(todo?.city, todo?.state, todo?.country)}
                            options={locationOptions}
                            onSelect={changeLocation}
                            onSearch={searchLocation}
                            onClear={clearLocation}
                            placeholder="City"
                        />
                    </Row>
                    <Row style={{paddingBottom: "20px"}}>
                        <Col span={8}>
                            <Checkbox
                                checked={todo?.status === TODO_STATUS_DONE}
                                onChange={doneHandler}
                            >
                                Done
                            </Checkbox>
                        </Col>
                        <Col span={16}></Col>
                    </Row>
                    <Row>
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
                                    Delete task
                                </Button>
                            </Flex>
                        </Col>
                        <Col span={16}></Col>
                    </Row>
                </> : null
            }
        </>
    )
}
