import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import TopNav from '@/pages/Workbench/TopNav.vue'
import { useUserStore } from '@/stores/user'
import { useChatStore } from '@/stores/chat'

// Mock Element Plus icons
vi.mock('@element-plus/icons-vue', () => ({
  Fold: { name: 'Fold', render: () => null },
  Expand: { name: 'Expand', render: () => null },
  Menu: { name: 'Menu', render: () => null },
  Close: { name: 'Close', render: () => null }
}))

describe('TopNav.vue', () => {
  let pinia: Pinia

  beforeEach(() => {
    // 同一个 pinia 实例同时提供给测试代码和组件挂载，
    // 避免测试操作与组件读取处于不同 store 实例
    pinia = createPinia()
    setActivePinia(pinia)
    localStorage.clear()
  })

  /** 组件与测试共用同一个 pinia 实例 */
  function mountTopNav() {
    return mount(TopNav, { global: { plugins: [pinia] } })
  }

  describe('会话标题', () => {
    it('无历史消息时显示"新对话"', () => {
      const wrapper = mountTopNav()
      const titleEl = wrapper.find('.top-nav__session-title')
      expect(titleEl.text()).toBe('新对话')
    })

    it('有历史消息时显示首条用户消息内容', () => {
      const chatStore = useChatStore()
      chatStore.addMessage({
        id: '1',
        role: 'user',
        content: '帮我翻译一下这个合同',
        created_at: '2026-09-17T10:00:00Z'
      })
      const wrapper = mountTopNav()
      const titleEl = wrapper.find('.top-nav__session-title')
      expect(titleEl.text()).toBe('帮我翻译一下这个合同')
    })

    it('首条用户消息超过20字时截断加省略号', () => {
      const longText = '这是一段超过二十个字的测试消息内容用于验证截断逻辑是否正常工作'
      const chatStore = useChatStore()
      chatStore.addMessage({
        id: '1',
        role: 'user',
        content: longText,
        created_at: '2026-09-17T10:00:00Z'
      })
      const wrapper = mountTopNav()
      const titleEl = wrapper.find('.top-nav__session-title')
      expect(titleEl.text()).toBe(longText.slice(0, 20) + '…')
    })

    it('首条用户消息为空文本（仅文件）时显示"文件对话"', () => {
      const chatStore = useChatStore()
      chatStore.addMessage({
        id: '1',
        role: 'user',
        content: '',
        created_at: '2026-09-17T10:00:00Z'
      })
      const wrapper = mountTopNav()
      const titleEl = wrapper.find('.top-nav__session-title')
      expect(titleEl.text()).toBe('文件对话')
    })
  })

  describe('免责声明', () => {
    it('始终显示"内容由AI生成，仅供参考"', () => {
      const wrapper = mountTopNav()
      const disclaimer = wrapper.find('.top-nav__disclaimer')
      expect(disclaimer.exists()).toBe(true)
      expect(disclaimer.text()).toBe('内容由AI生成，仅供参考')
    })
  })

  describe('侧边栏开关', () => {
    it('点击开关切换侧边栏折叠状态', async () => {
      const userStore = useUserStore()
      const wrapper = mountTopNav()
      const toggleBtn = wrapper.find('.top-nav__sidebar-toggle')
      const initialCollapsed = userStore.sidebarCollapsed
      await toggleBtn.trigger('click')
      expect(userStore.sidebarCollapsed).toBe(!initialCollapsed)
      await toggleBtn.trigger('click')
      expect(userStore.sidebarCollapsed).toBe(initialCollapsed)
    })

    it('折叠状态持久化到 localStorage 且与 store 状态一致', async () => {
      const userStore = useUserStore()
      const wrapper = mountTopNav()
      const toggleBtn = wrapper.find('.top-nav__sidebar-toggle')
      await toggleBtn.trigger('click')
      // 精确断言持久化值与 store 当前状态一致，避免 'false' 字符串恒真
      expect(localStorage.getItem('sidebar_collapsed')).toBe(
        String(userStore.sidebarCollapsed)
      )
    })
  })

  describe('导航菜单', () => {
    it('包含四个导航项', () => {
      const wrapper = mountTopNav()
      const menuItems = wrapper.findAll('.top-nav__menu .el-menu-item')
      expect(menuItems).toHaveLength(4)
      expect(menuItems[0].text()).toBe('工作台')
      expect(menuItems[1].text()).toBe('应用中心')
      expect(menuItems[2].text()).toBe('数据看板')
      expect(menuItems[3].text()).toBe('个人中心')
    })
  })

  describe('用户区域', () => {
    it('未登录时显示"未登录"', () => {
      const wrapper = mountTopNav()
      const userName = wrapper.find('.top-nav__user-name')
      expect(userName.text()).toBe('未登录')
    })

    it('已登录时显示用户名', () => {
      const userStore = useUserStore()
      userStore.setUserInfo({
        id: 'u_123',
        name: '张三',
        avatar: '',
        email: 'zhangsan@ua.com'
      })
      const wrapper = mountTopNav()
      const userName = wrapper.find('.top-nav__user-name')
      expect(userName.text()).toBe('张三')
    })
  })

  describe('Logo 和产品名称', () => {
    it('显示产品名称"UA超级入口"', () => {
      const wrapper = mountTopNav()
      const productName = wrapper.find('.top-nav__product-name')
      expect(productName.text()).toBe('UA超级入口')
    })
  })
})
