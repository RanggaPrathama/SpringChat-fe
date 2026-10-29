<script setup lang="ts">
import { Send, Smile } from 'lucide-vue-next'
import { computed, nextTick, onMounted, ref } from 'vue'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'

import { MAX_MESSAGE_LENGTH } from '../composables/useSendMessage'
import { useRecentEmojis } from '../composables/useRecentEmojis'
import EmojiPicker from './EmojiPicker.vue'

const props = defineProps<{ disabled?: boolean; sendFn: (text: string) => boolean }>()

const text = ref('')
const field = ref<InstanceType<typeof Textarea> | null>(null)
const emojiOpen = ref(false)
const { recent, add: addRecent } = useRecentEmojis()
const MAX_ROWS = 5

const trimmedLength = computed(() => text.value.trim().length)
const tooLong = computed(() => text.value.length > MAX_MESSAGE_LENGTH)
const canSend = computed(() => !props.disabled && trimmedLength.value > 0 && !tooLong.value)
const showCounter = computed(() => text.value.length > MAX_MESSAGE_LENGTH * 0.9)

const isTouch = () => window.matchMedia('(pointer: coarse)').matches

function el(): HTMLTextAreaElement | null {
  return (field.value?.$el as HTMLTextAreaElement | undefined) ?? null
}

function resize() {
  const node = el()
  if (!node) return
  node.style.height = 'auto'
  const lineHeight = parseFloat(getComputedStyle(node).lineHeight) || 24
  const max = lineHeight * MAX_ROWS + 20
  node.style.height = `${Math.min(node.scrollHeight, max)}px`
  node.style.overflowY = node.scrollHeight > max ? 'auto' : 'hidden'
}

function submit() {
  if (!canSend.value) return
  if (props.sendFn(text.value)) {
    text.value = ''
    nextTick(resize)
  }
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return
  // Touch keyboards keep Enter as a newline; the send button submits there.
  if (isTouch()) return
  event.preventDefault()
  submit()
}

function insertEmoji(char: string) {
  const node = el()
  const start = node?.selectionStart ?? text.value.length
  const end = node?.selectionEnd ?? start
  text.value = text.value.slice(0, start) + char + text.value.slice(end)
  addRecent(char)
  const caret = start + char.length
  nextTick(() => {
    resize()
    node?.setSelectionRange(caret, caret)
  })
}

function onPickerOpenFocus(event: Event) {
  // On touch devices focusing the search box would raise the keyboard over the picker.
  if (isTouch()) event.preventDefault()
}

function onPickerCloseFocus(event: Event) {
  event.preventDefault()
  if (!isTouch()) el()?.focus({ preventScroll: true })
}

onMounted(() => {
  // Do not auto-focus on touch: it would open the keyboard and cover the thread.
  if (!isTouch()) el()?.focus({ preventScroll: true })
})
</script>

<template>
  <form
    class="border-t-2 border-border bg-secondary-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:p-4"
    @submit.prevent="submit"
  >
    <div class="mx-auto flex w-full max-w-4xl items-end gap-2 sm:gap-3">
      <Popover v-model:open="emojiOpen">
        <PopoverTrigger as-child>
          <Button type="button" variant="neutral" size="icon-lg" aria-label="Insert emoji" :aria-expanded="emojiOpen">
            <Smile class="size-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent @open-auto-focus="onPickerOpenFocus" @close-auto-focus="onPickerCloseFocus">
          <EmojiPicker :recent="recent" @pick="insertEmoji" />
        </PopoverContent>
      </Popover>

      <div class="min-w-0 flex-1">
        <label for="message-input" class="sr-only">Message</label>
        <Textarea
          id="message-input"
          ref="field"
          v-model="text"
          rows="1"
          placeholder="Type a message"
          class="max-h-40 min-h-12 overflow-hidden"
          :aria-invalid="tooLong"
          aria-describedby="message-hint"
          @input="resize"
          @keydown="onKeydown"
        />
      </div>

      <Button type="submit" size="icon-lg" aria-label="Send message" :disabled="!canSend">
        <Send />
      </Button>
    </div>

    <p
      id="message-hint"
      class="mx-auto mt-1 w-full max-w-4xl text-xs font-medium"
      :class="[tooLong ? 'font-bold text-danger' : 'text-foreground/60', showCounter ? '' : 'hidden sm:block']"
    >
      <template v-if="showCounter">{{ text.length }} / {{ MAX_MESSAGE_LENGTH }}</template>
      <template v-else>Enter to send, Shift+Enter for a new line</template>
    </p>
  </form>
</template>
