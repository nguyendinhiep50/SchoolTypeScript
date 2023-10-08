import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Pagination, Popconfirm, Table, Typography } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Item, EditableCell } from '../../../InterFace/ISemester'
import { format } from 'date-fns';
import { GetListSemesterPage, CountSemesters, DeleteSemester, UpdateSemester } from '../../../services/APISemester';
import { PagesAndSize } from '../../../services/types'

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [Pageschange, setPageschange] = useState(1);
  const [Size, setSize] = useState(3); const [editingid, setEditingid] = useState('');
  const [dataSemester, setdataSemester] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  const [CountSemester, setCountSemesters] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CountSemesters();
        const value: any = response;
        setCountSemesters(value.data);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const pagesAndSize: PagesAndSize = { pages: Pageschange, size: 3 };
    const fetchData = async () => {
      try {
        const response = await GetListSemesterPage(pagesAndSize);
        if (typeof response === 'undefined') {
          console.log('studentList is of type void');
        } else {
          console.log(response.data);
          const semestersData = response.data.map((semester: any, index: number) => ({
            semesterId: semester.semesterId,
            semesterName: semester.semesterName,
            semesterDayBegin: format(new Date(semester.semesterDayBegin), 'yyyy-MM-dd'),
            semesterDayEnd: format(new Date(semester.semesterDayEnd), 'yyyy-MM-dd'),
          }));
          setdataSemester(semestersData);
        }
      } catch (error) {
        console.error(error);

      }
    };
    fetchData();
  }, [dataUpdate, Pageschange]);
  const handleDataChange = (newData: any) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { semesterId: string }) => {
    const bienxoa = DeleteSemester(record.semesterId);
    if (typeof bienxoa === 'undefined') {
      console.log('SemesterList is of type void');
    } else {
      const newDataSemester = dataSemester.filter(item => item.semesterId !== record.semesterId);
      handleDataChange(newDataSemester);
    }
  };
  const isEditing = (record: Item) => record.semesterId === editingid;

  const edit = (record: Partial<Item> & { semesterId: string }) => {
    form.setFieldsValue({ facultyName: '', ...record });
    setEditingid(record.semesterId);
  };

  const cancel = () => {
    setEditingid('');
  };
  const handleChanegPages = (newPages: number) => {
    console.log(newPages);
    setPageschange(newPages);
  };
  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...dataSemester];
      const index = newData.findIndex((item) => id === item.semesterId);
      // id
      console.log(id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setdataSemester(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        const update = await UpdateSemester(row, id);
        if (typeof update === 'undefined') {
          setEditingid('');
          return;
        }
        setdataSemester(newData);
        setEditingid('');
      } else {
        newData.push(row);
        setdataSemester(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const columns = [
    {
      title: 'Tên học kì',
      dataIndex: 'semesterName',
      width: '20%',
      editable: true,
    },
    {
      title: 'học kì bắt đầu',
      dataIndex: 'semesterDayBegin',
      width: '20%',
      editable: true,
    },
    {
      title: 'học kì kết thúc',
      dataIndex: 'semesterDayEnd',
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
            <Typography.Link onClick={() => save(record.semesterId)} style={{ marginRight: 8 }}>
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
      <Link to="/Management/SemesterAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add Semester</Button>
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
          dataSource={dataSemester}
          columns={mergedColumns}
          rowClassName="editable-row"
        />
      </Form>
      <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={CountSemester.valueOf()} />
    </>
  );
};

export default App;