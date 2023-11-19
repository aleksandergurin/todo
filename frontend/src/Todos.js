import {useEffect, useState} from "react"
import {useNavigate} from "react-router-dom"
import {Button, Table} from "antd"

import {TODOS_PATH, PAGE_SIZE} from "./Constants"


const columns = [
    {
        title: "Content",
        dataIndex: "content",
    },
    {
        title: "Created",
        dataIndex: "created",
    },
]


export const TodosTable = () => {
    const navigate = useNavigate()
    const [todos, setTodos] = useState(null)
    const [current, setCurrent] = useState(1)

    useEffect(() => {
        fetch(`${TODOS_PATH}?page=${current}`)
            .then(response => response.json())
            .then(data => setTodos(data))
    }, [current])

    const handleTableChange = (pagination, filters, sorter) =>
        setCurrent(pagination.current)

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
                            onChange={handleTableChange}
                            onRow={(record, rowIndex) => ({
                                onClick: () => navigate(`todo/${record.id}`),
                            })}
                        />
                        <Button
                            type="primary"
                            onClick={() => navigate("/add")}
                        >
                            Add todo
                        </Button>
                    </> :
                    <p>Loading...</p>
            }
        </>
    )
}
