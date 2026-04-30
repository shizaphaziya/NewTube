import { describe, it, expect, vi, beforeEach } from 'vitest'

const navigateToMock = vi.fn()
// @ts-ignore
globalThis.navigateTo = navigateToMock
// @ts-ignore
globalThis.defineNuxtRouteMiddleware = (fn) => fn

const fetchProfileMock = vi.fn()
const useProfileMock = vi.fn()
// @ts-ignore
globalThis.useProfile = useProfileMock

const adminMiddleware = (await import('./admin.ts')).default

describe('admin middleware', () => {
  beforeEach(() => {
    navigateToMock.mockClear()
    fetchProfileMock.mockClear()
    useProfileMock.mockClear()
  })

  it('should fetch profile if profile is not loaded', async () => {
    useProfileMock.mockReturnValue({
      profile: { value: null },
      fetchProfile: fetchProfileMock,
      isAdmin: { value: true }
    })

    await adminMiddleware('to', 'from')

    expect(useProfileMock).toHaveBeenCalled()
    expect(fetchProfileMock).toHaveBeenCalled()
    expect(navigateToMock).not.toHaveBeenCalled()
  })

  it('should redirect to / if not admin (profile loaded)', async () => {
    useProfileMock.mockReturnValue({
      profile: { value: { id: 1 } },
      fetchProfile: fetchProfileMock,
      isAdmin: { value: false }
    })

    await adminMiddleware('to', 'from')

    expect(fetchProfileMock).not.toHaveBeenCalled()
    expect(navigateToMock).toHaveBeenCalledWith('/')
  })

  it('should fetch profile and redirect if not admin', async () => {
    useProfileMock.mockReturnValue({
      profile: { value: null },
      fetchProfile: fetchProfileMock,
      isAdmin: { value: false }
    })

    await adminMiddleware('to', 'from')

    expect(fetchProfileMock).toHaveBeenCalled()
    expect(navigateToMock).toHaveBeenCalledWith('/')
  })

  it('should not redirect if admin', async () => {
    useProfileMock.mockReturnValue({
      profile: { value: { id: 1 } },
      fetchProfile: fetchProfileMock,
      isAdmin: { value: true }
    })

    await adminMiddleware('to', 'from')

    expect(fetchProfileMock).not.toHaveBeenCalled()
    expect(navigateToMock).not.toHaveBeenCalled()
  })
})
