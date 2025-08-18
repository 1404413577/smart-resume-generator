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
          <el-button @click="goBack" size="large">
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
            <router-link to="/resumes" class="help-link">
              <el-icon><Folder /></el-icon>
              <span>简历管理</span>
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
  Folder,
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
.not-found-view {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.not-found-container {
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-content {
  background: white;
  border-radius: 20px;
  padding: 60px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.error-illustration {
  position: relative;
  margin-bottom: 40px;
}

.error-number {
  font-size: 120px;
  font-weight: 900;
  color: #f0f2f5;
  line-height: 1;
  margin-bottom: -20px;
}

.error-icon {
  font-size: 80px;
  color: #f56c6c;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.error-text {
  margin-bottom: 40px;
}

.error-title {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
}

.error-description {
  font-size: 16px;
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 50px;
}

.helpful-links h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 20px 0;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.help-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  text-decoration: none;
  color: #606266;
  transition: all 0.3s ease;
}

.help-link:hover {
  border-color: #667eea;
  background: #f0f2ff;
  color: #667eea;
  transform: translateY(-2px);
}

.help-link .el-icon {
  font-size: 24px;
}

.help-link span {
  font-size: 14px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-view {
    padding: 15px;
  }
  
  .error-content {
    padding: 40px 30px;
  }
  
  .error-number {
    font-size: 80px;
  }
  
  .error-icon {
    font-size: 60px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .error-description {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .el-button {
    width: 200px;
  }
  
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 30px 20px;
  }
  
  .error-number {
    font-size: 60px;
  }
  
  .error-icon {
    font-size: 40px;
  }
  
  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
