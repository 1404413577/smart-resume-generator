/**
 * 前端防御工具包：反爬虫、反调试、拦截开发者工具
 * 仅在生产环境生效。
 */
export function setupAntiScrape() {
  // 只在生产环境开启防御 (Vite 会在生产环境将此设为 true)
  if (import.meta.env.DEV) return;

  // 1. 禁用右键菜单、拖拽保存
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());

  // 2. 禁用常见的开发者快捷键
  document.addEventListener('keydown', e => {
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    
    // 拦截 F12
    if (e.key === 'F12') {
      e.preventDefault();
      return;
    }

    // 拦截 Ctrl+Shift+I / Cmd+Option+I (控制台)
    // 拦截 Ctrl+Shift+C (审查)
    // 拦截 Ctrl+U (源码)
    if (
      (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
      (isMac && e.metaKey && e.altKey && ['I', 'J', 'C', 'U'].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === 'U') ||
      (e.ctrlKey && e.key.toUpperCase() === 'S') // 拦截保存
    ) {
      e.preventDefault();
    }
  });

  /**
   * 3. 无限 Debugger 陷阱 (杀手锏)
   * 利用构造器动态生成 debugger 语句，避开常规的代码压缩清理，
   * 强行开启调试面板会导致 JS 引擎不断被中断卡死。
   */
  const devtoolsTrap = () => {
    setInterval(() => {
      try {
        (function() { return false; }['constructor']('debugger')());
      } catch (e) {}
    }, 1000);
  };

  devtoolsTrap();
}
