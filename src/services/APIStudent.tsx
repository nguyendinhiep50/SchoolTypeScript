import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from '../InterFace/IStudent'
const accessToken = localStorage.getItem("access_tokenAdmin");

export const CountStudents = async () => {
    const response = await axios.get("https://localhost:7232/api/Students/TakeCountAll",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListStudentPage = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Students/TakeNameFaculty?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const DeleteStudent = async (params: string) => {
    const bien = params;
    const response = await axios.delete("https://localhost:7232/api/Students/"
        + bien, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const UpdateStudent = async (params: Item, id: string) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Students/" + id, dataupdate,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    ).then(() => { alert("cạp nhat thanh cong") })
        .catch((err) => {
            console.log(err)
        });
    return response;
}