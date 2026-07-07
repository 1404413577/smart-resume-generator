# 项目优化与 AI 模板生成规范

本文档用于两件事：

1. 记录当前项目后续还能继续优化的方向。
2. 规定以后让 AI 新建简历模板时，必须按统一规则生成，避免模板越写越乱。

当前项目是 Vue 3 + Vite + Pinia + Element Plus 的简历生成器，核心能力包括简历编辑、模板切换、实时预览、PDF/Word 导出、AI 生成、IndexedDB 持久化和自定义样式。项目已经能跑，但后续重点不应该继续堆功能，而是先把模板契约、数据模型、导出链路和 AI 生成规则稳定下来。

## 1. 当前项目优化判断

### 1.1 优先优化模板系统

当前模板注册在 `src/templates/index.js`，多个模板 ID 共用 `src/templates/components/UnifiedResumeTemplate.vue`，通过 `templateId`、CSS class、CSS 变量和全局设置区分风格。

这个方向是对的，因为简历模板最怕每新增一个模板就复制一份完整组件，后期会导致：

- 字段渲染逻辑重复。
- PDF 导出行为不一致。
- 头像、章节排序、全局样式不统一。
- AI 新建模板时容易漏字段、漏响应式、漏打印样式。

后续建议继续强化“统一模板内扩展 variant”的方式：

- 普通模板：只新增模板元数据和 `templateVariants` 配置。
- 中等差异模板：在 `UnifiedResumeTemplate.vue` 内新增少量 layout class。
- 强差异模板：才允许新增独立 Vue 组件。

判断标准：

| 类型 | 处理方式 | 示例 |
| --- | --- | --- |
| 只是颜色、标题线条、密度不同 | 扩展 registry + variant | 经典、现代、紧凑 |
| 头部、章节标题、技能标签样式不同 | 扩展 UnifiedResumeTemplate class | 技术、创意、高管 |
| 真实双栏、多页特殊布局、作品集型简历 | 新增独立组件 | 左右栏、设计师作品型、学术论文型 |

### 1.2 拆分过重模块

项目后续应优先降低几个重模块的职责：

- `src/stores/resume.js`：同时管理简历数据、模板、样式、保存、迁移、自定义模块，后期建议拆为 `resumeDataStore`、`templateStore`、`styleStore`、`documentStore`。
- `src/templates/components/UnifiedResumeTemplate.vue`：当前承担渲染、variant、样式变量和全部 CSS。可以先保留，但后续应把模板配置、章节渲染 helper、样式 token 拆出去。
- PDF 导出工具：目前存在多套导出逻辑，应统一成一个 `exportService`，页面只选择导出类型，不直接调用底层实现。
- AI 服务：provider、prompt、JSON 解析和简历业务逻辑应拆开，避免后续新增模型时影响模板和编辑器。

### 1.3 建立简历数据模型

当前模板渲染依赖字段：

- `personalInfo.name/email/phone/address/website/linkedin/github/targetPosition/photo/photoPosition/customFields`
- `summary`
- `workExperience[].company/position/startDate/endDate/current/location/description/achievements`
- `education[].school/major/degree/startDate/endDate/gpa/description/honors`
- `skills[].name/level/category/description`
- `projects[].name/role/startDate/endDate/description/technologies/highlights/url/github`
- `certifications[].name/issuer/date`
- `languages[].name/level`

建议新增：

```text
src/domain/resumeSchema.js
src/domain/resumeNormalizer.js
src/domain/resumeValidator.js
```

所有 AI 生成、JSON 恢复、默认数据和模板渲染前都先经过 normalizer。这样模板只关心稳定字段，不需要兼容一堆历史命名。

### 1.4 功能裁剪建议

这个项目的核心价值是“快速编辑、智能优化、稳定导出一份好看的简历”。不直接服务这条链路的功能，可以先移除、隐藏或延后。

核心功能应保留：

