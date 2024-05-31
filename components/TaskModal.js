import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Modal from '../components/Modal';
import DateTime from './plusModalSteps/DateTime';
import EditForm from './plusModalSteps/EditForm';

export default function TaskModal({
    visible,
    onClose,
    selectedCircle,
    setSelectedCircle,
    taskName,
    setTaskName,
    description,
    setDescription,
    selectedLocation,
    setSelectedLocation,
    handleDateTimeSelect,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleDayPress,
    getDaysBetween,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    color,
    setColor,
    emoji,
    setEmoji,
    selectedTask,
    isEditable,
    setIsEditable,
    taskId,
    setTaskId,
    onTaskCreated
}) {
    const [currentStep, setCurrentStep] = useState(5);
    const [reviewFormCurrentStep, setReviewFormCurrentStep] = useState(null);

    useEffect(() => {
        if (selectedTask) {
            const circleLevels = [
                ...new Set(
                    selectedTask.circles.map((circle) => circle.circleLevel)
                )
            ];

            setTaskId(selectedTask.taskId);
            setTaskName(selectedTask.title);
            setDescription(selectedTask.description);
            setSelectedCircle(circleLevels);
            setSelectedLocation(selectedTask.location);

            setStartDate(selectedTask.startDateTime);
            setEndDate(selectedTask.endDateTime);

            setFirstName(
                selectedTask.assignee ? selectedTask.assignee.firstName : ''
            );
            setLastName(
                selectedTask.assignee ? selectedTask.assignee.lastName : ''
            );
            setColor(selectedTask.assignee ? selectedTask.assignee.color : '');
            setEmoji(selectedTask.assignee ? selectedTask.assignee.emoji : '');
        }
    }, [selectedTask, setStartDate, setEndDate]);

    return (
        <Modal visible={visible} onClose={onClose} style={stylesPlus}>
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
                    setStartTime={setStartDate}
                    setEndTime={setEndDate}
                    startTime={startDate}
                    endTime={endDate}
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
                    selectedCircle={selectedCircle}
                    setSelectedCircle={setSelectedCircle}
                    startDateTime={startDate}
                    endDateTime={endDate}
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
        </Modal>
    );
}

const stylesPlus = StyleSheet.create({
    modalContainer: {
        height: '80%'
    }
});
