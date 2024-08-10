interface IUser {
  email: string
  name: string
  password: string
  deviceToken?: string
}

interface IAuthenticatedUser {
  email: string
  name: string
  avatar: string
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

interface ICategory {
  _id: string
  name: string
  user: IUser | string
  isEditable: boolean
  color: IColor
  icon: IIcon
  createdAt: string
  updatedAt: string
}

interface ICategoryRequest {
  name: string
  color: IColor
  icon: IIcon
}

interface ITask {
  _id: string
  name: string
  isCompleted: boolean
  categoryId: string
  createdAt: string
  date: string
  description: string
  dueDate: string; // Ngày đến hạn
  isOverdue?: boolean; // Trạng thái quá hạn
}

interface ITaskRequest {
  name: string
  isCompleted: boolean
  categoryId: string
  date: string
  description: string
}
