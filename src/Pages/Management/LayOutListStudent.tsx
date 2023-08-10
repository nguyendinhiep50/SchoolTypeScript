import React, {useEffect,useState,ReactNode }  from 'react';
import axios from 'axios';  
import ListStudent from "./List/ListStudent";
import { Form, Input, InputNumber, Table,Typography,Popconfirm,Select } from 'antd';

interface Faculty {
  facultyId: string;
  facultyName: string; 
}
function LayOutListStudent() {
const [dataKH, setDataKH] = useState<Faculty[]>([]); 
const [FilterString, setFilterString] = useState(""); 

  useEffect(() => {
    axios
      .get("https://localhost:7232/api/Faculties")
      .then((response) => {
        setDataKH(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
    const handleDataChange = (newData: any) => {
    setFilterString(newData);
  };
  return (
    <>  
        <h1>Lọc sản phẩm</h1>
        <Select onChange={handleDataChange} style={{maxWidth:"100px"}}>
            {dataKH.map((p, index) => (
            <Select.Option key={p.facultyId} value={p.facultyId}>
            {p.facultyName}
            </Select.Option>
        ))}
        </Select> 
        <ListStudent dataKH={dataKH} FilterString={FilterString}/>
    </>
  )
}
export default LayOutListStudent