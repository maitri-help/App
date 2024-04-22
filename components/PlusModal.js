import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Modal from '../components/Modal';
import { modalServiceTasks } from '../data/ModalServiceTasks';
import ServiceItemSelection from './plusModalSteps/ServiceItemSelection';
import TaskSelection from './plusModalSteps/TaskSelection';
import FormFields from './plusModalSteps/FormFields';
import DateTime from './plusModalSteps/DateTime';

export default function PlusModal({ visible, onClose, selectedService, setSelectedService, selectedCircle, setSelectedCircle, navigation, taskName, setTaskName, isOtherTask, setIsOtherTask, setDate, selectedDate, currentYearProp, currentMonthProp, setCurrentYear, setCurrentMonth, setWeekStartDate, }) {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      style={stylesPlus}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1}
      >
        <>
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
              selectedCircle={selectedCircle}
              setSelectedCircle={setSelectedCircle}
              isOtherTask={isOtherTask}
            />
          )}
          {currentStep === 4 && (
            <DateTime
              taskName={taskName}
              currentStep={currentStep}
              onBack={() => setCurrentStep(currentStep - 1)}
              setCurrentStep={setCurrentStep}
              setDate={setDate}
              selectedDate={selectedDate}
              currentYearProp={currentYearProp}
              currentMonthProp={currentMonthProp}
              setCurrentYear={setCurrentYear}
              setCurrentMonth={setCurrentMonth}
              setWeekStartDate={setWeekStartDate}
            />
          )}
        </>
      </TouchableOpacity>
    </Modal >
  );
};

const stylesPlus = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
})
