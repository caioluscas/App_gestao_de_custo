import React from 'react';
import { View, StyleSheet, Button, Alert } from 'react-native';
import { Popover, PopoverController } from 'react-native-popover-menu';

const renderMenu = ({ onClose }) => {
  const handleSelect = (eventKey) => {
    onClose();
    Alert.alert(`Selected: ${eventKey}`);
  };

  return (
    <Popover>
      <Popover.Menu onSelect={handleSelect}>
        <Popover.Menu title="New File">
          <Popover.Item label="New File" value={1} />
          <Popover.Item label="New File with Current Profile" value={2} />
        </Popover.Menu>
        <Popover.Item label="Download As..." value={3} />
        <Popover.Item label="Export PDF" value={4} />
        <Popover.Item label="Export HTML" value={5} />
        <Popover.Item label="Settings" value={6} />
        <Popover.Item label="About" value={7} />
      </Popover.Menu>
    </Popover>
  );
};

export default function Dropdown() {
  return (
    <View style={styles.container}>
      <PopoverController>
        {({ openPopover, closePopover }) => (
          <View>
            <Button title="Open Menu" onPress={openPopover} />
            {renderMenu({ onClose: closePopover })}
          </View>
        )}
      </PopoverController>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
