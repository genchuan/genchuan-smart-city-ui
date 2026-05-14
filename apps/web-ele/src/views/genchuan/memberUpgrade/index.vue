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

// 联系方式二维码弹窗状态
const showContactQr = ref(false);

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

// 显示联系方式二维码弹窗
function showContactQrModal() {
  showContactQr.value = true;
}

// 关闭联系方式二维码弹窗
function closeContactQr() {
  showContactQr.value = false;
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
        <el-button
          type="primary"
          size="large"
          class="cta-primary-btn"
          @click="showPremiumPaymentModal"
        >
          立即升级高级会员 →
        </el-button>
        <el-button
          size="large"
          class="cta-secondary-btn"
          @click="showContactQrModal"
        >
          💬 联系我们定制旗舰方案
        </el-button>
      </div>

      <div class="cta-features">
        <div class="feature-tag">
          <ShieldIcon class="cta-tag-icon" />
          <span>数据安全保障</span>
        </div>
        <!--        <div class="feature-tag">-->
        <!--          <RefreshIcon :size="16" />-->
        <!--          <span>随时可能降级</span>-->
        <!--        </div>-->
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

    <!-- 联系方式二维码弹窗 -->
    <div
      v-if="showContactQr"
      class="payment-modal-overlay"
      @click="closeContactQr"
    >
      <div class="payment-modal contact-modal" @click.stop>
        <button class="modal-close-btn" @click="closeContactQr">✕</button>
        <h3 class="modal-title">联系我们 - 专属定制服务</h3>
        <p class="modal-subtitle">扫描二维码添加企业微信，获取专属定制方案</p>
        <div class="qr-code-container">
          <img
            src="./img/contactInfoQW.jpg"
            alt="企业微信联系方式"
            class="contact-qr-image"
          />
        </div>
        <!--        <div class="contact-info">-->
        <!--          <div class="info-item">-->
        <!--            <span class="info-label">📞 服务热线</span>-->
        <!--            <span class="info-value">400-XXX-XXXX</span>-->
        <!--          </div>-->
        <!--          <div class="info-item">-->
        <!--            <span class="info-label">📧 商务邮箱</span>-->
        <!--            <span class="info-value">business@yichuan.com</span>-->
        <!--          </div>-->
        <!--          <div class="info-item">-->
        <!--            <span class="info-label">⏰ 服务时间</span>-->
        <!--            <span class="info-value">周一至周五 9:00-18:00</span>-->
        <!--          </div>-->
        <!--        </div>-->
        <p class="payment-notice contact-notice">
          💼 专业顾问将在24小时内与您联系，为您提供一对一的定制化解决方案
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
        max-width: 100%;
        text-align: center;
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

.member-upgrade-page {
  height: 100vh;
  overflow-y: auto;
  scrollbar-color: #667eea #f1f5f9;

  // Firefox 滚动条样式
  scrollbar-width: thin;
  background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);

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
}

