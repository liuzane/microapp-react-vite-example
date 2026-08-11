// 基础模块
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import microApp from '@micro-zoe/micro-app';
import { Provider } from 'react-redux';

// Ant Design 配置
import { ConfigProvider } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';
import zhCN from 'antd/es/locale/zh_CN';

// 样式
import '@/styles';

// Redux
import { store } from '@/store';
import { setAppLoading } from '@/store/slices/appsLoadingSlice';

// 应用入口
import App from './App.tsx';

// 远程模块
const [
  { initIndexedDB }, // 初始化 IndexedDB 数据库工具
  { DATABASE_NAME }, // 数据库名称
  { default: antdTheme }, // 共享的 Ant Design 主题配置
] = await Promise.all([
  import('mockDB/init'),
  import('shared/consts'),
  import('shared/utils/antdTheme'),
]);

async function init() {
  // 初始化 IndexedDB 数据库
  await initIndexedDB(DATABASE_NAME);

  // 启动 MicroApp
  microApp.start({
    'disableScopecss': true,
    'router-mode': 'native',
    // 全局生命周期钩子
    'lifeCycles': {
      created(_e: CustomEvent, appName: string) {
        console.log('Micro app created:', appName);
      },
      beforemount(_e: CustomEvent, appName: string) {
        console.log('Micro app beforemount:', appName);
        store.dispatch(setAppLoading({ appName, loading: true }));
      },
      mounted(_e: CustomEvent, appName: string) {
        console.log('Micro app mounted:', appName);
      },
      unmount(_e: CustomEvent, appName: string) {
        console.log('Micro app unmount:', appName);
        store.dispatch(setAppLoading({ appName, loading: false }));
      },
      error(_e: CustomEvent, appName: string) {
        console.error('Micro app error:', appName);
      },
    },
  });

  // 渲染应用
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <HashRouter>
          <ConfigProvider locale={zhCN} theme={antdTheme}>
            <StyleProvider layer>
              <App />
            </StyleProvider>
          </ConfigProvider>
        </HashRouter>
      </Provider>
    </StrictMode>,
  );

  // 隐藏 loading 文本
  const el: HTMLElement | null = document.getElementById('loading')!;
  el.style.opacity = '0';
  el.addEventListener('transitionend', () => {
    el.remove();
  }, { once: true });
}

init();
