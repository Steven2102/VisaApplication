import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const ApplicationList = ({ applications, setApplications, setEditingApplication }) => {
  const { user } = useAuth();

  const handleDelete = async (applicationId) => {
    try {
      await axiosInstance.delete(`/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setApplications(applications.filter((application) => application._id !== applicationId));
    } catch (error) {
      alert('Failed to delete application.');
    }
  };

  return (
    <div>
      {applications.map((application) => (
        <div key={application._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
          <h2 className="font-bold">{application.title}</h2>
          <p>{application.description}</p>
          <p className="text-sm text-gray-500">Deadline: {new Date(application.deadline).toLocaleDateString()}</p>
          <div className="mt-2">
            <button
              onClick={() => setEditingApplication(application)}
              className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(application._id)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;
