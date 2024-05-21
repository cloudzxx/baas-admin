import { useIntl } from 'react-intl';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

export default function Overview() {
  const intl = useIntl();

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'app.overview.title', defaultMessage: 'User Overview' })}
    >
      <h1 style={{ textAlign: 'center' }}>
        {intl.formatMessage({ id: 'app.overview.welcome.message', defaultMessage: 'Welcome!' })}
      </h1>
    </PageHeaderWrapper>
  );
}
