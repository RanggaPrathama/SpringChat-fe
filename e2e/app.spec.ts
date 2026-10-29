import { expect, type Page, test } from '@playwright/test'

const DEMO_EMAIL = 'demo@springchat.dev'
const DEMO_PASSWORD = 'password123'

async function login(page: Page, password = DEMO_PASSWORD) {
  await page.goto('/login')
  await page.getByLabel('Email').fill(DEMO_EMAIL)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
}

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(0)
}

test('guests are redirected from /chats to /login', async ({ page }) => {
  await page.goto('/chats')
  await expect(page).toHaveURL(/\/login$/)
})

test('landing page links to register and login', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Start chatting')
  await page.getByRole('main').getByRole('link', { name: 'Get started' }).click()
  await expect(page).toHaveURL(/\/register$/)
})

test('register creates an account and lands on the chat dashboard', async ({ page }) => {
  const suffix = Date.now().toString(36)
  await page.goto('/register')
  await page.getByLabel('Username').fill(`user.${suffix}`)
  await page.getByLabel('Email').fill(`user.${suffix}@example.com`)
  await page.getByLabel('Password').fill('longenough1')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/chats$/)
  await expect(page.getByRole('heading', { name: 'Chats' })).toBeVisible()
  await expect(page.getByText('No conversations yet')).toBeVisible()
})

test('register shows field validation errors', async ({ page }) => {
  await page.goto('/register')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(page.getByText('Username must be at least 3 characters.')).toBeVisible()
  await expect(page.getByText('Password must be at least 8 characters.')).toBeVisible()
})

test('wrong password shows a neutral error', async ({ page }) => {
  await login(page, 'wrong-password')
  await expect(page.getByRole('alert')).toHaveText('Email or password is incorrect.')
  await expect(page).toHaveURL(/\/login$/)
})

test('login, open a chat, then log out back to the landing page', async ({ page }) => {
  await login(page)
  await expect(page).toHaveURL(/\/chats$/)
  await page.getByRole('link', { name: /Ava Chen/ }).click()
  await expect(page).toHaveURL(/\/chats\/101$/)

  await page.getByRole('button', { name: 'Log out' }).click()
  await expect(page).toHaveURL(/\/$/)
  await page.goto('/chats')
  await expect(page).toHaveURL(/\/login$/)
})

async function openAvaChat(page: Page) {
  await login(page)
  await page.getByRole('link', { name: /Ava Chen/ }).click()
  await expect(page.getByRole('log')).toBeVisible()
  await expect(page.getByRole('log').locator('time').first()).toBeVisible()
}

const timeCount = (page: Page) => page.getByRole('log').locator('time').count()

test('send a message with Enter, then receive the mock reply', async ({ page }) => {
  await openAvaChat(page)
  const before = await timeCount(page)

  const input = page.getByRole('textbox', { name: 'Message' })
  await input.fill('Hello from e2e')
  await input.press('Enter')

  await expect(page.getByRole('log').getByText('Hello from e2e')).toBeVisible()
  await expect(input).toHaveValue('')
  await expect.poll(() => timeCount(page)).toBe(before + 1)
  await expect.poll(() => timeCount(page), { timeout: 15_000 }).toBe(before + 2)
})

test('pick an emoji from the picker and send it', async ({ page }) => {
  await openAvaChat(page)
  const input = page.getByRole('textbox', { name: 'Message' })
  await input.fill('love it ')

  await page.getByRole('button', { name: 'Insert emoji' }).click()
  const picker = page.getByRole('dialog')
  await picker.getByLabel('Search emoji').fill('red heart')
  await picker.getByRole('button', { name: /red heart/ }).click()
  await page.keyboard.press('Escape')

  await expect(input).toHaveValue('love it ❤️')
  await input.press('Enter')
  await expect(page.getByRole('log').getByText('love it ❤️')).toBeVisible()

  await page.getByRole('button', { name: 'Insert emoji' }).click()
  await expect(
    page.getByRole('dialog').getByRole('button', { name: 'Recent', exact: true }),
  ).toBeVisible()
})

test('Shift+Enter inserts a newline instead of sending', async ({ page }) => {
  await openAvaChat(page)
  const input = page.getByRole('textbox', { name: 'Message' })
  await input.fill('line one')
  await input.press('Shift+Enter')
  await input.type('line two')
  await expect(input).toHaveValue('line one\nline two')
})