- 简历编辑。
- 模板切换。
- 实时预览。
- PDF/Word 导出。
- 本地保存和 JSON 备份恢复。
- AI 生成简介、经历优化、JD 匹配建议。
- 模板样式调整。

可延后或移除：

- OCR 导入：依赖重、准确率不稳定、会增加用户纠错成本；除非明确要做“图片/截图转简历”，否则建议移除入口和依赖。
- 云同步：没有后端同步协议前不要展示。
- 图片导出：PDF/Word 已覆盖主要场景，PNG/JPEG 导出不是刚需。
- 水印：对个人简历工具价值有限。
- 语言切换：如果没有完整 i18n 文案，不要半成品上线。
- 反调试/防复制：工具型产品不建议默认启用。

### 1.5 优化模板中心

模板中心后续可以增加这些能力：

- 使用当前简历数据生成真实缩略图，而不是固定示例数据。
- 增加筛选维度：职位类型、是否 ATS 友好、是否带照片、信息密度、页数。
- 模板收藏和最近使用。
- 模板适配提示：例如“内容较多时建议使用紧凑模板”。
- 新模板上线前自动检查是否注册、是否可预览、是否可导出。

### 1.6 优化设计系统

当前 `src/styles/designSystem.js` 已有颜色、字体、间距、圆角、阴影、断点，但简历模板内部仍有不少局部硬编码。

建议：

- 简历模板使用 `--tpl-*` 变量作为唯一跨模板样式入口。
- 应用 UI 使用 `designSystem.js` 或统一 CSS variables。
- 不在模板组件中直接写 Element Plus 页面色值，例如 `#409eff`、`#f5f7fa`。
- 简历打印区域和应用操作区样式隔离，避免导出时把按钮、阴影、页面背景带进去。

## 2. 模板生成总原则

以后让 AI 新建模板时，必须先判断模板属于哪一类：

### 2.1 优先扩展统一模板

如果新模板只是风格不同，AI 只能改这些位置：

- `src/templates/index.js`
- `src/templates/templateVariants.js` 中的 `templateVariants`
- `UnifiedResumeTemplate.vue` 的 scoped CSS 中新增对应 `.layout-*`、`.accent-*`、`.design-*` 样式

不能复制整个 `UnifiedResumeTemplate.vue` 新建一份。

### 2.2 独立模板必须有明确理由

只有满足以下任一条件，才允许新增独立模板组件：

- 需要真实双栏布局，且章节可按左右栏分配。
- 需要和当前单栏流式结构完全不同。
- 需要特殊分页控制。
- 需要独立的缩略图渲染逻辑。
- 需要面向特定岗位的强结构模板，例如学术 CV、作品集型简历。

独立模板也必须接收统一 props：

```js
const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'modern' },
  renderMode: { type: String, default: 'preview' }
})
```

其中 `renderMode` 预留给以后区分：

- `preview`
- `print`
- `thumbnail`

## 3. 模板元数据规范

每个模板注册项必须包含：

```js
templateId: {
  name: '模板中文名',
  component: UnifiedTemplate,
  description: '一句话说明模板适合什么场景',
  category: 'professional',
  preview: '/images/templates/template-id-preview.png',
  features: ['特性1', '特性2', '特性3'],
  suitableFor: ['岗位1', '岗位2', '行业1']
}
```

字段要求：

| 字段 | 规则 |
| --- | --- |
| `templateId` | 英文小写短横线或驼峰，禁止中文和空格 |
| `name` | 中文，2 到 8 个字，能表达风格 |
| `description` | 不超过 36 个中文字符，不写营销空话 |
| `category` | 必须来自 `templateCategories` |
| `preview` | 路径必须存在，暂时没有图片时使用已有同类 preview |
| `features` | 3 到 5 个，描述真实能力 |
| `suitableFor` | 3 到 5 个，写岗位或行业 |

当前允许的 category：

