<script setup lang="ts">
import { ref } from 'vue';

import { createIconifyIcon } from '@vben/icons';

// 使用 Iconify 图标创建组件
const CheckIcon = createIconifyIcon('carbon:checkmark');
const CloseIcon = createIconifyIcon('carbon:close');
const StarIcon = createIconifyIcon('carbon:star-filled');
// const ViewIcon = createIconifyIcon('carbon:view');
// const UserIcon = createIconifyIcon('carbon:user');
// const DocumentIcon = createIconifyIcon('carbon:document');
const LightningIcon = createIconifyIcon('carbon:lightning');
const OfficeIcon = createIconifyIcon('carbon:building');
const BrushIcon = createIconifyIcon('carbon:paint-brush');
const ShieldIcon = createIconifyIcon('carbon:security');
const HeadsetIcon = createIconifyIcon('carbon:headset');
const MonitorIcon = createIconifyIcon('carbon:dashboard');
const RefreshIcon = createIconifyIcon('carbon:renew');
const ArrowDown = createIconifyIcon('carbon:chevron-down');

// const currentPlan = ref('free');

// 支付弹窗状态
const showPremiumPayment = ref(false);
const showEnterprisePayment = ref(false);

// 滚动到三级会员区域
function scrollToPricing() {
  const pricingSection = document.querySelector('#pricing-section');
  if (pricingSection) {
    pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// 显示高级会员支付弹窗
function showPremiumPaymentModal() {
  showPremiumPayment.value = true;
}

// 显示旗舰版会员支付弹窗
function showEnterprisePaymentModal() {
  showEnterprisePayment.value = true;
}

// 关闭弹窗
function closePremiumPayment() {
  showPremiumPayment.value = false;
}

function closeEnterprisePayment() {
  showEnterprisePayment.value = false;
}

// FAQ 数据
const faqList = ref([
  {
    question: '高级会员和旗舰版之间最大的区别是什么？',
    answer:
      '高级会员提供完整的操作权限和数据导出权限，适合日常管理需求。旗舰版额外提供AI智能增强、系统集成、品牌白标（专属域名/LOGO/颜色）、远程实施支持和专属客服，适合有定制化和商业化需求的政府机构或企业。',
  },
  {
    question: '旗舰版的价格是否可以谈判或按模块选购？',
    answer:
      '旗舰版支持按需定制，您可以联系我们的销售团队，根据实际使用规模、行业模块需求和部署方式，获得专属报价方案。¥9999为起步价，具体方案因需求不同而有所差异。',
  },
  {
    question: '升级后是否可以降级或免费版？',
    answer:
      '可以。若您决定不续费，到期后账号自动降级为免费用户，已创建的数据仍然保留，但操作权限将回收到仅查看状态，已导出的数据不受影响。',
  },
  {
    question: '免费版有哪些限制？',
    answer:
      '免费版可查看所有功能模块的数据，包括城市智能大屏、生命线、SCADA、30余个行业应用等，但无法进行增删改查操作、无法导出数据、无法进行系统集成，也不享有商业授权。适合初步评估和体验平台能力。',
  },
]);
</script>

<template>
  <div class="member-upgrade-page">
    <!-- Hero 区域 -->
    <section class="hero-section">
      <div class="hero-badge">
        <span class="badge-icon">⭐</span>
        <span>城市智能平台 · 旗舰版</span>
      </div>

      <h1 class="hero-title">
        <span class="gradient-text">解锁城市智能管理的</span><br />
        <span class="gradient-text">全部潜能</span>
      </h1>

      <p class="hero-subtitle">
        从基础监控到AI智能预测，从单模块管理到全域联动。<br />
        三级会员体系，按需赋能，助力政府与企业实现数字化转型跨越。
      </p>

      <div class="hero-buttons">
        <el-button
          type="primary"
          size="large"
          class="upgrade-btn"
          @click="scrollToPricing"
        >
          立即升级会员 →
        </el-button>
        <el-button size="large" class="trial-btn">免费体验</el-button>
      </div>

      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-number">200+</div>
          <div class="stat-label">城市客户</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">30+</div>
          <div class="stat-label">行业覆盖</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-number">99.9%</div>
          <div class="stat-label">系统稳定性</div>
        </div>
      </div>
    </section>

    <!-- 三级会员体系 -->
    <section id="pricing-section" class="pricing-section">
      <div class="section-header">
        <div class="section-badge">选择适合您的方案</div>
        <h2 class="section-title">三级会员体系，按需赋能</h2>
        <p class="section-subtitle">
          从免费体验到深度定制，每一级都为您提供最适合的城市智能管理能力
        </p>
      </div>

      <!-- 修改后的定价卡片 -->
      <div class="pricing-cards">
        <!-- 免费版 -->
        <div class="pricing-card free-plan">
          <div class="plan-header">
            <h3 class="plan-name">免费用户</h3>
            <div class="plan-price">
              <span class="price-text">免费</span>
            </div>
            <p class="plan-desc">永久免费，无需信用卡</p>
          </div>

          <ul class="feature-list">
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>所有模块仅查看权限</span>
            </li>
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>智能客服支持</span>
            </li>
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>在线文档与培训资料</span>
            </li>
            <li class="feature-item disabled">
              <CloseIcon class="size-4" />
              <span>不支持数据导出</span>
            </li>
            <li class="feature-item disabled">
              <CloseIcon class="size-4" />
              <span>不支持系统集成</span>
            </li>
          </ul>

          <button class="plan-btn current-btn">当前方案</button>
        </div>

        <!-- 高级会员 -->
        <div class="pricing-card premium-plan">
          <div class="popular-tag">热门</div>
          <div class="plan-header">
            <h3 class="plan-name">高级会员</h3>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="price-amount">198</span>
              <span class="price-period">/年</span>
            </div>
            <p class="plan-desc">适合中小型城市管理部门</p>
          </div>

          <ul class="feature-list">
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>基础功能完整操作权限</span>
            </li>
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>15+ 行业应用增删改查</span>
            </li>
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>数据完整导出能力</span>
            </li>
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>有限商业授权 + LOGO替换</span>
            </li>
            <li class="feature-item">
              <CheckIcon class="size-4" />
              <span>线上培训课程</span>
            </li>
            <li class="feature-item disabled">
              <CloseIcon class="size-4" />
              <span>不支持系统集成 & 实施支持</span>
            </li>
          </ul>

          <button
            class="plan-btn upgrade-btn-premium"
            @click="showPremiumPaymentModal"
          >
            立即升级高级会员 →
          </button>
        </div>

        <!-- 旗舰版 -->
        <div class="pricing-card enterprise-plan">
          <div class="enterprise-flag">🚀 旗舰</div>
          <div class="plan-header">
            <h3 class="plan-name">旗舰版会员</h3>
            <div class="plan-price">
              <span class="currency">¥</span>
              <span class="price-amount">9999</span>
              <span class="price-period">/起</span>
            </div>
            <p class="plan-desc">或联系客服定制专属方案</p>
          </div>

          <ul class="feature-list">
            <li class="feature-item">
              <StarIcon class="size-4" />
              <span>AI增强 + 智能预警预测</span>
            </li>
            <li class="feature-item">
              <StarIcon class="size-4" />
              <span>全行业应用定制优化</span>
            </li>
            <li class="feature-item">
              <StarIcon class="size-4" />
              <span>系统集成 + 专属技术支持</span>
            </li>
            <li class="feature-item">
              <StarIcon class="size-4" />
              <span>完全商业授权 + 页面定制</span>
            </li>
            <li class="feature-item">
              <StarIcon class="size-4" />
              <span>专属域名 + 完全LOGO替换</span>
            </li>
            <li class="feature-item">
              <StarIcon class="size-4" />
              <span>远程实施支持 + 数据迁移</span>
            </li>
          </ul>

          <button
            class="plan-btn upgrade-btn-enterprise"
            @click="showEnterprisePaymentModal"
          >
            💬 立即升级旗舰会员 →
          </button>
        </div>
      </div>
    </section>

    <!-- 功能权限对比表格 -->
    <section class="comparison-section">
      <h2 class="section-title">功能权限详细对比</h2>
      <p class="section-subtitle">
        透明、清晰的功能边界，帮助您做出最适合的选择
      </p>

      <div class="comparison-table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="th-feature">功能模块</th>
              <th class="th-subfeature">子功能</th>
              <th>免费用户</th>
              <th>高级会员</th>
              <th>旗舰版会员</th>
            </tr>
          </thead>
          <tbody>
            <!-- 基础功能 -->
            <tr>
              <td rowspan="4" class="module-cell">基础功能</td>
              <td class="sub-module">城市智慧大脑</td>
              <td>仅查看</td>
              <td>完整权限</td>
              <td class="highlight">完整权限+AI增强</td>
            </tr>
            <tr>
              <td class="sub-module">城市生命线</td>
              <td>仅查看</td>
              <td>完整预警管理</td>
              <td class="highlight">智能预警+预测</td>
            </tr>
            <tr>
              <td class="sub-module">Scada智能控制</td>
              <td>仅查看</td>
              <td>增删改查</td>
              <td class="highlight">高级功能+自动化</td>
            </tr>
            <tr>
              <td class="sub-module">城市运管服</td>
              <td>仅查看</td>
              <td>增删改查</td>
              <td class="highlight">高级功能</td>
            </tr>

            <!-- 行业应用 -->
            <tr>
              <td rowspan="4" class="module-cell">行业应用</td>
              <td class="sub-module">城管住建</td>
              <td>仅查看</td>
              <td>增删改查</td>
              <td class="highlight">可定制优化</td>
            </tr>
            <tr>
              <td class="sub-module">生态环保 / 交通运维</td>
              <td>仅查看</td>
              <td>增删改查</td>
              <td class="highlight">可定制优化</td>
            </tr>
            <tr>
              <td class="sub-module">应急安全 / 卫生健康</td>
              <td>仅查看</td>
              <td>增删改查</td>
              <td class="highlight">可定制优化</td>
            </tr>
            <tr>
              <td class="sub-module">其他15个行业</td>
              <td>仅查看</td>
              <td>增删改查</td>
              <td class="highlight">可定制优化</td>
            </tr>

            <!-- 系统能力 -->
            <tr>
              <td rowspan="4" class="module-cell">系统能力</td>
              <td class="sub-module">数据管理</td>
              <td>不支持</td>
              <td>完整导出</td>
              <td class="highlight">批量处理</td>
            </tr>
            <tr>
              <td class="sub-module">系统集成</td>
              <td>不支持</td>
              <td>不支持</td>
              <td class="highlight">标准支持</td>
            </tr>
            <tr>
              <td class="sub-module">后台支撑</td>
              <td>不支持</td>
              <td>不支持</td>
              <td class="highlight">专属技术支持</td>
            </tr>
            <tr>
              <td class="sub-module">商业授权</td>
              <td>不允许</td>
              <td>有限授权</td>
              <td class="highlight">完全商业授权</td>
            </tr>

            <!-- 品牌服务 -->
            <tr>
              <td rowspan="2" class="module-cell">品牌服务</td>
              <td class="sub-module">界面定制 / 颜色主题</td>
              <td>系统默认</td>
              <td>系统默认</td>
              <td class="highlight">完全自定义</td>
            </tr>
            <tr>
              <td class="sub-module">专属域名 / LOGO替换</td>
              <td>不支持</td>
              <td>有限替换</td>
              <td class="highlight">支持/完全替换</td>
            </tr>

            <!-- 增值服务 -->
            <tr>
              <td rowspan="2" class="module-cell">增值服务</td>
              <td class="sub-module">培训 / 客服</td>
              <td>在线文档/智能客服</td>
              <td>线上课程/专属客服</td>
              <td class="highlight">远程支持/专属客服</td>
            </tr>
            <tr>
              <td class="sub-module">实施支持 / 数据迁移</td>
              <td>不支持</td>
              <td>有限支持</td>
              <td class="highlight">远程支持/完整迁移</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- 为什么选择旗舰版 -->
    <section class="features-section">
      <h2 class="section-title">为什么选择旗舰版</h2>
      <p class="section-subtitle">
        旗舰版不仅是更多功能——它是专为城市治理而生的完整数字化底座
      </p>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <MonitorIcon class="feature-icon" />
          </div>
          <h3 class="feature-title">AI智能增强</h3>
          <p class="feature-desc">
            城市智慧大脑配备AI模型，自动识别异常、智能预测风险，将被动监控升级为主动防御。
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <LightningIcon class="feature-icon" />
          </div>
          <h3 class="feature-title">SCADA自动化控制</h3>
          <p class="feature-desc">
            旗舰版开放SCADA高级自动化功能，支持跨系统联动指令，实现真正的无人值守智能运维。
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <OfficeIcon class="feature-icon" />
          </div>
          <h3 class="feature-title">20+ 行业全覆盖定制</h3>
          <p class="feature-desc">
            覆盖城管、环保、交通、应急、卫生等20余个行业，旗舰版支持深度定制，贴合本地业务流程。
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <BrushIcon class="feature-icon" />
          </div>
          <h3 class="feature-title">完整品牌白标</h3>
          <p class="feature-desc">
            专属域名、LOGO全替换、颜色主题完全自定义，以政府或企业自身品牌形象对外呈现。
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <ShieldIcon class="feature-icon" />
          </div>
          <h3 class="feature-title">数据批处理与迁移</h3>
          <p class="feature-desc">
            旗舰版提供批量数据处理、历史数据完整迁移服务，确保系统切换零数据丢失。
          </p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrapper">
            <HeadsetIcon class="feature-icon" />
          </div>
          <h3 class="feature-title">专属技术与实施支持</h3>
          <p class="feature-desc">
            专属技术团队全程跟踪，从远程实施部署到售后支持，7×24小时专属客服响应。
          </p>
        </div>
      </div>
    </section>

    <!-- 常见问题 FAQ -->
    <section class="faq-section">
      <h2 class="section-title">常见问题</h2>
      <p class="section-subtitle">关于会员升级您可能有的疑问</p>

      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqList" :key="index">
          <div class="faq-question">
            <h3 class="question-text">{{ faq.question }}</h3>
            <el-icon :size="20" color="#667eea"><ArrowDown /></el-icon>
          </div>
          <div class="faq-answer">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>

    <!-- 底部CTA -->
    <section class="cta-section">
      <h2 class="cta-title">准备好升级您的城市数字化管理能力了吗？</h2>
      <p class="cta-subtitle">
        立即升级，解锁完整的城市治理数字化能力。按需定制，旗舰版更支持一对一定制方案。
      </p>

      <div class="cta-buttons">
        <el-button type="primary" size="large" class="cta-primary-btn">
          立即升级高级会员 →
        </el-button>
        <el-button size="large" class="cta-secondary-btn">
          💬 联系我们定制旗舰方案
        </el-button>
      </div>

      <div class="cta-features">
        <div class="feature-tag">
          <ShieldIcon class="cta-tag-icon" />
          <span>数据安全保障</span>
        </div>
        <div class="feature-tag">
          <RefreshIcon :size="16" />
          <span>随时可能降级</span>
        </div>
        <div class="feature-tag">
          <HeadsetIcon :size="16" />
          <span>7×24专属支持</span>
        </div>
        <div class="feature-tag">
          <OfficeIcon :size="16" />
          <span>200+ 城市案例</span>
        </div>
      </div>

      <!-- 页脚 -->
      <footer class="page-footer">
        <div class="footer-content">
          <div class="footer-brand">
            <img
              src="/static/imgs/logo/logoOnly.png"
              alt="亘川科技"
              class="footer-logo-img"
            />
            <h3 class="brand-name">亘川科技</h3>
            <p class="brand-desc">为城市治理而生的<br />数字化智能底座平台</p>
          </div>

          <div class="footer-links">
            <div class="link-column">
              <a href="#" class="link-title">功能特性</a>
              <a href="#" class="link-item">行业解决方案</a>
              <a href="#" class="link-item">定价方案</a>
              <a href="#" class="link-item">更新日志</a>
            </div>
            <div class="link-column">
              <a href="#" class="link-title">关于我们</a>
              <a href="#" class="link-item">合作伙伴</a>
              <a href="#" class="link-item">新闻动态</a>
            </div>
            <div class="link-column">
              <a href="#" class="link-title">文档中心</a>
              <a href="#" class="link-item">技术支持</a>
              <a href="#" class="link-item">联系我们</a>
              <a href="#" class="link-item">服务协议</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <p class="copyright">福建省亘川科技 · 保留所有权利。</p>
          <div class="legal-links">
            <a href="#">隐私政策</a>
            <span>|</span>
            <a href="#">服务条款</a>
            <span>|</span>
            <a href="#">Cookie 设置</a>
          </div>
        </div>
      </footer>
    </section>

    <!-- 高级会员支付弹窗 -->
    <div
      v-if="showPremiumPayment"
      class="payment-modal-overlay"
      @click="closePremiumPayment"
    >
      <div class="payment-modal" @click.stop>
        <button class="modal-close-btn" @click="closePremiumPayment">✕</button>
        <h3 class="modal-title">高级会员 - ¥198/年</h3>
        <p class="modal-subtitle">请使用支付宝扫码完成支付</p>
        <div class="qr-code-container">
          <div class="qr-code-placeholder">
            <div class="qr-icon">📱</div>
            <p>支付宝二维码</p>
            <p class="qr-hint">(模拟二维码 - 前端演示)</p>
          </div>
        </div>
        <div class="payment-info">
          <div class="info-item">
            <span class="info-label">套餐名称</span>
            <span class="info-value">高级会员（年付）</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付金额</span>
            <span class="info-value price-highlight">¥198.00</span>
          </div>
          <div class="info-item">
            <span class="info-label">有效期</span>
            <span class="info-value">1年</span>
          </div>
        </div>
        <p class="payment-notice">
          ⚠️ 提示：此为前端模拟演示，实际支付需要后端集成支付宝SDK生成真实二维码
        </p>
      </div>
    </div>

    <!-- 旗舰版会员支付弹窗 -->
    <div
      v-if="showEnterprisePayment"
      class="payment-modal-overlay"
      @click="closeEnterprisePayment"
    >
      <div class="payment-modal" @click.stop>
        <button class="modal-close-btn" @click="closeEnterprisePayment">
          ✕
        </button>
        <h3 class="modal-title">旗舰版会员 - ¥9999/年</h3>
        <p class="modal-subtitle">请使用支付宝扫码完成支付</p>
        <div class="qr-code-container">
          <div class="qr-code-placeholder enterprise">
            <div class="qr-icon">📱</div>
            <p>支付宝二维码</p>
            <p class="qr-hint">(模拟二维码 - 前端演示)</p>
          </div>
        </div>
        <div class="payment-info">
          <div class="info-item">
            <span class="info-label">套餐名称</span>
            <span class="info-value">旗舰版会员（年付）</span>
          </div>
          <div class="info-item">
            <span class="info-label">支付金额</span>
            <span class="info-value price-highlight">¥9,999.00</span>
          </div>
          <div class="info-item">
            <span class="info-label">有效期</span>
            <span class="info-value">1年</span>
          </div>
        </div>
        <p class="payment-notice">
          💡 提示：旗舰版支持定制方案，如需咨询请联系销售团队获取专属报价
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.member-upgrade-page {
  height: 100vh;
  overflow-y: auto;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);

  // 自定义滚动条样式（Webkit浏览器）
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 4px;

    &:hover {
      background: linear-gradient(135deg, #5568d3 0%, #654091 100%);
    }
  }

  // Firefox 滚动条样式
  scrollbar-width: thin;
  scrollbar-color: #667eea #f1f5f9;
}

// Hero 区域
.hero-section {
  text-align: center;
  padding: 80px 20px 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 14px;
  margin-bottom: 24px;

  .badge-icon {
    font-size: 18px;
  }
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 24px;

  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-subtitle {
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto 40px;
}

.hero-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 60px;

  .upgrade-btn {
    padding: 14px 36px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    background: white !important;
    color: #667eea !important;
    border: none;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    }
  }

  .trial-btn {
    padding: 14px 36px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    background: transparent !important;
    color: white !important;
    border: 2px solid white;

    &:hover {
      background: rgba(255, 255, 255, 0.1) !important;
    }
  }
}

