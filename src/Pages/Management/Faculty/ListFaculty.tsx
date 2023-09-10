import React, { useEffect, useState } from 'react';
import { Form, Input, Button, InputNumber, Popconfirm, Table, Typography, Pagination } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PagesAndSize } from '../../../services/types';
import { Item, EditableCell } from '../../../InterFace/IFaculty'
import { GetListFacultyPage, CountFaculty, DeleteFaculty, UpdateFaculty } from '../../../services/APIFaculty';
const App: React.FC = () => {
  const accessToken = localStorage.getItem("access_tokenAdmin");
  const [form] = Form.useForm();
  const [Size, setSize] = useState(3);
  const [Pageschange, setPageschange] = useState(1);
  const [editingid, setEditingid] = useState('');
  const [dataFaculty, setdataFaculty] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  const [countSubject, setcountSubject] = useState(1);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CountFaculty();
        const value: any = response;
        setcountSubject(value.data);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const pagesAndSize: PagesAndSize = { pages: Pageschange, size: 3 };
        const FacultyList = await GetListFacultyPage(pagesAndSize);
        if (typeof FacultyList === 'undefined') {
          console.log('studentList is of type void');
        } else {
          console.log(FacultyList.data);
          const facultysData = FacultyList.data.map((faculty: any, index: number) => ({
            facultyId: faculty.facultyId,
            facultyName: faculty.facultyName,
          }));
          setdataFaculty(facultysData);
        }

      } catch (error) {
        console.error(error);

      }
    };

    fetchData();

  }, [dataUpdate, Pageschange]);
  const DeleteID = (record: Partial<Item> & { facultyId: string }) => {
    const bienxoa = DeleteFaculty(record.facultyId);
    if (typeof bienxoa === 'undefined') {
      console.log('FacultyList is of type void');
    } else {
      const newDataFaculty = dataFaculty.filter(item => item.facultyId !== record.facultyId);
      setdataFaculty(newDataFaculty);
    }
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
        const update = UpdateFaculty(newData[index], id);
        if (typeof update === 'undefined') {
          setEditingid('');
          console.log('Validate Failed');
        }
      } else {
        newData.push(row);
        setdataFaculty(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  const handleChanegPages = (newPages: number) => {
    console.log(newPages);
    setPageschange(newPages);
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
          pagination={false}
          bordered
          dataSource={dataFaculty}
          columns={mergedColumns}
          rowClassName="editable-row"

        />
        <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={countSubject.valueOf()} />

      </Form>
    </>
  );
};

export default App;