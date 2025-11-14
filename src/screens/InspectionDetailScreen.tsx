import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  StatusBar,
  Modal,
  Dimensions,
  Image,
  PanResponder,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {Inspection} from '../types';
import {saveInspection, getInspection} from '../services/storageService';
import Voice from '@react-native-voice/voice';
import {MicrophoneIcon, PhotoIcon, CalendarIcon, PlusCircleIcon, XMarkIcon, ChevronLeftIcon, CubeTransparentIcon, MinusCircleIcon, PaintBrushIcon} from 'react-native-heroicons/outline';
import {MicrophoneIcon as MicrophoneIconSolid} from 'react-native-heroicons/solid';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<RootStackParamList, 'InspectionDetail'>;

const InspectionDetailScreen = ({route, navigation}: Props) => {
  const {inspectionId, address, propertyId, clientName} = route.params;
  const [inspection, setInspection] = useState<Inspection>({
    id: inspectionId || `insp_${Date.now()}`,
    propertyId: propertyId || '',
    address: address || '',
    inspectorName: clientName || '',
    inspectionDate: new Date(),
    status: 'draft',
    notes: '',
    photos: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [rooms, setRooms] = useState<string[]>(['']);
  const [roomMeasurements, setRoomMeasurements] = useState<{[key: number]: {lengthPrimary: string; lengthSecondary: string; widthPrimary: string; widthSecondary: string; heightPrimary: string; heightSecondary: string; unit: 'us' | 'international'}}>({});
  const [showMeasurementPanel, setShowMeasurementPanel] = useState(false);
  const [currentRoomIndex, setCurrentRoomIndex] = useState<number | null>(null);
  const [measurementTab, setMeasurementTab] = useState<'manual' | 'ar'>('manual');
  const [unit, setUnit] = useState<'us' | 'international'>('us');
  const [lengthPrimary, setLengthPrimary] = useState('');
  const [lengthSecondary, setLengthSecondary] = useState('');
  const [widthPrimary, setWidthPrimary] = useState('');
  const [widthSecondary, setWidthSecondary] = useState('');
  const [heightPrimary, setHeightPrimary] = useState('');
  const [heightSecondary, setHeightSecondary] = useState('');
  const [isRoomMapped, setIsRoomMapped] = useState(false);
  const [photos, setPhotos] = useState<{id: string; uri: any; filename: string; annotations: {x: number; y: number; letter: string; description: string}[]}[]>([]);
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState<number | null>(null);
  const [annotations, setAnnotations] = useState<{x: number; y: number; letter: string; description: string}[]>([]);
  const [editingFilenameIndex, setEditingFilenameIndex] = useState<number | null>(null);
  const [tempFilename, setTempFilename] = useState('');
  const datePickerHeight = useRef(new Animated.Value(0)).current;
  const datePickerOpacity = useRef(new Animated.Value(0)).current;
  const panelSlideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const annotationPanelSlideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const imageViewerSlideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;

  useEffect(() => {
    if (inspectionId) {
      loadInspection();
    }

    // Voice recognition disabled - using simulated dictation
    // Voice.onSpeechStart = onSpeechStart;
    // Voice.onSpeechEnd = onSpeechEnd;
    // Voice.onSpeechResults = onSpeechResults;
    // Voice.onSpeechError = onSpeechError;

    // return () => {
    //   Voice.destroy().then(Voice.removeAllListeners);
    // };
  }, [inspectionId]);

  // Reset AR state when switching tabs
  useEffect(() => {
    if (measurementTab === 'manual') {
      setIsRoomMapped(false);
    }
  }, [measurementTab]);

  const loadInspection = async () => {
    if (!inspectionId) return;
    const data = await getInspection(inspectionId);
    if (data) {
      setInspection(data);

      // Load rooms and measurements from floorPlan
      if (data.floorPlan && data.floorPlan.rooms.length > 0) {
        const roomNames = data.floorPlan.rooms.map(room => room.name);
        setRooms(roomNames);

        // Convert room dimensions to measurement format
        const measurements: {[key: number]: {lengthPrimary: string; lengthSecondary: string; widthPrimary: string; widthSecondary: string; heightPrimary: string; heightSecondary: string; unit: 'us' | 'international'}} = {};
        data.floorPlan.rooms.forEach((room, index) => {
          if (room.dimensions) {
            const unit = room.dimensions.unit === 'feet' ? 'us' : 'international';
            measurements[index] = {
              lengthPrimary: Math.floor(room.dimensions.length).toString(),
              lengthSecondary: ((room.dimensions.length % 1) * (unit === 'us' ? 12 : 100)).toFixed(0),
              widthPrimary: Math.floor(room.dimensions.width).toString(),
              widthSecondary: ((room.dimensions.width % 1) * (unit === 'us' ? 12 : 100)).toFixed(0),
              heightPrimary: '8', // Default height
              heightSecondary: '0',
              unit: unit,
            };
          }
        });
        setRoomMeasurements(measurements);
      }

      // Load photos from saved inspection data
      if (data.photos && data.photos.length > 0) {
        const loadedPhotos = data.photos.map((photo: any) => ({
          id: photo.id,
          uri: photo.uri,
          filename: photo.caption || 'photo.jpg',
          annotations: photo.annotations || [],
        }));
        setPhotos(loadedPhotos);
      } else {
        // Initialize photos for Van Ness property
        if (data.propertyId === '2550 Van Ness Ave' || data.address?.includes('2550 Van Ness Ave')) {
          const initialPhoto = {
            id: `photo_${Date.now()}`,
            uri: require('../assets/images/uploaded_pic.jpg'),
            filename: 'DSC3201.png',
            annotations: [],
          };
          setPhotos([initialPhoto]);
        }
      }
    }
  };

  const onSpeechStart = () => {
    setIsRecording(true);
    setRecognizedText('');
  };

  const onSpeechEnd = () => {
    setIsRecording(false);
  };

  const onSpeechResults = (event: any) => {
    if (event.value && event.value[0]) {
      const text = event.value[0];
      setRecognizedText(text);
      // Append to existing notes with a space
      setInspection(prev => ({
        ...prev,
        notes: prev.notes ? `${prev.notes} ${text}` : text,
      }));
    }
  };

  const onSpeechError = (event: any) => {
    console.error('Speech recognition error:', event.error);
    setIsRecording(false);
    Alert.alert('Voice Recognition Error', 'Failed to recognize speech. Please try again.');
  };

  const startVoiceRecognition = async () => {
    try {
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition. Please check microphone permissions.');
    }
  };

  const stopVoiceRecognition = async () => {
    try {
      await Voice.stop();
      setIsRecording(false);
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const handleMicrophonePress = () => {
    // Simulate dictation with visual feedback
    setIsRecording(true);

    // After 2 seconds, populate with lorem ipsum and return to normal
    setTimeout(() => {
      const loremIpsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.";

      setInspection(prev => ({
        ...prev,
        notes: loremIpsum,
      }));

      setIsRecording(false);
    }, 2000);
  };

  const toggleDatePicker = () => {
    if (showDatePicker) {
      // Hide the picker with animation
      Animated.parallel([
        Animated.timing(datePickerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(datePickerOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => setShowDatePicker(false));
    } else {
      // Show the picker with animation
      setShowDatePicker(true);
      Animated.parallel([
        Animated.timing(datePickerHeight, {
          toValue: 380,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(datePickerOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    Animated.parallel([
      Animated.timing(datePickerHeight, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(datePickerOpacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start(() => setShowDatePicker(false));

    if (selectedDate) {
      setInspection(prev => ({
        ...prev,
        inspectionDate: selectedDate,
      }));
    }
  };

  const addRoom = () => {
    setRooms([...rooms, `Room ${rooms.length + 1}`]);
  };

  const removeRoom = (index: number) => {
    setRooms(rooms.filter((_, i) => i !== index));
    // Remove measurements for this room and re-index remaining measurements
    const newMeasurements: typeof roomMeasurements = {};
    Object.keys(roomMeasurements).forEach(key => {
      const idx = parseInt(key);
      if (idx < index) {
        newMeasurements[idx] = roomMeasurements[idx];
      } else if (idx > index) {
        newMeasurements[idx - 1] = roomMeasurements[idx];
      }
    });
    setRoomMeasurements(newMeasurements);
  };

  const updateRoom = (index: number, value: string) => {
    const newRooms = [...rooms];
    newRooms[index] = value;
    setRooms(newRooms);
  };

  const addPhoto = () => {
    const newPhoto = {
      id: `photo_${Date.now()}`,
      uri: require('../assets/images/uploaded_pic.jpg'),
      filename: 'DSC3201.png',
      annotations: [],
    };
    setPhotos([...photos, newPhoto]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const startEditingFilename = (index: number) => {
    setEditingFilenameIndex(index);
    setTempFilename(photos[index].filename);
  };

  const saveFilename = () => {
    if (editingFilenameIndex !== null && tempFilename.trim() !== '') {
      const updatedPhotos = [...photos];
      updatedPhotos[editingFilenameIndex].filename = tempFilename;
      setPhotos(updatedPhotos);
    }
    setEditingFilenameIndex(null);
    setTempFilename('');
  };

  const openAnnotationPanel = (index: number) => {
    setCurrentPhotoIndex(index);
    // Load existing annotations for this photo
    setAnnotations(photos[index].annotations || []);
    setShowAnnotationPanel(true);
    Animated.timing(annotationPanelSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeAnnotationPanel = () => {
    // Save annotations to the photo before closing
    if (currentPhotoIndex !== null) {
      const updatedPhotos = [...photos];
      updatedPhotos[currentPhotoIndex].annotations = annotations;
      setPhotos(updatedPhotos);
    }

    Animated.timing(annotationPanelSlideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowAnnotationPanel(false);
      setCurrentPhotoIndex(null);
      setAnnotations([]);
    });
  };

  const openImageViewer = (index: number) => {
    setCurrentPhotoIndex(index);
    setShowImageViewer(true);
    Animated.timing(imageViewerSlideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeImageViewer = () => {
    Animated.timing(imageViewerSlideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowImageViewer(false);
      setCurrentPhotoIndex(null);
    });
  };

  const handleImageTap = (event: any) => {
    const {locationX, locationY} = event.nativeEvent;
    const letter = String.fromCharCode(65 + annotations.length); // A=65, B=66, etc.
    setAnnotations([...annotations, {x: locationX, y: locationY, letter, description: ''}]);
  };

  const updateAnnotationDescription = (index: number, description: string) => {
    const newAnnotations = [...annotations];
    newAnnotations[index].description = description;
    setAnnotations(newAnnotations);
  };

  const removeAnnotation = (index: number) => {
    const newAnnotations = annotations.filter((_, i) => i !== index);
    // Re-letter remaining annotations
    const reletteredAnnotations = newAnnotations.map((annotation, i) => ({
      ...annotation,
      letter: String.fromCharCode(65 + i),
    }));
    setAnnotations(reletteredAnnotations);
  };

  const updateAnnotationPosition = (index: number, x: number, y: number) => {
    const newAnnotations = [...annotations];
    newAnnotations[index].x = x;
    newAnnotations[index].y = y;
    setAnnotations(newAnnotations);
  };

  const createPanResponder = (index: number, initialX: number, initialY: number) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // User started touching the marker
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update position as user drags, using initial position + accumulated delta
        const newX = initialX + gestureState.dx;
        const newY = initialY + gestureState.dy;
        updateAnnotationPosition(index, newX, newY);
      },
      onPanResponderRelease: () => {
        // User released the marker, position is already updated
      },
    });
  };

  const getMeasurementSummary = (index: number): string => {
    const measurement = roomMeasurements[index];
    if (!measurement) return '';

    const primaryUnit = measurement.unit === 'us' ? 'ft' : 'm';
    const secondaryUnit = measurement.unit === 'us' ? 'in' : 'cm';

    // Convert to decimal format for cleaner display
    const formatDimension = (primary: string, secondary: string) => {
      const p = parseFloat(primary) || 0;
      const s = parseFloat(secondary) || 0;

      if (measurement.unit === 'us') {
        // For US: convert to feet with decimal (e.g., 12 ft 6 in = 12.5 ft)
        const totalFeet = p + (s / 12);
        return `${totalFeet.toFixed(1)} ${primaryUnit}`;
      } else {
        // For International: convert to meters with decimal (e.g., 3 m 50 cm = 3.5 m)
        const totalMeters = p + (s / 100);
        return `${totalMeters.toFixed(1)} ${primaryUnit}`;
      }
    };

    const length = formatDimension(measurement.lengthPrimary, measurement.lengthSecondary);
    const width = formatDimension(measurement.widthPrimary, measurement.widthSecondary);
    const height = formatDimension(measurement.heightPrimary, measurement.heightSecondary);

    return `${length} × ${width} × ${height}`;
  };

  const openMeasurementPanel = (index: number) => {
    setCurrentRoomIndex(index);
    setIsRoomMapped(false); // Reset AR state when opening measurement panel

    // Load existing measurements if they exist
    const existingMeasurement = roomMeasurements[index];
    if (existingMeasurement) {
      setLengthPrimary(existingMeasurement.lengthPrimary);
      setLengthSecondary(existingMeasurement.lengthSecondary);
      setWidthPrimary(existingMeasurement.widthPrimary);
      setWidthSecondary(existingMeasurement.widthSecondary);
      setHeightPrimary(existingMeasurement.heightPrimary);
      setHeightSecondary(existingMeasurement.heightSecondary);
      setUnit(existingMeasurement.unit);
    }

    setShowMeasurementPanel(true);
    Animated.spring(panelSlideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 65,
      friction: 11,
    }).start();
  };

  const closeMeasurementPanel = () => {
    Animated.timing(panelSlideAnim, {
      toValue: Dimensions.get('window').height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowMeasurementPanel(false);
      setLengthPrimary('');
      setLengthSecondary('');
      setWidthPrimary('');
      setWidthSecondary('');
      setHeightPrimary('');
      setHeightSecondary('');
      setMeasurementTab('manual');
      setUnit('us');
      setCurrentRoomIndex(null);
    });
  };

  const saveMeasurements = () => {
    if (currentRoomIndex === null) return;

    // Save the measurements to the room
    setRoomMeasurements(prev => ({
      ...prev,
      [currentRoomIndex]: {
        lengthPrimary,
        lengthSecondary,
        widthPrimary,
        widthSecondary,
        heightPrimary,
        heightSecondary,
        unit,
      },
    }));

    const roomName = rooms[currentRoomIndex] || (currentRoomIndex === 0 ? 'Lobby' : `Room ${currentRoomIndex + 1}`);
    const primaryUnit = unit === 'us' ? 'ft' : 'm';
    const secondaryUnit = unit === 'us' ? 'in' : 'cm';
    Alert.alert(
      'Success',
      `Measurements saved for ${roomName}\n\n` +
      `Length: ${lengthPrimary}${primaryUnit} ${lengthSecondary}${secondaryUnit}\n` +
      `Width: ${widthPrimary}${primaryUnit} ${widthSecondary}${secondaryUnit}\n` +
      `Height: ${heightPrimary}${primaryUnit} ${heightSecondary}${secondaryUnit}`
    );
    closeMeasurementPanel();
  };

  const handleSave = async () => {
    if (!inspection.propertyId) {
      Alert.alert('Error', 'Please fill in Property ID');
      return;
    }

    try {
      // Convert photos to match Photo type structure and include annotations
      const formattedPhotos = photos.map(photo => ({
        id: photo.id,
        uri: photo.uri,
        caption: photo.filename,
        timestamp: new Date(),
        synced: false,
        annotations: photo.annotations, // Include annotations
      }));

      // Build floorPlan from rooms and measurements
      let floorPlan = undefined;
      if (rooms.length > 0 && Object.keys(roomMeasurements).length > 0) {
        const formattedRooms = rooms.map((roomName, index) => {
          const measurements = roomMeasurements[index];
          if (!measurements) return null;

          const lengthValue = parseFloat(measurements.lengthPrimary || '0') +
                             (parseFloat(measurements.lengthSecondary || '0') / (measurements.unit === 'us' ? 12 : 100));
          const widthValue = parseFloat(measurements.widthPrimary || '0') +
                            (parseFloat(measurements.widthSecondary || '0') / (measurements.unit === 'us' ? 12 : 100));

          return {
            id: `room-${index}`,
            name: roomName || `Room ${index + 1}`,
            dimensions: {
              width: widthValue,
              length: lengthValue,
              unit: measurements.unit === 'us' ? 'feet' as const : 'meters' as const,
            },
          };
        }).filter(room => room !== null);

        if (formattedRooms.length > 0) {
          floorPlan = {
            id: `floorplan-${inspection.id}`,
            rooms: formattedRooms,
          };
        }
      }

      const updatedInspection = {
        ...inspection,
        photos: formattedPhotos,
        floorPlan: floorPlan,
        updatedAt: new Date(),
        status: 'in-progress' as const,
      };
      await saveInspection(updatedInspection);
      Alert.alert('Success', 'Inspection saved successfully', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save inspection');
    }
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <ChevronLeftIcon size={24} color="#1e3a5f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container}>
        <View style={styles.section}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={inspection.address}
          onChangeText={text =>
            setInspection(prev => ({...prev, address: text}))
          }
          placeholder="Enter property address"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Property ID</Text>
        <TextInput
          style={styles.input}
          value={inspection.propertyId}
          onChangeText={text =>
            setInspection(prev => ({...prev, propertyId: text}))
          }
          placeholder="Enter property ID"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Inspection Date</Text>
        <TouchableOpacity
          style={styles.dateDisplay}
          onPress={toggleDatePicker}>
          <Text style={styles.dateText}>
            {(() => {
              const date = new Date(inspection.inspectionDate);
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const year = date.getFullYear();
              return `${month}/${day}/${year}`;
            })()}
          </Text>
          <CalendarIcon size={20} color="#64748b" />
        </TouchableOpacity>
        <Animated.View
          style={[
            styles.datePickerContainer,
            {
              height: datePickerHeight,
              opacity: datePickerOpacity,
              marginTop: showDatePicker ? 12 : 0,
              overflow: 'hidden',
            },
          ]}>
          {showDatePicker && (
            <DateTimePicker
              value={new Date(inspection.inspectionDate)}
              mode="date"
              display="inline"
              onChange={handleDateChange}
            />
          )}
        </Animated.View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Notes</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={inspection.notes}
            onChangeText={text => setInspection(prev => ({...prev, notes: text}))}
            placeholder="Enter inspection notes or tap the microphone to dictate"
            multiline
            numberOfLines={6}
          />
          <TouchableOpacity
            style={styles.micButtonInline}
            onPress={handleMicrophonePress}>
            {isRecording ? (
              <MicrophoneIconSolid size={20} color="#1e3a5f" />
            ) : (
              <MicrophoneIcon size={20} color="#64748b" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Photos and Videos</Text>
        {photos.length > 0 && (
          <>
            {photos.map((photo, index) => (
              <View key={photo.id} style={styles.roomItem}>
                <View style={styles.roomInputContainer}>
                  <View style={[styles.roomInput, styles.photoItemContainer]}>
                    <TouchableOpacity onPress={() => openImageViewer(index)}>
                      <Image
                        source={photo.uri}
                        style={styles.photoThumbnail}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                    <View style={styles.photoInfo}>
                      {editingFilenameIndex === index ? (
                        <TextInput
                          style={styles.photoFileNameInput}
                          value={tempFilename}
                          onChangeText={setTempFilename}
                          onBlur={saveFilename}
                          onSubmitEditing={saveFilename}
                          returnKeyType="done"
                          autoFocus
                        />
                      ) : (
                        <TouchableOpacity onPress={() => startEditingFilename(index)}>
                          <Text style={styles.photoFileName}>{photo.filename}</Text>
                        </TouchableOpacity>
                      )}
                      <Text style={styles.photoLocation}>
                        {photos.length > 0 ? '37.77° N, 122.42° W' : 'Location N/A'}
                      </Text>
                      <Text style={styles.photoTags}>
                        {(() => {
                          const tagCount = photo.annotations.filter(a => a.description.trim() !== '').length;
                          return `${tagCount} ${tagCount === 1 ? 'tag' : 'tags'}`;
                        })()}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.photoPaintBrushIcon}
                      onPress={() => openAnnotationPanel(index)}>
                      <PaintBrushIcon size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => removePhoto(index)}
                  style={styles.removeButton}>
                  <MinusCircleIcon size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        <TouchableOpacity style={styles.addRoomButton} onPress={addPhoto}>
          <PlusCircleIcon size={20} color="#2563eb" />
          <Text style={styles.addRoomText}>Add Media</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Measurements</Text>
        {rooms.map((room, index) => (
          <View key={index} style={styles.roomItem}>
            <View style={styles.roomInputContainer}>
              <TextInput
                style={[styles.roomInput, getMeasurementSummary(index) && styles.roomInputWithMeasurement]}
                value={room}
                onChangeText={text => updateRoom(index, text)}
                placeholder="Room (e.g., Lobby)"
              />
              {getMeasurementSummary(index) ? (
                <Text style={styles.measurementSummary}>
                  {getMeasurementSummary(index)}
                </Text>
              ) : null}
              <TouchableOpacity
                style={styles.cubeIcon}
                onPress={() => openMeasurementPanel(index)}>
                <CubeTransparentIcon size={20} color="#64748b" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => removeRoom(index)}
              style={styles.removeButton}>
              <MinusCircleIcon size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addRoomButton} onPress={addRoom}>
          <PlusCircleIcon size={20} color="#2563eb" />
          <Text style={styles.addRoomText}>Add Room</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Inspection</Text>
      </TouchableOpacity>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Measurement Panel Modal */}
      <Modal
        visible={showMeasurementPanel}
        transparent={true}
        animationType="none"
        onRequestClose={closeMeasurementPanel}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeMeasurementPanel}
          />
          <Animated.View
            style={[
              styles.measurementPanel,
              {
                transform: [{translateY: panelSlideAnim}],
              },
            ]}>
            <View style={styles.panelHandle} />

            <Text style={styles.panelTitle}>
              {currentRoomIndex !== null
                ? (rooms[currentRoomIndex] || (currentRoomIndex === 0 ? 'Lobby' : `Room ${currentRoomIndex + 1}`))
                : 'Measurements'}
            </Text>

            {/* Tab Selection */}
            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tab,
                  measurementTab === 'manual' && styles.tabActive,
                ]}
                onPress={() => setMeasurementTab('manual')}>
                <Text
                  style={[
                    styles.tabText,
                    measurementTab === 'manual' && styles.tabTextActive,
                  ]}>
                  Manual
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tab,
                  measurementTab === 'ar' && styles.tabActive,
                ]}
                onPress={() => setMeasurementTab('ar')}>
                <Text
                  style={[
                    styles.tabText,
                    measurementTab === 'ar' && styles.tabTextActive,
                  ]}>
                  Use AR
                </Text>
              </TouchableOpacity>
            </View>

            {/* Manual Measurement Form */}
            {measurementTab === 'manual' && (
              <View style={styles.formContainer}>
                {/* Unit Selection */}
                <View style={styles.unitSection}>
                  <Text style={styles.unitLabel}>Unit of Measurement</Text>
                  <View style={styles.radioGroup}>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => setUnit('us')}>
                      <View style={styles.radioCircle}>
                        {unit === 'us' && <View style={styles.radioCircleSelected} />}
                      </View>
                      <Text style={styles.radioText}>US</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.radioButton}
                      onPress={() => setUnit('international')}>
                      <View style={styles.radioCircle}>
                        {unit === 'international' && <View style={styles.radioCircleSelected} />}
                      </View>
                      <Text style={styles.radioText}>Metric</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Length</Text>
                  <View style={styles.measurementRow}>
                    <View style={styles.measurementInputContainer}>
                      <TextInput
                        style={styles.measurementInput}
                        value={lengthPrimary}
                        onChangeText={setLengthPrimary}
                        placeholder="0"
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitPrefix}>{unit === 'us' ? 'ft' : 'm'}</Text>
                    </View>
                    <View style={styles.measurementInputContainer}>
                      <TextInput
                        style={styles.measurementInput}
                        value={lengthSecondary}
                        onChangeText={setLengthSecondary}
                        placeholder="0"
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitPrefix}>{unit === 'us' ? 'in' : 'cm'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Width</Text>
                  <View style={styles.measurementRow}>
                    <View style={styles.measurementInputContainer}>
                      <TextInput
                        style={styles.measurementInput}
                        value={widthPrimary}
                        onChangeText={setWidthPrimary}
                        placeholder="0"
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitPrefix}>{unit === 'us' ? 'ft' : 'm'}</Text>
                    </View>
                    <View style={styles.measurementInputContainer}>
                      <TextInput
                        style={styles.measurementInput}
                        value={widthSecondary}
                        onChangeText={setWidthSecondary}
                        placeholder="0"
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitPrefix}>{unit === 'us' ? 'in' : 'cm'}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Height</Text>
                  <View style={styles.measurementRow}>
                    <View style={styles.measurementInputContainer}>
                      <TextInput
                        style={styles.measurementInput}
                        value={heightPrimary}
                        onChangeText={setHeightPrimary}
                        placeholder="0"
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitPrefix}>{unit === 'us' ? 'ft' : 'm'}</Text>
                    </View>
                    <View style={styles.measurementInputContainer}>
                      <TextInput
                        style={styles.measurementInput}
                        value={heightSecondary}
                        onChangeText={setHeightSecondary}
                        placeholder="0"
                        keyboardType="decimal-pad"
                      />
                      <Text style={styles.unitPrefix}>{unit === 'us' ? 'in' : 'cm'}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.saveMeasurementButton}
                  onPress={saveMeasurements}>
                  <Text style={styles.saveMeasurementButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* AR Measurement */}
            {measurementTab === 'ar' && (
              <View style={styles.arContainer}>
                <TouchableOpacity
                  onPress={() => setIsRoomMapped(true)}
                  activeOpacity={0.9}
                  disabled={isRoomMapped}
                  style={{width: '100%'}}>
                  <Image
                    source={isRoomMapped ? require('../assets/images/room_mapped.png') : require('../assets/images/room_start.png')}
                    style={styles.arImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <Text style={styles.arInstructionText}>
                  {isRoomMapped ? 'Room mapped! Measurements captured.' : 'Scan the room to map and capture measurements'}
                </Text>
                <TouchableOpacity
                  style={styles.arSaveButton}
                  onPress={() => {
                    if (currentRoomIndex !== null && isRoomMapped) {
                      // Save simulated AR measurements
                      const arMeasurements = {
                        lengthPrimary: '12',
                        lengthSecondary: '6',
                        widthPrimary: '10',
                        widthSecondary: '3',
                        heightPrimary: '8',
                        heightSecondary: '0',
                        unit: 'us' as 'us' | 'international',
                      };

                      setRoomMeasurements(prev => ({
                        ...prev,
                        [currentRoomIndex]: arMeasurements,
                      }));

                      closeMeasurementPanel();
                    } else if (!isRoomMapped) {
                      Alert.alert('Map Room First', 'Please tap the image to map the room before saving');
                    }
                  }}>
                  <Text style={styles.arSaveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>

      {/* Annotation Panel Modal */}
      <Modal
        visible={showAnnotationPanel}
        transparent={true}
        animationType="none"
        onRequestClose={closeAnnotationPanel}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeAnnotationPanel}
          />
          <Animated.View
            style={[
              styles.annotationPanel,
              {
                transform: [{translateY: annotationPanelSlideAnim}],
              },
            ]}>
            <View style={styles.panelHandle} />

            <Text style={styles.panelTitle}>
              {currentPhotoIndex !== null
                ? 'DSC3201.png'
                : 'Photo Annotation'}
            </Text>

            {/* AR Annotation */}
            <View style={styles.arContainer}>
              <View style={{width: '100%', position: 'relative'}}>
                <TouchableOpacity
                  onPress={handleImageTap}
                  activeOpacity={1}
                  style={{width: '100%'}}>
                  <Image
                    source={require('../assets/images/uploaded_pic.jpg')}
                    style={styles.arImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                {annotations.map((annotation, index) => {
                  const panResponder = createPanResponder(index, annotation.x, annotation.y);
                  return (
                    <View
                      key={index}
                      {...panResponder.panHandlers}
                      style={[
                        styles.annotationMarker,
                        {
                          left: annotation.x - 10,
                          top: annotation.y - 10,
                        },
                      ]}>
                      <Text style={styles.annotationMarkerText}>{annotation.letter}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.arInstructionText}>
                Tap the image to add a tag. Update tag details below.
              </Text>

              {/* Annotation Tags List */}
              <ScrollView style={styles.annotationList} showsVerticalScrollIndicator={false}>
                {annotations.map((annotation, index) => (
                  <View key={index} style={styles.annotationListItem}>
                    <View style={styles.annotationListMarker}>
                      <Text style={styles.annotationListMarkerText}>{annotation.letter}</Text>
                    </View>
                    <TextInput
                      style={styles.annotationInput}
                      placeholder="Add description..."
                      placeholderTextColor="#94a3b8"
                      value={annotation.description}
                      onChangeText={(text) => updateAnnotationDescription(index, text)}
                    />
                    <TouchableOpacity
                      onPress={() => removeAnnotation(index)}
                      style={styles.removeAnnotationButton}>
                      <MinusCircleIcon size={20} color="#64748b" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.arSaveButton}
                onPress={closeAnnotationPanel}>
                <Text style={styles.arSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
      <Modal
        visible={showImageViewer}
        transparent={true}
        animationType="none"
        onRequestClose={closeImageViewer}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeImageViewer}
          />
          <Animated.View
            style={[
              styles.imageViewerPanel,
              {
                transform: [{translateY: imageViewerSlideAnim}],
              },
            ]}>
            <View style={styles.panelHandle} />
            {currentPhotoIndex !== null && editingFilenameIndex === currentPhotoIndex ? (
              <TextInput
                style={styles.panelTitleInput}
                value={tempFilename}
                onChangeText={setTempFilename}
                onBlur={saveFilename}
                onSubmitEditing={saveFilename}
                returnKeyType="done"
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => currentPhotoIndex !== null && startEditingFilename(currentPhotoIndex)}>
                <Text style={styles.panelTitle}>
                  {currentPhotoIndex !== null ? photos[currentPhotoIndex].filename : 'Photo'}
                </Text>
              </TouchableOpacity>
            )}
            <View style={styles.imageViewerContainer}>
              {currentPhotoIndex !== null && (
                <Image
                  source={photos[currentPhotoIndex].uri}
                  style={styles.imageViewerImage}
                  resizeMode="contain"
                />
              )}
            </View>
            <TouchableOpacity
              style={styles.arSaveButton}
              onPress={closeImageViewer}>
              <Text style={styles.arSaveButtonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#f3f4f6',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e3a5f',
  },
  headerSpacer: {
    width: 44,
  },
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  textAreaContainer: {
    position: 'relative',
  },
  recordingBanner: {
    backgroundColor: '#fef3c7',
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  recordingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingRight: 48,
  },
  micButtonInline: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
  },
  datePickerContainer: {
    alignItems: 'center',
  },
  photoPlaceholder: {
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
  },
  photoPlaceholderIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  photoPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
  },
  photoPlaceholderSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  spacer: {
    height: 32,
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  roomInputContainer: {
    flex: 1,
    position: 'relative',
  },
  roomInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  roomInputWithMeasurement: {
    paddingRight: 220,
  },
  photoItemContainer: {
    padding: 8,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  photoThumbnail: {
    width: 84,
    height: 84,
    borderRadius: 4,
  },
  photoInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 40,
  },
  photoFileName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
  },
  photoFileNameInput: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  photoLocation: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  photoTags: {
    fontSize: 14,
    color: '#64748b',
  },
  photoPaintBrushIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  measurementSummary: {
    position: 'absolute',
    right: 48,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    lineHeight: 48,
  },
  cubeIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addRoomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 0,
    gap: 8,
    marginTop: 4,
  },
  addRoomText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2563eb',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  measurementPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
    height: Dimensions.get('window').height * 0.75,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  annotationPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
    height: Dimensions.get('window').height * 0.9,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  imageViewerPanel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 40,
    height: Dimensions.get('window').height * 0.75,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  imageViewerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  imageViewerImage: {
    width: '100%',
    height: '100%',
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#d1d5db',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  panelTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 20,
    textAlign: 'center',
  },
  panelTitleInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e3a5f',
    marginBottom: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#1e3a5f',
  },
  formContainer: {
    gap: 20,
  },
  unitSection: {
    gap: 12,
  },
  unitLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e3a5f',
  },
  radioText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  formField: {
    gap: 8,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  measurementRow: {
    flexDirection: 'row',
    gap: 12,
  },
  measurementInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingRight: 16,
  },
  unitPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },
  measurementInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  formInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1f2937',
  },
  saveMeasurementButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  saveMeasurementButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  arContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 20,
  },
  arImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  annotationMarker: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  annotationMarkerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  annotationList: {
    maxHeight: 200,
    marginTop: 16,
    width: '100%',
  },
  annotationListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  annotationListMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  annotationListMarkerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  annotationInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: '#1f2937',
  },
  removeAnnotationButton: {
    padding: 4,
  },
  arInstructionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  arSaveButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 20,
    alignItems: 'center',
    width: '100%',
    marginTop: 'auto',
  },
  arSaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InspectionDetailScreen;
