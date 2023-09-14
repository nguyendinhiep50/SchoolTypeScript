import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from '../InterFace/ISubject'
const accessToken = localStorage.getItem("access_tokenAdmin");

export const CountSubjectGrades = async () => {
    const response = await axios.get("https://localhost:7232/api/Subjects/TakeCountAll",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListSubjectGradesPageTeacher = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Subjects?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}

export const UpdateSubjectGrades = async (params: Item, id: string) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Subjects/" + id, dataupdate,
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