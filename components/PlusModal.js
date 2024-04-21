import React, { useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Modal from '../components/Modal';
import { Formik } from 'formik';
import { modalServiceTasks } from '../data/ModalServiceTasks';
import ServiceItemSelection from './plusModalSteps/ServiceItemSelection';
import TaskSelection from './plusModalSteps/TaskSelection';
import FormFields from './plusModalSteps/FormFields';

const initialValues = {
  selectedService: { id: null, title: '', icon: null },
  taskName: '',
};

export default function PlusModal({ visible, onClose, selectedService, setSelectedService, selectedCircle, setSelectedCircle, navigation }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTaskName, setSelectedTaskName] = useState('');

  const handleSubmit = (values) => {
    console.log('Form values:', values);
  };

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
        <Formik
          initialValues={{ ...initialValues, selectedService }}
          onSubmit={handleSubmit}
        >
          {(formikProps) => (
            <>
              {currentStep === 1 && (
                <ServiceItemSelection
                  selected={selectedService}
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
                    setSelectedTaskName(taskName);
                    formikProps.setFieldValue('taskName', taskName);
                    setCurrentStep(3);
                  }}
                  currentStep={currentStep}
                  onBack={() => setCurrentStep(currentStep - 1)}
                  setCurrentStep={setCurrentStep}
                />
              )}
              {currentStep === 3 && (
                <FormFields
                  selectedService={selectedService}
                  modalServiceTasks={modalServiceTasks}
                  taskName={selectedTaskName}
                  currentStep={currentStep}
                  onBack={() => setCurrentStep(currentStep - 1)}
                  setCurrentStep={setCurrentStep}
                  selectedCircle={selectedCircle}
                  setSelectedCircle={setSelectedCircle}
                />
              )}
            </>
          )}
        </Formik>
      </TouchableOpacity>
    </Modal >
  );
};

const stylesPlus = StyleSheet.create({
  modalContainer: {
    height: '80%'
  },
})
