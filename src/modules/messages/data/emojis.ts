export interface Emoji {
  char: string
  name: string
}

export interface EmojiCategory {
  id: string
  label: string
  icon: string
  items: Emoji[]
}

const e = (char: string, name: string): Emoji => ({ char, name })

export const EMOJI_CATEGORIES: EmojiCategory[] = [
  {
    id: 'smileys',
    label: 'Smileys',
    icon: '😀',
    items: [
      e('😀', 'grinning face smile happy'), e('😃', 'smiley big eyes happy'), e('😄', 'smile laugh happy'),
      e('😁', 'beaming grin'), e('😆', 'laughing squint'), e('😅', 'sweat smile relief'),
      e('😂', 'joy tears laugh lol'), e('🤣', 'rolling floor laughing rofl'), e('🙂', 'slight smile'),
      e('😉', 'wink'), e('😊', 'blush smile warm'), e('😇', 'angel innocent halo'),
      e('🥰', 'love smiling hearts'), e('😍', 'heart eyes love'), e('🤩', 'star struck wow'),
      e('😘', 'kiss blowing'), e('😋', 'yum tasty tongue'), e('😛', 'tongue out'),
      e('😜', 'wink tongue crazy'), e('🤪', 'zany goofy crazy'), e('🤔', 'thinking hmm'),
      e('🤗', 'hug hugging'), e('🤭', 'giggle hand over mouth'), e('🤫', 'shush quiet secret'),
      e('😐', 'neutral face'), e('😑', 'expressionless'), e('😶', 'no mouth speechless'),
      e('😏', 'smirk'), e('🙄', 'eye roll'), e('😬', 'grimace awkward'),
      e('😌', 'relieved calm'), e('😔', 'pensive sad'), e('😴', 'sleeping zzz tired'),
      e('🥱', 'yawn bored'), e('😷', 'mask sick'), e('🤒', 'thermometer sick fever'),
      e('🥵', 'hot face sweating'), e('🥶', 'cold freezing'), e('😎', 'cool sunglasses'),
      e('🤓', 'nerd glasses'), e('😕', 'confused'), e('😟', 'worried'),
      e('😮', 'open mouth surprised'), e('😲', 'astonished shocked'), e('😳', 'flushed embarrassed'),
      e('🥺', 'pleading puppy eyes'), e('😢', 'cry sad tear'), e('😭', 'sob loudly crying'),
      e('😱', 'scream fear shocked'), e('😖', 'confounded'), e('😞', 'disappointed'),
      e('😤', 'huff triumph steam'), e('😡', 'angry mad red'), e('🤬', 'cursing swearing angry'),
      e('😈', 'devil smiling imp'), e('💀', 'skull dead'), e('🤡', 'clown'),
      e('👻', 'ghost boo'), e('🤖', 'robot'), e('💩', 'poop'),
    ],
  },
  {
    id: 'gestures',
    label: 'People',
    icon: '👍',
    items: [
      e('👍', 'thumbs up like yes ok'), e('👎', 'thumbs down dislike no'), e('👌', 'ok hand perfect'),
      e('✌️', 'victory peace'), e('🤞', 'crossed fingers luck hope'), e('🤟', 'love you gesture'),
      e('🤘', 'rock on horns'), e('👈', 'point left'), e('👉', 'point right'),
      e('👆', 'point up'), e('👇', 'point down'), e('☝️', 'index up'),
      e('✋', 'raised hand stop'), e('🤚', 'raised back hand'), e('🖐️', 'hand fingers splayed'),
      e('👋', 'wave hello bye'), e('🤙', 'call me shaka'), e('💪', 'muscle strong flex'),
      e('🙏', 'pray thanks please folded hands'), e('👏', 'clap applause bravo'), e('🙌', 'raising hands celebrate hooray'),
      e('🤝', 'handshake deal'), e('✍️', 'writing hand'), e('💅', 'nail polish'),
      e('👀', 'eyes look'), e('👂', 'ear listen'), e('👃', 'nose smell'),
      e('🧠', 'brain smart'), e('🫶', 'heart hands love'), e('🤷', 'shrug dont know'),
      e('🤦', 'facepalm'), e('🙋', 'raising hand question'), e('🙇', 'bow sorry thanks'),
      e('💃', 'dancer dance'), e('🕺', 'man dancing'), e('🚶', 'walking'),
      e('🏃', 'running'), e('👶', 'baby'), e('🧑', 'person'),
      e('👨', 'man'), e('👩', 'woman'), e('🧓', 'older person'),
    ],
  },
  {
    id: 'hearts',
    label: 'Hearts',
    icon: '❤️',
    items: [
      e('❤️', 'red heart love'), e('🧡', 'orange heart'), e('💛', 'yellow heart'),
      e('💚', 'green heart'), e('💙', 'blue heart'), e('💜', 'purple heart'),
      e('🖤', 'black heart'), e('🤍', 'white heart'), e('🤎', 'brown heart'),
      e('💔', 'broken heart'), e('❣️', 'heart exclamation'), e('💕', 'two hearts'),
      e('💞', 'revolving hearts'), e('💓', 'beating heart'), e('💗', 'growing heart'),
      e('💖', 'sparkling heart'), e('💘', 'heart arrow cupid'), e('💝', 'heart gift ribbon'),
      e('💋', 'kiss mark lips'), e('💯', 'hundred perfect score'), e('✨', 'sparkles shine'),
      e('⭐', 'star'), e('🌟', 'glowing star'), e('💫', 'dizzy star'),
      e('🔥', 'fire hot lit'), e('💥', 'boom collision'), e('💢', 'anger symbol'),
      e('💤', 'zzz sleep'), e('💬', 'speech bubble chat'), e('💭', 'thought bubble'),
    ],
  },
  {
    id: 'nature',
    label: 'Nature',
    icon: '🐶',
    items: [
      e('🐶', 'dog puppy'), e('🐱', 'cat kitten'), e('🐭', 'mouse'),
      e('🐹', 'hamster'), e('🐰', 'rabbit bunny'), e('🦊', 'fox'),
      e('🐻', 'bear'), e('🐼', 'panda'), e('🐨', 'koala'),
      e('🐯', 'tiger'), e('🦁', 'lion'), e('🐮', 'cow'),
      e('🐷', 'pig'), e('🐸', 'frog'), e('🐵', 'monkey'),
      e('🙈', 'see no evil monkey'), e('🐔', 'chicken'), e('🐧', 'penguin'),
      e('🐦', 'bird'), e('🦉', 'owl'), e('🦋', 'butterfly'),
      e('🐝', 'bee'), e('🐢', 'turtle'), e('🐙', 'octopus'),
      e('🐬', 'dolphin'), e('🐳', 'whale'), e('🦄', 'unicorn'),
      e('🌸', 'cherry blossom flower'), e('🌹', 'rose'), e('🌻', 'sunflower'),
      e('🌲', 'evergreen tree'), e('🌴', 'palm tree'), e('🍀', 'four leaf clover luck'),
      e('🌈', 'rainbow'), e('☀️', 'sun'), e('🌙', 'moon crescent'),
      e('⛅', 'sun behind cloud'), e('🌧️', 'rain cloud'), e('⚡', 'lightning bolt'),
      e('❄️', 'snowflake'), e('🌊', 'wave ocean'),
    ],
  },
  {
    id: 'food',
    label: 'Food',
    icon: '🍕',
    items: [
      e('🍎', 'red apple'), e('🍌', 'banana'), e('🍉', 'watermelon'),
      e('🍇', 'grapes'), e('🍓', 'strawberry'), e('🍒', 'cherries'),
      e('🍑', 'peach'), e('🥭', 'mango'), e('🍍', 'pineapple'),
      e('🥑', 'avocado'), e('🌽', 'corn'), e('🥕', 'carrot'),
      e('🍞', 'bread'), e('🧀', 'cheese'), e('🍳', 'cooking egg fried'),
      e('🥞', 'pancakes'), e('🍔', 'hamburger burger'), e('🍟', 'french fries'),
      e('🌭', 'hot dog'), e('🍕', 'pizza'), e('🌮', 'taco'),
      e('🌯', 'burrito'), e('🍜', 'noodles ramen'), e('🍣', 'sushi'),
      e('🍚', 'rice'), e('🍰', 'cake slice'), e('🎂', 'birthday cake'),
      e('🍩', 'donut'), e('🍪', 'cookie'), e('🍫', 'chocolate'),
      e('🍦', 'ice cream'), e('☕', 'coffee hot beverage'), e('🍵', 'tea'),
      e('🧋', 'bubble tea boba'), e('🍺', 'beer'), e('🍷', 'wine'),
      e('🥂', 'cheers clinking glasses'), e('🥤', 'cup with straw soda'),
    ],
  },
  {
    id: 'activities',
    label: 'Activity',
    icon: '⚽',
    items: [
      e('⚽', 'soccer football'), e('🏀', 'basketball'), e('🏈', 'american football'),
      e('⚾', 'baseball'), e('🎾', 'tennis'), e('🏐', 'volleyball'),
      e('🏓', 'ping pong'), e('🏸', 'badminton'), e('🥊', 'boxing glove'),
      e('🎯', 'direct hit target'), e('🎮', 'video game controller'), e('🎲', 'game die dice'),
      e('🧩', 'puzzle piece'), e('🎸', 'guitar'), e('🎹', 'piano keyboard'),
      e('🎤', 'microphone sing'), e('🎧', 'headphones music'), e('🎬', 'clapper movie'),
      e('🎨', 'artist palette art'), e('📚', 'books study'), e('🏆', 'trophy winner'),
      e('🥇', 'gold medal first'), e('🎉', 'party popper celebrate'), e('🎊', 'confetti ball'),
      e('🎁', 'gift present'), e('🎈', 'balloon'), e('🧗', 'climbing'),
      e('🚴', 'cycling bike'), e('🏊', 'swimming'), e('⛰️', 'mountain hike'),
    ],
  },
  {
    id: 'objects',
    label: 'Objects',
    icon: '💡',
    items: [
      e('📱', 'mobile phone'), e('💻', 'laptop computer'), e('⌨️', 'keyboard'),
      e('🖥️', 'desktop computer'), e('📷', 'camera'), e('📸', 'camera flash'),
      e('🔋', 'battery'), e('🔌', 'electric plug'), e('💡', 'light bulb idea'),
      e('🔦', 'flashlight'), e('📎', 'paperclip'), e('📌', 'pushpin'),
      e('✏️', 'pencil'), e('📝', 'memo note write'), e('📅', 'calendar date'),
      e('📊', 'bar chart'), e('📈', 'chart increasing growth'), e('📧', 'email envelope'),
      e('📦', 'package box'), e('🔑', 'key'), e('🔒', 'locked'),
      e('🔓', 'unlocked'), e('🔔', 'bell notification'), e('🔕', 'bell muted'),
      e('⏰', 'alarm clock'), e('⌛', 'hourglass'), e('💰', 'money bag'),
      e('💳', 'credit card'), e('🛒', 'shopping cart'), e('🚗', 'car'),
      e('🚌', 'bus'), e('🚲', 'bicycle'), e('✈️', 'airplane'),
      e('🚀', 'rocket launch'), e('🏠', 'house home'), e('🏢', 'office building'),
    ],
  },
  {
    id: 'symbols',
    label: 'Symbols',
    icon: '✅',
    items: [
      e('✅', 'check mark done yes'), e('❌', 'cross mark no'), e('❗', 'exclamation'),
      e('❓', 'question'), e('‼️', 'double exclamation'), e('⚠️', 'warning'),
      e('🚫', 'prohibited'), e('⭕', 'circle'), e('➕', 'plus'),
      e('➖', 'minus'), e('➡️', 'right arrow'), e('⬅️', 'left arrow'),
      e('⬆️', 'up arrow'), e('⬇️', 'down arrow'), e('🔄', 'refresh counterclockwise'),
      e('🔁', 'repeat'), e('▶️', 'play'), e('⏸️', 'pause'),
      e('🔴', 'red circle'), e('🟡', 'yellow circle'), e('🟢', 'green circle'),
      e('🔵', 'blue circle'), e('🟣', 'purple circle'), e('⚪', 'white circle'),
      e('🆗', 'ok button'), e('🆕', 'new'), e('🔝', 'top'),
      e('💲', 'dollar sign'), e('♻️', 'recycle'), e('🏁', 'chequered flag finish'),
    ],
  },
]

export const ALL_EMOJIS: Emoji[] = EMOJI_CATEGORIES.flatMap((category) => category.items)

export function searchEmojis(query: string, pool: Emoji[] = ALL_EMOJIS): Emoji[] {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []
  return pool.filter((emoji) => terms.every((term) => emoji.name.includes(term)))
}
