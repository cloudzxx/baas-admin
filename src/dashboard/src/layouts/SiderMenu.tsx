import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
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

const { Sider } = Layout;

const menuItems: { path: string; name: string; icon: React.ReactNode }[] = [
  { path: '/overview', name: 'menu.overview', icon: <DashboardOutlined /> },
  { path: '/organization', name: 'menu.organization', icon: <TeamOutlined /> },
  { path: '/node', name: 'menu.node', icon: <ClusterOutlined /> },
  { path: '/channel', name: 'menu.channel', icon: <ApartmentOutlined /> },
  { path: '/chaincode', name: 'menu.chaincode', icon: <CodeOutlined /> },
  { path: '/userManagement', name: 'menu.userManagement', icon: <UserOutlined /> },
];

const bottomItems: { path: string; name: string; icon: React.ReactNode; external?: boolean }[] = [
  { path: '/api/v1/docs', name: 'menu.api', icon: <ApiOutlined /> },
  { path: 'https://github.com/baas-admin', name: 'menu.github', icon: <GithubOutlined />, external: true },
  { path: 'https://baas-admin.readthedocs.io', name: 'menu.docs', icon: <BookOutlined />, external: true },
];

interface Props {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export default function SiderMenu({ collapsed, onCollapse }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const selectedKey = '/' + location.pathname.split('/')[1];

  const handleClick = (info: { key: string }) => {
    const item = bottomItems.find((i) => i.path === info.key);
    if (item?.external) {
      window.open(info.key, '_blank');
    } else {
      navigate(info.key);
    }
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={220}
      style={{
        background: '#272d33',
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div className="flex items-center justify-center h-16">
        <span className="text-white text-lg font-bold whitespace-nowrap overflow-hidden">
          {collapsed ? 'B' : 'Baas Admin'}
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        onClick={handleClick}
        style={{ background: '#272d33', borderRight: 0 }}
        items={menuItems.map((item) => ({
          key: item.path,
          icon: item.icon,
          label: item.name,
        }))}
      />
      <div style={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Menu
          theme="dark"
          mode="inline"
          onClick={handleClick}
          style={{ background: '#272d33', borderRight: 0 }}
          selectable={false}
          items={bottomItems.map((item) => ({
            key: item.path,
            icon: item.icon,
            label: item.name,
          }))}
        />
      </div>
    </Sider>
  );
}
