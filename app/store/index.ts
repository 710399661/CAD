import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, CadFile, ToolType, RootState } from '../types';

const initialAuthState = {
  isAuthenticated: false,
  user: null as User | null,
};

const initialFilesState = {
  files: [] as CadFile[],
};

const initialViewerState = {
  currentFile: null as CadFile | null,
  tool: 'PAN' as ToolType,
  scale: 1,
  rotation: 0,
  panX: 0,
  panY: 0,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

const filesSlice = createSlice({
  name: 'files',
  initialState: initialFilesState,
  reducers: {
    addFile: (state, action: PayloadAction<CadFile>) => {
      state.files.push(action.payload);
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
    },
    setFiles: (state, action: PayloadAction<CadFile[]>) => {
      state.files = action.payload;
    },
  },
});

const viewerSlice = createSlice({
  name: 'viewer',
  initialState: initialViewerState,
  reducers: {
    setCurrentFile: (state, action: PayloadAction<CadFile | null>) => {
      state.currentFile = action.payload;
    },
    setTool: (state, action: PayloadAction<ToolType>) => {
      state.tool = action.payload;
    },
    setScale: (state, action: PayloadAction<number>) => {
      state.scale = action.payload;
    },
    setRotation: (state, action: PayloadAction<number>) => {
      state.rotation = action.payload;
    },
    setPan: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.panX = action.payload.x;
      state.panY = action.payload.y;
    },
  },
});

export const { login, logout } = authSlice.actions;
export const { addFile, removeFile, setFiles } = filesSlice.actions;
export const { setCurrentFile, setTool, setScale, setRotation, setPan } = viewerSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    files: filesSlice.reducer,
    viewer: viewerSlice.reducer,
  },
});

export type AppDispatch = typeof store.dispatch;
