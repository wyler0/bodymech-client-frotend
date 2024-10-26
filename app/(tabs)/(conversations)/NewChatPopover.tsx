import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { sampleConversations } from '@/api/sample-data/conversations';

type NewChatPopoverProps = {
  isVisible: boolean;
  onClose: () => void;
};

type User = {
  id: string;
  name: string;
};

export default function NewChatPopover({ isVisible, onClose }: NewChatPopoverProps) {
  const [selectedUser, setSelectedUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(sampleConversations);
  const [message, setMessage] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const filtered = sampleConversations.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery]);

  const handleUserSelect = (user: User) => {
    setSelectedUser(user.name);
    setSearchQuery(user.name);
    setIsDropdownVisible(false);
  };

  const handleSend = () => {
    if (selectedUser && message) {
      const user = sampleConversations.find(u => u.name === selectedUser);
      if (user) {
        router.push({
          pathname: '/chat/[id]',
          params: { id: user.id, isNew: 'true', firstMessage: message }
        });
        onClose();
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Select a user"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setIsDropdownVisible(true);
              }}
              onFocus={() => setIsDropdownVisible(true)}
            />
            {isDropdownVisible && (
              <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                style={styles.dropdown}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleUserSelect(item)}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setMessage}
            value={message}
            placeholder="Type your message..."
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, (!selectedUser || !message) && styles.sendButtonDisabled]} 
            onPress={handleSend}
            disabled={!selectedUser || !message}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
    zIndex: 1, // Ensure the dropdown appears above other elements
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
    backgroundColor: 'white',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    width: '100%',
  },
  sendButton: {
    backgroundColor: '#0084ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#0084ff',
  },
});
