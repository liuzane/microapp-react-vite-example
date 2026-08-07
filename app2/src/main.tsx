// 基础模块
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

// Ant Design 配置
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/es/locale/zh_CN';

// 样式
import './styles';

// 应用入口
import App from './App.tsx';

// 引入共享的 Ant Design 主题配置
const { default: antdTheme } = await import('shared/utils/antdTheme');

// 渲染应用
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider locale={zhCN} theme={antdTheme}>
      <StyleProvider layer>
        <HashRouter basename={window.__MICRO_APP_BASE_ROUTE__ || '/'}>
          <App />
        </HashRouter>
      </StyleProvider>
    </ConfigProvider>
  </StrictMode>,
);
