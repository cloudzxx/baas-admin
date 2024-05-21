import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IntlProvider } from 'react-intl';
import { ConfigProvider } from 'antd';
import { useState, useMemo } from 'react';
import BasicLayout from '@/layouts/BasicLayout';
import Overview from '@/pages/Overview';
import Login from '@/pages/User/Login';
import Organization from '@/pages/Organization/Organization';
import Node from '@/pages/Node';
import Channel from '@/pages/Channel/Channel';
import ChainCode from '@/pages/ChainCode/ChainCode';
import UserManagement from '@/pages/UserManagement/UserManagement';
import Fisco from '@/pages/Fisco';
import FiscoContracts from '@/pages/Fisco/Contracts';
import NotFound from '@/pages/Exception/404';
import Forbidden from '@/pages/Exception/403';
import ServerError from '@/pages/Exception/500';
import { getMessages, getLocale, setLocale, type Locale } from '@/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

const theme = {
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
};

export default function App() {
  const [locale, setLocaleState] = useState<Locale>(getLocale());

  const handleLocaleChange = (l: Locale) => {
    setLocale(l);
    setLocaleState(l);
  };

  const messages = useMemo(() => getMessages(locale), [locale]);

  return (
    <QueryClientProvider client={queryClient}>
      <IntlProvider messages={messages} locale={locale.replace('-', '_')}>
        <ConfigProvider theme={theme}>
          <HashRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<BasicLayout />}>
                <Route path="/overview" element={<Overview />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/node" element={<Node />} />
                <Route path="/channel" element={<Channel />} />
                <Route path="/chaincode" element={<ChainCode />} />
                <Route path="/userManagement" element={<UserManagement />} />
                <Route path="/fisco" element={<Fisco />} />
                <Route path="/fisco/contracts" element={<FiscoContracts />} />
                <Route path="/403" element={<Forbidden />} />
                <Route path="/500" element={<ServerError />} />
                <Route path="/" element={<Navigate to="/overview" replace />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </HashRouter>
        </ConfigProvider>
      </IntlProvider>
    </QueryClientProvider>
  );
}
