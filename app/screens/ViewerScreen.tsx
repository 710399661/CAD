import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, PanResponder, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Svg, { Line, Circle, Polyline, G, Text as SvgText } from 'react-native-svg';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';
import { RootState, ToolType } from '../types';
import { setTool, setScale, setRotation, setPan, setCurrentFile } from '../store';
import { CADParser, calculateDistance, calculateArea, calculateAngle } from '../utils/cadParser';
import { Ionicons } from '@expo/vector-icons';

export default function ViewerScreen({ navigation }: any) {
  const currentFile = useSelector((state: RootState) => state.viewer.currentFile);
  const { tool, scale, rotation, panX, panY } = useSelector((state: RootState) => state.viewer);
  const dispatch = useDispatch();
  const viewShotRef = useRef<any>(null);
  const panRef = useRef({ x: panX, y: panY });
  const lastPosRef = useRef({ x: 0, y: 0 });
  const [cadDoc, setCadDoc] = useState<any>(null);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const [measurement, setMeasurement] = useState<string>('');

  // 同步引用到最新的 pan 值
  useEffect(() => {
    panRef.current = { x: panX, y: panY };
  }, [panX, panY]);

  // 加载图纸时居中显示
  useEffect(() => {
    loadCadFile();
  }, [currentFile]);

  const loadCadFile = async () => {
    const parser = new CADParser();
    const doc = await parser.generateSampleCAD();
    setCadDoc(doc);
    
    // 居中显示图纸
    const { width, height } = Dimensions.get('window');
    const bounds = doc.bounds;
    const initialScale = Math.min(
      (width - 40) / (bounds.maxX - bounds.minX),
      (height - 300) / (bounds.maxY - bounds.minY),
      1
    );
    dispatch(setScale(initialScale));
    
    const centerX = (width - (bounds.maxX - bounds.minX) * initialScale) / 2 - bounds.minX * initialScale;
    const centerY = (height - 300 - (bounds.maxY - bounds.minY) * initialScale) / 2 - bounds.minY * initialScale;
    dispatch(setPan({ x: centerX, y: centerY + 100 }));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      lastPosRef.current = {
        x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
    },
    onPanResponderMove: (evt) => {
      if (tool === 'PAN') {
        const dx = evt.nativeEvent.pageX - lastPosRef.current.x;
        const dy = evt.nativeEvent.pageY - lastPosRef.current.y;
        panRef.current = {
          x: panRef.current.x + dx,
          y: panRef.current.y + dy
        };
        dispatch(setPan(panRef.current));
        lastPosRef.current = {
          x: evt.nativeEvent.pageX, y: evt.nativeEvent.pageY };
      }
    },
  });

  const handleCanvasPress = (evt: any) => {
    if (tool === 'PAN') return;

    const x = (evt.nativeEvent.locationX - panX) / scale;
    const y = (evt.nativeEvent.locationY - panY) / scale;

    const newPoints = [...measurePoints, { x, y }];
    setMeasurePoints(newPoints);

    let result = '';
    switch (tool) {
      case 'DISTANCE':
        if (newPoints.length >= 2) {
          const dist = calculateDistance(newPoints[0], newPoints[1]);
          result = `距离: ${dist.toFixed(2)}`;
          setMeasurePoints([]);
        }
        break;
      case 'AREA':
        if (newPoints.length >= 3) {
          const area = calculateArea(newPoints);
          result = `面积: ${area.toFixed(2)}`;
          setMeasurePoints([]);
        }
        break;
      case 'ANGLE':
        if (newPoints.length >= 3) {
          const angle = calculateAngle(newPoints[0], newPoints[1], newPoints[2]);
          result = `角度: ${angle.toFixed(2)}°`;
          setMeasurePoints([]);
        }
        break;
    }
    setMeasurement(result);
  };

  const handleExport = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('提示', '分享不可用');
      }
    } catch (error) {
      Alert.alert('错误', '导出失败');
    }
  };

  const handleZoomIn = () => {
    dispatch(setScale(Math.min(scale * 1.5, 10)));
  };

  const handleZoomOut = () => {
    dispatch(setScale(Math.max(scale / 1.5, 0.1)));
  };

  const handleRotate = () => {
    dispatch(setRotation((rotation + 90) % 360));
  };

  const renderEntities = () => {
    if (!cadDoc) return null;

    return cadDoc.entities.map((entity: any, index: number) => {
      switch (entity.type) {
        case 'LINE':
          if (entity.points && entity.points.length >= 2) {
            return (
              <Line
                key={index}
                x1={entity.points[0].x}
                y1={entity.points[0].y}
                x2={entity.points[1].x}
                y2={entity.points[1].y}
                stroke="#000"
                strokeWidth={2 / scale}
              />
            );
          }
          break;
        case 'CIRCLE':
          if (entity.center) {
            return (
              <Circle
                key={index}
                cx={entity.center.x}
                cy={entity.center.y}
                r={entity.radius || 50}
                stroke="#000"
                strokeWidth={2 / scale}
                fill="none"
              />
            );
          }
          break;
        case 'POLYLINE':
          if (entity.points) {
            const points = entity.points.map(p => `${p.x},${p.y}`).join(' ');
            return (
              <Polyline
                key={index}
                points={points}
                stroke="#000"
                strokeWidth={2 / scale}
                fill="none"
              />
            );
          }
          break;
      }
      return null;
    });
  };

  const renderMeasurePoints = () => {
    return measurePoints.map((point, index) => (
      <Circle
        key={`measure-${index}`}
        cx={point.x}
        cy={point.y}
        r={10 / scale}
        fill="#ff4d4f"
      />
    ));
  };

  const ToolButton = ({ icon, type, label }: { icon: string; type: ToolType; label: string }) => (
    <TouchableOpacity
      style={[styles.toolButton, tool === type && styles.activeToolButton]}
      onPress={() => {
        dispatch(setTool(type));
        setMeasurePoints([]);
        setMeasurement('');
      }}
    >
      <Ionicons name={icon as any} size={20} color={tool === type ? '#fff' : '#666'} />
      <Text style={[styles.toolButtonText, tool === type && styles.activeToolButtonText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          dispatch(setCurrentFile(null));
          navigation.goBack();
        }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title} numberOfLines={1}>{currentFile?.name || 'CAD图纸'}</Text>
        <TouchableOpacity onPress={handleExport} style={styles.exportButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ViewShot ref={viewShotRef} style={styles.canvasContainer} {...panResponder.panHandlers}>
        <Svg
          width="100%"
          height="100%"
          onPress={handleCanvasPress}
        >
          <G
            transform={`translate(${panX}, ${panY}) scale(${scale}) rotate(${rotation})`}
          >
            {renderEntities()}
            {renderMeasurePoints()}
          </G>
        </Svg>
      </ViewShot>

      {measurement ? (
        <View style={styles.measurementBox}>
          <Text style={styles.measurementText}>{measurement}</Text>
        </View>
      ) : null}

      <View style={styles.toolbar}>
        <ToolButton icon="hand-left-outline" type="PAN" label="平移" />
        <ToolButton icon="move-outline" type="DISTANCE" label="距离" />
        <ToolButton icon="grid-outline" type="AREA" label="面积" />
        <ToolButton icon="compass-outline" type="ANGLE" label="角度" />
      </View>

      <View style={styles.zoomControls}>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
          <Ionicons name="add" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
          <Ionicons name="remove" size={24} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.zoomButton} onPress={handleRotate}>
          <Ionicons name="refresh-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  exportButton: {
    padding: 8,
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  toolbar: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e8e8e8',
    justifyContent: 'space-around',
  },
  toolButton: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  activeToolButton: {
    backgroundColor: '#1890ff',
  },
  toolButtonText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeToolButtonText: {
    color: '#fff',
  },
  zoomControls: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  zoomButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  measurementBox: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  measurementText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