.stats-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  max-width: 800px;
  margin: 0 auto;

  .stat-item {
    flex: 1;

    .stat-number {
      font-size: 42px;
      font-weight: 800;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 15px;
      opacity: 0.85;
    }
  }

  .stat-divider {
    width: 1px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
  }
}

// 通用 section 样式
.pricing-section,
.comparison-section,
.features-section,
.cta-section {
  padding: 80px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.section-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%);
  color: #667eea;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 16px;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;

  .section-badge {
    display: inline-block;
    margin-bottom: 16px;
  }

  .section-title {
    margin-bottom: 12px;
  }

  .section-subtitle {
    margin-top: 8px;
  }
}

.section-title {
  font-size: 42px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-subtitle {
  text-align: center;
  font-size: 17px;
  color: #64748b;
  max-width: 700px;
  margin: 0 auto 50px;
  line-height: 1.7;
}

// ========= 修改后的定价卡片样式 =========
.pricing-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  margin-top: 50px;
}

.pricing-card {
  position: relative;
  background: white;
  border-radius: 24px;
  padding: 32px 28px;
  transition: all 0.3s ease;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.05),
    0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(102, 126, 234, 0.1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.15);
    border-color: rgba(102, 126, 234, 0.3);
  }
}

.free-plan {
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);

  .plan-name {
    color: #64748b;
  }

  .plan-price {
    color: #093cf0; // 蓝色价格

    .price-text {
      font-size: 48px;
      font-weight: 900;
      color: #093cf0; // 蓝色
    }
  }

  .plan-desc {
    color: #475569;
  }

  // 功能列表 - 深色文字
  .feature-list {
    .feature-item {
      color: #1e293b;

      svg {
        color: #1e293b;
      }

      &.disabled {
        color: #64748b;
        text-decoration: line-through;

        svg {
          color: #94a3b8;
        }
      }
    }
  }

  // 分隔线
  .plan-header {
    border-bottom-color: rgba(0, 0, 0, 0.1);
  }

  .current-btn {
    width: 100%;
    padding: 12px;
    background: #f1f5f9;
    color: #64748b;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 15px;
    cursor: default;
    transition: none;

    &:hover {
      background: #f1f5f9;
      transform: none;
    }
  }
}

