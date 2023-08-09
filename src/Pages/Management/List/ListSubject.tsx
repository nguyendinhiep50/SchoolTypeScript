import React, {useEffect,useState,ReactNode}  from 'react';
import { Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import axios from 'axios';  
import { format } from 'date-fns';
interface Item {
  id: string; // Make sure you have a unique id for each item in the array
  subjectName: string;
  subjectCredit: number;
  subjectMandatory:boolean; 
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
interface ShowColumns {
  title: string;
  dataIndex: string;
  width: string;
  fixed: string;    
  render?: RenderFunction | RenderWithCellFunction;
}

type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode ;

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
  const [form] = Form.useForm(); 
  const [editingid, setEditingid] = useState('');
  const [dataSubject, setdataSubject] =useState<Item[]>([]);
  const [dataUpdate, setdataUpdate] = React.useState({ Item:{} as Item})
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://localhost:7232/api/Subjects");
        console.log(response.data);
        const SubjectsData = response.data.map((Subject: any, index: number) => ({
          id: Subject.id,
          subjectName: Subject.subjectName,
          subjectCredit:Subject.subjectCredit,
          subjectMandatory:Subject.subjectMandatory === true ? "true" : "false",
        }));
        setdataSubject(SubjectsData);
        console.log('Fetch data successful');
      } catch (error) {
        console.error(error);
        
      }
    };

    fetchData();
  }, [dataUpdate]);
  const handleDataChange = (newData :Item) => {
    setdataUpdate(prevData => ({
      ...prevData,
      Item: newData
    }));
  };
  const DeleteID = (record: Partial<Item> & { id: string }) => {
    axios
      .delete(
        "https://localhost:7232/api/Subjects/" +record.id
      )
      .then((response) =>{ 
        alert("Đã xóa môn học này -"+ record.subjectName);
        const newDataStudent = dataSubject.filter(item => item.id !== record.id);
        setdataSubject(newDataStudent);
      })
      .catch((err) => console.log(err));
  };

  const isEditing = (record: Item) => record.id === editingid;

  const edit = (record: Partial<Item> & { id: string }) => {
    form.setFieldsValue({ subjectName: '',subjectCredit:0 ,subjectMandatory:'hiban',  ...record });
    setEditingid(record.id);
  };

  const cancel = () => {
    setEditingid('');
  };

  const save = async (id: string) => {
    try {
      const row = (await form.validateFields()) as Item;
      const newData = [...dataSubject];
      const index = newData.findIndex((item) => id === item.id);
      // id
      console.log(id);
      if (index > -1) {
        const item = newData[index];
        item.subjectMandatory = item.subjectMandatory ===true? true:false
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setdataSubject(newData);
        setEditingid('');
        // xử lý cập nhật dữ liệu
        let item2 = newData[index];
        item2.subjectMandatory = item2.subjectMandatory ===true? true:false
        axios
        .put(
          "https://localhost:7232/api/Subjects/" +
            id,
            item2
        )
        .then((response) => console.log(response))
        .catch((err) => console.log(err));
        // newData[index].subjectMandatory =  newData[index].subjectMandatory ===true? 'true':'false'
      } else {
        newData.push(row);
        setdataSubject(newData);
        setEditingid('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
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
            <Typography.Link onClick={() => save(record.id)} style={{ marginRight: 8 }}>
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
            <Typography.Link disabled={editingid !== ''} style={{marginLeft:"20px"}} onClick={() => DeleteID(record)}>
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
    </Form>
  );
};

export default App;