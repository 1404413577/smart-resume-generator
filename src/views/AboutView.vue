<template>
  <div class="about-view">
    <div class="page-content">
      <div class="about-container">
        <!-- 产品介绍 -->
        <div class="hero-section">
          <div class="hero-content">
            <div class="logo-section">
              <el-icon class="app-logo"><Document /></el-icon>
              <h1 class="app-name">智能简历生成器</h1>
              <p class="app-version">版本 {{ version }}</p>
            </div>
            <p class="app-description">
              一款基于AI技术的智能简历生成器，帮助您快速创建专业、美观的简历。
              通过对话式AI交互，个性化模板选择，让简历制作变得简单高效。
            </p>
          </div>
        </div>

        <!-- 功能特色 -->
        <div class="features-section">
          <h2 class="section-title">核心功能</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><MagicStick /></el-icon>
              </div>
              <h3>AI智能助手</h3>
              <p>对话式AI交互，智能生成个性化简历内容，提供专业建议和优化方案。</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Grid /></el-icon>
              </div>
              <h3>丰富模板库</h3>
              <p>提供多种专业模板，涵盖现代、经典、创意等多种风格，适合不同行业需求。</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Edit /></el-icon>
              </div>
              <div>
                <h3>实时编辑预览</h3>
                <p>所见即所得的编辑体验，实时预览简历效果，支持多种缩放和布局调整。</p>
              </div>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Download /></el-icon>
              </div>
              <h3>多格式导出</h3>
              <p>支持PDF、Word、图片等多种格式导出，优化打印效果，满足不同使用场景。</p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><Upload /></el-icon>
              </div>
              <h3>云端同步</h3>
              <p>自动保存和云端同步，随时随地访问您的简历，永不丢失重要数据。</p>
            </div>

            <div class="feature-card">
              <div class="feature-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <h3>智能分析</h3>
              <p>AI分析简历质量，提供改进建议，匹配职位要求，提高求职成功率。</p>
            </div>
          </div>
        </div>

        <!-- 技术栈 -->
        <div class="tech-section">
          <h2 class="section-title">技术栈</h2>
          <div class="tech-grid">
            <div class="tech-item">
              <span class="tech-name">Vue.js 3</span>
              <span class="tech-desc">前端框架</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">Element Plus</span>
              <span class="tech-desc">UI组件库</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">Pinia</span>
              <span class="tech-desc">状态管理</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">Vue Router</span>
              <span class="tech-desc">路由管理</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">jsPDF</span>
              <span class="tech-desc">PDF生成</span>
            </div>
            <div class="tech-item">
              <span class="tech-name">OpenAI API</span>
              <span class="tech-desc">AI服务</span>
            </div>
          </div>
        </div>

        <!-- 更新日志 -->
        <div class="changelog-section">
          <h2 class="section-title">更新日志</h2>
          <div class="changelog-list">
            <div class="changelog-item">
              <div class="changelog-header">
                <span class="changelog-version">v1.2.0</span>
                <span class="changelog-date">2024-01-15</span>
              </div>
              <ul class="changelog-content">
                <li>新增路由系统，支持多页面导航</li>
                <li>重构组件架构，提升代码可维护性</li>
                <li>优化AI对话体验，增加历史记录功能</li>
                <li>新增设置页面，支持个性化配置</li>
              </ul>
            </div>
            
            <div class="changelog-item">
              <div class="changelog-header">
                <span class="changelog-version">v1.1.0</span>
                <span class="changelog-date">2024-01-01</span>
              </div>
              <ul class="changelog-content">
                <li>新增模板中心，提供更多专业模板</li>
                <li>优化PDF导出质量和性能</li>
                <li>增加简历管理功能</li>
                <li>修复已知问题，提升稳定性</li>
              </ul>
            </div>
            
            <div class="changelog-item">
              <div class="changelog-header">
                <span class="changelog-version">v1.0.0</span>
                <span class="changelog-date">2023-12-15</span>
              </div>
              <ul class="changelog-content">
                <li>首次发布，包含基础简历编辑功能</li>
                <li>集成AI智能助手</li>
                <li>支持多种模板和导出格式</li>
                <li>实现自动保存和数据持久化</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="contact-section">
          <h2 class="section-title">联系我们</h2>
          <div class="contact-grid">
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <div>
                <h4>邮箱支持</h4>
                <p>support@resumebuilder.com</p>
              </div>
            </div>
            
            <div class="contact-item">
              <el-icon><ChatDotRound /></el-icon>
              <div>
                <h4>在线客服</h4>
                <p>工作日 9:00-18:00</p>
              </div>
            </div>
            
            <div class="contact-item">
              <el-icon><Link /></el-icon>
              <div>
                <h4>官方网站</h4>
                <p>www.resumebuilder.com</p>
              </div>
            </div>
            
            <div class="contact-item">
              <el-icon><Platform /></el-icon>
              <div>
                <h4>GitHub</h4>
                <p>github.com/resumebuilder</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 版权信息 -->
        <div class="footer-section">
          <p class="copyright">
            © 2024 智能简历生成器. All rights reserved.
          </p>
          <div class="footer-links">
            <a href="#" @click.prevent>隐私政策</a>
            <a href="#" @click.prevent>服务条款</a>
            <a href="#" @click.prevent>帮助中心</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  MagicStick,
  Grid,
  Edit,
  Download,
  Upload,
  TrendCharts,
  Message,
  ChatDotRound,
  Link,
  Platform
} from '@element-plus/icons-vue'

