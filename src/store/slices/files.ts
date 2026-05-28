import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CadFile } from '../../types';

interface FilesState {
  files: CadFile[];
  currentFile: CadFile | null;
  loading: boolean;
  error: string | null;
}

const initialState: FilesState = {
  files: [],
  currentFile: null,
  loading: false,
  error: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setFiles: (state, action: PayloadAction<CadFile[]>) => {
      state.files = action.payload;
      state.error = null;
    },
    addFile: (state, action: PayloadAction<CadFile>) => {
      state.files.unshift(action.payload);
      state.error = null;
    },
    setCurrentFile: (state, action: PayloadAction<CadFile | null>) => {
      state.currentFile = action.payload;
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
      if (state.currentFile?.id === action.payload) {
        state.currentFile = null;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setFiles, addFile, setCurrentFile, removeFile, setLoading, setError } = filesSlice.actions;
export default filesSlice.reducer;