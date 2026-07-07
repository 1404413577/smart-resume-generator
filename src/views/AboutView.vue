<template>
  <div class="about-view">
    <main class="about-shell">
      <section class="project-header" aria-labelledby="about-title">
        <div class="project-title-row">
          <div class="project-mark" aria-hidden="true">
            <el-icon><Document /></el-icon>
          </div>
          <div>
            <h1 id="about-title">智能简历生成器</h1>
            <p class="version">v{{ version }} · 本地优先的简历编辑工具</p>
          </div>
        </div>
        <p class="project-summary">
          一个基于 Vue 3、Vite、Pinia 和 Element Plus 的开源风格简历生成器。项目聚焦结构化编辑、
          模板预览、样式调整、PDF/Word 导出，以及可配置的 AI 内容辅助。
        </p>
        <div class="quick-links" aria-label="项目入口">
          <router-link to="/" class="text-link">开始编辑</router-link>
          <router-link to="/templates" class="text-link">查看模板</router-link>
          <router-link to="/settings" class="text-link">配置 AI</router-link>
        </div>
      </section>

      <div class="content-grid">
        <aside class="toc" aria-label="页面目录">
          <a href="#features">核心能力</a>
          <a href="#privacy">数据与隐私</a>
          <a href="#stack">技术栈</a>
          <a href="#scope">当前边界</a>
        </aside>

        <div class="document-content">
          <section id="features" class="doc-section">
            <h2>核心能力</h2>
            <div class="definition-list">
              <div v-for="item in features" :key="item.title" class="definition-row">
                <dt>
                  <el-icon><component :is="item.icon" /></el-icon>
                  {{ item.title }}
                </dt>
                <dd>{{ item.description }}</dd>
              </div>
            </div>
          </section>

          <section id="privacy" class="doc-section">
            <h2>数据与隐私</h2>
            <div class="notice">
              <strong>默认不依赖后端。</strong>
              简历内容保存在当前浏览器环境中。清理浏览器站点数据、切换设备或更换浏览器后，本地数据可能无法恢复。
            </div>
            <ul class="check-list">
              <li>简历内容使用 IndexedDB/localStorage 持久化。</li>
              <li>AI API Key 和接口配置保存在当前浏览器本地。</li>
              <li>使用在线 AI 接口时，请求内容会发送到用户配置的服务地址。</li>
              <li>使用 Ollama 或浏览器本地模型时，数据处理位置取决于本地运行环境。</li>
            </ul>
          </section>

          <section id="stack" class="doc-section">
            <h2>技术栈</h2>
            <div class="stack-table" role="table" aria-label="技术栈">
              <div class="stack-row stack-head" role="row">
                <span role="columnheader">模块</span>
                <span role="columnheader">技术</span>
                <span role="columnheader">用途</span>
              </div>
              <div v-for="item in stack" :key="item.name" class="stack-row" role="row">
                <span role="cell">{{ item.group }}</span>
                <strong role="cell">{{ item.name }}</strong>
                <span role="cell">{{ item.description }}</span>
              </div>
            </div>
          </section>

          <section id="scope" class="doc-section">
            <h2>当前边界</h2>
            <div class="scope-grid">
              <div>
                <h3>已覆盖</h3>
                <ul>
                  <li>结构化编辑与实时预览</li>
                  <li>模板中心与设计样式调整</li>
                  <li>PDF/Word 导出主路径</li>
                  <li>可配置 AI 内容生成和润色</li>
                </ul>
              </div>
              <div>
                <h3>未内置</h3>
                <ul>
                  <li>云同步和账号体系</li>
                  <li>OCR 图片识别导入</li>
                  <li>在线客服或官方后端服务</li>
                  <li>多简历版本历史管理</li>
                </ul>
              </div>
            </div>
          </section>

          <footer class="project-footer">
            <span>© 2024 智能简历生成器</span>
            <span>面向稳定编辑、清晰导出和可维护模板系统持续优化。</span>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Document,
  Edit,
  Grid,
  Download,
  DataLine,
  MagicStick
} from '@element-plus/icons-vue'

const version = ref('2.0.0')

