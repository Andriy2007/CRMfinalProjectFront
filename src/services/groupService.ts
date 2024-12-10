import {IRes} from "../types/responceType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IGroup} from "../interfaces";


const groupService = {
    getGroups: (): IRes<IGroup[]> => apiService.get(urls.groups),
    addGroup: (groupName: string): Promise<{ data: { name: string } }> => apiService.post(urls.groups, { name: groupName }),
    }

export {
    groupService
}