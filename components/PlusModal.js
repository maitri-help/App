import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import Modal from '../components/Modal';
import { modalServiceTasks } from '../data/ModalServiceTasks';
import ServiceItemSelection from './plusModalSteps/ServiceItemSelection';
import TaskSelection from './plusModalSteps/TaskSelection';
import FormFields from './plusModalSteps/FormFields';
import DateTime from './plusModalSteps/DateTime';

export default function PlusModal({ visible, onClose, selectedService, setSelectedService, selectedCircle, setSelectedCircle, taskName, setTaskName, isOtherTask, setIsOtherTask, description, setDescription, selectedLocation, setSelectedLocation, handleDateTimeSelect, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, handleDayPress, getDaysBetween, onTaskCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const circles = ['Personal', 'First', 'Second', 'Third'];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      style={stylesPlus}
    >
      {currentStep === 1 && (
        <ServiceItemSelection
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onClose={onClose}
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
          startDateTime={startDate}
          endDateTime={endDate}
          onClose={onClose}
          onTaskCreated={onTaskCreated}
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
    </Modal >
  );
};

const stylesPlus = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
})