```js
professional // 专业商务
traditional  // 传统经典
minimalist   // 极简主义
business     // 高管商务
creative     // 创意设计
academic     // 学术研究
tech         // 技术开发
```

如果新增 category，必须同时更新：

- `templateCategories`
- `TemplatesView.vue` 的筛选项
- 文档中的分类说明

## 4. UnifiedResumeTemplate 扩展规范

### 4.1 templateVariants

新增统一模板 variant 时，必须在 `src/templates/templateVariants.js` 的 `templateVariants` 中增加配置：

```js
newTemplateId: {
  layout: 'new-layout',
  density: 'normal',
  accent: 'line'
}
```

字段取值建议：

| 字段 | 推荐取值 | 说明 |
| --- | --- | --- |
| `layout` | `classic`、`modern`、`compact`、`technical`、自定义 | 控制整体结构 |
| `density` | `compact`、`normal`、`loose` | 控制信息密度 |
| `accent` | `line`、`panel`、`block`、`band` | 控制标题和章节强调方式 |

新增 layout 或 accent 后，CSS 必须有对应 class。

### 4.2 CSS class 命名

只能使用这些前缀：

```text
layout-*
density-*
design-*
title-*
accent-*
align-*
section-*
```

不要给模板写随机 class 名，比如：

```text
cool-card
beautiful-box
ai-style
new-template-wrapper
```

### 4.3 CSS 变量

模板样式必须优先使用这些变量：

```css
--tpl-primary
--tpl-secondary
--tpl-accent
--tpl-text
--tpl-muted
--tpl-bg
--tpl-border
--tpl-font
--tpl-base-size
--tpl-title-size
--tpl-line-height
--tpl-section-gap
--tpl-column-gap
--tpl-padding
```

禁止在模板主体里大量硬编码颜色。允许少量固定色用于打印稳定性，例如白色背景、浅灰标签底色，但必须克制。

### 4.4 打印友好规则

模板必须满足：

- 根元素宽度为 `210mm`。
- 最小高度为 `297mm`。
- 章节使用 `page-break-inside: avoid`。
- 不使用复杂动画。
- 不使用 hover 才能看到的重要内容。
- 不使用会影响打印的 fixed、sticky、transform 大范围缩放。
- 重要文字不能依赖背景图或渐变。
- 背景色必须在黑白打印下仍可读。

### 4.5 内容完整规则

模板必须渲染以下章节：

- 个人信息
- 个人简介
- 工作经历
- 教育背景
- 技能特长
- 项目经历
- 证书荣誉
- 语言能力

允许某些章节在没有数据时不显示，但不能因为模板风格不同而永久不支持。

## 5. 独立模板组件规范

独立模板组件建议放在：

```text
src/templates/components/NewTemplateName.vue
```

必须满足：

- 不直接从 store 读 `resumeData`，只从 props 接收。
- 可以读取 store 的全局设置，但要优先通过 props 或 CSS vars。
- 不修改用户数据。
- 不调用保存、导出、AI 等业务函数。
- 不引入 Element Plus 表单组件。
- 不写应用级按钮。
- 不写弹窗。
- 不写网络请求。
- scoped CSS 内部完成模板外观。

独立模板最小结构：

```vue
<template>
  <article class="resume-template template-new-id" :style="templateVars">
    <!-- render sections -->
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  resumeData: { type: Object, required: true },
  templateId: { type: String, default: 'new-id' },
  renderMode: { type: String, default: 'preview' }
})

const templateVars = computed(() => ({
  '--tpl-primary': '#1f2937'
}))
</script>

<style scoped>
.resume-template {
  width: 210mm;
  min-height: 297mm;
  box-sizing: border-box;
  background: #fff;
  color: var(--tpl-text, #111827);
}
</style>
```

## 6. AI 新建模板工作流

以后让 AI 新建模板时，必须按下面流程执行。

