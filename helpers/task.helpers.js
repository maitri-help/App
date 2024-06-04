import { modalServices } from '../data/ModalServices';

export function stripCircles(task) {
    // Remove circles data, and use the circleLevel data instead
    return {
        ...task,
        circles: [...new Set(task.circles.map((circle) => circle.circleLevel))]
    };
}

export const getSelectedCircles = (task, option) => {
    let updatedCircles;

    if (option === 'Personal') {
        updatedCircles = [option];
    } else if (task?.circles?.includes('Personal')) {
        updatedCircles = [option];
    } else {
        if (task?.circles?.includes(option)) {
            updatedCircles = task?.circles?.filter((item) => item !== option);
        } else {
            updatedCircles = [...task?.circles, option];
        }
    }
    return updatedCircles;
};

export const findIcon = (task) => {
    const service = modalServices.find(
        (service) => service.title === task.category
    );

    return service ? service.icon : null;
};

export const calcIsDue = (task) => {
    if (!task?.endDate) return false;

    const endDate = new Date(task?.endDate);
    const today = new Date();
    const nextDay = new Date(endDate);
    nextDay.setDate(endDate.getDate() + 1);

    const isDue = task?.status === 'undone' && today >= nextDay;

    return isDue;
};
