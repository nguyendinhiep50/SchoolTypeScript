import axios from 'axios';
import { PagesAndSize } from './types';
import { Item } from "../InterFace/IRoleUserAccount";

// import { Item } from '../InterFace/IRoleUserAccount'
const accessToken = localStorage.getItem("access_tokenAdmin");

export const CountRoleAccounts = async () => {
    const response = await axios.get("https://localhost:7232/api/Login/getRoleCount",
        {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).catch((err) => console.log(err));
    return response;
}
export const GetListRoleAccountPage = async (params: PagesAndSize) => {
    const { pages, size } = params;
    const response = await axios.get("https://localhost:7232/api/Login/TakeUserRole?pages="
        + pages + "&size=" + size, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }).catch((err) => console.log(err));
    return response;
}
export const UpdateRoleAccount = async (params: Item) => {
    const dataupdate = params;
    const response = axios.put("https://localhost:7232/api/Login/UpdateRole", dataupdate,
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