### 6.1 第一步：先读文件

AI 必须先读取：

```text
src/templates/index.js
src/templates/components/UnifiedResumeTemplate.vue
src/components/templates/TemplatePreview.vue
src/stores/resume.js
src/data.js
```

如果涉及导出，还要读取：

```text
src/utils/pdf/browserPrint.js
src/utils/word/exportDocx.js
src/styles/print.css
```

### 6.2 第二步：判断实现方式

AI 必须先回答：

```text
本模板是扩展 UnifiedResumeTemplate，还是新增独立组件？
理由是什么？
需要修改哪些文件？
```

默认选择扩展 `UnifiedResumeTemplate`。

### 6.3 第三步：生成代码

扩展统一模板时，AI 只能做这些改动：

1. 在 `templateRegistry` 新增模板元数据。
2. 在 `templateVariants` 新增 variant。
3. 在 CSS 中新增必要的 `.layout-*`、`.accent-*` 样式。
4. 如有必要，补充模板预览图片路径，但不能让不存在的路径破坏页面。

新增独立组件时，AI 需要：

1. 新建 Vue 组件。
2. 在 `templateRegistry` 注册。
3. 确保 `TemplatePreview.vue` 可以正常渲染。
4. 确保 props 和数据字段兼容。

### 6.4 第四步：本地验证

AI 修改后必须至少运行：

```bash
npm run build
```

如果只写文档，不需要运行 build。

如果模板涉及视觉变化，应人工或自动检查：

- 模板中心能看到新模板。
- 点击模板能应用到首页。
- 预览不空白。
- A4 宽高正常。
- 头像 left/center/right 不错位。
- 章节排序后仍正常。
- PDF 打印没有按钮、弹窗、页面背景。

## 7. AI 生成模板提示词模板

后期可以直接把下面这段给 AI：

```text
请在当前 Vue 简历生成器项目中新增一个简历模板。

模板需求：
- 模板 ID：{templateId}
- 模板中文名：{name}
- 分类：{category}
- 适合岗位：{suitableFor}
- 视觉风格：{styleDescription}
- 信息密度：{compact | normal | loose}
- 是否允许独立组件：默认不允许，除非你说明理由

执行规则：
1. 先阅读 docs/项目优化与AI模板生成规范.md。
2. 先阅读 src/templates/index.js、src/templates/components/UnifiedResumeTemplate.vue、src/components/templates/TemplatePreview.vue、src/stores/resume.js、src/data.js。
3. 默认通过扩展 UnifiedResumeTemplate 实现，不要复制整个模板组件。
4. 必须使用现有 resumeData 字段，不要发明新字段。
5. 必须支持个人信息、简介、工作经历、教育、技能、项目、证书、语言。
6. 必须保持 A4 打印友好，根元素 210mm 宽，章节避免被分页截断。
7. 必须让模板中心、预览、首页应用模板都能工作。
8. 改完运行 npm run build，并说明验证结果。

输出要求：
- 说明选择扩展统一模板还是新增独立组件。
- 列出修改文件。
- 给出模板适配说明。
- 不要改无关功能。
```

## 8. 模板设计质量要求

简历模板不是营销页，设计应该服务招聘阅读。AI 生成模板时要遵守：

### 8.1 可读性优先

- 正文 12px 到 15px。
- 中文行高 1.35 到 1.65。
- 日期、公司、职位必须容易扫读。
- 联系方式不能过度装饰。
- 不要为了视觉效果牺牲 ATS 和打印可读性。

### 8.2 信息层级清晰

层级建议：

```text
姓名 > 目标职位 > 章节标题 > 公司/项目/学校 > 职位/角色/专业 > 描述和成果
```

同一层级样式必须一致。

### 8.3 风格克制

禁止：

- 大面积渐变。
- 花哨背景图。
- 复杂阴影。
- 大量圆角卡片。
- 过多图标。
- 纯装饰元素压缩正文空间。
- 使用 emoji 作为核心视觉。

