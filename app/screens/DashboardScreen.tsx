import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import { RootState } from '../types';
import { addFile, removeFile, setCurrentFile, logout } from '../store';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardScreen({ navigation }: any) {
  const files = useSelector((state: RootState) => state.files.files);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/dxf', 'application/dwg', 'image/svg+xml', '*/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const newFile = {
          id: Date.now().toString() + Math.random(),
          userId: user?.id || '1',
          name: asset.name || '未命名文件',
          type: asset.name?.split('.').pop()?.toUpperCase() || 'UNKNOWN',
          size: asset.size || 0,
          url: asset.uri,
          createdAt: new Date().toISOString(),
        };
        dispatch(addFile(newFile));
        Alert.alert('成功', '文件已添加');
      }
    } catch (error) {
      Alert.alert('错误', '选择文件失败');
    }
  };

  const handleOpenFile = (file: any) => {
    dispatch(setCurrentFile(file));
    navigation.navigate('Viewer');
  };

  const handleDeleteFile = (id: string) => {
    Alert.alert(
      '确认删除',
      '确定要删除这个文件吗？',
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: () => dispatch(removeFile(id)) },
      ]
    );
  };

  const handleLogout = () => {
    dispatch(logout());
    // 不需要手动导航，因为 App.tsx 会根据 auth 状态自动切换
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.fileItem} onPress={() => handleOpenFile(item)}>
      <View style={styles.fileIcon}>
        <Ionicons name="document-text" size={32} color="#1890ff" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileMeta}>
          {item.type} · {Math.round(item.size / 1024)} KB
        </Text>
        <Text style={styles.fileDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteFile(item.id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#ff4d4f" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CAD看图王</Text>
        <View style={styles.headerActions}>
          <Text style={styles.userName}>{user?.name || '用户'}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={files}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={80} color="#d9d9d9" />
            <Text style={styles.emptyText}>还没有文件</Text>
            <Text style={styles.emptySubtext}>点击下方按钮添加CAD文件</Text>
          </View>
        }
      />

      <TouchableOpacity style={styles.fab} onPress={handleFilePick}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    marginRight: 10,
    color: '#666',
  },
  logoutButton: {
    padding: 4,
  },
  list: {
    padding: 16,
  },
  fileItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fileIcon: {
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  fileDate: {
    fontSize: 11,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#1890ff',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
