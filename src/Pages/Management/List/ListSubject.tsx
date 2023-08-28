import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Pagination, Popconfirm, Table, Typography } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { PagesAndSize } from '../../../services/types'
import axios from 'axios';
import { format } from 'date-fns';
import { Item, EditableCellProps, ShowColumns, EditableCell } from "../../../InterFace/ISubject";
import { GetListSubjectPage, CountSubjects, DeleteSubject, UpdateSubject } from '../../../services/APISubject';

const App: React.FC = () => {
  const [form] = Form.useForm();
  const [Pageschange, setPageschange] = useState(1);
  const [editingid, setEditingid] = useState('');
  const [dataSubject, setdataSubject] = useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
  const [countSubject, setcountSubject] = useState(0);
  const [Size, setSize] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await CountSubjects();
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
      const pagesAndSize: PagesAndSize = { pages: Pageschange, size: 3 };
      try {
        const response = await GetListSubjectPage(pagesAndSize);
        if (typeof response === 'undefined') {
          console.log('SubjectList is of type void');
        } else {
          const SubjectsData = response.data.map((Subject: any, index: number) => ({
            subjectId: Subject.subjectId,
            subjectName: Subject.subjectName,
            subjectCredit: Subject.subjectCredit,
            subjectMandatory: Subject.subjectMandatory === true ? "true" : "false",
          }));
          setdataSubject(SubjectsData);
        }
      } catch (error) {
        console.error(error);

      }
    };

    fetchData();
  }, [dataUpdate, Pageschange]);
  // const handleDataChange = (newData: Item) => {
  //   setdataUpdate(prevData => ({
  //     ...prevData,
  //     Item: newData
  //   }));
  // };
  const DeleteID = (record: Partial<Item> & { subjectId: string }) => {
    const bienxoa = DeleteSubject(record.subjectId);
    if (typeof bienxoa === 'undefined') {
      console.log('SubjectList is of type void');
    } else {
      const newDataSubject = dataSubject.filter(item => item.subjectId !== record.subjectId);
      setdataSubject(newDataSubject);
    }

  };

  const isEditing = (record: Item) => record.subjectId === editingid;

  const edit = (record: Partial<Item> & { subjectId: string }) => {
    form.setFieldsValue({ subjectName: '', subjectCredit: 0, subjectMandatory: 'hiban', ...record });
    setEditingid(record.subjectId);
  };

  const cancel = () => {
    setEditingid('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields());
      row.subjectId = id;
      console.log(row.subjectMandatory);
      let result = (row.subjectMandatory === "true" ? true : false);
      row.subjectMandatory = result;
      const newData = [...dataSubject];
      const index = newData.findIndex((item) => id === item.subjectId);
      // id 
      if (index > -1) {
        newData.splice(index, 1, row);
        setdataSubject(newData);
        setEditingid('');
        const update = UpdateSubject(newData[index], id);
        if (typeof update === 'undefined') {
          setEditingid('');
          console.log('Validate Failed');
        }
      } else {
        newData.push(row);
        setdataSubject(newData);
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
      title: 'Tên môn',
      dataIndex: 'subjectName',
      width: '20%',
      editable: true,
    },
    {
      title: 'chứng chỉ',
      dataIndex: 'subjectCredit',
      width: '20%',
      editable: true,
    },
    {
      title: 'bắt buộc',
      dataIndex: 'subjectMandatory',
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
            <Typography.Link onClick={() => save(record.subjectId)} style={{ marginRight: 8 }}>
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
        inputType: col.dataIndex === 'id' ? 'subjectName' : 'subjectMandatory',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <>
      <Link to="/Management/SubjectAdd">
        <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add Subject</Button>
      </Link>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={dataSubject}
          columns={mergedColumns}

          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
        <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={countSubject.valueOf()} />
      </Form>
    </>
  );
};

export default App;