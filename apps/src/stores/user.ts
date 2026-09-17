import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  name: string
  avatar: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo>({
    id: '',
    name: '',
    avatar: '',
    email: ''
  })

  const permissions = ref({
    can_config_agent: false,
    can_manage_asset: false
  })

  const isLoggedIn = computed(() => !!userInfo.value.id)

  /** 侧边栏折叠状态，持久化到 localStorage */
  const sidebarCollapsed = ref<boolean>(
    localStorage.getItem('sidebar_collapsed') === 'true'
  )

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  function setPermissions(perms: { can_config_agent: boolean; can_manage_asset: boolean }) {
    permissions.value = perms
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('sidebar_collapsed', String(sidebarCollapsed.value))
  }

  function logout() {
    userInfo.value = { id: '', name: '', avatar: '', email: '' }
    permissions.value = { can_config_agent: false, can_manage_asset: false }
  }

  return {
    userInfo,
    permissions,
    isLoggedIn,
    sidebarCollapsed,
    setUserInfo,
    setPermissions,
    toggleSidebar,
    logout
  }
})
