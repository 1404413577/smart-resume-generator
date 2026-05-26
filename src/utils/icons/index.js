// src/utils/icons/index.js
// Element Plus 图标按需加载配置

import {
  Plus,
  Delete,
  Edit,
  View,
  Download,
  Upload,
  Search,
  Close,
  ArrowRight,
  Document,
  Picture,
  ChatRound,
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  Files,
  Share,
  Calendar,
  Clock,
  Check,
  Remove,
  Sort,
  Filter,
  Back,
  Menu,
  Promotion,
  Star
} from '@element-plus/icons-vue'

/**
 * 常用的图标列表
 * 按需注册这些图标，而不是全部注册
 */
export const COMMON_ICONS = {
  Plus,
  Delete,
  Edit,
  View,
  Download,
  Upload,
  Search,
  Close,
  ArrowRight,
  Document,
  Picture,
  ChatRound,
  CircleCheckFilled,
  CircleCloseFilled,
  InfoFilled,
  Files,
  Share,
  Calendar,
  Clock,
  Check,
  Remove,
  Sort,
  Filter,
  Back,
  Menu,
  Promotion,
  Star
}

/**
 * 注册常用图标到 Vue 应用
 * @param {App} app - Vue 应用实例
 */
export function registerCommonIcons(app) {
  Object.entries(COMMON_ICONS).forEach(([key, component]) => {
    app.component(key, component)
  })
}
