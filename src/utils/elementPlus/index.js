// src/utils/elementPlus/index.js
// Element Plus 按需加载配置

import {
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElDialog,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElCard,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElCheckbox,
  ElRadio,
  ElSwitch,
  ElSlider,
  ElDatePicker,
  ElColorPicker,
  ElDropdown,
  ElMenu,
  ElSubMenu,
  ElMenuItem,
  ElTabs,
  ElTabPane,
  ElTree,
  ElIcon,
  ElTag,
  ElBadge,
  ElAlert,
  ElUpload,
  ElDrawer
} from 'element-plus'

// 按需加载的 Element Plus 组件
export const ELEMENT_COMPONENTS = [
  ElMessage,
  ElMessageBox,
  ElNotification,
  ElDialog,
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElCard,
  ElTable,
  ElTableColumn,
  ElPagination,
  ElCheckbox,
  ElRadio,
  ElSwitch,
  ElSlider,
  ElDatePicker,
  ElColorPicker,
  ElDropdown,
  ElMenu,
  ElSubMenu,
  ElMenuItem,
  ElTabs,
  ElTabPane,
  ElTree,
  ElIcon,
  ElTag,
  ElBadge,
  ElAlert,
  ElUpload,
  ElDrawer
]

/**
 * 注册 Element Plus 按需加载的组件
 * @param {App} app - Vue 应用实例
 */
export function registerElementComponents(app) {
  ELEMENT_COMPONENTS.forEach(component => {
    if (component.name) {
      app.component(component.name, component)
    }
  })
}

// 导出常用的消息和对话框方法
export { ElMessage, ElMessageBox, ElNotification }