// 应用版本
const version = ref('1.2.0')
</script>

<style scoped>
.about-view {
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: auto;
}

.page-content {
  padding: 40px 20px;
}

.about-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 60px;
}

/* 英雄区域 */
.hero-section {
  text-align: center;
  color: white;
}

.logo-section {
  margin-bottom: 30px;
}

.app-logo {
  font-size: 80px;
  margin-bottom: 20px;
  opacity: 0.9;
}

.app-name {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.app-version {
  font-size: 18px;
  opacity: 0.8;
  margin: 0;
}

.app-description {
  font-size: 20px;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  opacity: 0.9;
}

/* 功能特色 */
.features-section,
.tech-section,
.changelog-section,
.contact-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 30px 0;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  padding: 30px 20px;
  border-radius: 12px;
  background: #f8f9fa;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
  font-size: 32px;
}

.feature-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 15px 0;
}

.feature-card p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

/* 技术栈 */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.tech-item:hover {
  border-color: #667eea;
  background: #f0f2ff;
}

.tech-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.tech-desc {
  font-size: 13px;
  color: #909399;
}

/* 更新日志 */
.changelog-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.changelog-item {
  border-left: 3px solid #667eea;
  padding-left: 20px;
}

.changelog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.changelog-version {
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
}

.changelog-date {
  font-size: 14px;
  color: #909399;
}

.changelog-content {
  margin: 0;
  padding-left: 20px;
  color: #606266;
}

.changelog-content li {
  margin-bottom: 5px;
  line-height: 1.5;
}

/* 联系信息 */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border-radius: 8px;
  background: #f8f9fa;
}

.contact-item .el-icon {
  font-size: 24px;
  color: #667eea;
}

.contact-item h4 {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 5px 0;
}

.contact-item p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}

/* 页脚 */
.footer-section {
  text-align: center;
  padding: 30px 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.copyright {
  font-size: 14px;
  color: #909399;
  margin: 0 0 15px 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.footer-links a {
  font-size: 14px;
  color: #667eea;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #764ba2;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-content {
    padding: 20px 15px;
  }
  
  .about-container {
    gap: 40px;
  }
  
  .app-logo {
    font-size: 60px;
  }
  
  .app-name {
    font-size: 32px;
  }
  
  .app-description {
    font-size: 16px;
  }
  
  .features-section,
  .tech-section,
  .changelog-section,
  .contact-section,
  .footer-section {
    padding: 30px 20px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .feature-card {
    padding: 25px 15px;
  }
  
  .tech-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .changelog-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