// Hero 区域
.hero-section {
  padding: 80px 20px 60px;
  color: white;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero-badge {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 20px;
  margin-bottom: 24px;
  font-size: 14px;
  background: rgb(255 255 255 / 20%);
  border-radius: 20px;

  .badge-icon {
    font-size: 18px;
  }
}

.hero-title {
  margin-bottom: 24px;
  font-size: 56px;
  font-weight: 800;
  line-height: 1.2;

  .gradient-text {
    background: linear-gradient(135deg, #fff 0%, #a5b4fc 100%);
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.hero-subtitle {
  max-width: 700px;
  margin: 0 auto 40px;
  font-size: 18px;
  line-height: 1.8;
  opacity: 0.95;
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
    color: #667eea !important;
    background: white !important;
    border: none;
    border-radius: 8px;

    &:hover {
      box-shadow: 0 10px 25px rgb(0 0 0 / 20%);
      transform: translateY(-2px);
    }
  }

  .trial-btn {
    padding: 14px 36px;
    font-size: 16px;
    font-weight: 600;
    color: white !important;
    background: transparent !important;
    border: 2px solid white;
    border-radius: 8px;

    &:hover {
      background: rgb(255 255 255 / 10%) !important;
    }
  }
}

.stats-container {
  display: flex;
  gap: 48px;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;

  .stat-item {
    flex: 1;

    .stat-number {
      margin-bottom: 8px;
      font-size: 42px;
      font-weight: 800;
    }

    .stat-label {
      font-size: 15px;
      opacity: 0.85;
    }
  }

  .stat-divider {
    width: 1px;
    height: 50px;
    background: rgb(255 255 255 / 30%);
  }
}

// 通用 section 样式
.pricing-section,
.comparison-section,
.features-section,
.cta-section {
  max-width: 1200px;
  padding: 80px 20px;
  margin: 0 auto;
}

.section-badge {
  display: inline-block;
  padding: 8px 20px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
  background: linear-gradient(135deg, #e0e7ff 0%, #fce7f3 100%);
  border-radius: 20px;
}

.section-header {
  margin-bottom: 50px;
  text-align: center;

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
  margin-bottom: 16px;
  font-size: 42px;
  font-weight: 800;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.section-subtitle {
  max-width: 700px;
  margin: 0 auto 50px;
  font-size: 17px;
  line-height: 1.7;
  color: #64748b;
  text-align: center;
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
  padding: 32px 28px;
  background: white;
  border: 1px solid rgb(102 126 234 / 10%);
  border-radius: 24px;
  box-shadow:
    0 10px 25px -5px rgb(0 0 0 / 5%),
    0 8px 10px -6px rgb(0 0 0 / 2%);
  transition: all 0.3s ease;

  &:hover {
    border-color: rgb(102 126 234 / 30%);
    box-shadow: 0 20px 35px -12px rgb(0 0 0 / 15%);
    transform: translateY(-6px);
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
    border-bottom-color: rgb(0 0 0 / 10%);
  }

  .current-btn {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 600;
    color: #64748b;
    cursor: default;
    background: #f1f5f9;
    border: none;
    border-radius: 12px;
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
  box-shadow: 0 20px 35px -12px rgb(0 201 255 / 20%);

  .popular-tag {
    position: absolute;
    top: -12px;
    right: 24px;
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 700;
    color: #1a1a2e;
    background: linear-gradient(135deg, #00c9ff, #92fe9d);
    border-radius: 40px;
    box-shadow: 0 4px 10px rgb(0 201 255 / 30%);
  }

  .plan-name {
    color: white; // 白色标题
  }

  .plan-desc {
    color: rgb(255 255 255 / 80%); // 半透明白色
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
      color: rgb(255 255 255 / 80%);
    }
  }

  // 功能列表 - 白色文字
  .feature-list {
    .feature-item {
      color: rgb(255 255 255 / 90%);

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
    border-bottom-color: rgb(255 255 255 / 15%);
  }

  .upgrade-btn-premium {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 700;
    color: #1a1a2e !important;
    background: linear-gradient(135deg, #00c9ff, #92fe9d) !important;
    border: none;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 8px 20px rgb(0 201 255 / 40%);
      transform: translateY(-2px);
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
    font-size: 13px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 40px;
    box-shadow: 0 4px 10px rgb(102 126 234 / 30%);
  }

  .plan-name {
    color: white; // 白色标题
  }

  .plan-desc {
    color: rgb(255 255 255 / 80%); // 半透明白色
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
      color: rgb(255 255 255 / 80%);
    }
  }

  // 功能列表 - 白色文字
  .feature-list {
    .feature-item {
      color: rgb(255 255 255 / 90%);

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
    border-bottom-color: rgb(255 255 255 / 15%);
  }

  .upgrade-btn-enterprise {
    width: 100%;
    padding: 12px;
    font-size: 15px;
    font-weight: 700;
    color: white !important;
    background: linear-gradient(135deg, #667eea, #764ba2) !important;
    border: none;
    border-radius: 12px;
    transition: all 0.2s ease;

    &:hover {
      box-shadow: 0 8px 20px rgb(102 126 234 / 40%);
      transform: translateY(-2px);
    }
  }
}

.plan-header {
  padding-bottom: 20px;
  margin-bottom: 28px;
  border-bottom: 1px solid #e2e8f0;
}

.plan-name {
  margin-bottom: 16px;
  font-size: 22px;
  font-weight: 700;
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
    margin-left: 2px;
    font-size: 16px;
    opacity: 0.8;
  }

  .price-text {
    font-size: 48px;
    font-weight: 900;
  }
}

.plan-desc {
  margin-top: 8px;
  font-size: 14px;
  color: #64748b;
}

.feature-list {
  padding: 0;
  margin: 0 0 32px;
  list-style: none;

  .feature-item {
    display: flex;
    gap: 10px;
    align-items: center;
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
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
}

// 对比表格
.comparison-table-wrapper {
  margin-top: 40px;
  overflow-x: auto;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
}

.comparison-table {
  width: 100%;
  font-size: 14px;
  border-collapse: collapse;
  background: white;

  th,
  td {
    padding: 16px 18px;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    font-size: 14px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

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
    font-weight: 600;
    vertical-align: middle;
    color: #475569;
    background: linear-gradient(90deg, #e0e7ff 0%, #f3e8ff 100%);
  }

  .sub-module {
    color: #64748b;
  }

  .highlight {
    font-weight: 600;
    color: #667eea;
    background: linear-gradient(
      90deg,
      rgb(102 126 234 / 8%) 0%,
      rgb(118 75 162 / 8%) 100%
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
  padding: 32px 26px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 12px 28px rgb(102 126 234 / 15%);
    transform: translateY(-6px);
  }

  .feature-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    margin-bottom: 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgb(102 126 234 / 10%);

    .feature-icon {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 36px !important;
      min-width: 36px;
      height: 36px !important;
      min-height: 36px;
      color: #667eea;

      :deep(svg) {
        display: block;
        width: 36px !important;
        min-width: 36px;
        height: 36px !important;
        min-height: 36px;
        color: currentcolor;
        fill: currentcolor;
      }
    }
  }

  .feature-title {
    margin-bottom: 12px;
    font-size: 19px;
    font-weight: 700;
    color: #1e293b;
  }

  .feature-desc {
    font-size: 14.5px;
    line-height: 1.7;
    color: #64748b;
  }
}

// CTA 区域
.cta-section {
  padding: 70px 20px;
  margin: 40px auto;
  color: #1e293b;
  text-align: center;
  background: transparent;
  border-radius: 24px;

  .cta-title {
    margin-bottom: 16px;
    font-size: 38px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .cta-subtitle {
    max-width: 700px;
    margin-right: auto;
    margin-bottom: 36px;
    margin-left: auto;
    font-size: 18px;
    line-height: 1.7;
    color: #64748b;
    opacity: 0.85;
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
      color: #1a1a2e !important;
      background: linear-gradient(135deg, #00c9ff 0%, #92fe9d 100%) !important;
      border: none;
      border-radius: 8px;

      &:hover {
        box-shadow: 0 10px 25px rgb(102 126 234 / 30%);
        opacity: 0.95;
        transform: translateY(-2px);
      }
    }

    .cta-secondary-btn {
      padding: 14px 40px;
      font-size: 16px;
      font-weight: 700;
      color: white !important;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      border: none;
      border-radius: 8px;

      &:hover {
        box-shadow: 0 10px 25px rgb(102 126 234 / 30%);
        opacity: 0.9;
        transform: translateY(-2px);
      }
    }
  }

  .cta-tag-icon {
    display: inline-flex;
    width: 16px !important;
    height: 16px !important;
    color: currentcolor;

    svg {
      display: block;
      width: 16px !important;
      height: 16px !important;
      fill: currentcolor;
    }
  }

  .cta-features {
    display: flex;
    flex-wrap: wrap;
    gap: 32px;
    justify-content: center;
    margin-bottom: 50px;

    .feature-tag {
      display: flex;
      gap: 6px;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
      color: #667eea;
    }
  }

  // 页脚
  .page-footer {
    padding-top: 50px;
    margin-top: 60px;
    border-top: 1px solid #e2e8f0;

    .footer-content {
      display: flex;
      gap: 60px;
      justify-content: space-between;
      margin-bottom: 40px;
    }

    .footer-brand {
      max-width: 280px;
      text-align: center;

      .footer-logo-img {
        display: block;
        height: 56px;
        margin: 0 auto 16px;
      }

      .brand-name {
        margin-bottom: 10px;
        font-size: 22px;
        font-weight: 800;
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
      flex: 1;
      gap: 80px;
      justify-content: flex-end;
    }

    .link-column {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .link-title {
        margin-bottom: 4px;
        font-size: 15px;
        font-weight: 700;
        color: #1e293b;
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
        pointer-events: none;
        cursor: not-allowed;
        transition: all 0.3s ease;

        &:hover {
          color: #64748b;
          transform: translateX(0);
        }
      }
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
          pointer-events: none;
          cursor: not-allowed;
          transition: all 0.3s ease;

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
  max-width: 900px;
  padding: 80px 20px;
  margin: 0 auto;

  .faq-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 50px;
  }

  .faq-item {
    padding: 24px 28px;
    cursor: pointer;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px rgb(102 126 234 / 12%);
      transform: translateY(-2px);
    }

    .faq-question {
      display: flex;
      gap: 16px;
      align-items: center;
      justify-content: space-between;

      .question-text {
        flex: 1;
        margin: 0;
        font-size: 17px;
        font-weight: 600;
        color: #1e293b;
      }
    }

    .faq-answer {
      padding-top: 16px;
      margin-top: 16px;
      font-size: 14.5px;
      line-height: 1.8;
      color: #475569;
      border-top: 1px solid rgb(102 126 234 / 15%);
    }
  }
}

// 支付弹窗样式
.payment-modal-overlay {
  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 60%);
  animation: fadeIn 0.3s ease;

  .payment-modal {
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    position: relative;
    width: 90%;
    max-width: 440px;
    padding: 40px;
    background: white;
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
    animation: slideUp 0.3s ease;

    .modal-close-btn {
      position: absolute;
      top: 16px;
      right: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      font-size: 18px;
      color: #64748b;
      cursor: pointer;
      background: #f1f5f9;
      border: none;
      border-radius: 50%;
      transition: all 0.2s ease;

      &:hover {
        color: #1e293b;
        background: #e2e8f0;
        transform: rotate(90deg);
      }
    }

    .modal-title {
      margin-bottom: 8px;
      font-size: 26px;
      font-weight: 800;
      color: #1e293b;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .modal-subtitle {
      margin-bottom: 28px;
      font-size: 15px;
      color: #64748b;
      text-align: center;
    }

    .qr-code-container {
      display: flex;
      justify-content: center;
      margin-bottom: 28px;

      .qr-code-placeholder {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        justify-content: center;
        width: 220px;
        height: 220px;
        background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        border: 3px dashed #cbd5e1;
        border-radius: 16px;
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
          margin: 0;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }

        .qr-hint {
          font-size: 12px !important;
          font-weight: 400 !important;
          color: #94a3b8;
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
      padding: 20px;
      margin-bottom: 20px;
      background: #f8fafc;
      border-radius: 12px;

      .info-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }

        .info-value {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;

          &.price-highlight {
            font-size: 22px;
            font-weight: 800;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
      }
    }

    .payment-notice {
      padding: 12px;
      font-size: 13px;
      line-height: 1.6;
      color: #94a3b8;
      text-align: center;
      background: #fffbeb;
      border-left: 3px solid #fbbf24;
      border-radius: 8px;

      &.contact-notice {
        color: #475569;
        background: #eff6ff;
        border-left-color: #3b82f6;
      }
    }

    // 联系方式弹窗特有样式
    &.contact-modal {
      .contact-qr-image {
        width: 240px;
        height: 240px;
        object-fit: cover;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgb(59 130 246 / 15%);
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 12px 32px rgb(59 130 246 / 25%);
          transform: scale(1.05);
        }
      }

      .contact-info {
        padding: 20px;
        margin-bottom: 20px;
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        border: 1px solid #bae6fd;
        border-radius: 12px;

        .info-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #bae6fd;

          &:last-child {
            border-bottom: none;
          }

          .info-label {
            font-size: 14px;
            font-weight: 600;
            color: #0369a1;
          }

          .info-value {
            font-size: 15px;
            font-weight: 600;
            color: #0c4a6e;
          }
        }
      }
    }
  }
}
</style>