test('a failed message offers retry and is not duplicated', async ({ page }) => {
  await openAvaChat(page)
  const input = page.getByRole('textbox', { name: 'Message' })
  await input.fill('[fail] please retry')
  await input.press('Enter')

  await expect(page.getByText('Message not sent.')).toBeVisible()
  await page.getByRole('button', { name: 'Retry' }).click()
  await expect(page.getByText('Message not sent.')).toBeHidden()
  await expect(page.getByRole('log').getByText('[fail] please retry')).toHaveCount(1)
})

test('scrolling to the top loads older history and keeps the scroll position', async ({ page }) => {
  await openAvaChat(page)
  const log = page.getByRole('log')
  const before = await timeCount(page)

  await log.evaluate((el) => el.scrollTo(0, 0))
  await expect.poll(() => timeCount(page)).toBeGreaterThan(before)
  await expect.poll(() => log.evaluate((el) => el.scrollTop)).toBeGreaterThan(100)
})

test('start a direct chat from the New conversation dialog', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: 'New message' }).click()
  await page.getByLabel('Search people').fill('Mina')
  await page.getByRole('button', { name: /Mina Park/ }).click()
  await expect(page).toHaveURL(/\/chats\/\d+$/)
  await expect(page.getByRole('heading', { name: 'Mina Park' })).toBeVisible()
})

test('create a group chat with validation', async ({ page }) => {
  await login(page)
  await page.getByRole('button', { name: 'New message' }).click()
  await page.getByRole('button', { name: 'New group' }).click()

  await page.getByRole('button', { name: 'Create group' }).click()
  await expect(page.getByText('Give your group a name.')).toBeVisible()

  await page.getByLabel('Group name').fill('QA Crew')
  await page.getByRole('button', { name: /Priya Kapoor/ }).click()
  await page.getByRole('button', { name: /Theo Baptiste/ }).click()
  await page.screenshot({ path: 'test-results/shots/group-dialog.png' })
  await page.getByRole('button', { name: 'Create group' }).click()

  await expect(page.getByRole('heading', { name: 'QA Crew' })).toBeVisible()
  await expect(page.getByText('3 members')).toBeVisible()
  await page.screenshot({ path: 'test-results/shots/group-chat.png' })
})

test('conversation details lists members', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: /Weekend Hiking/ }).click()
  await page.getByRole('button', { name: 'Conversation details' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('list', { name: 'Members' }).getByRole('listitem')).toHaveCount(4)
})

test('a conversation the user cannot open shows a safe error', async ({ page }) => {
  await login(page)
  await expect(page.getByRole('heading', { name: 'Chats' })).toBeVisible()
  await page.evaluate(() => {
    window.history.pushState({}, '', '/chats/999')
    window.dispatchEvent(new PopStateEvent('popstate'))
  })
  await expect(page.getByText('Conversation unavailable')).toBeVisible()
})

test('edit the profile and see the new name in the inbox', async ({ page }) => {
  await login(page)
  await page.getByRole('link', { name: /Jordan Lee/ }).click()
  await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible()

  await page.getByLabel('Display name').fill('')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Display name is required.')).toBeVisible()

  await page.getByLabel('Display name').fill('Jordan Q. Lee')
  await page.getByLabel('Avatar image URL').fill('not a url')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByText('Enter a valid http(s) image URL.')).toBeVisible()

  await page.getByLabel('Avatar image URL').fill('')
  await page.getByRole('button', { name: 'Save changes' }).click()
  await expect(page.getByRole('status')).toHaveText('Profile saved.')

  await page.getByRole('link', { name: 'Back to chats' }).click()
  await expect(page.getByText('Jordan Q. Lee')).toBeVisible()
})