.premium-plan {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid transparent;
  box-shadow: 0 20px 35px -12px rgba(0, 201, 255, 0.2);

  .popular-tag {
    position: absolute;
    top: -12px;
    right: 24px;
    padding: 6px 16px;
    background: linear-gradient(135deg, #00c9ff, #92fe9d);
    color: #1a1a2e;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 4px 10px rgba(0, 201, 255, 0.3);
  }

  .plan-name {
    color: white; // 白色标题
  }

  .plan-desc {
    color: rgba(255, 255, 255, 0.8); // 半透明白色
  }

  .plan-price {
    color: white; // 白色价格

    .currency {
      color: white;
    }

    .price-amount {
      color: white;
    }

    .price-period {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  // 功能列表 - 白色文字
  .feature-list {
    .feature-item {
      color: rgba(255, 255, 255, 0.9);

      &.included {
        color: white;
      }

      svg {
        color: #92fe9d; // 绿色图标
      }
    }
  }

  // 分隔线
  .plan-header {
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }

  .upgrade-btn-premium {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #00c9ff, #92fe9d) !important;
    color: #1a1a2e !important;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 201, 255, 0.4);
    }
  }
}

.enterprise-plan {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .enterprise-flag {
    position: absolute;
    top: -12px;
    right: 24px;
    padding: 6px 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border-radius: 40px;
    font-size: 13px;
    font-weight: 700;
    box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
  }

  .plan-name {
    color: white; // 白色标题
  }

  .plan-desc {
    color: rgba(255, 255, 255, 0.8); // 半透明白色
  }

  .plan-price {
    color: white; // 白色价格

    .currency {
      color: white;
    }

    .price-amount {
      color: white;
    }

    .price-period {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  // 功能列表 - 白色文字
  .feature-list {
    .feature-item {
      color: rgba(255, 255, 255, 0.9);

      &.included {
        color: white;
      }

      svg {
        color: #fbbf24; // 金黄色图标
      }
    }
  }

  // 分隔线
  .plan-header {
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }

  .upgrade-btn-enterprise {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    color: white !important;
    border: none;
    border-radius: 12px;
    font-weight: 700;
    font-size: 15px;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

.plan-header {
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.plan-name {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
}

.plan-price {
  margin-bottom: 8px;

  .currency {
    font-size: 24px;
    font-weight: 700;
    vertical-align: super;
  }

  .price-amount {
    font-size: 48px;
    font-weight: 900;
    line-height: 1;
  }

  .price-period {
    font-size: 16px;
    opacity: 0.8;
    margin-left: 2px;
  }

  .price-text {
    font-size: 48px;
    font-weight: 900;
  }
}

.plan-desc {
  font-size: 14px;
  color: #64748b;
  margin-top: 8px;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 32px 0;

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 0;
    font-size: 14.5px;
    color: #334155;

    svg {
      flex-shrink: 0;
      width: 18px;
      height: 18px;
    }

    &.disabled {
      color: #94a3b8;
      text-decoration: line-through;

      svg {
        color: #cbd5e1;
      }
    }
  }
}

.plan-btn {
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 15px;
}

// 对比表格
.comparison-table-wrapper {
  overflow-x: auto;
  margin-top: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;

  th,
  td {
    padding: 16px 18px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    font-weight: 700;
    font-size: 14px;

    &.th-feature {
      width: 15%;
    }

    &.th-subfeature {
      width: 22%;
    }
  }

  tbody tr:hover {
    background: #f8fafc;
  }

  .category-cell {
    text-align: left;
  }

  .module-cell {
    background: linear-gradient(90deg, #e0e7ff 0%, #f3e8ff 100%);
    font-weight: 600;
    color: #475569;
    vertical-align: middle;
  }

  .sub-module {
    color: #64748b;
  }

  .highlight {
    color: #667eea;
    font-weight: 600;
    background: linear-gradient(
      90deg,
      rgba(102, 126, 234, 0.08) 0%,
      rgba(118, 75, 162, 0.08) 100%
    );
  }
}

// 特性网格
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
  gap: 28px;
  margin-top: 50px;

  .feature-card:nth-child(4),
  .feature-card:nth-child(5),
  .feature-card:nth-child(6) {
    .feature-icon {
      color: #764ba2;
    }
  }
}

.feature-card {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 32px 26px;
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 28px rgba(102, 126, 234, 0.15);
  }

  .feature-icon-wrapper {
    width: 72px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 16px;
    margin-bottom: 20px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);

    .feature-icon {
      width: 36px !important;
      height: 36px !important;
      min-width: 36px;
      min-height: 36px;

      display: flex;
      align-items: center;
      justify-content: center;

      color: #667eea;
      flex-shrink: 0;

      :deep(svg) {
        width: 36px !important;
        height: 36px !important;
        min-width: 36px;
        min-height: 36px;

        display: block;
        color: currentColor;
        fill: currentColor;
      }
    }
  }

  .feature-title {
    font-size: 19px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 12px;
  }

  .feature-desc {
    font-size: 14.5px;
    line-height: 1.7;
    color: #64748b;
  }
}

// CTA 区域
.cta-section {
  text-align: center;
  background: transparent;
  color: #1e293b;
  border-radius: 24px;
  margin: 40px auto;
  padding: 70px 20px;

  .cta-title {
    font-size: 38px;
    font-weight: 800;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .cta-subtitle {
    font-size: 18px;
    opacity: 0.85;
    margin-bottom: 36px;
    color: #64748b;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
    line-height: 1.7;
  }

  .cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 40px;

    .cta-primary-btn {
      padding: 14px 40px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%) !important;
      color: #1a1a2e !important;
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        opacity: 0.95;
      }
    }

    .cta-secondary-btn {
      padding: 14px 40px;
      font-size: 16px;
      font-weight: 700;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: white !important;
      border: none;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
        opacity: 0.9;
      }
    }
  }
  .cta-tag-icon {
    width: 16px !important;
    height: 16px !important;
    display: inline-flex;
    color: currentColor;

    svg {
      width: 16px !important;
      height: 16px !important;
      display: block;
      fill: currentColor;
    }
  }
  .cta-features {
    display: flex;
    gap: 32px;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 50px;

    .feature-tag {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #667eea;
      font-weight: 500;
    }
  }

  // 页脚
  .page-footer {
    margin-top: 60px;
    padding-top: 50px;
    border-top: 1px solid #e2e8f0;

    .footer-content {
      display: flex;
      justify-content: space-between;
      gap: 60px;
      margin-bottom: 40px;
    }

    .footer-brand {
      text-align: center;
      max-width: 280px;

      .footer-logo-img {
        height: 56px;
        margin: 0 auto 16px;
        display: block;
      }

      .brand-name {
        font-size: 22px;
        font-weight: 800;
        margin-bottom: 10px;
        color: #093cf0;
      }

      .brand-desc {
        font-size: 14px;
        line-height: 1.7;
        color: #64748b;
      }
    }

    .footer-links {
      display: flex;
      gap: 80px;
      flex: 1;
      justify-content: flex-end;
    }

    .link-column {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .link-title {
        font-size: 15px;
        font-weight: 700;
        color: #1e293b;
        margin-bottom: 4px;
        text-decoration: none;
        pointer-events: none;
        cursor: not-allowed;

        &:hover {
          color: #1e293b;
        }
      }

      .link-item {
        font-size: 13.5px;
        color: #64748b;
        text-decoration: none;
        transition: all 0.3s ease;
        pointer-events: none;
        cursor: not-allowed;

        &:hover {
          color: #64748b;
          transform: translateX(0);
        }
      }
    }

    .footer-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;

      .copyright {
        font-size: 13px;
        color: #94a3b8;
      }

      .legal-links {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 13px;

        a {
          color: #64748b;
          text-decoration: none;
          transition: all 0.3s ease;
          pointer-events: none;
          cursor: not-allowed;

          &:hover {
            color: #64748b;
          }
        }

        span {
          color: #cbd5e1;
        }
      }
    }
  }
}

