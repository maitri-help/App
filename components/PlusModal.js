import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View, Text, Platform, Linking } from 'react-native';
import ModalCustom from '../components/Modal';
import { modalServiceTasks } from '../data/ModalServiceTasks';
import ServiceItemSelection from './plusModalSteps/ServiceItemSelection';
import TaskSelection from './plusModalSteps/TaskSelection';
import FormFields from './plusModalSteps/FormFields';
import DateTime from './plusModalSteps/DateTime';

export default function PlusModal({ visible, onClose, handleDateTimeSelect, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, handleDayPress, getDaysBetween, onTaskCreated, deviceLocation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const circles = ['Personal', 'First', 'Second', 'Third'];
  const [selectedService, setSelectedService] = useState({ id: null, title: '', icon: null });
  const [selectedCircle, setSelectedCircle] = useState('Personal');
  const [taskName, setTaskName] = useState('');
  const [isOtherTask, setIsOtherTask] = useState(false);
  const [description, setDescription] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const [confirmationVisible, setConfirmationVisible] = useState(false);

  console.log('startDate', startDate, 'endDate', endDate, 'startTime', startTime, 'endTime', endTime);

  useEffect(() => {
    if (!visible) {
      resetModalState();
    }
  }, [visible]);

  const resetModalState = () => {
    setConfirmationVisible(false);
    setCurrentStep(1);
    setSelectedService({ id: null, title: '', icon: null });
    setSelectedCircle('Personal');
    setTaskName('');
    setIsOtherTask(false);
    setDescription('');
    setSelectedLocation('');
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
  };

  const handleCancel = () => {
    setConfirmationVisible(false);
  };

  const handleClose = () => {
    resetModalState();
    onClose();
  };

  return (
    <ModalCustom
      visible={visible}
      onClose={() => {
        if (confirmationVisible) {
          setConfirmationVisible(false);
        } else {
          setConfirmationVisible(true);
        }
      }}
      style={stylesPlus}
    >
      {currentStep === 1 && (
        <ServiceItemSelection
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onClose={() => {
            if (confirmationVisible) {
              setConfirmationVisible(false);
            } else {
              setConfirmationVisible(true);
            }
          }}
          onPress={() => setCurrentStep(2)}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <TaskSelection
          selectedService={selectedService}
          modalServiceTasks={modalServiceTasks}
          onTaskSelect={(taskName) => {
            setTaskName(taskName);
            setCurrentStep(3);
          }}
          currentStep={currentStep}
          onBack={() => setCurrentStep(currentStep - 1)}
          setCurrentStep={setCurrentStep}
          setIsOtherTask={setIsOtherTask}
        />
      )}
      {currentStep === 3 && (
        <FormFields
          selectedService={selectedService}
          modalServiceTasks={modalServiceTasks}
          taskName={taskName}
          setTaskName={setTaskName}
          currentStep={currentStep}
          onBack={() => setCurrentStep(currentStep - 1)}
          setCurrentStep={setCurrentStep}
          circles={circles}
          selectedCircle={selectedCircle}
          setSelectedCircle={setSelectedCircle}
          isOtherTask={isOtherTask}
          description={description}
          setDescription={setDescription}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          startDateTime={startTime}
          endDateTime={endTime}
          onClose={onClose}
          onTaskCreated={() => {
            onTaskCreated();
            resetModalState();
          }}
          deviceLocation={deviceLocation}
        />
      )}
      {currentStep === 4 && (
        <DateTime
          taskName={taskName}
          currentStep={currentStep}
          onBack={() => setCurrentStep(currentStep - 1)}
          setCurrentStep={setCurrentStep}
          onDateTimeSelect={handleDateTimeSelect}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
          handleDayPress={handleDayPress}
          getDaysBetween={getDaysBetween}
        />
      )}
      {confirmationVisible && (
        <Modal visible={confirmationVisible} animationType='fade' onRequestClose={handleCancel} transparent>
          <TouchableOpacity onPress={handleCancel} style={stylesPlus.innerModalContainer}>
            <View style={stylesPlus.innerModalContent}>
              <View style={stylesPlus.innerModalTexts}>
                <Text style={stylesPlus.innerModalTitle}>Are you sure you want to close the task creator?</Text>
                <Text style={stylesPlus.innerModalSubtitle}>Your current settings inside the task creator will be lost.</Text>
              </View>
              <View style={stylesPlus.innerModalButtons}>
                <TouchableOpacity style={[stylesPlus.innerModalButton, stylesPlus.innerModalButtonRed]} onPress={handleClose}>
                  <Text style={[stylesPlus.innerModalButtonText, stylesPlus.innerModalButtonRedText]}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[stylesPlus.innerModalButton, stylesPlus.innerModalButtonWhite]} onPress={handleCancel}>
                  <Text style={[stylesPlus.innerModalButtonText, stylesPlus.innerModalButtonWhiteText]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </ModalCustom>
  );
};

const stylesPlus = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
  innerModalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    maxWidth: 350,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  innerModalTexts: {
    marginBottom: 20,
  },
  innerModalTitle: {
    color: '#000',
    fontSize: 14,
    fontFamily: 'poppins-regular',
    lineHeight: 16,
    textAlign: 'center',
    marginBottom: 5
  },
  innerModalSubtitle: {
    color: '#000',
    fontSize: 12,
    fontFamily: 'poppins-regular',
    lineHeight: 16,
    textAlign: 'center',
  },
  innerModalButtons: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  innerModalButton: {
    alignItems: 'center',
    minWidth: 125,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    shadowColor: (Platform.OS === 'android') ? 'rgba(0,0,0,0.5)' : '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  innerModalButtonRed: {
    backgroundColor: '#FF7070',
  },
  innerModalButtonWhite: {
    backgroundColor: '#fff',
  },
  innerModalButtonText: {
    fontSize: 14,
    fontFamily: 'poppins-medium',
    lineHeight: 18,
  },
  innerModalButtonRedText: {
    color: '#fff',
  },
  innerModalButtonWhiteText: {
    color: '#000',
  },
})
