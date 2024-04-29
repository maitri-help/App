import React, { useState } from 'react';
import {
  StyleSheet,
} from 'react-native';
import Modal from '../components/Modal';
import DateTime from './plusModalSteps/DateTime';
import EditForm from './plusModalSteps/EditForm';

export default function TaskModal({ visible, onClose, selectedCircle, setSelectedCircle, taskName, setTaskName, description, setDescription, selectedLocation, setSelectedLocation, dateTimeData, handleDateTimeSelect, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, handleDayPress, getDaysBetween }) {
  const [currentStep, setCurrentStep] = useState(5);
  const circles = ['Personal', 'First', 'Second', 'Third'];
  const [reviewFormCurrentStep, setReviewFormCurrentStep] = useState(null);

  const assignee = { emoji: '🦄', color: '#A571F9', name: 'Monica Geller' }

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      style={stylesPlus}
    >
      {currentStep === 4 && (
        <DateTime
          taskName={taskName}
          currentStep={currentStep}
          onBack={() => setCurrentStep(5)}
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
          reviewFormCurrentStep={reviewFormCurrentStep}
        />
      )}
      {currentStep === 5 && (
        <EditForm
          taskName={taskName}
          setTaskName={setTaskName}
          description={description}
          setDescription={setDescription}
          currentStep={currentStep}
          onClose={onClose}
          setCurrentStep={setCurrentStep}
          circles={circles}
          selectedCircle={selectedCircle}
          setSelectedCircle={setSelectedCircle}
          dateTimeData={dateTimeData}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          reviewFormCurrentStep={reviewFormCurrentStep}
          setReviewFormCurrentStep={setReviewFormCurrentStep}
          assignee={assignee}
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