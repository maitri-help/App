import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
} from 'react-native';
import Modal from '../components/Modal';
import DateTime from './plusModalSteps/DateTime';
import EditForm from './plusModalSteps/EditForm';

export default function TaskModal({ visible, onClose, selectedCircle, setSelectedCircle, taskName, setTaskName, description, setDescription, selectedLocation, setSelectedLocation, handleDateTimeSelect, startDate, setStartDate, endDate, setEndDate, startTime, setStartTime, endTime, setEndTime, handleDayPress, getDaysBetween, firstName, setFirstName, lastName, setLastName, color, setColor, emoji, setEmoji, selectedTask, isEditable, setIsEditable, taskId, setTaskId, onTaskCreated }) {
  const [currentStep, setCurrentStep] = useState(5);
  const circles = ['Personal', 'First', 'Second', 'Third'];
  const [reviewFormCurrentStep, setReviewFormCurrentStep] = useState(null);

  useEffect(() => {
    if (selectedTask) {
      const circleLevels = selectedTask.circles.map(circle => circle.circleLevel);

      console.log("Selected Task:", selectedTask);

      setTaskId(selectedTask.taskId);
      setTaskName(selectedTask.title);
      setDescription(selectedTask.description);
      setSelectedCircle(circleLevels);
      setSelectedLocation(selectedTask.location);

      setStartDate(selectedTask.startDateTime.split('T')[0]);
      setEndDate(selectedTask.endDateTime.split('T')[0]);
      setStartTime(selectedTask.startDateTime);
      setEndTime(selectedTask.endDateTime);

      setFirstName(selectedTask.firstName);
      setLastName(selectedTask.lastName);
      setColor(selectedTask.color);
      setEmoji(selectedTask.emoji);
    }
  }, [selectedTask, setStartDate, setEndDate, setStartTime, setEndTime]);

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
          onDateTimeSelect={(dateTimeData) => {
            handleDateTimeSelect(dateTimeData);
          }}
          startDate={startDate}
          endDate={endDate}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
          startTime={startTime}
          endTime={endTime}
          handleDayPress={handleDayPress}
          getDaysBetween={getDaysBetween}
          reviewFormCurrentStep={reviewFormCurrentStep}
        />
      )}
      {currentStep === 5 && (
        <EditForm
          taskId={taskId}
          setTaskId={setTaskId}
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
          startDateTime={startTime}
          endDateTime={endTime}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          reviewFormCurrentStep={reviewFormCurrentStep}
          setReviewFormCurrentStep={setReviewFormCurrentStep}
          firstName={firstName}
          lastName={lastName}
          color={color}
          emoji={emoji}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
          onTaskCreated={onTaskCreated}
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
