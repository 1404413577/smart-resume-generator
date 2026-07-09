<template>
  <el-dialog
    v-model="visible"
    title="项目免责及使用协议"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    class="disclaimer-dialog"
    center
    align-center
  >
    <div class="disclaimer-content">
      <p class="welcome-text">欢迎使用本智能简历生成器。</p>
      <p class="desc-text">本项目为开源/免费工具，仅供个人学习、求职及参考使用。</p>

      <div class="terms-list">
        <div class="term-item">
          <strong>1. 服务性质与目的：</strong>本项目（下称“本工具”）为个人开发及维护的免费开源项目，仅供用户个人学习、求职美化及内部参考使用，不提供任何形式的商业级服务承诺或企业级技术支持。
        </div>
        <div class="term-item">
          <strong>2. 版权与知识产权：</strong>
          <ul>
            <li>本工具平台内提供的所有简历模板、设计排版资源及源代码，版权均归原作者或开源社区所有。</li>
            <li><strong>字体与素材使用声明：</strong>本工具默认使用思源黑体、Noto Sans SC 等开源字体，并尽量避免内置来源不明的图片、图标和商业字体。用户若自行上传图片、替换字体或导入第三方素材，需确认拥有合法使用权。</li>
            <li>用户利用本工具生成、导出、下载的简历内容及填写的所有个人信息，其版权及所有权归用户本人所有，文责自负。</li>
            <li>如本项目以开源形式发布或再分发，使用者应遵守项目许可证、第三方依赖许可证和项目根目录 THIRD_PARTY_NOTICES.md，不得移除版权声明、冒充原作者、隐瞒第三方协议或以误导方式宣称获得官方背书。</li>
          </ul>
        </div>
        <div class="term-item">
          <strong>3. 图片及附件上传责任：</strong>用户在使用“头像上传”或插入其他图片附件功能时，必须保证所上传图片为其本人所有或已获得合法授权。严禁上传包含政治敏感、涉黄、涉暴及侵犯他人肖像权和著作权的图片资料。因违规上传引发的任何法律纠纷由用户自行承担。
        </div>
        <div class="term-item">
          <strong>4. 第三方依赖说明：</strong>本工具在运行过程中可能调用第三方开源组件、AI 接口服务及外部 API（包括但不限于页面渲染、PDF 生成、AI 服务和本地模型等）。相关组件、接口、模型和商标归其权利人所有，本项目不与 OpenAI、Google、GitHub、LinkedIn、Adobe、Figma 等第三方品牌存在从属、合作或背书关系。
        </div>
        <div class="term-item">
          <strong>5. 信息安全与隐私：</strong>本工具基于纯前端技术栈开发，用户填写的简历数据及上传的图片均以 Base64 形式保存在用户当前浏览器的本地缓存（LocalStorage）中，不会跨域上传至任何个人或机构云端服务器。用户需自行妥善保管本地设备，因设备借用、浏览器卸载或系统重装导致的数据丢失或泄露，本项目概不负责。
        </div>
        <div class="term-item">
          <strong>6. 免责条款：</strong>
          <ul>
            <li>本工具无法保证所生成的简历格式能完美匹配所有企业招聘系统或 ATS (申请追踪系统) 的自动解析规则。</li>
            <li>对于因使用本工具导致的任何排版错乱、错别字遗漏、面试失败、录用延误或其他任何直接或间接的损失，本项目及开发者不承担任何形式的法律及连带赔偿责任。</li>
          </ul>
        </div>
        <div class="term-item">
          <strong>7. 合规约束：</strong>用户承诺严格遵守国家及当地法律法规。在使用本工具填写真实经历时，不得伪造学历、履历及任何违背诚信原则的虚假信息；<strong>严禁未经授权复制、盗用、倒卖他人的真实简历信息及个人隐私数据</strong>。如发现任何违规或侵权行径，该等行径的一切法律责任及确权后果由用户本人全权自行承担，本项目概不负责。
        </div>
        <div class="term-item">
          <strong>8. 服务中断与维护：</strong>本工具可能因定期维护、系统升级、网络故障或不可抗力等原因暂时中断服务，不保证服务的绝对连续性和及时性。因服务中断导致的任何不便或损失，本项目概不负责。
        </div>
        <div class="term-item">
          <strong>9. 协议修改权：</strong>项目方有权根据实际运营需要随时修改本协议条款，修改后的协议一经在工具内公布即生效。用户继续使用本工具视为同意并接受修改后的协议内容。
        </div>
        <div class="term-item">
          <strong>10. 未成年人使用：</strong>若用户为未成年人，需在监护人的指导和同意下使用本工具。未成年人使用本工具产生的一切责任及后果由其监护人承担。
        </div>
        <div class="term-item">
          <strong>11. 无担保声明：</strong>本工具按“现状”提供，除本协议明确说明外，不提供任何明示或暗示的担保，包括但不限于对适用性、准确性、可靠性、无错误或不间断使用的担保。
        </div>
        <div class="term-item">
          <strong>12. 责任限制：</strong>在任何情况下，项目方对用户的赔偿责任上限不超过用户因使用本工具而支付的费用（若本工具为免费使用，则项目方不承担任何赔偿责任）。
        </div>
        <div class="term-item">
          <strong>13. 法律适用与管辖：</strong>本协议的解释、效力及纠纷解决均适用中华人民共和国法律；因本协议引发的任何纠纷，双方同意提交至项目方所在地有管辖权的人民法院诉讼解决。
        </div>
        <div class="term-item">
          <strong>14. 协议终止：</strong>若用户违反本协议任何条款，项目方有权立即终止向该用户提供服务，并保留追究其法律责任的权利。
        </div>
        <div class="term-item">
          <strong>15. 技术兼容性：</strong>本工具不保证兼容所有设备、浏览器或操作系统版本；因兼容性问题导致的数据丢失、功能异常或其他损失，本项目概不负责。
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-checkbox v-model="hasAgreed" class="agree-checkbox">
          我已阅读并完全同意以上免责协议
        </el-checkbox>
        <el-button 
          type="primary" 
          :disabled="!hasAgreed" 
          @click="handleConfirm"
          class="confirm-btn"
        >
          开始使用
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(false)
const hasAgreed = ref(false)

const checkDisclaimer = () => {
  // 检查是否已在当前会话中同意过
  const disclaimerAccepted = sessionStorage.getItem('disclaimerAccepted')
  if (!disclaimerAccepted) {
    visible.value = true
  }
}

onMounted(() => {
  // 每次打开应用时检查是否需要显示免责协议
  checkDisclaimer()
})

const handleConfirm = () => {
  if (hasAgreed.value) {
    // 保存用户的同意状态到sessionStorage（当前会话有效）
    sessionStorage.setItem('disclaimerAccepted', 'true')
    visible.value = false
    hasAgreed.value = false
  }
}
</script>

<style scoped>
.disclaimer-content {
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

.welcome-text {
  font-weight: bold;
  font-size: 16px;
  color: #409EFF;
  margin-bottom: 10px;
}

.desc-text {
  margin-bottom: 20px;
  color: #606266;
}

.terms-list {
  background-color: #f5f7fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.terms-list ul {
  padding-left: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
}

.terms-list li {
  margin-bottom: 4px;
}

.term-item {
  margin-bottom: 12px;
  text-align: justify;
}

.term-item:last-child {
  margin-bottom: 0;
}

.dialog-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.agree-checkbox {
  margin-right: 0;
}

.confirm-btn {
  width: 100%;
}
</style>
