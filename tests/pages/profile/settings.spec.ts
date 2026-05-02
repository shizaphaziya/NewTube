import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Settings from '../../../app/pages/profile/settings.vue'
import { ref, watchEffect } from 'vue'

global.ref = ref
global.watchEffect = watchEffect


// Create spy functions for console and alert
const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
if (typeof window !== 'undefined') window.alert = vi.fn();
else global.alert = vi.fn();
const alertSpy = vi.spyOn(typeof window !== 'undefined' ? window : global, 'alert');

// Mock Supabase
const mockUpload = vi.fn()
const mockGetPublicUrl = vi.fn()
const mockUpdate = vi.fn()
const mockEq = vi.fn()
const mockFrom = vi.fn()

const supabaseMock = {
  storage: {
    from: vi.fn(() => ({
      upload: mockUpload,
      getPublicUrl: mockGetPublicUrl
    }))
  },
  from: vi.fn(() => ({
    update: mockUpdate
  }))
}

// Mock composables
vi.mock('#imports', () => ({
  useSupabaseClient: () => supabaseMock,
  useSupabaseUser: () => ref({ id: 'user-123', email: 'test@test.com' }),
  useI18n: () => ({ t: (key) => key }),
  useProfile: () => ({ profile: ref({ display_name: 'Test', avatar_url: 'http://test.com' }), refresh: vi.fn() }),
  useToast: () => ({ add: vi.fn() }),
  useConfirm: () => ({ confirm: vi.fn() }),
  useSeoMeta: vi.fn()
}))

// We also need to mock useI18n, useProfile etc that Nuxt auto-imports
// Normally in Nuxt we can use @nuxt/test-utils, but we are doing a simpler setup here.
// Let's create a stub components environment or provide global mocks.

describe('settings.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdate.mockReturnValue({ eq: mockEq })
    mockEq.mockResolvedValue({ error: null })
  })

  it('handles avatar upload error correctly', async () => {
    // Setup mock to fail
    const mockError = new Error('Upload failed')
    mockUpload.mockResolvedValue({ error: mockError })

    // We have to mock auto-imports globally
    global.useSupabaseClient = () => supabaseMock
    global.useSupabaseUser = () => ref({ id: 'user-123', email: 'test@test.com' })
    global.useI18n = () => ({ t: (key) => key })
    global.useProfile = () => ({ profile: ref({ display_name: 'Test', avatar_url: 'http://test.com' }), refresh: vi.fn() })
    global.useToast = () => ({ add: vi.fn() })
    global.useConfirm = () => ({ confirm: vi.fn() })
    global.useSeoMeta = vi.fn()

    const wrapper = mount(Settings, {
      global: {
        stubs: {
          NuxtLink: true,
          Icon: true,
          Transition: false
        }
      }
    })

    // Find the file input
    const fileInput = wrapper.find('input[type="file"]')
    expect(fileInput.exists()).toBe(true)

    // Trigger change event with a mock file
    const file = new File(['dummy content'], 'avatar.png', { type: 'image/png' })

    // In Happy-DOM we need to mock files property
    Object.defineProperty(fileInput.element, 'files', {
      value: [file]
    })

    // Trigger the upload
    await fileInput.trigger('change')

    // Since upload is async, we need to wait for all promises to resolve
    await new Promise(resolve => setTimeout(resolve, 0))

    // Verify it attempted to upload
    expect(mockUpload).toHaveBeenCalledWith(
      expect.stringMatching(/^user-123-.*\.png$/),
      file,
      { upsert: true }
    )

    // Verify error handling
    expect(consoleSpy).toHaveBeenCalledWith('Avatar update failed:', 'Upload failed')
    expect(alertSpy).toHaveBeenCalledWith('Failed to update avatar: Upload failed')

    // Verify loading state is reset
    const uploadBtn = wrapper.find('button[type="button"]')
    expect(uploadBtn.attributes('disabled')).toBeUndefined()
    expect(wrapper.vm.loading).toBe(false)
  })
})
