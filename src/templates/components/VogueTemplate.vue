<template>
  <div class="vogue-template" :style="templateStyles">
    
    <!-- Top Decorative Line -->
    <div class="vogue-top-bar"></div>

    <!-- Header (Magazine Cover Style) -->
    <header class="vogue-header">
      <div class="header-name">
        <h1 class="v-name">{{ resumeData.personalInfo?.name || 'VOGUE' }}</h1>
        <div class="v-issue">ISSUE NO.01 / THE PORTFOLIO EDIT</div>
      </div>
      <div class="header-meta">
        <div class="v-role">{{ resumeData.personalInfo?.targetPosition || 'ART DIRECTOR' }}</div>
        
        <div class="v-contact" v-if="hasContactInfo">
          <span v-if="resumeData.personalInfo?.email">{{ resumeData.personalInfo.email }}</span>
          <span class="v-sep" v-if="resumeData.personalInfo?.email && resumeData.personalInfo?.phone">/</span>
          <span v-if="resumeData.personalInfo?.phone">{{ resumeData.personalInfo.phone }}</span>
          <span class="v-sep" v-if="(resumeData.personalInfo?.email || resumeData.personalInfo?.phone) && resumeData.personalInfo?.website">/</span>
          <span v-if="resumeData.personalInfo?.website">{{ resumeData.personalInfo.website }}</span>
        </div>
      </div>
    </header>

    <!-- Main Spread -->
    <div class="vogue-spread">
      
      <!-- Left Column -->
      <div class="vogue-col vogue-left">
        
        <!-- Summary / Editor's Letter -->
        <section class="vogue-section" v-if="resumeData.summary">
          <h2 class="section-heading"><span>THE</span> PREFACE</h2>
          <div class="editorial-box">
            <p class="drop-cap">{{ resumeData.summary }}</p>
          </div>
        </section>

        <!-- Experience -->
        <section class="vogue-section" v-if="resumeData.workExperience?.length">
          <h2 class="section-heading"><span>THE</span> CAREER</h2>
          
          <div class="exp-article" v-for="work in resumeData.workExperience" :key="work.id">
            <div class="exp-top">
              <h3 class="exp-title">{{ work.position }}</h3>
              <div class="exp-brand">{{ work.company }}</div>
            </div>
            <div class="exp-season">{{ work.startDate }} — {{ work.endDate }}</div>
            <p class="exp-prose" v-if="work.description">{{ work.description }}</p>
            
            <ul class="exp-details" v-if="work.achievements?.length">
              <li v-for="ach in work.achievements" :key="ach">{{ ach }}</li>
            </ul>
          </div>
        </section>

      </div>

      <!-- Right Column -->
      <div class="vogue-col vogue-right">
        
        <!-- Image / Portrait if available -->
        <div class="vogue-portrait" v-if="resumeData.personalInfo?.photo">
          <div class="img-frame">
            <img :src="resumeData.personalInfo.photo" alt="Portrait" />
          </div>
          <div class="img-caption">EXCLUSIVE FEATURE</div>
        </div>

        <!-- Selected Projects -->
        <section class="vogue-section" v-if="resumeData.projects?.length">
          <h2 class="section-heading"><span>THE</span> PORTFOLIO</h2>
          <div class="proj-catalog">
            <div class="proj-item" v-for="(proj, index) in resumeData.projects" :key="proj.id">
              <div class="proj-num">{{ String(index + 1).padStart(2, '0') }}</div>
              <div class="proj-content">
                <h4 class="proj-title">{{ proj.name }}</h4>
                <p class="proj-prose">{{ proj.description }}</p>
                <div class="proj-tags" v-if="proj.technologies?.length">
                  <span class="v-tag" v-for="tag in proj.technologies.slice(0,3)" :key="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="vogue-section" v-if="resumeData.education?.length">
          <h2 class="section-heading"><span>THE</span> ACADEMICS</h2>
          <div class="edu-list">
            <div class="edu-item" v-for="edu in resumeData.education" :key="edu.id">
              <div class="edu-degree">{{ edu.degree }}</div>
              <div class="edu-major">{{ edu.major }}</div>
              <div class="edu-univ">{{ edu.school }}, {{ edu.endDate }}</div>
            </div>
          </div>
        </section>

        <!-- Skills -->
        <section class="vogue-section" v-if="resumeData.skills?.length">
          <h2 class="section-heading"><span>THE</span> CRAFT</h2>
          <div class="skill-cloud">
            <span class="skill-badge" v-for="skill in resumeData.skills" :key="skill.id">
              {{ skill.name }}
            </span>
          </div>
        </section>

      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useTemplateComponentStyles } from '../../composables/useTemplateStyles'

const props = defineProps({
  resumeData: {
    type: Object,
    required: true
  },
  templateId: {
    type: String,
    default: 'vogue'
  }
})

const { templateStyles } = useTemplateComponentStyles(props.templateId)

const hasContactInfo = computed(() => {
  const p = props.resumeData?.personalInfo || {}
  return p.email || p.phone || p.website
})
</script>

<style scoped>
/* 
  Vogue / High Fashion Editorial Premium Aesthetic 
  Serif heavy, huge contrast, extreme elegance.
*/
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Lato:wght@300;400;700;900&display=swap');

