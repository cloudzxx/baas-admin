import React from 'react';
import { useIntl, connect } from 'umi';
import { Breadcrumb, Tabs, Typography } from 'antd';
import classNames from 'classnames';
import MenuContext from '@/layouts/MenuContext';
import GridContent from './GridContent';
import styles from './index.less';
import { conversionBreadcrumbList } from './breadcrumb';

const { Title } = Typography;

/**
 * render Footer tabList
 * In order to be compatible with the old version of the PageHeader
 * basically all the functions are implemented.
 */
const renderFooter = ({ tabList, tabActiveKey, onTabChange, tabBarExtraContent }) => {
  return tabList && tabList.length ? (
    <Tabs
      className={styles.tabs}
      activeKey={tabActiveKey}
      onChange={key => {
        if (onTabChange) {
          onTabChange(key);
        }
      }}
      tabBarExtraContent={tabBarExtraContent}
    >
      {tabList.map(item => (
        <Tabs.TabPane tab={item.tab} key={item.key} />
      ))}
    </Tabs>
  ) : null;
};

const PageHeaderWrapper = ({
  children,
  contentWidth,
  wrapperClassName,
  top,
  title,
  content,
  logo,
  extraContent,
  hiddenBreadcrumb,
  ...restProps
}) => {
  const intl = useIntl();
  return (
    <div style={{ margin: '-24px -24px 0' }} className={classNames(wrapperClassName, styles.main)}>
      {top}
      <MenuContext.Consumer>
        {value => {
          return (
            <div className={styles.pageHeader}>
              {!hiddenBreadcrumb && (
                <Breadcrumb
                  items={conversionBreadcrumbList(
                    {
                      ...value,
                      ...restProps,
                      home: intl.formatMessage({ id: 'menu.home', defaultMessage: 'Home' }),
                    },
                    intl
                  )}
                />
              )}
              <Title level={4} style={{ marginBottom: 0 }}>
                {title}
              </Title>
              {renderFooter(restProps)}
              {logo && <div className={styles.logo}>{logo}</div>}
              <div className={styles.detail}>
                <div className={styles.main}>
                  <div className={styles.row}>
                    {content && <div className={styles.content}>{content}</div>}
                    {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      </MenuContext.Consumer>
      {children ? (
        <div className={styles['children-content']}>
          <GridContent>{children}</GridContent>
        </div>
      ) : null}
    </div>
  );
};

export default connect(({ setting }) => ({
  contentWidth: setting.contentWidth,
}))(PageHeaderWrapper);
