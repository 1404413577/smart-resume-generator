<template>
  <div class="grid-form-template" :style="templateStyles">
    
    <h1 class="gf-main-title">个 人 简 历</h1>

    <table class="gf-table">
      <tbody>
        <tr>
          <th class="gf-th">姓名</th>
          <td class="gf-td">{{ resumeData.personalInfo?.name }}</td>
          <th class="gf-th">意向岗位</th>
          <td class="gf-td">{{ resumeData.personalInfo?.targetPosition }}</td>
          <td class="gf-td gf-photo-cell" rowspan="3">
            <div class="gf-photo" v-if="resumeData.personalInfo?.photo">
              <img :src="resumeData.personalInfo.photo" alt="照片" />
            </div>
            <div class="gf-photo-placeholder" v-else>照片</div>
          </td>
        </tr>
        
        <tr>
          <th class="gf-th">联系电话</th>
          <td class="gf-td">{{ resumeData.personalInfo?.phone }}</td>
          <th class="gf-th">电子邮箱</th>
          <td class="gf-td">{{ resumeData.personalInfo?.email }}</td>
        </tr>

        <tr>
          <th class="gf-th">籍贯/地址</th>
          <td class="gf-td" colspan="3">{{ resumeData.personalInfo?.address }}</td>
        </tr>

        <tr v-if="resumeData.education?.length">
          <th class="gf-th">教育背景</th>
          <td class="gf-td" colspan="4">
            <div class="gf-block-item" v-for="edu in resumeData.education" :key="edu.id">
              <div class="gf-block-header">
                <strong>{{ edu.startDate }} - {{ edu.endDate }}</strong> | 
                <strong>{{ edu.school }}</strong> | 
                {{ edu.degree }} | {{ edu.major }}
              </div>
            </div>
          </td>
        </tr>

        <tr v-if="resumeData.workExperience?.length">
          <th class="gf-th">工作经历</th>
          <td class="gf-td" colspan="4">
            <div class="gf-block-item" v-for="work in resumeData.workExperience" :key="work.id">
              <div class="gf-block-header">
                <strong>{{ work.startDate }} - {{ work.endDate }}</strong> | 
                <strong>{{ work.company }}</strong> | 
                {{ work.position }}
              </div>
              <ul class="gf-list" v-if="work.achievements?.length">
                <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
              </ul>
            </div>
          </td>
        </tr>

        <tr v-if="resumeData.projects?.length">
          <th class="gf-th">项目经历</th>
          <td class="gf-td" colspan="4">
            <div class="gf-block-item" v-for="proj in resumeData.projects" :key="proj.id">
              <div class="gf-block-header">
                <strong>{{ proj.name }}</strong> ({{ proj.startDate }} - {{ proj.endDate }})
              </div>
              <div class="gf-text">{{ proj.description }}</div>
            </div>
          </td>
        </tr>

        <tr v-if="resumeData.skills?.length">
          <th class="gf-th">专业技能</th>
          <td class="gf-td" colspan="4">
            <div class="gf-inline-skills">
              <span v-for="skill in resumeData.skills" :key="skill.name">
                {{ skill.name }} ({{ skill.level }})；
              </span>
            </div>
          </td>
        </tr>

        <tr v-if="resumeData.summary">
          <th class="gf-th">自我评价</th>
          <td class="gf-td" colspan="4">
            <div class="gf-text gf-summary">{{ resumeData.summary }}</div>
          </td>
        </tr>

      </tbody>
    </table>

  </div>
</template>

<script setup>
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'gridForm'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)
</script>

<style scoped>
.grid-form-template {
  font-family: 'SimSun', 'Songti SC', serif; /* 传统宋体，最符合公文/表格规范 */
  background-color: #ffffff;
  color: #000000;
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 50px;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

.gf-main-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  letter-spacing: 5px;
  margin: 0 0 30px 0;
  font-family: 'SimHei', 'Heiti SC', sans-serif; /* 标题用黑体 */
}

.gf-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  line-height: 1.5;
}

.gf-th, .gf-td {
  border: 1px solid #000000;
  padding: 10px 12px;
}

.gf-th {
  background-color: #f2f2f2; /* 浅灰色背景，提升表格层次感 */
  font-weight: bold;
  text-align: center;
  width: 15%;
  white-space: nowrap;
}

.gf-td {
  vertical-align: top;
}

/* 照片单元格特定样式 */
.gf-photo-cell {
  width: 25%;
  text-align: center;
  vertical-align: middle;
  padding: 5px;
}

.gf-photo {
  width: 100px;
  height: 133px; /* 标准一寸/二寸比例 */
  margin: 0 auto;
}

.gf-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gf-photo-placeholder {
  width: 100px;
  height: 133px;
  margin: 0 auto;
  background-color: #f9f9f9;
  border: 1px dashed #999;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

/* 内部区块样式 */
.gf-block-item {
  margin-bottom: 12px;
}
.gf-block-item:last-child {
  margin-bottom: 0;
}

.gf-block-header {
  margin-bottom: 6px;
}

.gf-list {
  margin: 0;
  padding-left: 20px;
}

.gf-list li {
  margin-bottom: 4px;
}

.gf-text {
  text-align: justify;
}

.gf-summary {
  text-indent: 2em; /* 首行缩进，标准的中文文书规范 */
}

.gf-inline-skills {
  line-height: 1.8;
}
</style>