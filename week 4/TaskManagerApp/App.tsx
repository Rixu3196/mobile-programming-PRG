import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar
} from 'react-native';

export default function App() {
  const [tasks, setTasks] = useState([
    { id: '1', text: 'Learn React Native', completed: true },
    { id: '2', text: 'Create mobile app', completed: false },
    { id: '3', text: 'Submit assignment', completed: false },
  ]);
  const [newTask, setNewTask] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Add new task
  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask,
          completed: false
        }
      ]);
      setNewTask('');
    } else {
      Alert.alert('Oops', 'Please enter a task description');
    }
  };

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Theme configuration
  const theme = {
    light: {
      background: '#ffffff',
      text: '#333333',
      card: '#f8f9fa',
      primary: '#5e8bf7',
    },
    dark: {
      background: '#121212',
      text: '#ffffff',
      card: '#1e1e1e',
      primary: '#bb86fc',
    }
  };

  const colors = darkMode ? theme.dark : theme.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Task Manager</Text>
        <TouchableOpacity 
          onPress={() => setDarkMode(!darkMode)}
          style={styles.themeToggle}
        >
          <Text style={{ color: colors.primary }}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.primary 
          }]}
          placeholder="Add new task..."
          placeholderTextColor="#999"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask}
        />
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }] }
          onPress={addTask}
        >
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[
            styles.taskItem,
            { 
              backgroundColor: colors.card,
              borderLeftColor: item.completed ? '#4caf50' : colors.primary
            }
          ]}>
            <TouchableOpacity 
              style={styles.taskContent}
              onPress={() => toggleTask(item.id)}
            >
              <Text style={[
                styles.taskText,
                { 
                  color: colors.text,
                  textDecorationLine: item.completed ? 'line-through' : 'none'
                }
              ]}>
                {item.text}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.deleteButton}
              onPress={() => deleteTask(item.id)}
            >
              <Text style={{ color: '#ff6b6b', fontSize: 20 }}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
      
      <Text style={[styles.footer, { color: colors.text }]}>
        {Platform.OS === 'ios' ? 'iOS' : 'Android'} • {tasks.filter(t => !t.completed).length} tasks remaining
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskText: {
    fontSize: 18,
  },
  deleteButton: {
    padding: 10,
  },
  footer: {
    textAlign: 'center',
    paddingVertical: 20,
    opacity: 0.6,
  },
});
