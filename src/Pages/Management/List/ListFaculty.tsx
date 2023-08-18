import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
interface Item {
  facultyId: string; // Make sure you have a unique id for each item in the array
  facultyName: string;
}


interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const App: React.FC = () => {
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const [form] = Form.useForm();
  const [editingid, setEditingid] = useState('');
  const [dataFaculty, setdataFaculty] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Faculties", {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log(response.data);
        const facultysData = response.data.map((faculty: any, index: number) => ({
          facultyId: faculty.facultyId,
          facultyName: faculty.facultyName,
        }));
        setdataFaculty(facultysData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);

      }
    };

    fetchData();

  }, [dataUpdate]);
  const handleDataChange = (newData: Item) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { facultyId: string }) => {
    axios
      .delete(
        "https://localhost:7232/api/Faculties/" + record.facultyId, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
      )
      .then((response) => {
        alert("Đã xóa khoa");
        const newdataFaculty = dataFaculty.filter(item => item.facultyId !== record.facultyId);
        setdataFaculty(newdataFaculty);
      })
      .catch((err) => console.log(err));
  };

  const isEditing = (record: Item) => record.facultyId === editingid;

  const edit = (record: Partial<Item> & { facultyId: string }) => {
    form.setFieldsValue({ facultyName: '', ...record });
    setEditingid(record.facultyId);
  };

  const cancel = () => {
    setEditingid('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataFaculty];
      const index = newData.findIndex((item) => id === item.facultyId);
      // id
      console.log(id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setdataFaculty(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        axios
          .put(
            "https://localhost:7232/api/Faculties/" +
            id,
            newData[index], {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          }
          )
          .then((response) => { alert("cạp nhat thanh cong") })

          .catch((err) => console.log(err));

        console.log(newData[index]);
      } else {
        newData.push(row);
        setdataFaculty(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Tên khoa',
      dataIndex: 'facultyName',
      width: '20%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      width: '15%',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.facultyId)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link disabled={editingid !== ''} onClick={() => edit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link disabled={editingid !== ''} style={{ marginLeft: "20px" }} onClick={() => DeleteID(record)}>
              Delete
            </Typography.Link>
          </>

        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'id' ? 'facultyName' : '',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Link to="/Management/FacultyAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add Faculty</Button>
      </Link>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataFaculty}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </>
  );
};

export default App;