/** User 系统管理/用户管理 **/

// ==================
// 所需的第三方库
// ==================
import React, { useState, useMemo } from "react";
import { useSetState, useMount } from "react-use";
import { connect } from "react-redux";
import {
  Form,
  Button,
  // Input,
  Table,
  message,
  // Popconfirm,
  Modal,
  Tooltip,
  Divider,
  // Select,
} from "antd";
import {
  EyeOutlined,
  // EditOutlined,
  // ToolOutlined,
  // DeleteOutlined,
  // PlusCircleOutlined,
  // SearchOutlined,
} from "@ant-design/icons";

// ==================
// 所需的自定义的东西
// ==================
import "./index.less";
// import tools from "@/util/tools"; // 工具函数

// const { TextArea } = Input;
// const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

// ==================
// 所需的组件
// ==================
import RoleTree from "@/components/TreeChose/RoleTree";

// ==================
// 类型声明
// ==================
import {
  TableRecordData,
  Page,
  operateType,
  ModalType,
  // SearchInfo,
  RoleTreeInfo,
  // UserBasicInfoParam,
  // Res,
} from "./index.type";
import { RootState, Dispatch } from "@/store";
import { Res } from "../UserAdmin/index.type";

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;
// ==================
// 本组件
// ==================
function RoleAdminContainer(props: Props): JSX.Element {
  // const p = props.powersCode; // 用户拥有的所有权限code
  const [form] = Form.useForm();

  const [data, setData] = useState<TableRecordData[]>([]); // 当前页面列表数据
  const [loading, setLoading] = useState(false); // 数据是否正在加载中

  // 分页相关参数
  const [page, setPage] = useSetState<Page>({
    pageNum: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框相关参数
  const [modal, setModal] = useSetState<ModalType>({
    operateType: "add", // see查看，add添加，up修改
    nowData: null,
    modalShow: false,
    modalLoading: false,
  });

  // 搜索相关参数
  // const [searchInfo, setSearchInfo] = useSetState<SearchInfo>({
  //   username: undefined, // 用户名
  //   conditions: undefined, // 状态
  // });

  // 角色树相关参数
  const [role, setRole] = useSetState<RoleTreeInfo>({
    roleData: [],
    roleTreeLoading: false,
    roleTreeShow: false,
    roleTreeDefault: [],
  });

  // 生命周期 - 组件挂载时触发一次
  useMount(() => {
    onGetData(page);
  });


  // 函数 - 查询当前页面所需列表数据
  async function onGetData(page: {
    pageNum: number;
    pageSize: number;
  }): Promise<void> {
    const p = props.powersCode;
    if (!p.includes("user:query")) {
      return;
    }
    setLoading(true);
    try {
      const res = await props.getVerfifyUserList();
      if ((res && res.status === 200) || (res && res.code === "S_Ok")) {
        setData(res.data);
        setPage({
          pageNum: page.pageNum,
          pageSize: page.pageSize,
          total: res.data.total,
        });
      } else {
        message.error(res?.message ?? "数据获取失败");
      }
    } finally {
      setLoading(false);
    }
  }

  // // 搜索 - 名称输入框值改变时触发
  // const searchUsernameChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ): void => {
  //   if (e.target.value.length < 20) {
  //     setSearchInfo({ username: e.target.value });
  //   }
  // };

  // // 搜索 - 状态下拉框选择时触发
  // const searchConditionsChange = (v: number): void => {
  //   setSearchInfo({ conditions: v });
  // };

  // // 搜索
  // const onSearch = (): void => {
  //   onGetData(page);
  // };

  /**
   * 添加/修改/查看 模态框出现
   * @param data 当前选中的那条数据
   * @param type add添加/up修改/see查看
   * **/
  const onModalShow = (
    data: TableRecordData | null,
    type: operateType
  ): void => {
    setModal({
      modalShow: true,
      nowData: data,
      operateType: type,
    });
    // 用setTimeout是因为首次让Modal出现时得等它挂载DOM，不然form对象还没来得及挂载到Form上
    setTimeout(() => {
      if (type === "add") {
        // 新增，需重置表单各控件的值
        form.resetFields();
      } else if (data) {
        // 查看或修改，需设置表单各控件的值为当前所选中行的数据
        // form.setFieldsValue({
        //   formConditions: data.conditions,
        //   formDesc: data.desc,
        //   formUsername: data.username,
        //   formPhone: data.phone,
        //   formEmail: data.email,
        //   formPassword: data.password,
        // });
      }
    });
  };

  /** 模态框确定 **/
  const onOk = () => {
    return;
  };

  // 删除某一条数据
  // const onDel = async (id: number): Promise<void> => {
  //   setLoading(true);
  //   try {
  //     const res = await props.delUser({ id });
  //     if (res && res.status === 200) {
  //       message.success("删除成功");
  //       onGetData(page);
  //     } else {
  //       message.error(res?.message ?? "操作失败");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  /** 模态框关闭 **/
  const onClose = () => {
    setModal({
      modalShow: false,
    });
  };

  /** 分配角色按钮点击，角色控件出现 **/
  // const onTreeShowClick = (record: TableRecordData): void => {
  //   setModal({
  //     nowData: record,
  //   });
  //   setRole({
  //     roleTreeShow: true,
  //     roleTreeDefault: record.roles || [],
  //   });
  // };

  // 分配角色确定
  const onRoleOk = async (keys: number[]): Promise<void> => {
    // if (!modal.nowData?.id) {
    //   message.error("未获取到该条数据id");
    //   return;
    // }
    // const params = {
    //   id: modal.nowData.id,
    //   roles: keys.map((item) => Number(item)),
    // };
    // setRole({
    //   roleTreeLoading: true,
    // });
    // try {
    //   const res: Res = await props.setUserRoles(params);
    //   if (res && res.status === 200) {
    //     message.success("分配成功");
    //     onGetData(page);
    //     onRoleClose();
    //   } else {
    //     message.error(res?.message ?? "操作失败");
    //   }
    // } finally {
    //   setRole({
    //     roleTreeLoading: false,
    //   });
    // }
  };

  // 分配角色树关闭
  const onRoleClose = (): void => {
    setRole({
      roleTreeShow: false,
    });
  };

  // 表格页码改变
  const onTablePageChange = (pageNum: number, pageSize: number): void => {
    onGetData({ pageNum, pageSize });
  };

  const onAggress = async (id: number): Promise<void> => {
    const res: Res = await props.updateUserStatus({
      user_id: id,
      base_info: {
        verify_status: 3
      }
    });
    if (res?.code === "S_Ok") {
      onGetData(page);
      message.success("操作成功");
    }
  };

  // ==================
  // 属性 和 memo
  // ==================

  // table字段
  const tableColumns = [
    // {
    //   title: "序号",
    //   dataIndex: "serial",
    //   key: "serial",
    // },
    {
      title: "用户名",
      dataIndex: "real_name",
      key: "real_name",
    },
    {
      title: "电话",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "角色",
      dataIndex: "desc",
      key: "role",
      render: (v: number): JSX.Element =>
        v === 1 ? <span>客户</span> : <span>律师</span>,
    },
    {
      title: "申请时间",
      dataIndex: "applyVerfifyTime",
      key: "extra_profile.applyVerfifyTime",
    },
    // {
    //   title: "描述",
    //   dataIndex: "desc",
    //   key: "desc",
    // },
    {
      title: "状态",
      dataIndex: "verify_status",
      key: "verify_status",
      render: (v: number): JSX.Element =>
        v === 3 ? (
          <span style={{ color: "green" }}>已认证</span>
        ) : (
          <span style={{ color: "red" }}>待认证</span>
        ),
    },
    {
      title: "操作",
      key: "control",
      width: 200,
      render: (v: null, record: TableRecordData) => {
        const controls = [];
        // const u = props.userinfo.userBasicInfo || { id: -1 };
        const p = props.powersCode;
        p.includes("user:query") &&
          controls.push(
            <span
              key="0"
              className="control-btn green"
              onClick={() => onModalShow(record, "see")}
            >
              <Tooltip placement="top" title="查看">
                <EyeOutlined />
              </Tooltip>
            </span>
          );
        p.includes("user:up") &&
          controls.push(
            <Button
              type="primary"
              size="small"
              onClick={() => onAggress(record.id)}
            >
              同意
            </Button>
          );

        // p.includes("user:del") &&
        //   u.id !== record.id &&
        //   controls.push(
        //     <Popconfirm
        //       key="3"
        //       title="确定删除吗?"
        //       onConfirm={() => onDel(record.id)}
        //       okText="确定"
        //       cancelText="取消"
        //     >
        //       <span className="control-btn red">
        //         <Tooltip placement="top" title="删除">
        //           <DeleteOutlined />
        //         </Tooltip>
        //       </span>
        //     </Popconfirm>
        //   );

        const result: JSX.Element[] = [];
        controls.forEach((item, index) => {
          if (index) {
            result.push(<Divider key={`line${index}`} type="vertical" />);
          }
          result.push(item);
        });
        return result;
      },
    },
  ];

  // table列表所需数据
  const tableData = useMemo(() => {
    return data.map((item, index) => {
      return {
        key: index,
        id: item.id,
        real_name: item.real_name,
        phone: item.phone,
        username: item.username,
        password: item.password,
        verify_status: item.verify_status,
        role: item.role,
        create_time: item.create_time,
        extra_profile: item.extra_profile,
      };
    });
  }, [page, data]);

  return (
    <div>
      <div className="diy-table">
        <Table
          columns={tableColumns}
          loading={loading}
          dataSource={tableData}
          pagination={{
            total: page.total,
            current: page.pageNum,
            pageSize: page.pageSize,
            showQuickJumper: true,
            showTotal: (t, range) => `共 ${t} 条数据`,
            onChange: onTablePageChange,
          }}
        />
      </div>
      {/* 新增&修改&查看 模态框 */}
      <Modal
        title={{ add: "新增", up: "修改", see: "查看" }[modal.operateType]}
        visible={modal.modalShow}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={modal.modalLoading}
      >
        <Form
          form={form}
          initialValues={{
            formConditions: 1,
          }}
        >
          <Form.Item
            label="用户名"
            name="formUsername"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { max: 12, message: "最多输入12位字符" },
            ]}
          >
            aaa
          </Form.Item>
          {/* <Form.Item
            label="密码"
            name="formPassword"
            {...formItemLayout}
            rules={[
              { required: true, whitespace: true, message: "必填" },
              { min: 6, message: "最少输入6位字符" },
              { max: 18, message: "最多输入18位字符" },
            ]}
          >
            <Input
              type="password"
              placeholder="请输入密码"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="电话"
            name="formPhone"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkPhone(v)) {
                      return Promise.reject("请输入有效的手机号码");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入手机号"
              maxLength={11}
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="邮箱"
            name="formEmail"
            {...formItemLayout}
            rules={[
              () => ({
                validator: (rule, value) => {
                  const v = value;
                  if (v) {
                    if (!tools.checkEmail(v)) {
                      return Promise.reject("请输入有效的邮箱地址");
                    }
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              placeholder="请输入邮箱地址"
              disabled={modal.operateType === "see"}
            />
          </Form.Item>
          <Form.Item
            label="描述"
            name="formDesc"
            {...formItemLayout}
            rules={[{ max: 100, message: "最多输入100个字符" }]}
          >
            <TextArea
              rows={4}
              disabled={modal.operateType === "see"}
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Form.Item>
          <Form.Item
            label="状态"
            name="formConditions"
            {...formItemLayout}
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Select disabled={modal.operateType === "see"}>
              <Option key={1} value={1}>
                启用
              </Option>
              <Option key={-1} value={-1}>
                禁用
              </Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>
      <RoleTree
        title={"分配角色"}
        data={role.roleData}
        visible={role.roleTreeShow}
        defaultKeys={role.roleTreeDefault}
        loading={role.roleTreeLoading}
        onOk={onRoleOk}
        onClose={onRoleClose}
      />
    </div>
  );
}

const mapState = (state: RootState) => ({
  powerTreeData: state.sys.powerTreeData,
  userinfo: state.app.userinfo,
  powersCode: state.app.powersCode,
});
const mapDispatch = (dispatch: Dispatch) => ({
  getVerfifyUserList: dispatch.sys.getVerfifyUserList,
  updateUserStatus: dispatch.sys.updateUserStatus,
});
export default connect(mapState, mapDispatch)(RoleAdminContainer);