.vogue-template {
  --v-bg: #EAE6DF;       /* Warm parchment/beige */
  --v-text: #1C1B1A;     /* Soft black */
  --v-accent: #7A2828;   /* Deep crimson / burgundy */
  --v-lines: #2C2C2C;
  --v-muted: #5A5A5A;
  
  --f-serif: 'Playfair Display', Georgia, serif;
  --f-sans: 'Lato', 'Helvetica Neue', Arial, sans-serif;

  font-family: var(--f-serif);
  background-color: var(--v-bg);
  color: var(--v-text);
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 40px 50px;
  position: relative;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* Subtle texture (optional noise) */
.vogue-template::after {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  opacity: 0.15;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}

/* Structure that sits above noise */
.vogue-top-bar, .vogue-header, .vogue-spread {
  position: relative;
  z-index: 1;
}

/* Top Decor */
.vogue-top-bar {
  height: 8px;
  background-color: var(--v-text);
  margin-bottom: 2px;
}
.vogue-top-bar::after {
  content: '';
  display: block;
  height: 2px;
  background-color: var(--v-text);
  margin-top: 12px;
}

/* Header */
.vogue-header {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 40px;
}

.header-name {
  margin-bottom: 20px;
}

.v-name {
  font-family: var(--f-serif);
  font-size: 72px;
  font-weight: 900;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: -2px;
  line-height: 1;
}

.v-issue {
  font-family: var(--f-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 4px;
  color: var(--v-muted);
  margin-top: 10px;
  text-transform: uppercase;
}

.header-meta {
  border-top: 1px solid var(--v-lines);
  border-bottom: 1px solid var(--v-lines);
  padding: 15px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

.v-role {
  font-family: var(--f-serif);
  font-style: italic;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1px;
}

.v-contact {
  font-family: var(--f-sans);
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--v-muted);
}

.v-sep {
  margin: 0 10px;
  color: var(--v-accent);
}

/* Magazine Layout (2 Cols) */
.vogue-spread {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 50px;
}

/* Common Section Heading */
.section-heading {
  font-family: var(--f-sans);
  font-size: 14px;
  font-weight: 900;
  letter-spacing: 3px;
  text-transform: uppercase;
  border-bottom: 1px solid var(--v-text);
  padding-bottom: 10px;
  margin-bottom: 25px;
  display: flex;
  align-items: center;
}

.section-heading span {
  font-family: var(--f-serif);
  font-style: italic;
  font-size: 16px;
  font-weight: 400;
  color: var(--v-accent);
  margin-right: 8px;
  text-transform: lowercase;
}

.vogue-section {
  margin-bottom: 45px;
}

/* Preface (Summary) with Drop Cap */
.editorial-box {
  padding-right: 20px;
}

.drop-cap {
  font-family: var(--f-serif);
  font-size: 15px;
  line-height: 1.8;
  color: var(--v-text);
  margin: 0;
  text-align: justify;
}

.drop-cap::first-letter {
  font-family: var(--f-serif);
  font-size: 64px;
  font-weight: 900;
  float: left;
  line-height: 0.8;
  padding-right: 8px;
  padding-top: 4px;
  color: var(--v-accent);
}

/* Experience Article */
.exp-article {
  margin-bottom: 35px;
}

.exp-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
}

.exp-title {
  font-family: var(--f-serif);
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.exp-brand {
  font-family: var(--f-sans);
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--v-accent);
}

.exp-season {
  font-family: var(--f-sans);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--v-muted);
  text-transform: uppercase;
  margin-bottom: 12px;
}

.exp-prose {
  font-size: 14px;
  line-height: 1.6;
  text-align: justify;
  margin: 0 0 12px 0;
}

.exp-details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.exp-details li {
  position: relative;
  padding-left: 20px;
  font-size: 13.5px;
  line-height: 1.6;
  margin-bottom: 8px;
  color: var(--v-text);
}

.exp-details li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--v-accent);
}

/* Portrait (Right Col) */
.vogue-portrait {
  margin-bottom: 40px;
}

.img-frame {
  width: 100%;
  aspect-ratio: 3/4; /* Classic magazine portrait ratio */
  background: #ccc;
  overflow: hidden;
  border: 1px solid var(--v-lines);
  padding: 8px;
  box-sizing: border-box;
}

.img-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.2) contrast(1.1); /* Editorial coloring */
}

.img-caption {
  font-family: var(--f-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  text-align: right;
  margin-top: 8px;
  color: var(--v-muted);
}

/* Portfolio Catalog */
.proj-catalog {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.proj-item {
  display: flex;
  gap: 15px;
}

.proj-num {
  font-family: var(--f-serif);
  font-size: 20px;
  font-weight: 900;
  color: var(--v-accent);
  line-height: 1;
}

.proj-content {
  flex: 1;
}

.proj-title {
  font-family: var(--f-serif);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  margin: 0 0 6px 0;
}

.proj-prose {
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 10px 0;
}

.proj-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.v-tag {
  font-family: var(--f-sans);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 1px solid var(--v-muted);
  padding: 3px 6px;
  color: var(--v-muted);
}

/* Education */
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.edu-item {
  text-align: center;
  padding: 15px;
  border: 1px solid var(--v-lines);
}

.edu-degree {
  font-family: var(--f-serif);
  font-size: 16px;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.edu-major {
  font-family: var(--f-sans);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--v-accent);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.edu-univ {
  font-style: italic;
  font-size: 13px;
  color: var(--v-muted);
}

/* Skills Cloud */
.skill-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.skill-badge {
  font-family: var(--f-sans);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  padding: 8px 12px;
  background-color: var(--v-text);
  color: var(--v-bg);
}

/* Responsive */
@media (max-width: 768px) {
  .vogue-template {
    width: 100%;
    height: auto;
    padding: 20px;
  }
  .v-name {
    font-size: 48px;
  }
  .vogue-spread {
    grid-template-columns: 1fr;
  }
  .vogue-portrait {
    display: none; /* Hide huge image on mobile for better flow */
  }
}
</style>
