import React, { FC, useMemo, memo, useState } from "react";
import {
  Table,
  TableProps,
  Button,
  Tooltip,
  notification,
  Space,
  Row,
  Col,
  Typography,
} from "antd";
import { apiNames } from "../../redux/metadata";
import { TIME_FORMAT } from "../../constants";
import moment from "moment";
import { LayoutProps } from "../../routers";
import { ReduxDispatchHelper } from "../../redux/helper";
import CreateBuilding from "./create";

interface IList {
  page: number;
  limit: number;
  q: string;
  populated: boolean;
}

const BuildingList: FC<LayoutProps> = ({ reduxStates }) => {
  const buildings = reduxStates[apiNames.buildings.list];

  const [buildingsQuery, setBuildingsQuery] = useState<IList>({
    page: 1,
    limit: 10,
    q: "",
    populated: false,
  });

  const [createBuildingVisible, setCreateBuildingVisible] = useState<any>(false);

  const onSetBuildingQuery = (states: any) =>
    setBuildingsQuery((prev) => ({ ...prev, ...states }));

  const handleFetchBuilding = () => {
    new ReduxDispatchHelper<IList>(
      apiNames.buildings.list,
      buildingsQuery,
      (payload: any) => {
        setCreateBuildingVisible(null);
      },
      (errors: any) => {
        notification.error({ message: errors?.exception?.response?.message });
      }
    ).do();
  };

  useMemo(() => {
    if (createBuildingVisible === false) handleFetchBuilding();
  }, [createBuildingVisible]);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (id: string) => (
        <Tooltip title={id}>
          <Button type="link">{id.slice(0, 8)}</Button>
        </Tooltip>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => moment(createdAt).format(TIME_FORMAT),
    },
    {
      title: "Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: string) => moment(updatedAt).format(TIME_FORMAT),
    },
  ];

  const onTableChange: TableProps<any>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    if (pagination.current !== buildingsQuery.page) {
      setCreateBuildingVisible(false);
      onSetBuildingQuery({ page: pagination.current });
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <Typography.Title level={2}>Building</Typography.Title>
        </Col>
        <Col>
          <Button onClick={() => setCreateBuildingVisible(true)} type="primary">
            Create
            1
          </Button>
          <CreateBuilding
            visible={createBuildingVisible}
            setVisible={setCreateBuildingVisible}
            reduxStates={reduxStates}
          />
        </Col>
      </Row>
      {buildings?.data?.pager && (
        <Table
          scroll={{ x: 1000 }}
          onChange={onTableChange}
          rowKey={(data: any) => data.id}
          columns={columns}
          dataSource={buildings.data.buildings}
          pagination={{
            current: buildingsQuery.page,
            pageSize: buildingsQuery.limit,
            total: buildings.data.pager.total,
          }}
        />
      )}
    </Space>
  );
};

export default memo(BuildingList);
