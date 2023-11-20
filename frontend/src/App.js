import {useEffect, useState} from "react"
import {Route, Routes, useNavigate} from "react-router-dom"
import {Button, Layout, notification} from "antd"

import "./App.css"
import {LOGOUT_PATH, WHOAMI_PATH} from "./Constants"
import {TodosTable} from "./Todos"
import {NoPage} from "./NoPage"
import {TodoAdd} from "./TodoAdd"
import {TodoDetails} from "./TodoDetails"
import {Login} from "./Login"

const {Header, Content} = Layout

const layoutStyle = {
    backgroundColor: "white",
}

const headerStyle = {
    height: 64,
    backgroundColor: "lightGray",
}

const contentStyle = {
    marginTop: "20px",
}

const App = ({history}) => {
    const navigate = useNavigate()
    const [username, setUsername] = useState(null)
    const [
        notifApi,
        contextHolder,
    ] = notification.useNotification()

    useEffect(() => {
        fetch(WHOAMI_PATH)
            .then(response => {
                if (response.status === 200) {
                    response.json().then(data => {
                        if (data.isAuthenticated) {
                            setUsername(data.username)
                        }
                    })
                } else if ([401, 403].includes(response.status)) {
                    // Go to login page.
                    navigate("/login")
                }
            })
            .catch(error => console.error(error.message))
    }, [navigate])

    const logoutHandle = () => {
        fetch(LOGOUT_PATH)
            .then(() => {
                setUsername(null)
                navigate("/login")
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="App">
            {contextHolder}
            <Layout style={layoutStyle}>
                {username ?
                    <Header style={headerStyle}>
                        <div>
                            <b>{username}</b> |
                            <Button
                                type="link"
                                onClick={logoutHandle}
                            >
                                Logout
                            </Button>
                        </div>
                    </Header> : null
                }
                <Content style={contentStyle}>
                    <Routes>
                        <Route path="/login" element={<Login notifApi={notifApi} />} />
                        <Route path="/" element={<TodosTable />} />
                        <Route path="/add" element={<TodoAdd notifApi={notifApi} />} />
                        <Route path="/todo/:todoId" element={<TodoDetails notifApi={notifApi} />} />
                        <Route path="*" element={<NoPage />} />
                    </Routes>
                </Content>
            </Layout>
        </div>
    )
}

export default App
