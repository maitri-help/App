import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
} from 'react-native';
import Modal from '../components/Modal';
import DateTime from './plusModalSteps/DateTime';
import EditForm from './plusModalSteps/EditForm';

export default function TaskModal({ visible, onClose, selectedCircle, setSelectedCircle, taskName, setTaskName, description, setDescription, selectedLocation, setSelectedLocation, dateTimeData, handleDateTimeSelect, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, handleDayPress, getDaysBetween, firstName, setFirstName, lastName, setLastName, color, setColor, emoji, setEmoji, selectedTask }) {
  const [currentStep, setCurrentStep] = useState(5);
  const circles = ['Personal', 'First', 'Second', 'Third'];
  const [reviewFormCurrentStep, setReviewFormCurrentStep] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      setTaskName(selectedTask.title);
      setDescription(selectedTask.description);
      setSelectedCircle(selectedTask.circles);
      setSelectedLocation(selectedTask.location);

      const dateTimeObj = {
        startDateTime: selectedTask.startDateTime,
        endDateTime: selectedTask.endDateTime
      };
      handleDateTimeSelect(dateTimeObj);
      const startDateTime = new Date(selectedTask.startDateTime);
      const endDateTime = new Date(selectedTask.endDateTime);

      const startDate = startDateTime.toISOString().split('T')[0];
      const endDate = endDateTime.toISOString().split('T')[0];

      const startTime = `${startDateTime.getHours()}:${startDateTime.getMinutes()}`;
      const endTime = `${endDateTime.getHours()}:${endDateTime.getMinutes()}`;

      console.log('Start Time:', startTime);
      console.log('End Time:', endTime);

      setStartDate(startDate);
      setEndDate(endDate);
      setStartTime(startTime);
      setEndTime(endTime);

      setFirstName(selectedTask.firstName);
      setLastName(selectedTask.lastName);
      setColor(selectedTask.color);
      setEmoji(selectedTask.emoji);
    }
  }, [selectedTask]);

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
          firstName={firstName}
          lastName={lastName}
          color={color}
          emoji={emoji}
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