// FAQ 区域
.faq-section {
  padding: 80px 20px;
  max-width: 900px;
  margin: 0 auto;

  .faq-list {
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .faq-item {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 12px;
    padding: 24px 28px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.12);
      transform: translateY(-2px);
    }

    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;

      .question-text {
        font-size: 17px;
        font-weight: 600;
        color: #1e293b;
        margin: 0;
        flex: 1;
      }
    }

    .faq-answer {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid rgba(102, 126, 234, 0.15);
      font-size: 14.5px;
      line-height: 1.8;
      color: #475569;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .hero-title {
    font-size: 38px;
  }

  .hero-subtitle {
    font-size: 16px;
  }

  .stats-container {
    flex-direction: column;
    gap: 24px;

    .stat-divider {
      width: 80px;
      height: 1px;
    }
  }

  .pricing-cards {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 32px;
  }

  .cta-title {
    font-size: 28px;
  }

  .comparison-table {
    font-size: 12px;

    th,
    td {
      padding: 12px 10px;
    }
  }

  .faq-section {
    padding: 50px 20px;

    .faq-item {
      padding: 18px 20px;

      .faq-question .question-text {
        font-size: 15.5px;
      }

      .faq-answer {
        font-size: 13.5px;
      }
    }
  }

  .cta-section {
    padding: 50px 16px;
    border-radius: 0;

    .cta-title {
      font-size: 26px;
    }

    .cta-subtitle {
      font-size: 15px;
    }

    .cta-buttons {
      flex-direction: column;

      .cta-primary-btn,
      .cta-secondary-btn {
        width: 100%;
      }
    }

    .cta-features {
      gap: 16px;
    }

    .page-footer {
      .footer-content {
        flex-direction: column;
        gap: 30px;
      }

      .footer-brand {
        text-align: center;
        max-width: 100%;
      }

      .footer-links {
        flex-direction: column;
        gap: 24px;
        justify-content: center;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 12px;
        text-align: center;
      }
    }
  }
}

