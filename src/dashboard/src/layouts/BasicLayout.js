/*
 SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useCallback, useMemo } from 'react';
import { Layout } from 'antd';
import { Helmet } from 'react-helmet';
import { connect, useIntl } from 'umi';
import SiderMenu from '@/components/SiderMenu';
import getPageTitle from '@/utils/getPageTitle';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import styles from './BasicLayout.less';

const { Content } = Layout;

const BasicLayout = props => {
  const {
    dispatch,
    route: { routes, path, authority },
    navTheme,
    layout: propsLayout,
    children,
    location,
    location: { pathname },
    isMobile,
    menuData,
    breadcrumbNameMap,
    fixedHeader,
    fixSiderbar,
    collapsed,
  } = props;

  const intl = useIntl();

  useEffect(() => {
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/getMenuData',
      payload: { routes, path, authority },
    });
  }, [dispatch, routes, path, authority]);

  const contextValue = useMemo(
    () => ({
      location,
      breadcrumbNameMap,
    }),
    [location, breadcrumbNameMap]
  );

  const layoutStyle = useMemo(() => {
    if (fixSiderbar && propsLayout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  }, [fixSiderbar, propsLayout, isMobile, collapsed]);

  const handleMenuCollapse = useCallback(
    collapsedState => {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload: collapsedState,
      });
    },
    [dispatch]
  );

  const isTop = propsLayout === 'topmenu';
  const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};

  const layoutContent = (
    <Layout>
      {isTop && !isMobile ? null : (
        <SiderMenu
          logo={logo}
          theme={navTheme}
          onCollapse={handleMenuCollapse}
          menuData={menuData}
          isMobile={isMobile}
          {...props}
        />
      )}
      <Layout
        style={{
          ...layoutStyle,
          minHeight: '100vh',
        }}
      >
        <Header
          menuData={menuData}
          handleMenuCollapse={handleMenuCollapse}
          logo={logo}
          isMobile={isMobile}
          {...props}
        />
        <Content className={styles.content} style={contentStyle}>
          {children}
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );

  return (
    <>
      <Helmet>
        <title>{getPageTitle(pathname, breadcrumbNameMap, intl)}</title>
      </Helmet>

      <Context.Provider value={contextValue}>
        <div>{layoutContent}</div>
      </Context.Provider>
    </>
  );
};

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => <BasicLayout {...props} isMobile={false} />);
