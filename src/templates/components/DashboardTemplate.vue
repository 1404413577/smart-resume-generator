<template>
  <div class="dash-template" :style="templateStyles">
    
    <aside class="dash-sidebar">
      <div class="sidebar-logo">
        <div class="logo-circle"></div>
        <span class="logo-text">RESUME_OS</span>
      </div>
      
      <div class="sidebar-profile">
        <div class="dash-avatar" v-if="resumeData.personalInfo?.photo">
          <img :src="resumeData.personalInfo.photo" alt="avatar" />
        </div>
        <div class="dash-name">{{ resumeData.personalInfo?.name || 'Admin User' }}</div>
        <div class="dash-role">{{ resumeData.personalInfo?.targetPosition || 'System Engineer' }}</div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-item active"><i>📊</i> Dashboard</div>
        <div class="nav-item"><i>💼</i> Experience</div>
        <div class="nav-item"><i>🚀</i> Projects</div>
        <div class="nav-item"><i>🎓</i> Education</div>
      </nav>

      <div class="sidebar-contact">
        <div class="contact-row" v-if="resumeData.personalInfo?.phone">📱 {{ resumeData.personalInfo.phone }}</div>
        <div class="contact-row" v-if="resumeData.personalInfo?.email">✉️ {{ resumeData.personalInfo.email }}</div>
        <div class="contact-row" v-if="resumeData.personalInfo?.address">📍 {{ resumeData.personalInfo.address }}</div>
      </div>
    </aside>

    <main class="dash-main">
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">Total Experience</div>
          <div class="kpi-value">{{ resumeData.workExperience?.length || 0 }} <span class="kpi-unit">Roles</span></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Projects Shipped</div>
          <div class="kpi-value">{{ resumeData.projects?.length || 0 }} <span class="kpi-unit">Apps</span></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">Tech Stack</div>
          <div class="kpi-value">{{ resumeData.skills?.length || 0 }} <span class="kpi-unit">Skills</span></div>
        </div>
      </div>

      <div class="dash-panel" v-if="resumeData.summary">
        <div class="panel-header">System Summary</div>
        <div class="panel-body">
          <p class="dash-text">{{ resumeData.summary }}</p>
        </div>
      </div>

      <div class="dash-two-col">
        <div class="col-left">
          <div class="dash-panel" v-if="resumeData.workExperience?.length">
            <div class="panel-header">Employment History</div>
            <div class="panel-body p-0">
              <table class="dash-table">
                <thead>
                  <tr>
                    <th>Company / Role</th>
                    <th>Period</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="work in resumeData.workExperience" :key="work.id">
                    <td>
                      <div class="td-title">{{ work.company }}</div>
                      <div class="td-sub">{{ work.position }}</div>
                      <ul class="td-bullets" v-if="work.achievements?.length">
                        <li v-for="ach in work.achievements.slice(0,2)" :key="ach">{{ ach }}</li>
                      </ul>
                    </td>
                    <td class="td-date">{{ work.startDate }}<br/>|<br/>{{ work.endDate }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="col-right">
          
          <div class="dash-panel" v-if="resumeData.skills?.length">
            <div class="panel-header">Skill Metrics</div>
            <div class="panel-body">
              <div class="skill-bar-wrapper" v-for="skill in resumeData.skills" :key="skill.name">
                <div class="sb-head">
                  <span class="sb-name">{{ skill.name }}</span>
                  <span class="sb-level">{{ skill.level }}</span>
                </div>
                <div class="sb-track">
                  <div class="sb-fill" :class="skill.level === '专家' ? 'bg-expert' : 'bg-normal'" :style="{ width: skill.level === '专家' ? '95%' : (skill.level === '高级' ? '80%' : '60%') }"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="dash-panel" v-if="resumeData.education?.length">
            <div class="panel-header">Education Logs</div>
            <div class="panel-body">
              <div class="edu-log" v-for="edu in resumeData.education" :key="edu.id">
                <div class="log-indicator"></div>
                <div class="log-content">
                  <div class="log-school">{{ edu.school }}</div>
                  <div class="log-degree">{{ edu.degree }}, {{ edu.major }}</div>
                  <div class="log-date">{{ edu.endDate }}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'dashboard' }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.dash-template {
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: #f1f5f9;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Sidebar */
.dash-sidebar {
  width: 240px;
  background-color: #0f172a;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  padding: 0 24px;
  margin-bottom: 30px;
}
.logo-circle { width: 14px; height: 14px; background: #3b82f6; border-radius: 50%; margin-right: 10px; box-shadow: 0 0 10px #3b82f6; }
.logo-text { color: #fff; font-weight: 800; font-size: 14px; letter-spacing: 1px; }

.sidebar-profile {
  padding: 0 24px;
  margin-bottom: 30px;
}
.dash-avatar { width: 60px; height: 60px; border-radius: 8px; margin-bottom: 12px; overflow: hidden; border: 2px solid #334155; }
.dash-avatar img { width: 100%; height: 100%; object-fit: cover; }
.dash-name { color: #f8fafc; font-weight: 600; font-size: 16px; margin-bottom: 4px; }
.dash-role { font-size: 12px; }

.sidebar-nav { flex: 1; }
.nav-item { padding: 12px 24px; font-size: 13px; font-weight: 500; display: flex; align-items: center; }
.nav-item i { margin-right: 12px; font-style: normal; }
.nav-item.active { background-color: #1e293b; color: #fff; border-right: 3px solid #3b82f6; }

.sidebar-contact { padding: 0 24px; font-size: 12px; }
.contact-row { margin-bottom: 10px; word-break: break-all; }

/* Main Content */
.dash-main { flex: 1; padding: 30px; }

.kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
.kpi-card { background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.kpi-title { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; margin-bottom: 8px; }
.kpi-value { font-size: 28px; font-weight: 700; color: #0f172a; }
.kpi-unit { font-size: 13px; color: #94a3b8; font-weight: 500; }

.dash-panel { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
.panel-header { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600; color: #0f172a; background: #f8fafc; }
.panel-body { padding: 20px; }
.p-0 { padding: 0; }

.dash-text { font-size: 13px; color: #334155; line-height: 1.6; margin: 0; }

.dash-two-col { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }

/* Table */
.dash-table { width: 100%; border-collapse: collapse; font-size: 13px; text-align: left; }
.dash-table th { padding: 12px 20px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-weight: 600; }
.dash-table td { padding: 16px 20px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
.dash-table tr:last-child td { border-bottom: none; }
.td-title { font-weight: 600; color: #0f172a; margin-bottom: 4px; }
.td-sub { color: #3b82f6; margin-bottom: 8px; font-weight: 500;}
.td-bullets { margin: 0; padding-left: 16px; color: #475569; }
.td-bullets li { margin-bottom: 4px; }
.td-date { color: #64748b; font-size: 11px; text-align: center; white-space: nowrap; }

/* Skills */
.skill-bar-wrapper { margin-bottom: 16px; }
.skill-bar-wrapper:last-child { margin-bottom: 0; }
.sb-head { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; font-weight: 500; }
.sb-level { color: #64748b; }
.sb-track { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
.sb-fill { height: 100%; border-radius: 3px; }
.bg-expert { background: #3b82f6; }
.bg-normal { background: #94a3b8; }

/* Education Log */
.edu-log { display: flex; margin-bottom: 16px; position: relative; }
.edu-log:last-child { margin-bottom: 0; }
.log-indicator { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; margin-top: 4px; margin-right: 12px; z-index: 2; position: relative; box-shadow: 0 0 0 4px #fff; }
.edu-log:not(:last-child)::before { content: ''; position: absolute; left: 3px; top: 12px; bottom: -20px; width: 2px; background: #e2e8f0; z-index: 1; }
.log-school { font-weight: 600; font-size: 13px; color: #0f172a; }
.log-degree { font-size: 12px; color: #475569; margin: 2px 0; }
.log-date { font-size: 11px; color: #94a3b8; }
</style>