test.describe('settings shell (desktop)', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('opens from the inbox footer with a full-bleed two-pane layout', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /Jordan Lee/ }).click()
    await expect(page).toHaveURL(/\/settings\/profile$/)

    const menu = page.getByRole('navigation', { name: 'Settings sections' })
    for (const label of [
      'Profile',
      'Account',
      'About & help',
      'Notifications',
      'Privacy',
      'Chat settings',
    ]) {
      await expect(menu.getByRole('link', { name: new RegExp(label) })).toBeVisible()
    }
    await expect(menu.getByText('soon')).toHaveCount(3)
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible()
    await expect(menu.getByRole('link', { name: /Profile/ })).toHaveAttribute(
      'aria-current',
      'page',
    )

    const aside = await page.getByRole('complementary', { name: 'Settings menu' }).boundingBox()
    const pane = await page.getByRole('main').boundingBox()
    expect(aside?.x).toBe(0)
    expect((pane?.x ?? 0) + (pane?.width ?? 0)).toBe(1440)
    await page.screenshot({ path: 'test-results/shots/settings-profile-1440.png' })
  })

  test('account pane shows details and logs out to the landing page', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /Jordan Lee/ }).click()
    await page
      .getByRole('navigation', { name: 'Settings sections' })
      .getByRole('link', { name: /Account/ })
      .click()

    await expect(page).toHaveURL(/\/settings\/account$/)
    await expect(page.getByRole('heading', { name: 'Account', exact: true })).toBeVisible()
    await expect(page.getByText('@demo', { exact: true }).last()).toBeVisible()

    await page.getByRole('button', { name: 'Log out' }).click()
    await expect(page).toHaveURL(/\/$/)
    await page.goto('/settings/profile')
    await expect(page).toHaveURL(/\/login$/)
  })

  test('about pane lists real shortcuts and the developer contact', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /Jordan Lee/ }).click()
    await page
      .getByRole('navigation', { name: 'Settings sections' })
      .getByRole('link', { name: /About & help/ })
      .click()

    await expect(page.getByRole('heading', { name: 'About SpringChat' })).toBeVisible()
    await expect(page.getByText('Shift + Enter')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Email Rangga Prathama' })).toHaveAttribute(
      'href',
      'mailto:developer@gmail.com',
    )
    await page.screenshot({ path: 'test-results/shots/settings-about-1440.png' })
  })

  test('search filters sections and coming soon rows open a placeholder', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /Jordan Lee/ }).click()
    const menu = page.getByRole('navigation', { name: 'Settings sections' })

    await page.getByLabel('Search settings').fill('acc')
    await expect(menu.getByRole('listitem')).toHaveCount(1)
    await expect(menu.getByRole('link', { name: /Account/ })).toBeVisible()
    await page.getByLabel('Search settings').fill('zzzz')
    await expect(page.getByText('No settings found')).toBeVisible()
    await page.getByLabel('Search settings').fill('')

    await menu.getByRole('link', { name: /Privacy/ }).click()
    await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible()
    await expect(page.getByText('Coming soon', { exact: true })).toBeVisible()
    await page.screenshot({ path: 'test-results/shots/settings-soon-1440.png' })
  })
})

test.describe('settings shell (mobile 375px)', () => {
  test.use({ viewport: { width: 375, height: 700 } })

  test('shows the list first, then one section with a back arrow', async ({ page }) => {
    await login(page)
    await page.getByRole('link', { name: /Jordan Lee/ }).click()
    await expect(page).toHaveURL(/\/settings\/profile$/)

    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Settings sections' })).toBeHidden()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: 'test-results/shots/settings-profile-375.png' })

    await page.getByRole('link', { name: 'Settings' }).click()
    await expect(page).toHaveURL(/\/settings$/)
    await expect(page.getByRole('navigation', { name: 'Settings sections' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Your profile' })).toBeHidden()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: 'test-results/shots/settings-list-375.png' })
  })
})

test.describe('landing navbar and footer', () => {
  test.use({ viewport: { width: 1280, height: 720 } })

  test('navbar is sticky and widens from a pill to full width on scroll', async ({ page }) => {
    await page.goto('/')
    const bar = page.getByTestId('landing-bar')
    await expect(bar).toBeVisible()
    await expect.poll(async () => (await bar.boundingBox())?.width ?? 0).toBeLessThan(1100)
    await page.screenshot({ path: 'test-results/shots/nav-pill.png' })

    await page.evaluate(() => window.scrollTo(0, 1500))
    const header = page.getByRole('banner')
    await expect.poll(async () => (await header.boundingBox())?.y).toBe(0)
    await expect
      .poll(async () => (await bar.boundingBox())?.width ?? 0)
      .toBeGreaterThanOrEqual(1260)
    await page.screenshot({ path: 'test-results/shots/nav-full.png' })

    await page.evaluate(() => window.scrollTo(0, 0))
    await expect.poll(async () => (await bar.boundingBox())?.width ?? 0).toBeLessThan(1100)
  })

  test('footer shows the developer and a mailto link', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const card = page.locator('#developer')
    await expect(card.getByText('Rangga Prathama')).toBeVisible()
    await expect(card.getByRole('link', { name: 'Email Rangga Prathama' })).toHaveAttribute(
      'href',
      'mailto:developer@gmail.com',
    )
    await page.waitForTimeout(600)
    await page.screenshot({ path: 'test-results/shots/footer-1280.png' })
  })

  test('the Developer nav link scrolls to the developer card', async ({ page }) => {
    await page.goto('/')
    await page
      .getByRole('navigation', { name: 'Primary' })
      .getByRole('link', { name: 'Developer' })
      .click()
    await expect(page.locator('#developer')).toBeInViewport()
  })
})

test.describe('landing with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('still renders everything and navigates', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'How it works' })).toBeVisible()
    await page.getByRole('link', { name: 'Get started' }).first().click()
    await expect(page).toHaveURL(/\/register$/)
  })
})