允许：

- 标题线条。
- 左边框强调。
- 顶部色带。
- 技能标签。
- 轻量分隔线。
- 克制的强调色。

### 8.4 ATS 友好

ATS 友好模板应满足：

- 单栏优先。
- 少用图标。
- 不使用图片承载文字。
- 字段顺序稳定。
- 标题使用真实文本。
- 链接直接显示 URL 或可读文本。

## 9. 禁止 AI 做的事

AI 新建模板时禁止：

- 修改简历数据结构，除非任务明确要求。
- 修改 store 保存逻辑。
- 修改导出逻辑。
- 引入新依赖。
- 使用不存在的图标库。
- 把模板写成应用页面。
- 在模板中出现“点击按钮”“选择模板”等应用 UI。
- 在模板里调用 `ElMessage`、`router.push`、`localStorage`、`IndexedDB`。
- 新增未注册的 category。
- 写死只有示例数据才能正常显示的结构。
- 删除现有模板。
- 重命名现有字段。

## 10. 新模板验收清单

每个新模板合并前必须检查：

```text
[ ] templateRegistry 已注册
[ ] templateVariants 已配置，或独立组件已注册
[ ] 模板中心能显示
[ ] TemplatePreview 能渲染
[ ] 首页应用模板后能实时预览
[ ] 个人信息字段完整
[ ] 头像 left/center/right 正常
[ ] sectionOrder 改变后顺序正常
[ ] 空章节不会显示空标题
[ ] 技能长文本和短标签都正常
[ ] 工作经历 achievements 正常
[ ] 项目 technologies/highlights 正常
[ ] A4 宽高正常
[ ] 打印时不显示应用 UI
[ ] npm run build 通过
```

## 11. 推荐的后续实施顺序

### 第一阶段：稳定模板契约

- [x] 统一 `templateRegistry` 元数据字段。
- [x] 给模板新增 schema 校验或简单检查脚本。
- [x] 修复模板中心 category 与 `templateCategories` 不完全一致的问题。
- [x] 让缩略图使用当前统一模板真实渲染。
- [x] `UnifiedResumeTemplate.vue` 已补齐 `renderMode` prop，和独立模板契约保持一致。
- [x] `scripts/check-templates.js` 已覆盖模板 ID、名称长度、描述长度、分类来源、features/suitableFor 数量、统一模板 variant 覆盖、layout/accent CSS 样式存在性。

### 第二阶段：拆分模板配置

建议结构：

```text
src/templates/
├── index.js
├── templateCategories.js
├── templateVariants.js
├── components/
│   └── UnifiedResumeTemplate.vue
└── validators/
    └── validateTemplateRegistry.js
```

状态：

- [x] `templateCategories` 已拆到 `src/templates/templateCategories.js`。
- [x] `templateVariants` 已拆到 `src/templates/templateVariants.js`。
- [x] `UnifiedResumeTemplate.vue` 不再保存所有 variant 配置，只负责渲染。
- [x] 模板中心筛选项已直接读取 `templateCategories`，避免手写分类漂移。

### 第三阶段：清理冗余代码并稳定现有功能

状态：

