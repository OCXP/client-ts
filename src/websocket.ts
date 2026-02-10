/**
 * WebSocket service for OCXP real-time communication
 * Provides push notifications for job progress, sync events, etc.
 */

export type WebSocketMessageType =
  | 'job_progress'
  | 'repo_status'
  | 'notification'
  | 'sync_event'
  | 'prototype_sync_progress'
  | 'prototype_sync_complete'
  | 'kb_indexing_status';

export interface WebSocketMessage {
  type: WebSocketMessageType;
  [key: string]: unknown;
}

export interface JobProgressMessage extends WebSocketMessage {
  type: 'job_progress';
  job_id: string;
  status: string;
  progress: number;
  files_processed: number;
  total_files: number;
  error?: string;
}

export interface RepoStatusMessage extends WebSocketMessage {
  type: 'repo_status';
  repo_id: string;
  status: string;
  kb_synced: boolean;
  s3_path?: string;
  files_count?: number;
}

export interface NotificationMessage extends WebSocketMessage {
  type: 'notification';
  title: string;
  message: string;
  level: 'info' | 'warning' | 'error' | 'success';
  action?: {
    label: string;
    url: string;
  };
}

export interface SyncEventMessage extends WebSocketMessage {
  type: 'sync_event';
  event: string;
  path?: string;
  content_type?: string;
}

export interface PrototypeSyncProgressMessage extends WebSocketMessage {
  type: 'prototype_sync_progress';
  job_id: string;
  status: 'queued' | 'fetching' | 'downloading' | 'screenshotting' | 'uploading';
  progress: number;
  current_step: string;
  files_processed: number;
  files_total: number;
  screenshots_processed: number;
  screenshots_total: number;
}

export interface PrototypeSyncCompleteMessage extends WebSocketMessage {
  type: 'prototype_sync_complete';
  job_id: string;
  content_links: string[];
  stored_versions: string[];
}

export interface KBIndexingStatusMessage extends WebSocketMessage {
  type: 'kb_indexing_status';
  status: string;
  documents_count: number;
  indexed: number;
  failed: number;
  error?: string;
  kb_type?: string;
  kb_id?: string;
  job_id?: string;
}

export interface WebSocketServiceOptions {
  /** WebSocket endpoint (wss://...) */
  endpoint: string;
  /** Workspace for scoping */
  workspace: string;
  /** Optional user ID */
  userId?: string;
  /** Token provider (same as OCXPClient) */
  token?: string | (() => Promise<string>);
  /** Max reconnection attempts (default: 5) */
  maxReconnectAttempts?: number;
  /** Reconnection delay base in ms (default: 1000) */
  reconnectDelayMs?: number;
  /** Connection timeout in ms (default: 10000) */
  connectionTimeoutMs?: number;
}

