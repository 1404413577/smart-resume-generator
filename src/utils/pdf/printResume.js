/**
 * printResume.js
 * 基于浏览器打印 (window.print) 的 PDF 导出方案。
 * 利用 @page CSS 规则和 page-break 属性，实现：
 *   - 自动分页（不截断内容中间）
 *   - 精确的页面边距
 *   - 打印时隐藏编辑器 UI
 */

/**
 * 触发简历打印（另存为 PDF）
 * @param {Object} options
 * @param {string}  [options.resumeId='resume-preview']  - 简历容器的 DOM ID
 * @param {number}  [options.marginMm=15]                - 页面四边边距（mm）
 * @param {Object}  [options.margin]                     - 精细边距 {top, right, bottom, left}（mm）
 */
export function printResume({ resumeId = 'resume-preview', marginMm = 15, margin = null } = {}) {
    const t = margin?.top ?? marginMm
    const r = margin?.right ?? marginMm
    const b = margin?.bottom ?? marginMm
    const l = margin?.left ?? marginMm

    // 创建一个临时的 <style> 标签，注入打印专属 CSS
    const styleId = '__resume_print_override__'
    let styleEl = document.getElementById(styleId)
    if (!styleEl) {
        styleEl = document.createElement('style')
        styleEl.id = styleId
        document.head.appendChild(styleEl)
    }

    styleEl.textContent = `
    @media print {
      /* ---- 页面边距设置 ---- */
      @page {
        size: A4 portrait;
        margin: ${t}mm ${r}mm ${b}mm ${l}mm;
      }

      /* ---- 隐藏除简历外的所有 UI ---- */
      body > *:not(#app) { display: none !important; }

      /* 隐藏 App 内除预览区以外的区域 */
      .el-container,
      .el-aside,
      .el-header,
      .el-footer,
      .editor-panel,
      .sidebar,
      .nav-panel,
      .editor-section,
      .preview-controls,
      .zoom-controls,
      .export-actions,
      .template-selector,
      .section-toolbar,
      .section-sort-dialog,
      .el-drawer,
      .el-dialog,
      .home-hero,
      .home-features,
      .tab-pane:not(.active) {
        display: none !important;
      }

      /* ---- 让 #app 和内部容器全屏 ---- */
      html, body, #app {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
      }

      /* 展开预览容器 */
      .resume-builder,
      .preview-section,
      .preview-container,
      .resume-preview-wrapper {
        display: block !important;
        position: static !important;
        width: 100% !important;
        height: auto !important;
        overflow: visible !important;
        transform: none !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
      }

      /* 简历本体样式 */
      #${resumeId},
      .resume-preview {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        background: #fff !important;
      }

      /* ---- page-break 规则 ---- */
      /* 防止 section/item 被拦腰截断 */
      .section,
      .resume-section,
      .startup-section,
      .experience-item,
      .education-item,
      .project-item,
      .journey-milestone,
      .innovation-card,
      .growth-card,
      .badge-item,
      .language-sphere {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      /* 防止孤行：标题后面不独立跑到下一页 */
      h2, h3,
      .section-title,
      .startup-section > h3:first-child {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }

      /* 手动分页类 */
      .page-break-before {
        page-break-before: always !important;
        break-before: page !important;
      }

      /* 金融/开发者模板的容器对齐 */
      .finance-template .resume-container,
      .developer-template .resume-container {
        max-width: 100% !important;
        box-shadow: none !important;
        padding: ${t}mm ${r}mm ${b}mm ${l}mm !important;
      }
    }
  `

    // 短暂等待 CSS 注入完毕，然后调用打印
    setTimeout(() => {
        window.print()

        // 打印窗口关闭后清理临时 style（用 afterprint 事件）
        const cleanup = () => {
            if (styleEl && styleEl.parentNode) {
                styleEl.textContent = ''
            }
            window.removeEventListener('afterprint', cleanup)
        }
        window.addEventListener('afterprint', cleanup)
    }, 80)
}
