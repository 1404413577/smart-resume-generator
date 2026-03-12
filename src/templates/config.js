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
    },
    artisticPortfolio: {
      colors: {
        primary: '#8B4513',
        secondary: '#654321',
        accent: '#D2691E'
      },
      fonts: {
        primary: 'Playfair Display, Georgia, serif',
        secondary: 'Helvetica Neue, Arial, sans-serif'
      }
    },
    corporateExecutive: {
      colors: {
        primary: '#1a365d',
        secondary: '#2d3748',
        accent: '#4299e1'
      },
      fonts: {
        primary: 'Georgia, Times New Roman, serif',
        secondary: 'Helvetica Neue, Arial, sans-serif'
      }
    },
    // ===== 近期新增的极致风格模板配置 =====

    vogue: {
      colors: {
        primary: '#7A2828',   // 经典酒红
        secondary: '#5A5A5A', // 优雅灰
        accent: '#2C2C2C'
      },
      fonts: {
        primary: '"Playfair Display", Georgia, serif', // 强视觉衬线体
        secondary: '"Lato", Arial, sans-serif'
      }
    },

    terminal: {
      colors: {
        primary: '#629755',   // 终端绿
        secondary: '#a9b7c6', // 终端灰
        accent: '#cc7832'     // 关键字黄
      },
      fonts: {
        primary: '"Fira Code", Consolas, Monaco, monospace', // 纯等宽字体
        secondary: 'monospace'
      }
    },

    nordic: {
      colors: {
        primary: '#18181b',   // 极暗灰(非纯黑)
        secondary: '#71717a', // 柔和灰
        accent: '#e4e4e7'     // 边框灰
      },
      fonts: {
        primary: '"Inter", -apple-system, sans-serif',
        secondary: 'Arial, sans-serif'
      }
    },

    pure: {
      colors: {
        primary: '#111827',
        secondary: '#6b7280',
        accent: '#e5e7eb'
      },
      fonts: {
        primary: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        secondary: 'system-ui, sans-serif'
      }
    },

    standardClean: {
      colors: {
        primary: '#000000',
        secondary: '#444444',
        accent: '#cccccc'
      },
      fonts: {
        primary: '"Times New Roman", Times, serif', // 传统清爽风首选衬线体
        secondary: 'Arial, sans-serif'
      }
    },

    consulting: {
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#000000'
      },
      fonts: {
        primary: '"Times New Roman", Garamond, serif', // 顶级投行公认字体
        secondary: 'serif'
      }
    },

    gridForm: {
      colors: {
        primary: '#000000',
        secondary: '#333333',
        accent: '#f2f2f2' // 表头背景色
      },
      fonts: {
        primary: '"SimSun", "Songti SC", serif', // 体制内表格必须用宋体
        secondary: '"SimHei", "Heiti SC", sans-serif' // 标题黑体
      }
    },

    notion: {
      colors: {
        primary: '#37352f', // Notion 黑
        secondary: '#787774', // Notion 灰
        accent: '#f1f1ef' // Notion 背景块灰
      },
      fonts: {
        primary: '"Inter", -apple-system, sans-serif',
        secondary: 'sans-serif'
      }
    },

    gitProfile: {
      colors: {
        primary: '#c9d1d9', // GitHub 文本色
        secondary: '#8b949e', // GitHub 次要文本
        accent: '#58a6ff' // GitHub 链接蓝
      },
      fonts: {
        primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        secondary: 'monospace'
      }
    },

    bento: {
      colors: {
        primary: '#111827',
        secondary: '#6b7280',
        accent: '#3b82f6' // 亮蓝色点缀
      },
      fonts: {
        primary: '"Inter", system-ui, sans-serif',
        secondary: 'sans-serif'
      }
    },

    dashboard: {
      colors: {
        primary: '#0f172a', // 深海蓝 (侧边栏)
        secondary: '#64748b', // 文本灰
        accent: '#3b82f6' // 数据高亮蓝
      },
      fonts: {
        primary: 'system-ui, -apple-system, sans-serif',
        secondary: 'Roboto, sans-serif'
      }
    },
  }
}

// 获取模板配置
export function getTemplateConfig(templateId) {
  return {
    ...templateConfig.defaults,
    ...templateConfig.templates[templateId]
  }
}