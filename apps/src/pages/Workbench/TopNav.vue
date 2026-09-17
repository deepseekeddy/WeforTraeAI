<template>
  <header class="top-nav" role="banner">
    <!-- 左侧：侧边栏开关 + Logo + 会话标题 -->
    <div class="top-nav__left">
      <el-button
        class="top-nav__sidebar-toggle"
        :icon="userStore.sidebarCollapsed ? Expand : Fold"
        link
        :aria-label="userStore.sidebarCollapsed ? '展开侧边栏' : '折叠侧边栏'"
        @click="handleSidebarToggle"
      />
      <div class="top-nav__logo">
        <img src="@/assets/logo.svg" alt="UA超级入口" class="top-nav__logo-icon" />
        <span class="top-nav__product-name">UA超级入口</span>
      </div>
      <span class="top-nav__session-title" :title="chatStore.sessionTitle">
        {{ chatStore.sessionTitle }}
      </span>
    </div>

    <!-- 中间：导航菜单（桌面端） -->
    <nav class="top-nav__menu" role="navigation" aria-label="主导航">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        :ellipsis="false"
        @select="handleMenuSelect"
      >
        <el-menu-item index="workbench">工作台</el-menu-item>
        <el-menu-item index="app-center">应用中心</el-menu-item>
        <el-menu-item index="dashboard">数据看板</el-menu-item>
        <el-menu-item index="profile">个人中心</el-menu-item>
      </el-menu>
    </nav>

    <!-- 右侧：免责声明 + 用户头像下拉 -->
    <div class="top-nav__right">
      <span class="top-nav__disclaimer" role="status" aria-live="polite">
        内容由AI生成，仅供参考
      </span>
      <el-dropdown trigger="click" @command="handleUserCommand">
        <div class="top-nav__user" tabindex="0" role="button" aria-label="用户菜单">
          <el-avatar :size="32" :src="userStore.userInfo.avatar">
            {{ userStore.userInfo.name?.charAt(0) || 'U' }}
          </el-avatar>
          <span class="top-nav__user-name">{{ userStore.userInfo.name || '未登录' }}</span>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="settings">设置</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 移动端折叠按钮 -->
    <el-button
      class="top-nav__mobile-toggle"
      :icon="mobileMenuOpen ? Close : Menu"
      link
      aria-label="切换移动端菜单"
      @click="mobileMenuOpen = !mobileMenuOpen"
    />
  </header>

  <!-- 移动端下拉菜单 -->
  <Transition name="slide-down">
    <nav
      v-show="mobileMenuOpen"
      class="top-nav__mobile-menu"
      role="navigation"
      aria-label="移动端导航"
    >
      <el-menu :default-active="activeMenu" @select="handleMobileMenuSelect">
        <el-menu-item index="workbench">工作台</el-menu-item>
        <el-menu-item index="app-center">应用中心</el-menu-item>
        <el-menu-item index="dashboard">数据看板</el-menu-item>
        <el-menu-item index="profile">个人中心</el-menu-item>
      </el-menu>
    </nav>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Fold, Expand, Menu, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'

const userStore = useUserStore()
const chatStore = useChatStore()

const activeMenu = ref('workbench')
const mobileMenuOpen = ref(false)

/** 侧边栏折叠/展开，埋点 sidebar_toggle */
function handleSidebarToggle() {
  const action = userStore.sidebarCollapsed ? 'unfold' : 'fold'
  userStore.toggleSidebar()
  trackEvent('sidebar_toggle', {
    user_id: userStore.userInfo.id,
    action
  })
}

function handleMenuSelect(index: string) {
  activeMenu.value = index
}

function handleMobileMenuSelect(index: string) {
  activeMenu.value = index
  mobileMenuOpen.value = false
}

function handleUserCommand(command: string) {
  switch (command) {
    case 'profile':
      activeMenu.value = 'profile'
      break
    case 'settings':
      // 跳转设置页（待后续实现）
      break
    case 'logout':
      userStore.logout()
      break
  }
}

/** 埋点上报（预留接口，后续接入统一埋点 SDK） */
function trackEvent(eventName: string, props: Record<string, unknown>) {
  console.debug(`[track] ${eventName}`, props)
}
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
}

.top-nav__left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.top-nav__sidebar-toggle {
  font-size: 20px;
  color: #606266;
}

.top-nav__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.top-nav__logo-icon {
  width: 28px;
  height: 28px;
}

.top-nav__product-name {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
}

.top-nav__session-title {
  font-size: 14px;
  color: #909399;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-left: 8px;
  padding-left: 12px;
  border-left: 1px solid #e4e7ed;
}

.top-nav__menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.top-nav__menu .el-menu {
  border-bottom: none;
}

.top-nav__right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.top-nav__disclaimer {
  font-size: 12px;
  color: #909399;
  white-space: nowrap;
}

.top-nav__user {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}

.top-nav__user-name {
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
}

.top-nav__mobile-toggle {
  display: none;
  font-size: 20px;
  color: #606266;
}

.top-nav__mobile-menu {
  display: none;
  background: #ffffff;
  border-bottom: 1px solid #e4e7ed;
}

/* 响应式：移动端折叠 */
@media (max-width: 768px) {
  .top-nav__menu,
  .top-nav__disclaimer,
  .top-nav__user-name {
    display: none;
  }

  .top-nav__mobile-toggle {
    display: inline-flex;
  }

  .top-nav__mobile-menu {
    display: block;
  }

  .top-nav__session-title {
    max-width: 120px;
  }
}

/* 移动端菜单展开动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
