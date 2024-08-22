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
    const timeToCheck = new Date(task?.endDate ?? task?.startDate);
    const today = new Date();

    if (task?.endTime || task?.startTime) {
        const time = task?.endTime ?? task?.startTime;
        const [hours, minutes] = time.split(':');
        timeToCheck.setHours(hours, minutes);
    }

    // if time is in the past or in the next 12 hours then it is due
    const isDue = timeToCheck < today || timeToCheck < new Date(today.getTime() + 12 * 60 * 60 * 1000);

    return isDue;
};

export const sortTasksByStartDate = (tasks) => {
    return tasks?.sort((a, b) => {
        if (a.status === 'done' && b.status !== 'done') {
            return 1;
        } else if (a.status !== 'done' && b.status === 'done') {
            return -1;
        } else {
            return (
                new Date(a.startDate).getTime() -
                new Date(b.startDate).getTime()
            );
        }
    });
};