export type WebSocketEventHandler<T extends WebSocketMessage = WebSocketMessage> = (
  message: T
) => void;

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private eventHandlers: Map<WebSocketMessageType | '*', Set<WebSocketEventHandler>> = new Map();
  private connectionStateHandlers: Set<(state: ConnectionState) => void> = new Set();
  private connectionPromise: Promise<void> | null = null;
  private _connectionState: ConnectionState = 'disconnected';
  private shouldReconnect = true;

  constructor(private options: WebSocketServiceOptions) {}

  /**
   * Get current connection state
   */
  get connectionState(): ConnectionState {
    return this._connectionState;
  }

  /**
   * Check if connected
   */
  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Connect to WebSocket server
   */
  async connect(): Promise<void> {
    if (this.connectionPromise) return this.connectionPromise;
    if (this.connected) return Promise.resolve();

    this.shouldReconnect = true;
    this.connectionPromise = this.doConnect();
    return this.connectionPromise;
  }

  private setConnectionState(state: ConnectionState): void {
    this._connectionState = state;
    this.connectionStateHandlers.forEach((handler) => handler(state));
  }

  private async doConnect(): Promise<void> {
    this.setConnectionState('connecting');

    const token =
      typeof this.options.token === 'function' ? await this.options.token() : this.options.token;

    const params = new URLSearchParams({
      workspace: this.options.workspace,
    });

    if (this.options.userId) {
      params.set('user_id', this.options.userId);
    }

    if (token) {
      params.set('token', token);
    }

    const url = `${this.options.endpoint}?${params}`;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.ws?.close();
        reject(new Error('WebSocket connection timeout'));
      }, this.options.connectionTimeoutMs ?? 10000);

      try {
        this.ws = new WebSocket(url);
      } catch (error) {
        clearTimeout(timeout);
        this.connectionPromise = null;
        this.setConnectionState('disconnected');
        reject(error instanceof Error ? error : new Error(String(error)));
        return;
      }

      this.ws.onopen = () => {
        clearTimeout(timeout);
        this.reconnectAttempts = 0;
        this.setConnectionState('connected');
        resolve();
      };

      this.ws.onmessage = (event: MessageEvent<string>) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;
          this.dispatchMessage(message);
        } catch {
          // Ignore invalid messages
        }
      };

      this.ws.onclose = (event) => {
        clearTimeout(timeout);
        this.connectionPromise = null;

        if (this.shouldReconnect && event.code !== 1000) {
          this.setConnectionState('reconnecting');
          this.handleReconnect();
        } else {
          this.setConnectionState('disconnected');
        }
      };

      this.ws.onerror = () => {
        clearTimeout(timeout);
        this.connectionPromise = null;
        reject(new Error('WebSocket connection failed'));
      };
    });
  }

  private handleReconnect(): void {
    if (!this.shouldReconnect) return;

    const maxAttempts = this.options.maxReconnectAttempts ?? 5;
    if (this.reconnectAttempts >= maxAttempts) {
      this.setConnectionState('disconnected');
      return;
    }

    const delay = (this.options.reconnectDelayMs ?? 1000) * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect().catch(() => {
        // Reconnect failed, will try again via onclose
      });
    }, delay);
  }

  private dispatchMessage(message: WebSocketMessage): void {
    // Dispatch to type-specific handlers
    const handlers = this.eventHandlers.get(message.type);
    handlers?.forEach((handler) => handler(message));

    // Dispatch to wildcard handlers
    const wildcardHandlers = this.eventHandlers.get('*');
    wildcardHandlers?.forEach((handler) => handler(message));
  }

  /**
   * Subscribe to message types
   * @returns Unsubscribe function
   */
  on<T extends WebSocketMessage = WebSocketMessage>(
    type: WebSocketMessageType | '*',
    handler: WebSocketEventHandler<T>
  ): () => void {
    if (!this.eventHandlers.has(type)) {
      this.eventHandlers.set(type, new Set());
    }
    this.eventHandlers.get(type)!.add(handler as WebSocketEventHandler);

    return () => this.eventHandlers.get(type)?.delete(handler as WebSocketEventHandler);
  }

  /**
   * Subscribe to job progress updates
   */
  onJobProgress(handler: WebSocketEventHandler<JobProgressMessage>): () => void {
    return this.on('job_progress', handler);
  }

  /**
   * Subscribe to repository status updates
   */
  onRepoStatus(handler: WebSocketEventHandler<RepoStatusMessage>): () => void {
    return this.on('repo_status', handler);
  }

  /**
   * Subscribe to notifications
   */
  onNotification(handler: WebSocketEventHandler<NotificationMessage>): () => void {
    return this.on('notification', handler);
  }

  /**
   * Subscribe to sync events
   */
  onSyncEvent(handler: WebSocketEventHandler<SyncEventMessage>): () => void {
    return this.on('sync_event', handler);
  }

  /**
   * Subscribe to prototype sync progress updates
   */
  onPrototypeSyncProgress(
    handler: WebSocketEventHandler<PrototypeSyncProgressMessage>
  ): () => void {
    return this.on('prototype_sync_progress', handler);
  }

  /**
   * Subscribe to prototype sync complete notifications
   */
  onPrototypeSyncComplete(
    handler: WebSocketEventHandler<PrototypeSyncCompleteMessage>
  ): () => void {
    return this.on('prototype_sync_complete', handler);
  }

  /**
   * Subscribe to KB indexing status updates
   */
  onKBIndexingStatus(handler: WebSocketEventHandler<KBIndexingStatusMessage>): () => void {
    return this.on('kb_indexing_status', handler);
  }

  /**
   * Subscribe to connection state changes
   */
  onConnectionStateChange(handler: (state: ConnectionState) => void): () => void {
    this.connectionStateHandlers.add(handler);
    return () => this.connectionStateHandlers.delete(handler);
  }

  /**
   * Subscribe to specific job updates
   */
  subscribeToJob(jobId: string): void {
    this.send({ action: 'subscribe', type: 'job', id: jobId });
  }

  /**
   * Subscribe to repository updates
   */
  subscribeToRepo(repoId: string): void {
    this.send({ action: 'subscribe', type: 'repo', id: repoId });
  }

  /**
   * Subscribe to prototype sync job updates
   */
  subscribeToPrototypeSync(jobId: string): void {
    this.send({ action: 'subscribe', topic: `prototype_sync:${jobId}` });
  }

  /**
   * Send message to server
   */
  send(data: object): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Send ping to keep connection alive
   */
  ping(): void {
    this.send({ action: 'ping' });
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    this.shouldReconnect = false;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.connectionPromise = null;
    this.reconnectAttempts = 0;
    this.setConnectionState('disconnected');
  }

  /**
   * Clear all event handlers
   */
  clearHandlers(): void {
    this.eventHandlers.clear();
    this.connectionStateHandlers.clear();
  }
}

/**
 * Create WebSocket service with same options pattern as OCXPClient
 */
export function createWebSocketService(options: WebSocketServiceOptions): WebSocketService {
  return new WebSocketService(options);
}
