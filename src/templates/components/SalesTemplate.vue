<template>
  <div class="sales-template" :style="cssVars">

    <!-- 顶部页眉：姓名 + 职位 + 联系方式 -->
    <header class="st-header">
      <div class="st-header-left">
        <h1 class="st-name">{{ info.name || '姓名' }}</h1>
        <p class="st-position">{{ info.targetPosition || '销售经理 · Sales Manager' }}</p>
        <div class="st-tagline" v-if="resumeData.summary">
          {{ resumeData.summary }}
        </div>
      </div>
      <div class="st-header-right">
        <div class="st-contact-row" v-if="info.phone">
          <span class="ct-icon">📱</span>
          <span>{{ info.phone }}</span>
        </div>
        <div class="st-contact-row" v-if="info.email">
          <span class="ct-icon">✉</span>
          <span>{{ info.email }}</span>
        </div>
        <div class="st-contact-row" v-if="info.address">
          <span class="ct-icon">📍</span>
          <span>{{ info.address }}</span>
        </div>
        <div class="st-contact-row" v-if="info.website">
          <span class="ct-icon">🔗</span>
          <span>{{ info.website }}</span>
        </div>
      </div>
    </header>

    <!-- 核心业绩看板 -->
    <section class="st-kpi" v-if="kpiItems.length">
      <div class="kpi-card" v-for="(kpi, i) in kpiItems" :key="i">
        <div class="kpi-value">{{ kpi.value }}</div>
        <div class="kpi-label">{{ kpi.label }}</div>
      </div>
    </section>

    <div class="st-body">

      <!-- 左栏 -->
      <aside class="st-sidebar">

        <!-- 核心技能 -->
        <section class="st-section" v-if="resumeData.skills?.length">
          <h2 class="st-section-title">核心技能</h2>
          <div class="skill-list">
            <div class="skill-item" v-for="s in resumeData.skills" :key="s.id">
              <div class="skill-row">
                <span class="skill-name">{{ s.name }}</span>
                <span class="skill-level">{{ s.level }}</span>
              </div>
              <div class="skill-bar-bg">
                <div class="skill-bar-fill" :style="{ width: levelToWidth(s.level) }"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- 教育背景 -->
        <section class="st-section" v-if="resumeData.education?.length">
          <h2 class="st-section-title">教育背景</h2>
          <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
            <div class="edu-school">{{ edu.school }}</div>
            <div class="edu-major">{{ edu.major }} · {{ edu.degree }}</div>
            <div class="edu-date">{{ edu.startDate }} – {{ edu.endDate || '至今' }}</div>
            <div class="edu-gpa" v-if="edu.gpa">GPA {{ edu.gpa }}</div>
          </div>
        </section>

        <!-- 语言能力 -->
        <section class="st-section" v-if="resumeData.languages?.length">
          <h2 class="st-section-title">语言能力</h2>
          <div class="lang-item" v-for="l in resumeData.languages" :key="l.id">
            <span class="lang-name">{{ l.name }}</span>
            <span class="lang-level">{{ l.level }}</span>
          </div>
        </section>

        <!-- 证书 -->
        <section class="st-section" v-if="resumeData.certifications?.length">
          <h2 class="st-section-title">证书 & 荣誉</h2>
          <div class="cert-item" v-for="c in resumeData.certifications" :key="c.id">
            <div class="cert-name">{{ c.name }}</div>
            <div class="cert-meta">{{ c.issuer }} · {{ c.date }}</div>
          </div>
        </section>

      </aside>

      <!-- 右栏（主内容） -->
      <main class="st-main">

        <!-- 工作经历 -->
        <section class="st-section" v-if="resumeData.workExperience?.length">
          <h2 class="st-section-title">销售业绩 &amp; 工作经历</h2>
          <div class="work-item" v-for="w in resumeData.workExperience" :key="w.id">
            <div class="work-header">
              <div class="work-left">
                <div class="work-position">{{ w.position }}</div>
                <div class="work-company">{{ w.company }}<span v-if="w.location"> · {{ w.location }}</span></div>
              </div>
              <div class="work-date">{{ w.startDate }} – {{ w.current ? '至今' : w.endDate }}</div>
            </div>
            <p class="work-desc" v-if="w.description">{{ w.description }}</p>
            <ul class="work-achievements" v-if="w.achievements?.length">
              <li v-for="(a, i) in w.achievements" :key="i">{{ a }}</li>
            </ul>
          </div>
        </section>

        <!-- 项目经历 -->
        <section class="st-section" v-if="resumeData.projects?.length">
          <h2 class="st-section-title">重点项目 &amp; 案例</h2>
          <div class="project-item" v-for="p in resumeData.projects" :key="p.id">
            <div class="project-header">
              <span class="project-name">{{ p.name }}</span>
              <span class="project-date" v-if="p.startDate">{{ p.startDate }} – {{ p.endDate || '至今' }}</span>
            </div>
            <p class="project-desc" v-if="p.description">{{ p.description }}</p>
            <div class="project-techs" v-if="p.technologies?.length">
              <span class="tech-tag" v-for="t in p.technologies" :key="t">{{ t }}</span>
            </div>
            <ul class="project-highlights" v-if="p.highlights?.length">
              <li v-for="(h, i) in p.highlights" :key="i">{{ h }}</li>
            </ul>
          </div>
        </section>

      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'sales' }
})

