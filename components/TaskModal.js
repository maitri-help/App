import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import Modal from '../components/Modal';
import DateTime from './plusModalSteps/DateTime';
import EditForm from './plusModalSteps/EditForm';

export default function TaskModal({
    visible,
    onClose,
    firstName,
    lastName,
    color,
    emoji,
    selectedTask,
    isEditable,
    setIsEditable,
    taskId,
    setTaskId,
    setSelectedTask
}) {
    const [currentStep, setCurrentStep] = useState(5);
    const [reviewFormCurrentStep, setReviewFormCurrentStep] = useState(null);

    return (
        <Modal visible={visible} onClose={onClose} style={stylesPlus}>
            {currentStep === 4 && (
                <DateTime
                    currentStep={currentStep}
                    onBack={() => setCurrentStep(5)}
                    setCurrentStep={setCurrentStep}
                    task={selectedTask}
                    setTask={setSelectedTask}
                    reviewFormCurrentStep={reviewFormCurrentStep}
                />
            )}
            {currentStep === 5 && (
                <EditForm
                    taskId={taskId}
                    setTaskId={setTaskId}
                    currentStep={currentStep}
                    onClose={onClose}
                    setCurrentStep={setCurrentStep}
                    reviewFormCurrentStep={reviewFormCurrentStep}
                    setReviewFormCurrentStep={setReviewFormCurrentStep}
                    firstName={firstName}
                    lastName={lastName}
                    color={color}
                    emoji={emoji}
                    isEditable={isEditable}
                    setIsEditable={setIsEditable}
                    task={selectedTask}
                    setTask={setSelectedTask}
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
