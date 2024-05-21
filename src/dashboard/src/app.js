import {
  DashboardOutlined,
  TeamOutlined,
  ClusterOutlined,
  ApartmentOutlined,
  CodeOutlined,
  UserOutlined,
  ApiOutlined,
  GithubOutlined,
  BookOutlined,
} from '@ant-design/icons';

export const icons = {
  dashboard: <DashboardOutlined />,
  team: <TeamOutlined />,
  node: <ClusterOutlined />,
  channel: <ApartmentOutlined />,
  chaincode: <CodeOutlined />,
  user: <UserOutlined />,
  api: <ApiOutlined />,
  github: <GithubOutlined />,
  docs: <BookOutlined />,
};

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
    },
  },
};

export const antd = {
  theme: {
    token: {
      colorPrimary: '#5aaafa',
      colorLink: '#5aaafa',
      borderRadius: 2,
      colorSuccess: '#8cd211',
      colorError: '#ff5050',
      colorWarning: '#efc100',
      colorInfo: '#7cc7ff',
      fontSize: 16,
    },
    components: {
      Layout: {
        headerBg: '#20343e',
        bodyBg: '#20343e',
        siderBg: '#272d33',
      },
      Table: {
        headerBg: '#20343e',
      },
      Button: {
        defaultBg: '#8c9ba5',
        defaultColor: '#ffffff',
      },
    },
  },
};
