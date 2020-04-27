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
  Radio,
  Input,
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
// import RoleTree from "@/components/TreeChose/RoleTree";

// ==================
// 类型声明
// ==================
import {
  TableRecordData,
  Page,
  operateType,
  ModalType,
  // SearchInfo,
  // RoleTreeInfo,
  // UserBasicInfoParam,
  Res,
} from "./index.type";
import { RootState, Dispatch } from "@/store";
// import tools from "@/util/tools";

type Props = ReturnType<typeof mapState> & ReturnType<typeof mapDispatch>;
// ==================
// 本组件
// ==================
function UserAdminContainer(props: Props): JSX.Element {
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
    operateType: "reject", // see查看，add添加，up修改
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
  // const [role, setRole] = useSetState<RoleTreeInfo>({
  //   roleData: [],
  //   roleTreeLoading: false,
  //   roleTreeShow: false,
  //   roleTreeDefault: [],
  // });

  // 生命周期 - 组件挂载时触发一次
  useMount(() => {
    onGetData(page);
    // getAllRolesData();
  });

  // 函数 - 获取所有的角色数据，用于分配角色控件的原始数据
  // const getAllRolesData = async (): Promise<void> => {
  //   try {
  //     const res = await props.getAllRoles();
  //     if (res && res.status === 200) {
  //       setRole({
  //         roleData: res.data,
  //       });
  //     }
  //   } catch {}
  // };

  // 函数 - 查询当前页面所需列表数据
  async function onGetData(page: {
    pageNum: number;
    pageSize: number;
  }): Promise<void> {
    const p = props.powersCode;
    if (!p.includes("user:query")) {
      return;
    }

    // const params = {
    //   pageNum: page.pageNum,
    //   pageSize: page.pageSize,
    //   // username: searchInfo.username,
    //   // conditions: searchInfo.conditions,
    // };
    setLoading(true);
    try {
      const res = await props.getAppealList();
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

  const rejectCaseStatusChange = (e: any): void => {
    console.log("aa", e)
    form.setFieldsValue({
      changeStatus: e.target.value,
    });
  };

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
      form.setFieldsValue({
        changeStatus: 2,
        rejectReson: "",
      });
      // form.resetFields();
      // if (type === "add") {
      //   // 新增，需重置表单各控件的值
      //   form.resetFields();
      // } else if (data) {
      //   // 查看或修改，需设置表单各控件的值为当前所选中行的数据
      //   form.setFieldsValue({
      //     formConditions: data.conditions,
      //     formDesc: data.desc,
      //     formUsername: data.username,
      //     formPhone: data.phone,
      //     formEmail: data.email,
      //     formPassword: data.password,
      //   });
      // }
    });
  };

  /** 模态框确定 **/
  const onOk = async (data: TableRecordData): Promise<void> => {
    const values = await form.validateFields();

    const params = {
      ...values,
      case_id: data.case.id,
      appeal_id: data.id,
      client_id: data.appealer.id,
      lawyer_id: "",
    };

    try {
      const res: Res | undefined = await props.onReject(params);
      if (res && res.code === "S_Ok") {
        message.success("操作成功");
        onGetData(page);
        onClose();
      } else {
        message.error(res?.message ?? "操作失败");
      }
    } finally {
      setModal({
        modalLoading: false,
      });
    }
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

  const onAggress = async (data: TableRecordData) => {
    const res = await props.onAgress({
      appeal_id: data.id,
      case_id: data.case.id,
      client_id: data.appealer.id,
      la: "",
      is_normal_user: true,
    });

    if (res && res.code === "S_Ok") {
      onGetData(page);
      message.success("操作成功");
    }
  };

  // const onReject = async (data: TableRecordData) => {
  //   const res = await props.onReject({
  //     appeal_id: data.id,
  //     case_id: data.case.id,
  //     from_id: data.appealer.id,
  //     to_id: "",
  //     is_normal_user: true,
  //   });

  //   if (res && res.code === "S_Ok") {
  //     onGetData(page);
  //     message.success("操作成功");
  //   }
  // };

  // 表格页码改变
  const onTablePageChange = (pageNum: number, pageSize: number): void => {
    onGetData({ pageNum, pageSize });
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
      title: "申诉人",
      dataIndex: "real_name",
      key: "real_name",
    },
    {
      title: "申诉类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "申诉原因",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "申诉时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "联系方式",
      dataIndex: "phone",
      key: "phone",
    },
    // {
    //   title: "描述",
    //   dataIndex: "desc",
    //   key: "desc",
    // },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (v: number): JSX.Element => (
        <span style={{ color: v === 3 ? "red" : "green" }}>
          {(v === 0 && "待处理") ||
            (v === 1 && "已取消") ||
            (v === 2 && "已同意") ||
            (v === 3 && "已拒绝")}
        </span>
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
              // onClick={() => onModalShow(record, "see")}
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
              onClick={() => onAggress(record)}
            >
              同意
            </Button>
          );
        p.includes("user:up") &&
          controls.push(
            <Button
              type="danger"
              size="small"
              onClick={() => onModalShow(record, "reject")}
            >
              拒绝
            </Button>
          );
        // p.includes("user:role") &&
        //   controls.push(
        //     <span
        //       key="2"
        //       className="control-btn blue"
        //       onClick={() => onTreeShowClick(record)}
        //     >
        //       <Tooltip placement="top" title="分配角色">
        //         <EditOutlined />
        //       </Tooltip>
        //     </span>
        //   );

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
        real_name: item.appealer.real_name,
        type: item.case?.case_type,
        reason: item.reason,
        status: item.status,
        phone: item.appealer.phone,
        createTime: item.createTime,
        case: item.case,
        appealer: item.appealer,
        payOrder: item.payOrder,
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
        title={{ reject: "拒绝" }[modal.operateType]}
        visible={modal.modalShow}
        onOk={() => onOk(modal.nowData)}
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
            label="拒绝理由"
            name="rejectReson"
            {...formItemLayout}
            rules={[{ max: 100, message: "最多输入100个字符", required: true }]}
          >
            <Input.TextArea rows={4} autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
          <Form.Item label="订单状态" name="changeStatus">
            <Radio.Group onChange={rejectCaseStatusChange}>
              <Radio value={2}>继续服务</Radio>
              <Radio value={6}>结束订单</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

const mapState = (state: RootState) => ({
  powerTreeData: state.sys.powerTreeData,
  userinfo: state.app.userinfo,
  powersCode: state.app.powersCode,
});
const mapDispatch = (dispatch: Dispatch) => ({
  getAllRoles: dispatch.sys.getAllRoles,
  addUser: dispatch.sys.addUser,
  upUser: dispatch.sys.upUser,
  delUser: dispatch.sys.delUser,
  getUserList: dispatch.sys.getUserList,
  setUserRoles: dispatch.sys.setUserRoles,
  getAppealList: dispatch.sys.getAppealList,
  onAgress: dispatch.sys.onAgressAppeal,
  onReject: dispatch.sys.onRejectAppeal,
});
export default connect(mapState, mapDispatch)(UserAdminContainer);
