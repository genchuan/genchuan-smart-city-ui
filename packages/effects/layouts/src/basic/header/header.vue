<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import { useRouter } from 'vue-router';

import { useRefresh } from '@vben/hooks';
import { createIconifyIcon, RotateCw } from '@vben/icons';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { VbenFullScreen, VbenIconButton } from '@vben-core/shadcn-ui';

import {
  GlobalSearch,
  LanguageToggle,
  PreferencesButton,
  ThemeToggle,
  TimezoneButton,
} from '../../widgets';

defineOptions({
  name: 'LayoutHeader',
});

withDefaults(defineProps<Props>(), {
  theme: 'light',
});

const emit = defineEmits<{ clearPreferencesAndLogout: [] }>();

// 创建商城图标
const ShoppingCartIcon = createIconifyIcon('mdi:cart-outline');

// 创建升级会员图标
const CrownIcon = createIconifyIcon('mdi:crown');

interface Props {
  /**
   * Logo 主题
   */
  theme?: string;
}

const REFERENCE_VALUE = 50;

const accessStore = useAccessStore();
const { globalSearchShortcutKey, preferencesButtonPosition } = usePreferences();
const slots = useSlots();
const { refresh } = useRefresh();
const router = useRouter();

const rightSlots = computed(() => {
  const list = [{ index: REFERENCE_VALUE + 100, name: 'user-dropdown' }];
  if (preferences.widget.globalSearch) {
    list.push({
      index: REFERENCE_VALUE,
      name: 'global-search',
    });
  }

  // 升级会员图标
  list.push({
    index: REFERENCE_VALUE + 4,
    name: 'upgrade-member',
  });

  // 商城图标
  list.push({
    index: REFERENCE_VALUE + 5,
    name: 'mall',
  });

  if (preferencesButtonPosition.value.header) {
    list.push({
      index: REFERENCE_VALUE + 10,
      name: 'preferences',
    });
  }
  if (preferences.widget.themeToggle) {
    list.push({
      index: REFERENCE_VALUE + 20,
      name: 'theme-toggle',
    });
  }
  if (preferences.widget.languageToggle) {
    list.push({
      index: REFERENCE_VALUE + 30,
      name: 'language-toggle',
    });
  }
  if (preferences.widget.timezone) {
    list.push({
      index: REFERENCE_VALUE + 40,
      name: 'timezone',
    });
  }
  if (preferences.widget.fullscreen) {
    list.push({
      index: REFERENCE_VALUE + 50,
      name: 'fullscreen',
    });
  }
  if (preferences.widget.notification) {
    list.push({
      index: REFERENCE_VALUE + 60,
      name: 'notification',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-right')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.toSorted((a, b) => a.index - b.index);
});

const leftSlots = computed(() => {
  const list: Array<{ index: number; name: string }> = [];

  if (preferences.widget.refresh) {
    list.push({
      index: 0,
      name: 'refresh',
    });
  }

  Object.keys(slots).forEach((key) => {
    const name = key.split('-');
    if (key.startsWith('header-left')) {
      list.push({ index: Number(name[2]), name: key });
    }
  });
  return list.toSorted((a, b) => a.index - b.index);
});

function clearPreferencesAndLogout() {
  emit('clearPreferencesAndLogout');
}

/** 打开商城页面，实现单点登录 */
function openMall() {
  // 获取当前用户的 token
  // const accessToken = accessStore.accessToken;
  // if (!accessToken) {
  //   // 未登录，直接跳转到商城登录页
  //   window.open('http://192.168.8.12:3000/pages/index/cart', '_blank');
  //   return;
  // }
  // 已登录，携带 token 跳转到商城实现单点登录
  // 方式1：通过 URL 参数传递 token（需要商城端支持 暂时不支持）
  // const mallUrl = `http://192.168.8.12:3000/pages/index/cart?token=${encodeURIComponent(accessToken)}`;
  // window.open(mallUrl, '_blank');
  window.open('http://192.168.8.12:3000/pages/index/cart', '_blank');
}

/** 打开升级会员页面 */
function openUpgradeMember() {
  router.push('/member/upgrade');
}
</script>

<template>
  <template
    v-for="slot in leftSlots.filter((item) => item.index < REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name">
      <template v-if="slot.name === 'refresh'">
        <VbenIconButton class="my-0 mr-1 rounded-md" @click="refresh">
          <RotateCw class="size-4" />
        </VbenIconButton>
      </template>
    </slot>
  </template>
  <div class="flex-center hidden lg:block">
    <slot name="breadcrumb"></slot>
  </div>
  <template
    v-for="slot in leftSlots.filter((item) => item.index > REFERENCE_VALUE)"
    :key="slot.name"
  >
    <slot :name="slot.name"></slot>
  </template>
  <div
    :class="`menu-align-${preferences.header.menuAlign}`"
    class="flex h-full min-w-0 flex-1 items-center"
  >
    <slot name="menu"></slot>
  </div>
  <div class="flex h-full min-w-0 flex-shrink-0 items-center">
    <template v-for="slot in rightSlots" :key="slot.name">
      <slot :name="slot.name">
        <template v-if="slot.name === 'global-search'">
          <GlobalSearch
            :enable-shortcut-key="globalSearchShortcutKey"
            :menus="accessStore.accessMenus"
            class="mr-1 sm:mr-4"
          />
        </template>

        <template v-else-if="slot.name === 'upgrade-member'">
          <div
            class="mr-2 flex cursor-pointer items-center gap-1 rounded-md bg-orange-100 px-2 py-1 text-orange-600 transition-colors hover:bg-orange-200"
            @click="openUpgradeMember"
          >
            <CrownIcon class="size-4" />
            <span class="text-xs font-medium">升级会员</span>
          </div>
        </template>

        <template v-else-if="slot.name === 'mall'">
          <div
            class="bg-primary/10 text-primary hover:bg-primary/20 mr-2 flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 transition-colors"
            @click="openMall"
          >
            <ShoppingCartIcon class="size-4" />
            <span class="text-xs font-medium">软件商城</span>
          </div>
        </template>

        <template v-else-if="slot.name === 'preferences'">
          <PreferencesButton
            class="mr-1"
            @clear-preferences-and-logout="clearPreferencesAndLogout"
          />
        </template>
        <template v-else-if="slot.name === 'theme-toggle'">
          <ThemeToggle class="mr-1 mt-[2px]" />
        </template>
        <template v-else-if="slot.name === 'language-toggle'">
          <LanguageToggle class="mr-1" />
        </template>
        <template v-else-if="slot.name === 'fullscreen'">
          <VbenFullScreen class="mr-1" />
        </template>
        <template v-else-if="slot.name === 'timezone'">
          <TimezoneButton class="mr-1 mt-[2px]" />
        </template>
      </slot>
    </template>
  </div>
</template>
<style lang="scss" scoped>
.menu-align-start {
  --menu-align: start;
}

.menu-align-center {
  --menu-align: center;
}

.menu-align-end {
  --menu-align: end;
}
</style>
