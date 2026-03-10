# Word模板导出使用说明

## 功能介绍
Word模板导出功能允许用户上传自定义的.docx模板文件，系统会自动将简历数据填充到模板中，生成符合企业HR要求的标准简历格式。

## 使用步骤
1. 准备Word模板文件（.docx格式）
2. 在模板中插入变量占位符
3. 在简历编辑器中点击"模板导出"按钮
4. 上传模板文件
5. 点击"使用模板导出"生成填充后的简历

## 模板变量说明

### 个人信息
- `{{name}}` - 姓名
- `{{email}}` - 邮箱地址
- `{{phone}}` - 电话号码
- `{{address}}` - 居住地址
- `{{website}}` - 个人网站
- `{{linkedin}}` - LinkedIn链接
- `{{github}}` - GitHub链接
- `{{targetPosition}}` - 目标职位

### 个人简介
- `{{summary}}` - 个人简介内容

### 工作经历（循环结构）
```
{{#workExperience}}
职位：{{position}}
公司：{{company}}
工作地点：{{location}}
工作时间：{{startDate}} - {{endDate}}
工作描述：{{description}}
主要成就：{{achievementsText}}
{{/workExperience}}
```

### 教育背景（循环结构）
```
{{#education}}
学位：{{degree}}
学校：{{school}}
专业：{{major}}
时间：{{startDate}} - {{endDate}}
GPA：{{gpa}}
荣誉：{{honors}}
{{/education}}
```

### 技能特长（循环结构）
```
{{#skills}}
技能：{{name}} - {{level}}
{{/skills}}
```

### 项目经历（循环结构）
```
{{#projects}}
项目名称：{{name}}
项目角色：{{role}}
项目时间：{{startDate}} - {{endDate}}
项目描述：{{description}}
技术栈：{{technologiesText}}
项目链接：{{url}}
GitHub：{{github}}
{{/projects}}
```

### 统计信息
- `{{workExperienceCount}}` - 工作经历数量
- `{{educationCount}}` - 教育背景数量
- `{{skillsCount}}` - 技能数量
- `{{projectsCount}}` - 项目数量

### 日期信息
- `{{currentDate}}` - 当前日期
- `{{currentYear}}` - 当前年份

## 模板制作建议

### 1. 基本格式
- 使用标准的Word文档格式
- 设置合适的页边距（建议2.5cm）
- 选择专业的字体（如微软雅黑、宋体）

### 2. 变量插入
- 直接在Word中输入变量名（如{{name}}）
- 循环结构必须成对出现（{{#workExperience}} ... {{/workExperience}}）
- 变量名区分大小写，请严格按照说明使用

### 3. 样式设置
- 可以对变量文本设置字体、颜色、大小等样式
- 建议为标题设置加粗、增大字号
- 可以使用表格、分栏等Word功能

### 4. 测试建议
- 制作完模板后，先用测试数据验证效果
- 检查循环结构是否正确显示
- 确认所有变量都能正常替换

## 常见问题

### Q: 为什么某些变量没有被替换？
A: 请检查变量名是否正确，注意大小写和拼写。确保使用双大括号格式。

### Q: 循环结构不显示内容怎么办？
A: 确认循环的开始标签（如{{#workExperience}}）和结束标签（{{/workExperience}}）都存在且配对正确。

### Q: 支持哪些Word功能？
A: 支持大部分Word格式功能，包括字体样式、表格、分栏、页眉页脚等。但不支持复杂的宏和ActiveX控件。

### Q: 模板文件有大小限制吗？
A: 模板文件不能超过10MB，建议控制在2MB以内以确保处理速度。

## 示例模板
可以下载我们提供的示例模板作为参考：
- 经典简历模板
- 现代简历模板
- 技术简历模板

## 技术支持
如果在使用过程中遇到问题，请联系技术支持或查看详细的API文档。