const info = computed(() => props.resumeData?.personalInfo || {})

// CSS 变量注入
const cssVars = computed(() => ({
  '--primary': 'var(--resume-primary-color, #c0392b)',
  '--accent':  'var(--resume-accent-color, #e74c3c)',
  '--text':    'var(--resume-text-color, #1a1a2e)',
  '--subtle':  '#6b7280',
  '--bg':      '#ffffff',
  '--sidebar-bg': '#1a1a2e',
  '--sidebar-text': '#f0f0f0',
  '--bar-bg':  'rgba(255,255,255,0.15)',
  '--bar-fill':'var(--resume-accent-color, #e74c3c)',
  '--font':    'var(--resume-font-family, "Inter", "PingFang SC", "Microsoft YaHei", sans-serif)',
  '--base-fs': 'var(--resume-base-font-size, 13px)',
}))

// 从工作经历第一条抽取核心 KPI（如果achievements里有包含 % 或 数字的条目）
const kpiItems = computed(() => {
  const result = []
  const works = props.resumeData?.workExperience || []
  // 尝试提取 achievements 里看起来是数字/业绩的内容，最多 4 个
  for (const w of works) {
    for (const a of (w.achievements || [])) {
      const numMatch = a.match(/[\d,.]+[%倍万亿+]/)
      if (numMatch && result.length < 4) {
        // 截取数值部分作为 value，其余作为 label（最多12字）
        const valueReg = a.match(/[\d,.]+[%倍万亿+K]/)
        const value = valueReg ? valueReg[0] : '—'
        const label = a.replace(value, '').trim().slice(0, 18) || a.slice(0, 18)
        result.push({ value, label })
      }
    }
    if (result.length >= 4) break
  }

  // 如果没有可提取的，提供占位示例
  if (result.length === 0) {
    return [
      { value: '120%', label: '年度业绩完成率' },
      { value: '500+', label: '累计服务客户' },
      { value: '¥3,000万', label: '个人年销售额' },
      { value: '95%', label: '客户续签率' },
    ]
  }
  return result
})

function levelToWidth(level) {
  const map = { '专家': '95%', '高级': '85%', '熟练': '70%', '中级': '60%', '初级': '40%', '了解': '30%' }
  return map[level] || '65%'
}
</script>

<style scoped>
/* ============ 整体 ============ */
.sales-template {
  font-family: var(--font);
  font-size: var(--base-fs);
  color: var(--text);
  background: var(--bg);
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* ============ 页眉 ============ */
.st-header {
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding: 28px 32px 22px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.st-name {
  font-size: 2em;
  font-weight: 800;
  letter-spacing: -.5px;
  margin: 0 0 4px;
  color: #fff;
}

.st-position {
  font-size: 1em;
  font-weight: 600;
  color: var(--accent);
  margin: 0 0 10px;
  letter-spacing: .3px;
}

.st-tagline {
  font-size: .82em;
  color: rgba(255,255,255,.7);
  line-height: 1.5;
  max-width: 340px;
}

.st-header-right {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 180px;
}

.st-contact-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: .82em;
  color: rgba(255,255,255,.85);
}

.ct-icon {
  font-size: 1em;
  width: 18px;
  text-align: center;
}

/* ============ KPI 看板 ============ */
.st-kpi {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  background: var(--accent);
}

.kpi-card {
  padding: 14px 10px;
  text-align: center;
  border-right: 1px solid rgba(255,255,255,.25);
  color: #fff;
}

.kpi-card:last-child {
  border-right: none;
}

.kpi-value {
  font-size: 1.5em;
  font-weight: 800;
  line-height: 1;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: .72em;
  opacity: .9;
  line-height: 1.3;
}

/* ============ 主体布局 ============ */
.st-body {
  flex: 1;
  display: grid;
  grid-template-columns: 195px 1fr;
}

/* ============ 侧栏 ============ */
.st-sidebar {
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.st-sidebar .st-section-title {
  font-size: .78em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--accent);
  margin: 0 0 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid rgba(255,255,255,.12);
}

/* 技能条 */
.skill-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 3px;
}

