import {useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Col, Input, Row, Typography, AutoComplete} from "antd"

import {
    TODOS_PATH,
    CSRF_PATH,
    QUICK_NOTIF_DURATION_SEC,
    GEO_PATH,
} from "./Constants"
import {uniqueGeoData} from "./utils"

const {TextArea} = Input

export const TodoAdd = ({notifApi}) => {
    const navigate = useNavigate()
    const [content, setContent] = useState("")
    const [location, setLocation] = useState(null)
    const [locationOptions, setLocationOptions] = useState(null)

    const handleSubmitTodo = () => {
        const errorNotif = {
            message: "Unable to add task",
            description: "Try again later.",
        }
        const successNotif = {
            message: "Task added",
            duration: QUICK_NOTIF_DURATION_SEC,
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
                    body: JSON.stringify({
                        content,
                        city: location?.name,
                        state: location?.state,
                        country: location?.country,
                    }),
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
                <AutoComplete
                    allowClear
                    style={{width: "250px"}}
                    options={locationOptions}
                    onSelect={(_, optionObj) => setLocation(optionObj.data)}
                    onSearch={searchLocation}
                    placeholder="City"
                />
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
