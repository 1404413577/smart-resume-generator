// 模板配置
export const templateConfig = {
  // 默认模板设置
  defaults: {
    pageSize: 'A4',
    margin: {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    },
    fontSize: {
      base: 14,
      title: 18,
      subtitle: 16
    },
    colors: {
      primary: '#409eff',
      secondary: '#67c23a',
      accent: '#e6a23c',
      text: '#303133',
      background: '#ffffff'
    }
  },

  // 模板特定配置
  templates: {
    modern: {
      colors: {
        primary: '#409eff',
        secondary: '#67c23a',
        accent: '#e6a23c'
      },
      fonts: {
        primary: 'system-ui, -apple-system, sans-serif',
        secondary: 'Georgia, serif'
      }
    },
    classic: {
      colors: {
        primary: '#2c3e50',
        secondary: '#34495e',
        accent: '#3498db'
      },
      fonts: {
        primary: 'Times New Roman, serif',
        secondary: 'Arial, sans-serif'
      }
    },
    creative: {
      colors: {
        primary: '#e74c3c',
        secondary: '#f39c12',
        accent: '#9b59b6'
      },
      fonts: {
        primary: 'Helvetica, Arial, sans-serif',
        secondary: 'Georgia, serif'
      }
    },
    professional: {
      colors: {
        primary: '#2c3e50',
        secondary: '#7f8c8d',
        accent: '#3498db'
      },
      fonts: {
        primary: 'Arial, sans-serif',
        secondary: 'Times New Roman, serif'
      }
    },
    academic: {
      colors: {
        primary: '#34495e',
        secondary: '#7f8c8d',
        accent: '#2980b9'
      },
      fonts: {
        primary: 'Times New Roman, serif',
        secondary: 'Arial, sans-serif'
      }
    },
    tech: {
      colors: {
        primary: '#2ecc71',
        secondary: '#27ae60',
        accent: '#f39c12'
      },
      fonts: {
        primary: 'Monaco, Consolas, monospace',
        secondary: 'system-ui, sans-serif'
      }
    },
    minimalist: {
      colors: {
        primary: '#2c3e50',
        secondary: '#95a5a6',
        accent: '#3498db'
      },
      fonts: {
        primary: 'system-ui, -apple-system, sans-serif',
        secondary: 'Georgia, serif'
      }
    }
  }
}

// 获取模板配置
export function getTemplateConfig(templateId) {
  return {
    ...templateConfig.defaults,
    ...templateConfig.templates[templateId]
  }
}
