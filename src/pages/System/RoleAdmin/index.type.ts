/** 当前页面所需所有类型声明 **/

import { Role, UserBasicInfoParam } from "@/models/index.type";

export type { UserBasicInfoParam, Res } from "@/models/index.type";

// 列表table的数据类型
export interface TableRecordData {
  key?: number;
  id: number;
  username: string;
  password: string;
  real_name: string; // 真实名字
  phone: string | number; // 手机
  role: string; // 角色
  verify_status: number; // 是否验证，2: 待验证，3: 已验证
  create_time: string; // 创建时间
  extra_profile?: any; // 额外信息
}

export interface Page {
  pageNum: number;
  pageSize: number;
  total: number;
}

export type operateType = "add" | "see" | "up";

export interface ModalType {
  operateType: operateType;
  nowData: any | null;
  modalShow: boolean;
  modalLoading: boolean;
}

export interface SearchInfo {
  username: string | undefined; // 用户名
  conditions: number | undefined; // 状态
}

export interface RoleTreeInfo {
  roleData: Role[]; // 所有的角色数据
  roleTreeLoading: boolean; // 控制树的loading状态，因为要先加载当前role的菜单，才能显示树
  roleTreeShow: boolean; // 角色树是否显示
  roleTreeDefault: number[]; // 用于角色树，默认需要选中的项
}