test.describe('mobile 375px', () => {
  test.use({ viewport: { width: 375, height: 800 } })

  test('has no horizontal overflow and shows list or thread only', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: 'test-results/shots/landing-375.png', fullPage: true })

    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden()

    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: 'test-results/shots/login-375.png' })

    await login(page)
    await expect(page.getByRole('heading', { name: 'Chats' })).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: 'test-results/shots/chats-375.png' })

    await page.getByRole('link', { name: /Ava Chen/ }).click()
    await expect(page.getByRole('heading', { name: 'Chats' })).toBeHidden()
    await expect(page.getByRole('textbox', { name: 'Message' })).toBeVisible()
    await expect(page.getByRole('log').locator('time').first()).toBeVisible()
    await expectNoHorizontalOverflow(page)
    await page.screenshot({ path: 'test-results/shots/thread-375.png' })
  })
})

test.describe('mobile touch 360x640', () => {
  test.use({ viewport: { width: 360, height: 640 }, isMobile: true, hasTouch: true })

  test('composer stays inside the visible screen and the keyboard is not forced open', async ({
    page,
  }) => {
    await openAvaChat(page)
    const input = page.getByRole('textbox', { name: 'Message' })
    await expect(input).toBeVisible()

    const box = await input.boundingBox()
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThanOrEqual(640)
    const focused = await page.evaluate(() => document.activeElement?.id)
    expect(focused).not.toBe('message-input')

    // A shorter viewport (keyboard open) must still keep the composer on screen.
    await page.setViewportSize({ width: 360, height: 340 })
    const shrunk = await input.boundingBox()
    expect((shrunk?.y ?? 0) + (shrunk?.height ?? 0)).toBeLessThanOrEqual(340)
    await page.screenshot({ path: 'test-results/shots/mobile-keyboard.png' })
  })

  test('emoji picker fits the screen', async ({ page }) => {
    await openAvaChat(page)
    await page.getByRole('button', { name: 'Insert emoji' }).click()
    const picker = page.getByRole('dialog')
    await expect(picker).toBeVisible()
    const box = await picker.boundingBox()
    expect(box?.x).toBeGreaterThanOrEqual(0)
    expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(360)
    await page.screenshot({ path: 'test-results/shots/mobile-emoji.png' })
  })
})

test.describe('desktop 1440px', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('chat shell is full-bleed with no outer frame', async ({ page }) => {
    await openAvaChat(page)
    const sidebar = await page.getByRole('complementary', { name: 'Conversations' }).boundingBox()
    const thread = await page.getByRole('main').boundingBox()
    expect(sidebar?.x).toBe(0)
    expect(sidebar?.y).toBe(0)
    expect((thread?.x ?? 0) + (thread?.width ?? 0)).toBe(1440)
    expect(thread?.height).toBe(900)
  })

  test('shows the conversation list and the thread together', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await page.screenshot({ path: 'test-results/shots/landing-1440.png', fullPage: true })

    await login(page)
    await expect(page.getByText('Select a conversation')).toBeVisible()
    await page.screenshot({ path: 'test-results/shots/chats-1440.png' })

    await page.getByRole('link', { name: /Ava Chen/ }).click()
    await expect(page.getByRole('heading', { name: 'Chats' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ava Chen' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'Message' })).toBeVisible()
    await page.waitForTimeout(400)
    await page.screenshot({ path: 'test-results/shots/thread-1440.png' })
  })
})
