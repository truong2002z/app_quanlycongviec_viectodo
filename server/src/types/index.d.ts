export interface IUser {
    email: string
    name: string
    password: string
    avatar: string
    deviceToken: string
  }
  
  export interface IColor {
    name: string
    id: string
    code: string
  }
  
  export interface IIcon {
    name: string
    id: string
    symbol: string
  }
  
  export interface ICategory {
    _id: string
    name: string
    user: IUser | string
    isEditable: boolean
    color: IColor
    icon: IIcon
  }
  
  export interface ITask {
    _id: string
    name: string
    categoryId: ICategory|string
    user: IUser | string
    isCompleted: boolean
    isEditable: boolean
    date: string
    createdAt: string
    updatedAt: string
    description: string
    deviceToken: string;
  }