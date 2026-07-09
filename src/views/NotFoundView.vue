<template>
  <div class="not-found-view">
    <div class="not-found-container">
      <div class="error-content">
        <div class="error-illustration">
          <div class="error-number">404</div>
          <div class="error-icon">
            <el-icon><DocumentDelete /></el-icon>
          </div>
        </div>
        
        <div class="error-text">
          <h1 class="error-title">页面未找到</h1>
          <p class="error-description">
            抱歉，您访问的页面不存在或已被移动。
            <br>
            请检查URL是否正确，或返回首页继续使用。
          </p>
        </div>
        
        <div class="error-actions">
          <el-button @click="goHome" type="primary" size="large">
            <el-icon><House /></el-icon>
            返回首页
          </el-button>
          <el-button @click="goBack" size="large" plain>
            <el-icon><Back /></el-icon>
            返回上页
          </el-button>
        </div>
        
        <div class="helpful-links">
          <h3>您可能在寻找：</h3>
          <div class="links-grid">
            <router-link to="/" class="help-link">
              <el-icon><Edit /></el-icon>
              <span>简历编辑器</span>
            </router-link>
            <router-link to="/design" class="help-link">
              <el-icon><Brush /></el-icon>
              <span>设计工作室</span>
            </router-link>
            <router-link to="/templates" class="help-link">
              <el-icon><Grid /></el-icon>
              <span>模板中心</span>
            </router-link>
            <router-link to="/ai-assistant" class="help-link">
              <el-icon><MagicStick /></el-icon>
              <span>AI助手</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  DocumentDelete,
  House,
  Back,
  Edit,
  Brush,
  Grid,
  MagicStick
} from '@element-plus/icons-vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
/* ===== 简约风格样式 ===== */
.not-found-view {
  min-height: 100vh;
  background: #f5f7fa;          /* 柔和浅灰背景，取代渐变 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-container {
  max-width: 600px;
  width: 100%;
}

.error-content {
  background: #ffffff;
  border-radius: 16px;
  padding: 48px 40px 40px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04); /* 极轻阴影，若隐若现 */
}

/* --- 数字 + 图标区域 --- */
.error-illustration {
  position: relative;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px; /* 固定高度，便于定位 */
}

.error-number {
  font-size: 80px;
  font-weight: 700;
  color: #e8ecf1;      /* 更淡的灰色数字，弱化视觉权重 */
  line-height: 1;
  letter-spacing: 2px;
}

.error-icon {
  position: absolute;
  font-size: 48px;
  color: #c0c4cc;      /* 柔和灰色图标 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* --- 文本 --- */
.error-text {
  margin-bottom: 32px;
}

.error-title {
  font-size: 28px;
  font-weight: 500;    /* 更轻的字重 */
  color: #303133;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}

.error-description {
  font-size: 15px;
  color: #909399;      /* 次级灰色 */
  line-height: 1.7;
  margin: 0;
}

/* --- 按钮区 --- */
.error-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

/* 让按钮更简约：主按钮使用纯色，次要按钮用 plain 样式（已在模板中设置） */
.error-actions .el-button {
  min-width: 140px;
  border-radius: 8px;
  font-weight: 500;
}

/* --- 快捷链接 --- */
.helpful-links h3 {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin: 0 0 16px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.help-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px 12px;
  background: #fafbfc;          /* 极浅背景，取代边框 */
  border-radius: 10px;
  text-decoration: none;
  color: #606266;
  transition: all 0.2s ease;
  border: 1px solid transparent; /* 预留边框过渡 */
}

.help-link:hover {
  background: #f0f2f5;
  color: #409eff;              /* 品牌色（与 Element Plus 主色一致） */
  transform: translateY(-1px);
  border-color: #d9dce3;
}

.help-link .el-icon {
  font-size: 22px;
}

.help-link span {
  font-size: 13px;
  font-weight: 400;
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .not-found-view {
    padding: 16px;
  }

  .error-content {
    padding: 32px 24px 28px;
  }

  .error-number {
    font-size: 60px;
  }
  .error-icon {
    font-size: 36px;
  }

  .error-title {
    font-size: 22px;
  }
  .error-description {
    font-size: 14px;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  .error-actions .el-button {
    width: 100%;
    max-width: 240px;
  }

  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 24px 16px 20px;
  }
  .error-number {
    font-size: 48px;
  }
  .error-icon {
    font-size: 28px;
  }
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>