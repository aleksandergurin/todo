import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Table} from "antd"

import {
    TODOS_PATH,
    CSRF_PATH,
    PAGE_SIZE,
    TODO_STATUS_DONE,
    TODO_STATUS_ACTIVE, QUICK_NOTIF_DURATION_SEC,
} from "./Constants"


const columns = [
    {
        title: "Content",
        dataIndex: "content",
        render: (text, record) => record.status === TODO_STATUS_DONE ?
            <s>{text}</s> : text,
    },
    {
        title: "Created",
        dataIndex: "created",
        render: (text, record) => record.status === TODO_STATUS_DONE ?
            <s>{text}</s> : text,
    },
]


export const TodosTable = ({notifApi}) => {
    const navigate = useNavigate()
    const [todos, setTodos] = useState(null)
    const [current, setCurrent] = useState(1)

    useEffect(() => {
        fetch(`${TODOS_PATH}?page=${current}`)
            .then(response => response.json())
            .then(data => setTodos(data))
            .catch(error => notifApi.error({
                message: "Unable to receive tasks",
                description: "Try again later.",
            }))
    }, [current])

    const handleTableChange = (pagination, filters, sorter) =>
        setCurrent(pagination.current)

    const rowSelection = {
        hideSelectAll: true,
        onSelect: (record, selected) => {
            const status = selected ? TODO_STATUS_DONE : TODO_STATUS_ACTIVE
            setTodos(prev => ({
                ...prev,
                results: prev.results.map(todo => {
                    if (todo.id !== record.id) {
                        return todo
                    }
                    return {...todo, status}
                })
            }))

            const errorNotif = {
                message: "Unable to change task",
                description: "Try again later.",
            }
            const successNotif = {
                message: `Task marked as "${status}"`,
                duration: QUICK_NOTIF_DURATION_SEC,
            }
            fetch(CSRF_PATH)
                .then(response => {
                    fetch(`${TODOS_PATH}${record.id}`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "X-CSRFToken": response.headers.get("X-CSRFToken"),
                        },
                        body: JSON.stringify({...record, status}),
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
        },
        selectedRowKeys: todos?.results
            .filter(t => t.status === TODO_STATUS_DONE)
            .map(t => t.id),
    }

    return (
        <>
            {
                todos ?
                    <>
                        <Table
                            columns={columns}
                            dataSource={todos.results}
                            pagination={{
                                current,
                                total: todos.count,
                                pageSize: PAGE_SIZE,
                            }}
                            rowKey="id"
                            rowSelection={rowSelection}
                            onChange={handleTableChange}
                            onRow={(record, rowIndex) => ({
                                onClick: () => navigate(`todo/${record.id}`),
                            })}
                        />
                        <Button
                            type="primary"
                            onClick={() => navigate("/add")}
                        >
                            Add task
                        </Button>
                    </> :
                    <p>Loading...</p>
            }
        </>
    )
}
