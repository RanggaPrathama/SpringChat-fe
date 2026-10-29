import { Client, type IMessage, type StompSubscription } from '@stomp/stompjs'

import { env } from '@/lib/env'

let client: Client | null = null

export function connectRealtime(): Client {
  if (client?.active) return client

  client = new Client({
    brokerURL: env.wsUrl,
    reconnectDelay: 2000,
    heartbeatIncoming: 10_000,
    heartbeatOutgoing: 10_000,
  })

  client.activate()
  return client
}

export function disconnectRealtime(): void {
  client?.deactivate()
  client = null
}

export function subscribe(
  destination: string,
  callback: (message: IMessage) => void,
): StompSubscription | undefined {
  return client?.subscribe(destination, callback)
}