- [x] 已移除 OCR 入口、OCR 服务和相关依赖。
- [x] 已移除旧 AI 测试组件、随机样式组件、诊断脚本和无效 package scripts。
- [x] 已移除未被当前入口引用的旧表单组件、旧设置组件和悬空自定义模块组件。
- [x] 已移除模板中心无效的“显示/隐藏预览”按钮。
- [x] 已移除首页、路由、打印页、PDF 生成过程中的无业务调试日志。
- [x] 已移除 `setupAntiScrape` 空安全钩子和 `Ctrl+Shift+D` 覆盖默认数据的隐藏快捷键。
- [x] 已移除运行时性能监控入口和 `web-vitals` 依赖，避免非核心监控逻辑进入主包。
- [x] 已移除未引用的 Vue/Vite 默认图标、赞赏图片和 public 模板示例目录。
- [x] 已移除未使用的 `file-saver` 与 `@types/file-saver` 依赖，并同步清理 Vite 手动分包配置。
- [x] 已简化 `npm run build`，由 `prebuild` 统一生成 sitemap/icons，避免构建时重复生成两次。
- [x] 已移除 Vite 中未使用的 `@api` alias 和空 `/api` dev proxy。
- [x] 已补齐 HTML sitemap 中当前真实路由的中文页面标题。
- [x] 已移除未引用的 `src/utils/seo/seoAnalyzer.js`。
- [x] 已收窄 PDF/打印工具，只保留当前入口实际使用的 `generateOptimizedPDF` 和 `printResume`。
- [x] 已移除 PWA 注册和字体子集更新的运行时控制台日志。
- [x] 已修正字体子集提取逻辑，改为读取当前真实字段 `position/description/achievements/projects`。
- [x] 已合并重复导航入口：首页左侧不再重复提供模板选择和设计入口，统一通过顶部“模板中心”和“设计”进入。
- [x] 已修正 404 页面指向不存在 `/resumes` 的导航，改为当前真实的“设计工作室”入口。
- [x] 已移除重复编辑路由 `/resume/:id?`，当前编辑器统一从首页 `/` 进入。
- [x] 已移除未被页面和导出链路引用的 `/print` 路由与 `PrintView.vue`，导出继续使用当前首页/设计页按钮。
- [x] 已移除脱离当前入口的 `TemplateManager.vue`，模板选择统一通过“模板中心”完成。
- [x] 已收窄设置页和设置 store，移除未被当前功能消费的主题、默认字体、默认字号、网格线、默认导出格式和 AI 建议空开关。
- [x] 已将“设计与样式”和“AI助手”从顶部导航移动到首页左侧，与“简历内容”导航组平级并放在其下方，按现有模块导航样式呈现，减少顶部重复入口。
- [x] 已新增 `PRODUCT.md`，明确项目为工具型产品，About 页和后续 UI 优化按开源项目说明页气质处理。
- [x] 已重设计 `AboutView.vue`，移除大渐变、营销式 hero 和大卡片堆叠，改为 README 风格的项目说明、数据边界、技术栈和当前能力边界。
- [x] `npm run check:templates` 通过。
- [x] `npm run build` 通过。

暂不处理：

- `resumeStore` 中的 `customModules/customModulesData` 兼容字段暂时保留，避免历史数据读取出错。
- `docs/优化方案.md`、`docs/每个页面如何优化.md` 属于历史方案文档，仍会提到 OCR 等已裁剪方向，不作为当前实现依据。

### 第四阶段：增加模板生成脚手架

建议新增脚本：

```text
scripts/create-template.js
```

能力：

- 输入 templateId、name、category。
- 自动检查 ID 是否重复。
- 自动追加 registry。
- 自动追加 variant。
- 自动生成预览占位路径。
- 自动运行模板注册检查。

### 第五阶段：模板质量自动化

已新增：

```text
scripts/check-templates.js
```

检查：

- [x] 所有模板 ID 唯一。
- [x] category 必须来自 `templateCategories`。
- [x] component 字段存在。
- [x] name、description、features、suitableFor 满足基础规范。
- [x] preview 路径不存在时只提示，页面依赖实时组件缩略图兜底。
- [x] `templateVariants` 覆盖所有统一模板 ID。
- [x] variant 中的 layout/accent 必须有对应 CSS class。

## 12. 一句话结论

这个项目后续最值得优化的不是继续增加更多模板，而是先把“模板如何被注册、如何渲染、如何打印、AI 如何生成”变成稳定协议。协议稳定后，新模板可以批量增加；协议不稳定时，模板越多，维护成本越高。