.skill-name {
  font-size: .82em;
  font-weight: 500;
}

.skill-level {
  font-size: .7em;
  color: var(--accent);
}

.skill-bar-bg {
  height: 4px;
  background: rgba(255,255,255,.15);
  border-radius: 2px;
  overflow: hidden;
}

.skill-bar-fill {
  height: 100%;
  background: var(--accent);
  border-radius: 2px;
  transition: width .3s;
}

/* 教育 */
.edu-item {
  margin-bottom: 12px;
  font-size: .82em;
}

.edu-school {
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
}

.edu-major {
  color: rgba(255,255,255,.75);
  margin-bottom: 2px;
}

.edu-date, .edu-gpa {
  color: rgba(255,255,255,.5);
  font-size: .9em;
}

/* 语言 */
.lang-item {
  display: flex;
  justify-content: space-between;
  font-size: .82em;
  padding: 4px 0;
  border-bottom: 1px solid rgba(255,255,255,.06);
  color: rgba(255,255,255,.8);
}

.lang-name { font-weight: 600; }
.lang-level { color: var(--accent); font-size: .9em; }

/* 证书 */
.cert-item {
  margin-bottom: 10px;
  font-size: .82em;
}

.cert-name {
  font-weight: 600;
  color: #fff;
  margin-bottom: 2px;
}

.cert-meta {
  color: rgba(255,255,255,.5);
  font-size: .9em;
}

/* ============ 主内容区 ============ */
.st-main {
  padding: 22px 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.st-section-title {
  font-size: .78em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--primary);
  margin: 0 0 12px;
  padding-bottom: 5px;
  border-bottom: 2px solid var(--accent);
  display: inline-block;
  width: 100%;
}

/* 工作经历 */
.work-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f2f2f2;
}

.work-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 5px;
}

.work-position {
  font-size: 1em;
  font-weight: 700;
  color: var(--text);
}

.work-company {
  font-size: .85em;
  color: var(--subtle);
  margin-top: 2px;
}

.work-date {
  font-size: .78em;
  color: var(--primary);
  font-weight: 600;
  white-space: nowrap;
  background: rgba(192,57,43,.08);
  padding: 2px 8px;
  border-radius: 4px;
}

.work-desc {
  font-size: .85em;
  color: #555;
  line-height: 1.55;
  margin: 6px 0 6px;
}

.work-achievements {
  margin: 0;
  padding-left: 16px;
  list-style: none;
}

.work-achievements li {
  font-size: .85em;
  color: #444;
  line-height: 1.5;
  padding: 2px 0 2px 12px;
  position: relative;
}

.work-achievements li::before {
  content: '▶';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: .65em;
  top: 4px;
}

/* 项目 */
.project-item {
  margin-bottom: 14px;
  padding: 12px 14px;
  background: #fafafa;
  border-left: 3px solid var(--accent);
  border-radius: 0 6px 6px 0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.project-name {
  font-weight: 700;
  font-size: .92em;
  color: var(--text);
}

.project-date {
  font-size: .75em;
  color: var(--subtle);
}

.project-desc {
  font-size: .82em;
  color: #555;
  margin: 4px 0 6px;
  line-height: 1.5;
}

.project-techs {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 6px;
}

.tech-tag {
  font-size: .72em;
  padding: 2px 8px;
  background: rgba(192,57,43,.1);
  color: var(--primary);
  border-radius: 20px;
  font-weight: 600;
}

.project-highlights {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.project-highlights li {
  font-size: .82em;
  color: #444;
  padding: 2px 0;
  padding-left: 14px;
  position: relative;
}

.project-highlights li::before {
  content: '●';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-size: .6em;
  top: 4px;
}

/* ============ 打印优化 ============ */
@media print {
  .sales-template {
    width: 100% !important;
    min-height: auto !important;
  }
  .st-kpi { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .st-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .st-sidebar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
</style>
