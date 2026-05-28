export interface CollaborationUser {
  id: string;
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

export interface CollaborationEvent {
  type: 'cursor_move' | 'annotation_add' | 'annotation_delete' | 'tool_change';
  userId: string;
  data: any;
  timestamp: number;
}

class CollaborationService {
  private users: Map<string, CollaborationUser> = new Map();
  private eventListeners: Set<(event: CollaborationEvent) => void> = new Set();
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private userId: string;
  private userName: string;
  private userColor: string;

  private colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
  ];

  constructor() {
    this.userId = this.generateId();
    this.userName = `用户${Math.floor(Math.random() * 1000)}`;
    this.userColor = this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  async connect(roomId: string): Promise<void> {
    this.roomId = roomId;
    
    const user: CollaborationUser = {
      id: this.userId,
      name: this.userName,
      color: this.userColor,
    };
    
    this.users.set(this.userId, user);
    
    console.log(`Connected to room: ${roomId}`);
    console.log(`User: ${this.userName} (${this.userId})`);
    
    this.notifyListeners({
      type: 'tool_change',
      userId: this.userId,
      data: { action: 'join', user },
      timestamp: Date.now(),
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.users.clear();
    this.roomId = null;
  }

  updateCursor(x: number, y: number): void {
    const user = this.users.get(this.userId);
    if (user) {
      user.cursor = { x, y };
      this.notifyListeners({
        type: 'cursor_move',
        userId: this.userId,
        data: { x, y },
        timestamp: Date.now(),
      });
    }
  }

  broadcastAnnotation(action: 'add' | 'delete', annotation: any): void {
    this.notifyListeners({
      type: action === 'add' ? 'annotation_add' : 'annotation_delete',
      userId: this.userId,
      data: { annotation },
      timestamp: Date.now(),
    });
  }

  broadcastToolChange(tool: string): void {
    this.notifyListeners({
      type: 'tool_change',
      userId: this.userId,
      data: { tool },
      timestamp: Date.now(),
    });
  }

  onEvent(callback: (event: CollaborationEvent) => void): () => void {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  private notifyListeners(event: CollaborationEvent): void {
    this.eventListeners.forEach(listener => listener(event));
  }

  getUsers(): CollaborationUser[] {
    return Array.from(this.users.values());
  }

  getCurrentUser(): CollaborationUser {
    return this.users.get(this.userId) || {
      id: this.userId,
      name: this.userName,
      color: this.userColor,
    };
  }

  isConnected(): boolean {
    return this.roomId !== null;
  }

  getRoomId(): string | null {
    return this.roomId;
  }

  generateShareLink(): string {
    if (!this.roomId) {
      throw new Error('Not connected to a room');
    }
    const baseUrl = window.location.origin;
    return `${baseUrl}?room=${this.roomId}`;
  }
}

export const collaborationService = new CollaborationService();

export const useCollaboration = () => {
  const connect = (roomId: string) => collaborationService.connect(roomId);
  const disconnect = () => collaborationService.disconnect();
  const updateCursor = (x: number, y: number) => collaborationService.updateCursor(x, y);
  const broadcastAnnotation = collaborationService.broadcastAnnotation.bind(collaborationService);
  const broadcastToolChange = collaborationService.broadcastToolChange.bind(collaborationService);
  const onEvent = collaborationService.onEvent.bind(collaborationService);
  const getUsers = () => collaborationService.getUsers();
  const getCurrentUser = () => collaborationService.getCurrentUser();
  const isConnected = () => collaborationService.isConnected();
  const generateShareLink = () => collaborationService.generateShareLink();

  return {
    connect,
    disconnect,
    updateCursor,
    broadcastAnnotation,
    broadcastToolChange,
    onEvent,
    getUsers,
    getCurrentUser,
    isConnected,
    generateShareLink,
  };
};