import Dexie from 'dexie';

export const db = new Dexie('ResumeBuilderDB');

// 定义数据库架构
// resumes 表存储简历数据
// id: 主键
// updatedAt: 最后修改时间（以便于排序）
// data: 存储完整的简历 JSON 对象
db.version(1).stores({
  resumes: '++id, updatedAt, name',
  settings: 'key' // 存储全局设置，如主题、字体等
});

/**
 * 保存简历到 IndexedDB
 * @param {Object} resumeData 简历内容
 * @param {number} id 简历ID（可选，如果不传则创建新简历）
 * @returns {Promise<number>} 返回保存后的简历ID
 */
export async function saveResumeToDB(resumeData, id = null) {
  const resumeToSave = {
    name: resumeData.personalInfo?.name || '未命名简历',
    updatedAt: new Date().getTime(),
    data: JSON.parse(JSON.stringify(resumeData))
  };

  if (id) {
    resumeToSave.id = id;
    await db.resumes.put(resumeToSave);
    return id;
  } else {
    return await db.resumes.add(resumeToSave);
  }
}

/**
 * 加载所有简历列表（仅包含元数据，不包含完整 data）
 */
export async function getAllResumes() {
  return await db.resumes.toCollection().reverse().sortBy('updatedAt');
}

/**
 * 根据 ID 加载单个简历
 */
export async function getResumeById(id) {
  return await db.resumes.get(id);
}

/**
 * 删除简历
 */
export async function deleteResumeFromDB(id) {
  return await db.resumes.delete(id);
}

/**
 * 保存全局设置
 */
export async function saveSettings(key, value) {
  // 确保数据是可克隆的（处理 Proxy 等问题）
  const cleanValue = JSON.parse(JSON.stringify(value));
  return await db.settings.put({ key, value: cleanValue });
}

/**
 * 读取全局设置
 */
export async function getSettings(key) {
  const result = await db.settings.get(key);
  return result ? result.value : null;
}
