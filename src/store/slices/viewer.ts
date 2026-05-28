import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ViewerState, ToolType, Layer, Annotation, Measurement } from '../../types';

const initialState: ViewerState = {
  currentTool: 'PAN',
  zoom: 1,
  pan: { x: 0, y: 0 },
  rotation: 0,
  showGrid: true,
  layers: [],
  annotations: [],
  measurements: [],
};

const viewerSlice = createSlice({
  name: 'viewer',
  initialState,
  reducers: {
    setTool: (state, action: PayloadAction<ToolType>) => {
      state.currentTool = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(10, action.payload));
    },
    setPan: (state, action: PayloadAction<{ x: number; y: number }>) => {
      state.pan = action.payload;
    },
    setRotation: (state, action: PayloadAction<number>) => {
      state.rotation = action.payload;
    },
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },
    setLayers: (state, action: PayloadAction<Layer[]>) => {
      state.layers = action.payload;
    },
    addLayer: (state, action: PayloadAction<Layer>) => {
      state.layers.push(action.payload);
    },
    updateLayer: (state, action: PayloadAction<{ id: string; updates: Partial<Layer> }>) => {
      const index = state.layers.findIndex(layer => layer.id === action.payload.id);
      if (index !== -1) {
        state.layers[index] = { ...state.layers[index], ...action.payload.updates };
      }
    },
    setAnnotations: (state, action: PayloadAction<Annotation[]>) => {
      state.annotations = action.payload;
    },
    addAnnotation: (state, action: PayloadAction<Annotation>) => {
      state.annotations.push(action.payload);
    },
    removeAnnotation: (state, action: PayloadAction<string>) => {
      state.annotations = state.annotations.filter(ann => ann.id !== action.payload);
    },
    addMeasurement: (state, action: PayloadAction<Measurement>) => {
      state.measurements.push(action.payload);
    },
    clearMeasurements: (state) => {
      state.measurements = [];
    },
    resetViewer: () => initialState,
  },
});

export const {
  setTool,
  setZoom,
  setPan,
  setRotation,
  toggleGrid,
  setLayers,
  addLayer,
  updateLayer,
  setAnnotations,
  addAnnotation,
  removeAnnotation,
  addMeasurement,
  clearMeasurements,
  resetViewer,
} = viewerSlice.actions;

export default viewerSlice.reducer;