export interface IGroup {
    _id: string;
    name: string;
    groups: IGroup[];
    data: IGroup[];
}
export interface IGroups {
    results: IGroup[],
    data: IGroup[];
    name: string;
    groups?: any;
}
