const API_URL = '/api/admin';

export const fetchStats = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/stats`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
};

export const fetchCourses = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/courses`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch courses');
    return response.json();
};
export const createCourse = async (courseData: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/courses`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(courseData)
    });
    if (!response.ok) throw new Error('Failed to create course');
    return response.json();
};

export const fetchGraphData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/reports/graphs`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch graph data');
    return response.json();
};
