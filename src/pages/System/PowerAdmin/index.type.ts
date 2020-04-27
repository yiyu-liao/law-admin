/** 当前页面所需所有类型声明 **/

import { Role } from "@/models/index.type";

export type { UserBasicInfoParam, Res } from "@/models/index.type";

// 列表table的数据类型
export interface TableRecordData {
  key?: number;
  id: number;
  reason: string;
  status: number;
  createTime: string;
  case: any;
  appealer: any;
  payOrder: any;
}

// id: 1
// out_refund_no: "20200302145644674491"
// reason: "七天无理由"
// status: 0
// createTime: "2020-04-07T06:56:44.758Z"
// case: {id: 1, select_lawyer_id: null, case_type: 1, extra_info: null, status: 3,…}
// payOrder: null
// appealer: {id: 1, openid: "aa", avatar_url: null, nick_name: "test", real_name: "吴彦祖", role: 0, verify_status: 3,…}
// id: 1
// openid: "aa"
// avatar_url: null
// nick_name: "test"
// real_name: "吴彦祖"
// role: 0
// verify_status: 3

export interface Page {
  pageNum: number;
  pageSize: number;
  total: number;
}

export type operateType = "reject";

export interface ModalType {
  operateType: operateType;
  nowData: TableRecordData | any;
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