// 支付弹窗样式
.payment-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .payment-modal {
    background: white;
    border-radius: 20px;
    padding: 40px;
    max-width: 440px;
    width: 90%;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    animation: slideUp 0.3s ease;
    position: relative;

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: #e2e8f0;
        color: #1e293b;
        transform: rotate(90deg);
      }
    }

    .modal-title {
      font-size: 26px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 8px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .modal-subtitle {
      font-size: 15px;
      color: #64748b;
      text-align: center;
      margin-bottom: 28px;
    }

    .qr-code-container {
      display: flex;
      justify-content: center;
      margin-bottom: 28px;

      .qr-code-placeholder {
        width: 220px;
        height: 220px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border: 3px dashed #cbd5e1;
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 12px;
        transition: all 0.3s ease;

        &.enterprise {
          background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
          border-color: #a78bfa;
        }

        .qr-icon {
          font-size: 56px;
          opacity: 0.6;
        }

        p {
          font-size: 14px;
          color: #64748b;
          margin: 0;
          font-weight: 500;
        }

        .qr-hint {
          font-size: 12px !important;
          color: #94a3b8;
          font-weight: 400 !important;
        }

        &:hover {
          border-color: #667eea;
          transform: scale(1.02);

          &.enterprise {
            border-color: #764ba2;
          }
        }
      }
    }

    .payment-info {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .info-value {
          font-size: 15px;
          color: #1e293b;
          font-weight: 600;

          &.price-highlight {
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
      }
    }

    .payment-notice {
      font-size: 13px;
      color: #94a3b8;
      text-align: center;
      line-height: 1.6;
      padding: 12px;
      background: #fffbeb;
      border-radius: 8px;
      border-left: 3px solid #fbbf24;
    }
  }
}
</style>
