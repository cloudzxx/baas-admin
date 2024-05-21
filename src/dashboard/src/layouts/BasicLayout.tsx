import { Outlet, useLocation, matchPath } from 'react-router-dom';
import { Layout } from 'antd';
import { useSettingsStore } from '@/stores/settings';
import SiderMenu from './SiderMenu';
import Header from './Header';
import Footer from './Footer';

const { Content } = Layout;

export default function BasicLayout() {
  const collapsed = useSettingsStore((s) => s.collapsed);
  const toggleCollapsed = useSettingsStore((s) => s.toggleCollapsed);

  const publicRoutes = ['/user/login', '/user/register'];
  const location = useLocation();
  const isPublic = publicRoutes.some((route) => matchPath(route, location.pathname));

  if (isPublic) {
    return <Outlet />;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <SiderMenu collapsed={collapsed} onCollapse={() => toggleCollapsed()} />
      <Layout style={{ marginLeft: collapsed ? 80 : 220, transition: 'margin-left 0.2s' }}>
        <Header collapsed={collapsed} onToggle={toggleCollapsed} />
        <Content style={{ margin: 16, padding: 16, background: '#fff', borderRadius: 4 }}>
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