const features = [
  {
    title: '结构化编辑',
    description: '按个人信息、简介、经历、教育、技能和项目拆分内容，降低格式维护成本。',
    icon: Edit
  },
  {
    title: '模板系统',
    description: '通过统一模板和 variant 配置复用渲染逻辑，减少新增模板时的重复代码。',
    icon: Grid
  },
  {
    title: '导出能力',
    description: '支持 PDF 与 Word 导出，覆盖投递、打印和本地备份的主要场景。',
    icon: Download
  },
  {
    title: '本地保存',
    description: '默认在浏览器本地保存简历和设置，不要求用户接入后端服务。',
    icon: DataLine
  },
  {
    title: 'AI 辅助',
    description: '支持 OpenAI 兼容接口、Gemini、Ollama 和浏览器本地模型等可配置方式。',
    icon: MagicStick
  }
]

const stack = [
  { group: '前端', name: 'Vue 3 + Vite', description: '单页应用和开发构建' },
  { group: '状态', name: 'Pinia', description: '简历数据、模板和全局设置管理' },
  { group: 'UI', name: 'Element Plus', description: '表单、按钮、弹窗和基础交互组件' },
  { group: '存储', name: 'Dexie / IndexedDB', description: '浏览器本地简历数据持久化' },
  { group: '导出', name: 'jsPDF / docx', description: '生成 PDF 和 Word 文件' },
  { group: 'AI', name: 'OpenAI / Gemini / Ollama', description: '按用户配置调用内容生成服务' }
]
</script>

<style scoped>
.about-view {
  height: 100%;
  overflow: auto;
  background: #f5f7fa;
  color: #303133;
}

.about-shell {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
  padding: 36px 0 48px;
}

.project-header {
  padding: 28px 0 32px;
  border-bottom: 1px solid #dcdfe6;
}

.project-title-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 18px;
}

.project-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #ffffff;
  color: #409eff;
  font-size: 24px;
}

h1,
h2,
h3,
p {
  margin: 0;
}

h1 {
  font-size: 30px;
  line-height: 1.2;
  font-weight: 650;
  color: #1f2937;
}

.version {
  margin-top: 6px;
  font-size: 13px;
  color: #606266;
}

.project-summary {
  max-width: 820px;
  font-size: 15px;
  line-height: 1.8;
  color: #4b5563;
}

.quick-links {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 20px;
}

.text-link {
  color: #2563eb;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.text-link:hover {
  text-decoration: underline;
}

.content-grid {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
  padding-top: 28px;
}

.toc {
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 0;
}

.toc a {
  padding: 8px 10px;
  border-radius: 6px;
  color: #606266;
  font-size: 13px;
  text-decoration: none;
}

.toc a:hover {
  background: #ffffff;
  color: #2563eb;
}

.document-content {
  display: flex;
  flex-direction: column;
  gap: 34px;
}

.doc-section {
  padding-bottom: 34px;
  border-bottom: 1px solid #e4e7ed;
}

.doc-section h2 {
  margin-bottom: 18px;
  font-size: 20px;
  line-height: 1.3;
  font-weight: 650;
  color: #1f2937;
}

.definition-list {
  display: grid;
  gap: 12px;
}

.definition-row {
  display: grid;
  grid-template-columns: 190px minmax(0, 1fr);
  gap: 20px;
  padding: 14px 0;
  border-top: 1px solid #e4e7ed;
}

.definition-row:first-child {
  border-top: none;
}

.definition-row dt {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 650;
  color: #303133;
}

.definition-row dt .el-icon {
  color: #409eff;
}

.definition-row dd {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.7;
}

.notice {
  padding: 14px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #ffffff;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.7;
}

.check-list,
.scope-grid ul {
  margin: 16px 0 0;
  padding-left: 18px;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.stack-table {
  overflow: hidden;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  background: #ffffff;
}

.stack-row {
  display: grid;
  grid-template-columns: 120px 180px minmax(0, 1fr);
  gap: 16px;
  padding: 13px 16px;
  border-top: 1px solid #ebeef5;
  color: #606266;
  font-size: 14px;
}

.stack-row:first-child {
  border-top: none;
}

.stack-head {
  background: #fafbfc;
  color: #303133;
  font-size: 13px;
  font-weight: 650;
}

.stack-row strong {
  color: #303133;
  font-weight: 650;
}

.scope-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

.scope-grid h3 {
  font-size: 15px;
  font-weight: 650;
  color: #303133;
}

.project-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  color: #909399;
  font-size: 13px;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .toc {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 0;
  }
}

@media (max-width: 640px) {
  .about-shell {
    width: min(100% - 28px, 1120px);
    padding: 24px 0 36px;
  }

  .project-title-row,
  .project-footer {
    align-items: flex-start;
  }

  h1 {
    font-size: 24px;
  }

  .definition-row,
  .stack-row,
  .scope-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .stack-head {
    display: none;
  }
}
</style>
