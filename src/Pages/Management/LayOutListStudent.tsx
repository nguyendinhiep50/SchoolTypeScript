import React, { useEffect, useState, ReactNode } from 'react';
import axios from 'axios';
import ListStudent from "./List/ListStudent";
import { Select } from 'antd';
import { PagesAndSize } from '../../services/types';
import { GetListFacultyPage } from '../../services/APIFaculty';
import { Item, EditableCell } from '../../InterFace/IFaculty'

function LayOutListStudent() {
  const [dataKH, setDataKH] = useState<Item[]>([]);
  const [FilterString, setFilterString] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const pagesAndSize: PagesAndSize = { pages: 1, size: -1 };
      const FacultyList = await GetListFacultyPage(pagesAndSize);
      if (typeof FacultyList === 'undefined') {
        console.log('studentList is of type void');
      } else {
        console.log(FacultyList.data);
        const facultysData = FacultyList.data.map((faculty: any, index: number) => ({
          facultyId: faculty.facultyId,
          facultyName: faculty.facultyName,
        }));
        setDataKH(facultysData);
      }
    }
    fetchData();
    console.log(dataKH);
  }, []);
  const handleDataChange = (newData: any) => {
    setFilterString(newData);
  };
  return (
    <>
      <h1>Lọc sản phẩm</h1>
      <Select onChange={handleDataChange} style={{ maxWidth: "100px" }}>
        {dataKH.map((p, index) => (
          <Select.Option key={p.facultyId} value={p.facultyId}>
            {p.facultyName}
          </Select.Option>
        ))}
      </Select>
      <ListStudent dataKH={dataKH} FilterString={FilterString} />
    </>
  )
}
export default LayOutListStudent